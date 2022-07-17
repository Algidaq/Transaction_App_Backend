import 'reflect-metadata';
import express from 'express';
import * as http from 'http';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import { CommonRoutesConfig } from './common/common.route.config';
import debug from 'debug';
import dotenv from 'dotenv';
const result = dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

if (result.error) {
  throw result.error;
}
import ApplicationDataSource from './database/database';
import { UserRoute } from './modules/user/routes/user.routes';

import { AuthRoutes } from './modules/auth/auth.route';
import { RoleDao } from './modules/role/role.dao';
import { RoleRoutes } from './modules/role/role.routes';
import { CurrencyRoutes } from './modules/currency/currency.routes';
import { CustomerRoutes } from './modules/customers/customer.routes';
import { TransactionRoutes } from './modules/transactions/transactions.routes';
import { Logger } from './utils/logger';
import { CustomerDao } from './modules/customers/customer.dao';
import helmet from 'helmet';

const app: express.Application = express();
const server: http.Server = http.createServer(app);

const port = Number.parseInt(process.env.PORT ?? '3000');
const debugLog: debug.IDebugger = debug('app');

Logger.info(process.env.NODE_ENV);

app.use(helmet());
// here we are adding middleware to parse all incoming requests as JSON
app.use(express.json());

// here we are adding middleware to allow cross-origin requests
app.use(
  cors({
    exposedHeaders: [
      'total-pages',
      'count',
      'next-page',
      'current-page',
      'query',
    ],
  })
);

// here we are preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions: expressWinston.LoggerOptions = {
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (process.env.NODE_ENV !== 'development') {
  loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));

// here we are adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app!
// routes.push(new UsersRoutes(app));

// this is a simple route to make sure everything is working properly
const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req: express.Request, res: express.Response) => {
  res.status(200).send(runningMessage);
});

async function setup() {
  try {
    await ApplicationDataSource.initialize();
    const roles = await new RoleDao().getAllResources();
    const routes: CommonRoutesConfig<any>[] = [];
    routes.push(new UserRoute(app, roles));
    routes.push(new AuthRoutes(app));
    routes.push(new RoleRoutes(app, roles));
    routes.push(new CurrencyRoutes(app, roles));
    routes.push(new CustomerRoutes(app, roles));
    routes.push(new TransactionRoutes(app, roles));
    server.listen(port, async () => {
      routes.forEach((route: CommonRoutesConfig<any>) => {
        Logger.info(`Routes configured for ${route.name} ${route.route}`);
      });
      // our only exception to avoiding console.log(), because we
      // always want to know when the server is done starting up
      Logger.info(runningMessage);
    });
  } catch (e) {
    Logger.error('erorr', [e]);
  }
}

setup();
