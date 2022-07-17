/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 6752:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(3236);
const express_1 = __importDefault(__webpack_require__(6860));
const http = __importStar(__webpack_require__(3685));
const winston = __importStar(__webpack_require__(7773));
const expressWinston = __importStar(__webpack_require__(3316));
const cors_1 = __importDefault(__webpack_require__(3582));
const debug_1 = __importDefault(__webpack_require__(6974));
const dotenv_1 = __importDefault(__webpack_require__(5142));
const result = dotenv_1.default.config({ path: `.env.${"production"}` });
if (result.error) {
    throw result.error;
}
const database_1 = __importDefault(__webpack_require__(3570));
const user_routes_1 = __webpack_require__(643);
const auth_route_1 = __webpack_require__(2679);
const role_dao_1 = __webpack_require__(9324);
const role_routes_1 = __webpack_require__(7569);
const currency_routes_1 = __webpack_require__(5561);
const customer_routes_1 = __webpack_require__(4842);
const transactions_routes_1 = __webpack_require__(6426);
const logger_1 = __webpack_require__(6645);
const helmet_1 = __importDefault(__webpack_require__(7806));
const app = (0, express_1.default)();
const server = http.createServer(app);
const port = Number.parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000');
const debugLog = (0, debug_1.default)('app');
logger_1.Logger.info("production");
app.use((0, helmet_1.default)());
// here we are adding middleware to parse all incoming requests as JSON
app.use(express_1.default.json());
// here we are adding middleware to allow cross-origin requests
app.use((0, cors_1.default)({
    exposedHeaders: [
        'total-pages',
        'count',
        'next-page',
        'current-page',
        'query',
    ],
}));
// here we are preparing the expressWinston logging middleware configuration,
// which will automatically log all HTTP requests handled by Express.js
const loggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(winston.format.json(), winston.format.prettyPrint(), winston.format.colorize({ all: true })),
};
if (true) {
    loggerOptions.meta = false; // when not debugging, log requests as one-liners
}
// initialize the logger with the above configuration
app.use(expressWinston.logger(loggerOptions));
// here we are adding the UserRoutes to our array,
// after sending the Express.js application object to have the routes added to our app!
// routes.push(new UsersRoutes(app));
// this is a simple route to make sure everything is working properly
const runningMessage = `Server running at http://localhost:${port}`;
app.get('/', (req, res) => {
    res.status(200).send(runningMessage);
});
function setup() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield database_1.default.initialize();
            const roles = yield new role_dao_1.RoleDao().getAllResources();
            const routes = [];
            routes.push(new user_routes_1.UserRoute(app, roles));
            routes.push(new auth_route_1.AuthRoutes(app));
            routes.push(new role_routes_1.RoleRoutes(app, roles));
            routes.push(new currency_routes_1.CurrencyRoutes(app, roles));
            routes.push(new customer_routes_1.CustomerRoutes(app, roles));
            routes.push(new transactions_routes_1.TransactionRoutes(app, roles));
            server.listen(port, () => __awaiter(this, void 0, void 0, function* () {
                routes.forEach((route) => {
                    logger_1.Logger.info(`Routes configured for ${route.name} ${route.route}`);
                });
                // our only exception to avoiding console.log(), because we
                // always want to know when the server is done starting up
                logger_1.Logger.info(runningMessage);
            }));
        }
        catch (e) {
            logger_1.Logger.error('erorr', [e]);
        }
    });
}
setup();


/***/ }),

/***/ 6577:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ICommonController = void 0;
const network_handler_1 = __importDefault(__webpack_require__(5166));
class ICommonController {
    constructor() {
        this.validateCreationSchema = (req, res, next) => {
            var _a;
            const { error } = this.creationSchema.validate(req.body);
            if (!error)
                return next();
            return network_handler_1.default.badRequest(res, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : 'N/A');
        };
    }
}
exports.ICommonController = ICommonController;


/***/ }),

/***/ 8626:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ICommonDao = void 0;
const database_1 = __importDefault(__webpack_require__(3570));
class ICommonDao {
    constructor(target) {
        this._repo = database_1.default.getRepository(target);
    }
    get repo() {
        return this._repo;
    }
}
exports.ICommonDao = ICommonDao;


/***/ }),

/***/ 5906:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CommonRoutesConfig = void 0;
const logger_1 = __webpack_require__(6645);
class CommonRoutesConfig {
    constructor(app, name, controller, userRoles = []) {
        this.controller = controller;
        this.userRoles = userRoles;
        this.getUserRoleByName = (name) => {
            const index = this.userRoles.findIndex((element) => element.role.toLowerCase() === name.toLowerCase());
            logger_1.Logger.info('inndex', index);
            if (index === -1)
                return;
            return this.userRoles[index];
        };
        this._name = name;
        this.app = app;
        this.configureRoutes();
    }
    get name() {
        return this._name;
    }
    get adminRole() {
        if (this.userRoles.length === 0)
            return;
        return this.getUserRoleByName('admin');
    }
    get pathPrefix() {
        var _a;
        return (_a = process.env.PATH_PREFIX) !== null && _a !== void 0 ? _a : '';
    }
}
exports.CommonRoutesConfig = CommonRoutesConfig;


/***/ }),

/***/ 3570:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
const typeorm_1 = __webpack_require__(5250);
const mysql2_1 = __importDefault(__webpack_require__(7993));
const user_entity_1 = __webpack_require__(1268);
const role_entity_1 = __webpack_require__(7918);
const currency_entity_1 = __webpack_require__(7206);
const transaction_entity_1 = __webpack_require__(7917);
const exchange_rate_entity_1 = __webpack_require__(6110);
const local_transaction_info_entity_1 = __webpack_require__(6506);
const transaction_info_entity_1 = __webpack_require__(4129);
const customer_entity_1 = __webpack_require__(2279);
const customer_account_entity_1 = __webpack_require__(5580);
const deposite_info_entity_1 = __webpack_require__(3089);
const ApplicationDataSource = new typeorm_1.DataSource({
    type: 'mysql',
    database: process.env.DB,
    port: Number.parseInt((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : '3306'),
    username: process.env.DB_USER,
    host: (_b = process.env.HOST) !== null && _b !== void 0 ? _b : 'localhost',
    password: (_c = process.env.DB_PASS) !== null && _c !== void 0 ? _c : 'password',
    dateStrings: true,
    synchronize: true,
    cache: false,
    driver: mysql2_1.default,
    charset: 'utf8mb4_unicode_ci',
    entities: [
        user_entity_1.UserEntity,
        role_entity_1.RoleEntity,
        currency_entity_1.CurrencyEntity,
        customer_entity_1.CustomerEntity,
        customer_account_entity_1.AccountEntity,
        transaction_entity_1.TransactionEntity,
        exchange_rate_entity_1.TransactionExchangeRateEntity,
        transaction_info_entity_1.TransactionInfoEntity,
        local_transaction_info_entity_1.LocalTransactionInfoEntity,
        deposite_info_entity_1.DepositeInfo,
    ],
});
exports["default"] = ApplicationDataSource;


/***/ }),

/***/ 9683:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthorizationMiddleware = void 0;
const network_handler_1 = __importDefault(__webpack_require__(5166));
const utils_1 = __webpack_require__(974);
const jwt = __importStar(__webpack_require__(9344));
const logger_1 = __webpack_require__(6645);
class AuthorizationMiddleware {
    constructor() {
        this.isAuthorizedUser = (req, res, next) => {
            var _a;
            try {
                const authorizationHeader = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
                if (!authorizationHeader)
                    return network_handler_1.default.unauthorized(res);
                const user = jwt.verify(authorizationHeader, utils_1.kPrivateKey);
                req.user = user;
                next();
            }
            catch (e) {
                logger_1.Logger.error(e);
                return network_handler_1.default.unauthorized(res);
            }
        };
        this.isAuthByRole = (roles) => {
            return (req, res, next) => {
                if (!roles)
                    return network_handler_1.default.badRequest(res, 'No Roles where found');
                const user = req.user;
                const index = roles.findIndex((role) => (role = user.role.role));
                if (index === -1)
                    return network_handler_1.default.forbidden(res);
                next();
            };
        };
    }
}
exports.AuthorizationMiddleware = AuthorizationMiddleware;


/***/ }),

/***/ 2426:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.entityExitsMiddleware = void 0;
const network_handler_1 = __importDefault(__webpack_require__(5166));
/**
 * check for id in requrest params and findSingleResource if entity not exits stop executing
 * the request and return @NotFoundException
 * else continues to the next and adds Founded entity to request
 */
function entityExitsMiddleware(dao, keyName = 'id', paramKeyName = 'id') {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        var _a;
        const entity = yield dao.findSingleResource({
            where: { [keyName]: (_a = req.params[paramKeyName]) !== null && _a !== void 0 ? _a : 'N/A' },
        });
        if (!entity) {
            return network_handler_1.default.entityNotFound(res, 'Entity', req.params.id);
        }
        req.entity = entity;
        next();
    });
}
exports.entityExitsMiddleware = entityExitsMiddleware;


/***/ }),

/***/ 4679:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthController = void 0;
const user_dao_1 = __webpack_require__(2348);
const joi_1 = __importDefault(__webpack_require__(8506));
const network_handler_1 = __importDefault(__webpack_require__(5166));
const auth_dto_1 = __webpack_require__(8066);
const utils_1 = __webpack_require__(974);
const bcrypt_1 = __importDefault(__webpack_require__(7096));
class AuthController {
    constructor(userDao = new user_dao_1.UserDao()) {
        this.userDao = userDao;
        this.validationScheam = joi_1.default.object({
            phone: joi_1.default.string().required().pattern(RegExp('[0-9]')),
            password: joi_1.default.string().required().min(4),
        });
        this.validateAuthSchema = (req, res, next) => {
            const { error } = this.validationScheam.validate(req.body);
            if (error)
                return network_handler_1.default.badRequest(res, error.message);
            next();
        };
        this.auth = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const authDto = (0, auth_dto_1.getAuthDtoFromBody)(req.body);
                const user = yield this.userDao.findSingleResource({
                    where: { phone: authDto.phone },
                    select: ['id', 'fullName', 'phone', 'role', 'updateDate', 'password'],
                });
                if (!user)
                    return this.invalidUserNameOrPassword(res);
                console.log(user, authDto);
                const isCorrect = yield bcrypt_1.default.compare(authDto.password, user.password);
                if (!isCorrect)
                    return this.invalidUserNameOrPassword(res);
                const token = (0, utils_1.getJwtToken)(user);
                res.setHeader('authorization', token);
                return res.json({ token });
            }
            catch (e) {
                console.error(e);
                return network_handler_1.default.serverError(res, 'An Error Occured');
            }
        });
        this.invalidUserNameOrPassword = (res) => {
            return network_handler_1.default.badRequest(res, 'Invalid username or password');
        };
    }
}
exports.AuthController = AuthController;


/***/ }),

/***/ 8066:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAuthDtoFromBody = void 0;
function getAuthDtoFromBody(body) {
    return {
        phone: body.phone,
        password: body.password,
    };
}
exports.getAuthDtoFromBody = getAuthDtoFromBody;


/***/ }),

/***/ 2679:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthRoutes = void 0;
const common_route_config_1 = __webpack_require__(5906);
const auth_controller_1 = __webpack_require__(4679);
class AuthRoutes extends common_route_config_1.CommonRoutesConfig {
    constructor(app) {
        super(app, 'AuthenticationRoute', new auth_controller_1.AuthController());
    }
    configureRoutes() {
        this.app
            .route(this.route)
            .post(this.controller.validateAuthSchema, this.controller.auth);
        return this.app;
    }
    get route() {
        return this.pathPrefix + '/auth';
    }
}
exports.AuthRoutes = AuthRoutes;


/***/ }),

/***/ 9862:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurrencyController = void 0;
const common_controller_1 = __webpack_require__(6577);
const currency_service_1 = __webpack_require__(9889);
const joi_1 = __importDefault(__webpack_require__(8506));
const network_handler_1 = __importDefault(__webpack_require__(5166));
const utils_1 = __webpack_require__(974);
const logger_1 = __webpack_require__(6645);
class CurrencyController extends common_controller_1.ICommonController {
    constructor(service = new currency_service_1.CurrencyService()) {
        super();
        this.service = service;
        this.addResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const currency = yield this.service.addNewCurrency(req.body);
                return res.json(currency);
            }
            catch (e) {
                logger_1.Logger.error(e);
                return network_handler_1.default.badRequest(res, 'Currency Already Exists');
            }
        });
        this.findSingleResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const currency = yield this.service.findOnById(req.params);
                if (currency === null)
                    return network_handler_1.default.entityNotFound(res, 'Currency', req.params.id);
                return res.json(currency);
            }
            catch (e) {
                logger_1.Logger.error(e);
                return network_handler_1.default.serverError(res, 'An Error Occured');
            }
        });
        this.findAllResources = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [currencies, count] = yield this.service.getAllCurrenciesAndCount(req.query);
            (0, utils_1.setTotalPagesHeader)(res, req.query, count);
            return res.json(currencies);
        });
        this.deleteResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const deletedResource = yield this.service.deleteCurrency(req.params);
            if (deletedResource === null) {
                return network_handler_1.default.entityNotFound(res, 'Currency', req.params.id);
            }
            return res.json(deletedResource);
        });
    }
    get creationSchema() {
        return joi_1.default.object({
            name: joi_1.default.string().required().min(2),
            symbol: joi_1.default.string().required().min(2),
        });
    }
}
exports.CurrencyController = CurrencyController;


/***/ }),

/***/ 7717:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurrencyDao = void 0;
const common_dao_1 = __webpack_require__(8626);
const currency_entity_1 = __webpack_require__(7206);
class CurrencyDao extends common_dao_1.ICommonDao {
    constructor() {
        super(currency_entity_1.CurrencyEntity);
    }
    addResource(resource) {
        return this.repo.save(resource);
    }
    findSingleResource(option) {
        return this.repo.findOne(option);
    }
    getAllResources(options) {
        return this.repo.find(options);
    }
    getAllResourcesAndCount(options) {
        return this.repo.findAndCount(options);
    }
    deleteResource(resource) {
        return this.repo.remove(resource);
    }
    updateResource(resource) {
        return this.repo.save(resource);
    }
}
exports.CurrencyDao = CurrencyDao;


/***/ }),

/***/ 7951:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCurrencyFromBody = void 0;
function getCurrencyFromBody(body) {
    var _a, _b;
    const json = Object.assign({}, body);
    return { name: (_a = json.name) !== null && _a !== void 0 ? _a : 'N/A', symbol: (_b = json.symbol) !== null && _b !== void 0 ? _b : 'N/A' };
}
exports.getCurrencyFromBody = getCurrencyFromBody;


/***/ }),

/***/ 7206:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurrencyEntity = void 0;
const typeorm_1 = __webpack_require__(5250);
let CurrencyEntity = class CurrencyEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], CurrencyEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'name',
        unique: true,
        type: 'varchar',
        length: 56,
        nullable: false,
    }),
    __metadata("design:type", String)
], CurrencyEntity.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'symbol',
        unique: true,
        nullable: false,
        default: '$',
        type: 'varchar',
    }),
    __metadata("design:type", String)
], CurrencyEntity.prototype, "symbol", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_date' }),
    __metadata("design:type", String)
], CurrencyEntity.prototype, "createDate", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_date' }),
    __metadata("design:type", String)
], CurrencyEntity.prototype, "updateDate", void 0);
CurrencyEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'currencies' })
], CurrencyEntity);
exports.CurrencyEntity = CurrencyEntity;


/***/ }),

/***/ 5561:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurrencyRoutes = void 0;
const common_route_config_1 = __webpack_require__(5906);
const currency_controller_1 = __webpack_require__(9862);
class CurrencyRoutes extends common_route_config_1.CommonRoutesConfig {
    constructor(app, roles = [], controller = new currency_controller_1.CurrencyController()) {
        super(app, 'CurrencyRole', controller, roles);
    }
    configureRoutes() {
        this.app.route(this.route).get(this.controller.findAllResources);
        this.app.route(this.route + '/:id').get(this.controller.findSingleResource);
        this.app
            .route(this.route)
            .post(this.controller.validateCreationSchema, this.controller.addResource);
        return this.app;
    }
    get route() {
        return this.pathPrefix + '/currencies';
    }
}
exports.CurrencyRoutes = CurrencyRoutes;


/***/ }),

/***/ 9889:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CurrencyService = void 0;
const currency_dao_1 = __webpack_require__(7717);
const currency_dto_1 = __webpack_require__(7951);
const typeorm_1 = __webpack_require__(5250);
const utils_1 = __webpack_require__(974);
class CurrencyService {
    constructor(dao = new currency_dao_1.CurrencyDao()) {
        this.dao = dao;
        this.findOnById = (params) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = Number.parseInt((_a = params.id) !== null && _a !== void 0 ? _a : '-1');
            return this.dao.findSingleResource({ where: { id: id } });
        });
        this.addNewCurrency = (body) => __awaiter(this, void 0, void 0, function* () {
            const entity = (0, currency_dto_1.getCurrencyFromBody)(body);
            return this.dao.addResource(entity);
        });
        this.getAllCurrencies = (queryParams) => __awaiter(this, void 0, void 0, function* () {
            const options = this.getCurrencyFindManyOptions(queryParams);
            options.take = undefined;
            options.skip = undefined;
            return this.dao.getAllResources(options);
        });
        this.getAllCurrenciesAndCount = (queryParams) => __awaiter(this, void 0, void 0, function* () {
            const options = this.getCurrencyFindManyOptions(queryParams);
            return this.dao.getAllResourcesAndCount(options);
        });
        this.deleteCurrency = (params) => __awaiter(this, void 0, void 0, function* () {
            const currency = yield this.findOnById(params);
            if (currency === null)
                return null;
            return yield this.dao.deleteResource(currency);
        });
        this.updateCurrency = (params, body) => __awaiter(this, void 0, void 0, function* () {
            const currency = yield this.findOnById(params);
            if (currency === null)
                return null;
            const updateCurrency = this.getCurrencyUpdateEntity(currency, body);
            return yield this.dao.updateResource(updateCurrency);
        });
        this.getCurrencyUpdateEntity = (currency, body) => {
            var _a, _b;
            currency.name = (_a = body.name) !== null && _a !== void 0 ? _a : currency.name;
            currency.symbol = (_b = body.symbol) !== null && _b !== void 0 ? _b : currency.symbol;
            return currency;
        };
        this.getCurrencyFindManyOptions = (queryParams) => {
            var _a, _b, _c, _d;
            const { skip, take } = (0, utils_1.getPagination)(queryParams);
            const where = [];
            if (queryParams.name)
                where.push({ name: (0, typeorm_1.Like)(queryParams.name) });
            if (queryParams.symbol)
                where.push({ name: (0, typeorm_1.Like)(queryParams.symbol) });
            return {
                where: where.length > 0 ? where : undefined,
                skip: skip,
                take: take,
                order: !queryParams.orderBy
                    ? { id: 'desc' }
                    : {
                        createDate: queryParams.orderBy === 'create_date'
                            ? (_a = queryParams.order) !== null && _a !== void 0 ? _a : 'desc'
                            : undefined,
                        name: queryParams.orderBy === 'name'
                            ? (_b = queryParams.order) !== null && _b !== void 0 ? _b : 'desc'
                            : undefined,
                        id: queryParams.orderBy === 'id'
                            ? (_c = queryParams.order) !== null && _c !== void 0 ? _c : 'desc'
                            : undefined,
                        symbol: queryParams.orderBy === 'symbol'
                            ? (_d = queryParams.order) !== null && _d !== void 0 ? _d : 'desc'
                            : undefined,
                    },
            };
        };
    }
}
exports.CurrencyService = CurrencyService;


/***/ }),

/***/ 1847:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomerAccountController = void 0;
const common_controller_1 = __webpack_require__(6577);
const joi_1 = __importDefault(__webpack_require__(8506));
const customer_account_service_1 = __webpack_require__(5275);
const network_handler_1 = __importDefault(__webpack_require__(5166));
const logger_1 = __webpack_require__(6645);
class CustomerAccountController extends common_controller_1.ICommonController {
    constructor(accountService = new customer_account_service_1.CustomerAccountService()) {
        super();
        this.accountService = accountService;
        this.addResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = req.entity;
                const _entity = yield this.accountService.addResource(req.body, customer);
                logger_1.Logger.info(_entity);
                const element = yield this.accountService.getAccountById(_entity.generatedMaps[0].id);
                res.json({
                    id: element === null || element === void 0 ? void 0 : element.id,
                    balance: element === null || element === void 0 ? void 0 : element.balance,
                    currency: element === null || element === void 0 ? void 0 : element.currency,
                    createDate: element === null || element === void 0 ? void 0 : element.createDate,
                    updateDate: element === null || element === void 0 ? void 0 : element.updateDate,
                });
            }
            catch (e) {
                logger_1.Logger.error(e);
                return network_handler_1.default.badRequest(res, 'Account Already extis');
            }
        });
        this.findSingleResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const accountId = (_a = req.params.accountId) !== null && _a !== void 0 ? _a : 'N/A';
            const account = yield this.accountService.getAccountById(accountId);
            if (!account) {
                return network_handler_1.default.entityNotFound(res, 'Account', accountId);
            }
            return res.json(account);
        });
        this.findAllResources = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const accounts = yield this.accountService.getAccountsByCustomerId(req.params);
                const formattedAccounts = accounts.map((element) => {
                    return {
                        id: element.id,
                        balance: element.balance,
                        currency: element.currency,
                        createDate: element.createDate,
                        updateDate: element.updateDate,
                    };
                });
                return res.json(formattedAccounts);
            }
            catch (e) {
                logger_1.Logger.error(e);
                return network_handler_1.default.serverError(res, 'Error Occured');
            }
        });
    }
    get creationSchema() {
        return joi_1.default.object({
            balance: joi_1.default.number().greater(-1),
            currency: joi_1.default.object({
                id: joi_1.default.number().greater(-1).required(),
                name: joi_1.default.string().required(),
                symbol: joi_1.default.string().required(),
                createDate: joi_1.default.string(),
                updateDate: joi_1.default.string(),
            }).required(),
        });
    }
    deleteResource(req, res) {
        throw new Error('Method not implemented.');
    }
}
exports.CustomerAccountController = CustomerAccountController;


/***/ }),

/***/ 9153:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountDao = void 0;
const common_dao_1 = __webpack_require__(8626);
const customer_account_entity_1 = __webpack_require__(5580);
class AccountDao extends common_dao_1.ICommonDao {
    constructor() {
        super(customer_account_entity_1.AccountEntity);
    }
    addResource(resource) {
        return this.repo.save(resource);
    }
    findSingleResource(option) {
        return this.repo.findOne(option);
    }
    getAllResources(options) {
        return this.repo.find(options);
    }
    getAllResourcesAndCount(options) {
        return this.repo.findAndCount(options);
    }
    deleteResource(resource) {
        throw new Error('Method not implemented.');
    }
    updateResource(resource) {
        return this.repo.save(resource);
    }
}
exports.AccountDao = AccountDao;


/***/ }),

/***/ 5580:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AccountEntity = void 0;
const typeorm_1 = __webpack_require__(5250);
const currency_entity_1 = __webpack_require__(7206);
const customer_entity_1 = __webpack_require__(2279);
let AccountEntity = class AccountEntity {
};
__decorate([
    (0, typeorm_1.Column)({ name: 'id', generated: 'uuid' }),
    __metadata("design:type", String)
], AccountEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'balance', type: 'float', nullable: false, default: 0.0 }),
    __metadata("design:type", Number)
], AccountEntity.prototype, "balance", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => currency_entity_1.CurrencyEntity, {
        eager: true,
        nullable: false,
        cascade: false,
        onUpdate: 'NO ACTION',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'currencyId' }),
    __metadata("design:type", currency_entity_1.CurrencyEntity)
], AccountEntity.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'currencyId', select: true }),
    __metadata("design:type", Number)
], AccountEntity.prototype, "currencyId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.CustomerEntity, (customer) => customer.accounts),
    (0, typeorm_1.JoinColumn)({ name: 'customerId' }),
    __metadata("design:type", customer_entity_1.CustomerEntity)
], AccountEntity.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'customerId', select: false }),
    __metadata("design:type", String)
], AccountEntity.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_date' }),
    __metadata("design:type", String)
], AccountEntity.prototype, "createDate", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_date' }),
    __metadata("design:type", String)
], AccountEntity.prototype, "updateDate", void 0);
AccountEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'accounts' })
], AccountEntity);
exports.AccountEntity = AccountEntity;


/***/ }),

/***/ 5275:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomerAccountService = void 0;
const customer_dao_1 = __webpack_require__(368);
const customer_dto_1 = __webpack_require__(6214);
const customer_account_dao_1 = __webpack_require__(9153);
class CustomerAccountService {
    constructor(customerDao = new customer_dao_1.CustomerDao(), accountDao = new customer_account_dao_1.AccountDao()) {
        this.customerDao = customerDao;
        this.accountDao = accountDao;
        this.addResource = (body, customer) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const currency = body.currency;
            const balance = (_a = body.balance) !== null && _a !== void 0 ? _a : 0.0;
            return this.accountDao.repo.insert({
                currency,
                customerId: customer.id,
                balance: balance !== null && balance !== void 0 ? balance : 0.0,
            });
        });
        /**
         *
         * @param params
         * @returns  all accounts by customer
         */
        this.getAccountsByCustomerId = (params) => __awaiter(this, void 0, void 0, function* () {
            const customerId = params.id;
            return this.accountDao.getAllResources({
                where: { customerId },
                select: [
                    'id',
                    'balance',
                    'currency',
                    'customerId',
                    'updateDate',
                    'createDate',
                ],
                loadRelationIds: false,
            });
        });
        this.getAllAccounts = (params) => __awaiter(this, void 0, void 0, function* () {
            const options = (0, customer_dto_1.getAccountsQueryParams)(params);
            return this.accountDao.getAllResources(Object.assign(Object.assign({}, options), { skip: 0, take: undefined }));
        });
        this.getAccountById = (id) => __awaiter(this, void 0, void 0, function* () {
            return this.accountDao.findSingleResource({
                where: { id },
                select: [
                    'id',
                    'balance',
                    'currency',
                    'updateDate',
                    'createDate',
                    'customerId',
                    'currencyId',
                ],
                loadRelationIds: false,
            });
        });
    }
}
exports.CustomerAccountService = CustomerAccountService;


/***/ }),

/***/ 3438:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomerController = void 0;
const common_controller_1 = __webpack_require__(6577);
const customers_service_1 = __webpack_require__(7545);
const joi_1 = __importDefault(__webpack_require__(8506));
const network_handler_1 = __importDefault(__webpack_require__(5166));
const utils_1 = __webpack_require__(974);
const customer_account_service_1 = __webpack_require__(5275);
const logger_1 = __webpack_require__(6645);
class CustomerController extends common_controller_1.ICommonController {
    constructor(customerService = new customers_service_1.CustomerService(), accountService = new customer_account_service_1.CustomerAccountService()) {
        super();
        this.customerService = customerService;
        this.accountService = accountService;
        this.validateUpdateSchema = (req, res, next) => {
            var _a;
            const { error } = this.updateSchema.validate(req.body);
            if (!error)
                return next();
            return network_handler_1.default.badRequest(res, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : 'N/A');
        };
        this.addResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield this.customerService.addResource(req.body);
                logger_1.Logger.info(customer);
                const customers = this.customerService.getFormattedCustomerEntity([
                    customer,
                ]);
                return res.json(customers[0]);
            }
            catch (e) {
                logger_1.Logger.error(e);
                return network_handler_1.default.badRequest(res, 'Customer Already Exists');
            }
        });
        this.findSingleResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const customer = yield this.customerService.getCustomer(req.params);
            if (!customer) {
                return network_handler_1.default.entityNotFound(res, 'Customer', req.params.id);
            }
            customer.accounts = yield this.accountService.getAccountsByCustomerId(req.params);
            return res.json(customer);
        });
        this.findAllResources = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const page = Number.parseInt(`${(_a = req.query.page) !== null && _a !== void 0 ? _a : '1'}`);
                if (page === -1) {
                    const _ = this.customerService.getFormattedCustomerEntity(yield this.customerService.getAllCustomers(req.query));
                    return res.json(_);
                }
                const [customers, count] = yield this.customerService.getAllCustomersAndCount(req.query);
                (0, utils_1.setTotalPagesHeader)(res, req.query, count);
                logger_1.Logger.warn(customers);
                return res.json(this.customerService.getFormattedCustomerEntity(customers));
            }
            catch (e) {
                logger_1.Logger.error(e);
                // tslint:disable-next-line:no-console
                console.error(e);
                return network_handler_1.default.serverError(res, 'Error occured');
            }
        });
        this.deleteResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const customer = yield this.customerService.getCustomer(req.params);
                if (!customer) {
                    return network_handler_1.default.entityNotFound(res, 'Customer', req.params.id);
                }
                const removedCustomer = yield this.customerService.deleteCustomer(customer);
                return res.json(customer);
            }
            catch (e) {
                logger_1.Logger.error(e);
                network_handler_1.default.serverError(res, 'An Occured');
                return;
            }
        });
        this.updateResources = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const customerEntity = req.entity;
                const updatedCustomer = yield this.customerService.updateCustomer(customerEntity, req.body);
                res.json(updatedCustomer);
                return;
            }
            catch (e) {
                logger_1.Logger.error(e);
                network_handler_1.default.serverError(res, 'An Error Occured');
                return;
            }
        });
    }
    get creationSchema() {
        return joi_1.default.object({
            fullName: joi_1.default.string().required().min(3),
            phone: joi_1.default.string().required().pattern(/[0-9]/).min(3),
            accounts: joi_1.default.array().items({
                balance: joi_1.default.number().greater(-1),
                currency: joi_1.default.object({
                    id: joi_1.default.number().positive().required(),
                    name: joi_1.default.string().required(),
                    symbol: joi_1.default.string().required(),
                    createDate: joi_1.default.string(),
                    updateDate: joi_1.default.string(),
                }).required(),
            }),
        });
    }
    get updateSchema() {
        return joi_1.default.object({
            fullName: joi_1.default.string().min(3),
            phone: joi_1.default.string().pattern(/[0-9]/).min(3),
        }).unknown();
    }
}
exports.CustomerController = CustomerController;


/***/ }),

/***/ 368:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomerDao = void 0;
const common_dao_1 = __webpack_require__(8626);
const customer_entity_1 = __webpack_require__(2279);
const customer_account_entity_1 = __webpack_require__(5580);
const customer_account_dao_1 = __webpack_require__(9153);
class CustomerDao extends common_dao_1.ICommonDao {
    constructor(accountDao = new customer_account_dao_1.AccountDao()) {
        super(customer_entity_1.CustomerEntity);
        this.accountDao = accountDao;
    }
    addResource(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            const customer = new customer_entity_1.CustomerEntity();
            customer.fullName = resource.fullName;
            customer.phone = resource.phone;
            yield this.repo.save(customer);
            if (!resource.accounts) {
                customer.accounts = [];
                return customer;
            }
            const accounts = [];
            resource.accounts.forEach((dto) => __awaiter(this, void 0, void 0, function* () {
                var _a;
                const account = new customer_account_entity_1.AccountEntity();
                account.balance = (_a = dto.balance) !== null && _a !== void 0 ? _a : 0.0;
                account.currency = dto.currency;
                account.customer = customer;
                accounts.push(account);
            }));
            customer.accounts = yield this.accountDao.repo.save(accounts);
            return customer;
        });
    }
    findSingleResource(option) {
        return this.repo.findOne(option);
    }
    getAllResources(options) {
        return this.repo.find(options);
    }
    getAllResourcesAndCount(options) {
        return this.repo.findAndCount(options);
    }
    deleteResource(resource) {
        return this.repo.softRemove(resource);
    }
    updateResource(resource) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.repo.update(resource.id, {
                fullName: resource.fullName,
                phone: resource.phone,
            });
            const customer = yield this.findSingleResource({
                where: { id: resource.id },
            });
            return customer;
        });
    }
}
exports.CustomerDao = CustomerDao;


/***/ }),

/***/ 6214:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getAccountsQueryParams = exports.getCustomerQueryParams = void 0;
const utils_1 = __webpack_require__(974);
const typeorm_1 = __webpack_require__(5250);
function getCustomerQueryParams(params) {
    const { take, skip } = (0, utils_1.getPagination)(params);
    const where = {
        fullName: params.fullname ? (0, typeorm_1.Like)(`%${params.fullname}%`) : (0, typeorm_1.Not)(''),
        phone: params.phone ? (0, typeorm_1.Like)(`%${params.phone}%`) : (0, typeorm_1.Not)(''),
        isRemoved: false,
    };
    return {
        where: where,
        skip: skip,
        take: take,
        order: { createDate: 'asc' },
    };
}
exports.getCustomerQueryParams = getCustomerQueryParams;
function getAccountsQueryParams(params) {
    const { take, skip } = (0, utils_1.getPagination)(params);
    const where = [];
    if (params.currencyId)
        where.push({ currencyId: params.currencyId });
    if (params.customerId)
        where.push({ customerId: params.customerId });
    return {
        where: where.length > 0 ? where : undefined,
        skip: skip,
        take: take,
        order: { createDate: 'asc' },
    };
}
exports.getAccountsQueryParams = getAccountsQueryParams;


/***/ }),

/***/ 2279:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomerEntity = void 0;
const typeorm_1 = __webpack_require__(5250);
const customer_account_entity_1 = __webpack_require__(5580);
let CustomerEntity = class CustomerEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CustomerEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'phone', type: 'varchar', nullable: false, unique: true }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => customer_account_entity_1.AccountEntity, (account) => account.customer, {
        eager: true,
        nullable: false,
        cascade: false,
        onUpdate: 'NO ACTION',
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Array)
], CustomerEntity.prototype, "accounts", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'is_removed',
        type: 'boolean',
        default: false,
        nullable: false,
    }),
    __metadata("design:type", Boolean)
], CustomerEntity.prototype, "isRemoved", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_date' }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "createDate", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_date' }),
    __metadata("design:type", String)
], CustomerEntity.prototype, "updateDate", void 0);
CustomerEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'customers' })
], CustomerEntity);
exports.CustomerEntity = CustomerEntity;


/***/ }),

/***/ 4842:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomerRoutes = void 0;
const common_route_config_1 = __webpack_require__(5906);
const customer_controller_1 = __webpack_require__(3438);
const entity_exits_middleware_1 = __webpack_require__(2426);
const customer_dao_1 = __webpack_require__(368);
const customer_account_controller_1 = __webpack_require__(1847);
class CustomerRoutes extends common_route_config_1.CommonRoutesConfig {
    constructor(app, roles = []) {
        super(app, 'Customers', new customer_controller_1.CustomerController(), roles);
    }
    configureRoutes() {
        const customerDao = new customer_dao_1.CustomerDao();
        const accountController = new customer_account_controller_1.CustomerAccountController();
        /**
         * get All accounts by specific customer
         */
        this.app
            .route(this.route + '/:id' + this.accountRoute + '/:accountId')
            .get((0, entity_exits_middleware_1.entityExitsMiddleware)(customerDao), accountController.findSingleResource);
        this.app
            .route(this.route + '/:id' + this.accountRoute)
            .get((0, entity_exits_middleware_1.entityExitsMiddleware)(customerDao), accountController.findAllResources);
        this.app
            .route(this.route + '/:id' + this.accountRoute)
            .post((0, entity_exits_middleware_1.entityExitsMiddleware)(customerDao), accountController.validateCreationSchema, accountController.addResource);
        /**
         * Customer Routes
         */
        this.app.route(this.route + '/:id').get(this.controller.findSingleResource);
        this.app.route(this.route).get(this.controller.findAllResources);
        this.app
            .route(this.route)
            .post(this.controller.validateCreationSchema, this.controller.addResource);
        this.app.route(this.route + '/:id').delete(this.controller.deleteResource);
        this.app
            .route(this.route + '/:id')
            .put((0, entity_exits_middleware_1.entityExitsMiddleware)(customerDao), this.controller.validateUpdateSchema, this.controller.updateResources);
        return this.app;
    }
    get route() {
        return this.pathPrefix + '/customers';
    }
    get accountRoute() {
        return '/accounts';
    }
}
exports.CustomerRoutes = CustomerRoutes;


/***/ }),

/***/ 7545:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CustomerService = void 0;
const customer_dao_1 = __webpack_require__(368);
const customer_account_dao_1 = __webpack_require__(9153);
const customer_dto_1 = __webpack_require__(6214);
const logger_1 = __webpack_require__(6645);
const utils_1 = __webpack_require__(974);
class CustomerService {
    constructor(customerDao = new customer_dao_1.CustomerDao(), accountDao = new customer_account_dao_1.AccountDao()) {
        this.customerDao = customerDao;
        this.accountDao = accountDao;
        this.addResource = (body) => __awaiter(this, void 0, void 0, function* () {
            return this.customerDao.addResource(body);
        });
        this.getAllCustomers = (queryParams) => __awaiter(this, void 0, void 0, function* () {
            const options = (0, customer_dto_1.getCustomerQueryParams)(queryParams);
            return this.customerDao.getAllResources(options);
        });
        this.getAllCustomersAndCount = (queryParams) => __awaiter(this, void 0, void 0, function* () {
            const { skip, take } = (0, utils_1.getPagination)(queryParams);
            const query = this.customerDao.repo
                .createQueryBuilder('customer')
                .select()
                .leftJoinAndSelect('customer.accounts', 'accounts')
                .leftJoinAndSelect('accounts.currency', 'currency')
                .skip(skip)
                .take(take);
            if (queryParams.fullname)
                query.orWhere(`full_name like('%${queryParams.fullname}%')`);
            if (queryParams.phone)
                query.orWhere(`phone like('%${queryParams.phone}%')`);
            query.andWhere('customer.is_removed <> 1');
            logger_1.Logger.warn(query.getSql());
            return query.getManyAndCount();
        });
        this.getCustomer = (params) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = (_a = params.id) !== null && _a !== void 0 ? _a : 'N/A';
            return this.customerDao.findSingleResource({
                where: { id: id },
            });
        });
        this.deleteCustomer = (customer) => __awaiter(this, void 0, void 0, function* () {
            customer.isRemoved = true;
            return this.customerDao.repo.query(`update customers set is_removed=1 where id='${customer.id}'`);
        });
        this.updateCustomer = (customer, body) => __awaiter(this, void 0, void 0, function* () {
            var _b, _c;
            customer.phone = (_b = body.phone) !== null && _b !== void 0 ? _b : customer.phone;
            customer.fullName = (_c = body.fullName) !== null && _c !== void 0 ? _c : customer.fullName;
            return this.customerDao.updateResource(customer);
        });
        this.getFormattedCustomerEntity = (customers) => {
            return customers.map((element, index) => {
                return {
                    id: element.id,
                    fullName: element.fullName,
                    phone: element.phone,
                    isRemoved: element.isRemoved,
                    accounts: element.accounts.map((account) => {
                        return {
                            id: account.id,
                            balance: account.balance,
                            currency: account.currency,
                            updateDate: account.updateDate,
                            createDate: account.createDate,
                        };
                    }),
                    updateDate: element.updateDate,
                };
            });
        };
    }
}
exports.CustomerService = CustomerService;


/***/ }),

/***/ 4228:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoleController = void 0;
const common_controller_1 = __webpack_require__(6577);
const joi_1 = __importDefault(__webpack_require__(8506));
const role_dao_1 = __webpack_require__(9324);
const network_handler_1 = __importDefault(__webpack_require__(5166));
const utils_1 = __webpack_require__(974);
const user_dao_1 = __webpack_require__(2348);
const logger_1 = __webpack_require__(6645);
class RoleController extends common_controller_1.ICommonController {
    constructor(roleDao = new role_dao_1.RoleDao()) {
        super();
        this.roleDao = roleDao;
        this.validateIfRoleExists = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const role = (_a = req.body.role) !== null && _a !== void 0 ? _a : 'N/A';
            const resources = yield this.roleDao.findSingleResource({
                where: { role: role.toLowerCase() },
            });
            if (resources)
                return network_handler_1.default.badRequest(res, 'Role Already exists');
            next();
        });
        this.addResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const name = req.body.role;
            const role = yield this.roleDao.addResource(name.toLowerCase());
            res.json(role);
            return;
        });
        this.findSingleResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const role = yield this.roleDao.findSingleResource({
                where: { id: Number.parseInt(id !== null && id !== void 0 ? id : '-1') },
            });
            if (!role)
                return network_handler_1.default.entityNotFound(res, 'Role', id);
            return res.json(role);
        });
        this.findAllResources = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [roles, count] = yield this.roleDao.getAllResourcesAndCount();
            (0, utils_1.setTotalPagesHeader)(res, req.query, count);
            return res.json(roles);
        });
        this.deleteResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            try {
                const id = Number.parseInt((_b = req.params.id) !== null && _b !== void 0 ? _b : '-1');
                const role = yield this.roleDao.findSingleResource({ where: { id: id } });
                if (!role)
                    return network_handler_1.default.entityNotFound(res, 'Role', `${id}`);
                const userDao = new user_dao_1.UserDao();
                yield userDao.repo.query('update users set roleId=null where roleId=' + role.id);
                yield this.roleDao.deleteResource(role);
                return res.json(role);
            }
            catch (e) {
                logger_1.Logger.error(e);
                network_handler_1.default.serverError(res, 'An Error Occured');
                return;
            }
        });
    }
    get creationSchema() {
        return joi_1.default.object({
            role: joi_1.default.string().required().min(3),
        });
    }
}
exports.RoleController = RoleController;


/***/ }),

/***/ 9324:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoleDao = void 0;
const common_dao_1 = __webpack_require__(8626);
const role_entity_1 = __webpack_require__(7918);
class RoleDao extends common_dao_1.ICommonDao {
    constructor() {
        super(role_entity_1.RoleEntity);
    }
    getAllResources(options) {
        return this.repo.find();
    }
    addResource(resource) {
        return this.repo.save({ role: resource });
    }
    findSingleResource(option) {
        return this.repo.findOne(option);
    }
    getAllResourcesAndCount(options) {
        return this.repo.findAndCount(options);
    }
    deleteResource(resource) {
        return this.repo.remove(resource);
    }
    updateResource(resource) {
        throw new Error('Method not implemented.');
    }
}
exports.RoleDao = RoleDao;


/***/ }),

/***/ 7918:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoleEntity = void 0;
const typeorm_1 = __webpack_require__(5250);
let RoleEntity = class RoleEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], RoleEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'role', type: 'varchar', nullable: false, unique: true }),
    __metadata("design:type", String)
], RoleEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_date' }),
    __metadata("design:type", String)
], RoleEntity.prototype, "createDate", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_date' }),
    __metadata("design:type", String)
], RoleEntity.prototype, "updateDate", void 0);
RoleEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'roles' })
], RoleEntity);
exports.RoleEntity = RoleEntity;


/***/ }),

/***/ 7569:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RoleRoutes = void 0;
const common_route_config_1 = __webpack_require__(5906);
const role_controller_1 = __webpack_require__(4228);
class RoleRoutes extends common_route_config_1.CommonRoutesConfig {
    constructor(app, roles = []) {
        super(app, 'RoleRoute', new role_controller_1.RoleController());
    }
    configureRoutes() {
        this.app.route(this.route).get(this.controller.findAllResources);
        this.app.route(this.route + '/:id').get(this.controller.findSingleResource);
        this.app.route(this.route + '/:id').delete(this.controller.deleteResource);
        this.app
            .route(this.route)
            .post(this.controller.validateCreationSchema, this.controller.validateIfRoleExists, this.controller.addResource);
        return this.app;
    }
    get route() {
        return this.pathPrefix + '/roles';
    }
}
exports.RoleRoutes = RoleRoutes;


/***/ }),

/***/ 9592:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ITransactionController = void 0;
const joi_1 = __importDefault(__webpack_require__(8506));
const network_handler_1 = __importDefault(__webpack_require__(5166));
const customers_service_1 = __webpack_require__(7545);
const customer_account_service_1 = __webpack_require__(5275);
const currency_service_1 = __webpack_require__(9889);
class ITransactionController {
    constructor(transactionService, customerService = new customers_service_1.CustomerService(), accountService = new customer_account_service_1.CustomerAccountService(), currencyService = new currency_service_1.CurrencyService()) {
        this.transactionService = transactionService;
        this.customerService = customerService;
        this.accountService = accountService;
        this.currencyService = currencyService;
        /**
         * validate user sent body
         */
        this.validateCreationSchema = (req, res, next) => {
            var _a;
            const { error } = this.creationSchema.validate(req.body);
            if (!error)
                return next();
            return network_handler_1.default.badRequest(res, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : 'N/A');
        };
        /**
         * middleware that fetch customer , fromAccount, toCurrency
         * customer if Customer not found returns 404 same as for fromAccount,toCurrency
         *
         */
        this.validateIsCustomerAndFromAccountExists = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const customerId = (_a = req.body.customer.id) !== null && _a !== void 0 ? _a : 'N/A';
            const customer = yield this.customerService.getCustomer({ id: customerId });
            if (!customer) {
                network_handler_1.default.entityNotFound(res, 'Customer', customerId);
                return;
            }
            const fromAccountId = (_b = req.body.fromAccount.id) !== null && _b !== void 0 ? _b : 'N/A';
            const account = yield this.accountService.getAccountById(fromAccountId);
            if (!account) {
                network_handler_1.default.entityNotFound(res, 'fromAccount', fromAccountId);
                return;
            }
            const currencyId = (_c = req.body.exchangeRate.toCurrency.id) !== null && _c !== void 0 ? _c : 'N/A';
            const toCurrency = yield this.currencyService.findOnById({
                id: currencyId,
            });
            if (!toCurrency) {
                network_handler_1.default.entityNotFound(res, 'toCurrency', currencyId);
                return;
            }
            req.customer = customer;
            req.fromAccount = account;
            req.toCurrency = toCurrency;
            next();
        });
        this.getTransactionData = (req) => {
            const customer = req.customer;
            const fromAccount = req.fromAccount;
            const toCurrency = req.toCurrency;
            return [customer, fromAccount, toCurrency];
        };
    }
    get creationSchema() {
        return joi_1.default.object({
            amount: joi_1.default.number().required().positive(),
            comment: joi_1.default.string(),
            fromAccount: joi_1.default.object({
                id: joi_1.default.string().required(),
                currency: joi_1.default.object(),
                balance: joi_1.default.number(),
                createDate: joi_1.default.string(),
                updateDate: joi_1.default.string(),
            }).required(),
            customer: joi_1.default.object({
                id: joi_1.default.string().uuid().required(),
                fullName: joi_1.default.string(),
                accounts: joi_1.default.array(),
                phone: joi_1.default.string(),
                createDate: joi_1.default.string(),
                updateDate: joi_1.default.string(),
            }).required(),
            exchangeRate: joi_1.default.object({
                rate: joi_1.default.number().required().positive(),
                toCurrency: joi_1.default.object({
                    id: joi_1.default.number().required(),
                    name: joi_1.default.string(),
                    symbol: joi_1.default.string(),
                    createDate: joi_1.default.string(),
                    updateDate: joi_1.default.string(),
                }).required(),
            }).required(),
        }).unknown();
    }
}
exports.ITransactionController = ITransactionController;


/***/ }),

/***/ 9826:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ITransactionService = void 0;
const exchange_rate_entity_1 = __webpack_require__(6110);
const transaction_entity_1 = __webpack_require__(7917);
const transaction_dao_1 = __webpack_require__(3640);
const customer_account_entity_1 = __webpack_require__(5580);
const logger_1 = __webpack_require__(6645);
class ITransactionService {
    constructor(transactionDao = new transaction_dao_1.TransactionDao()) {
        this.transactionDao = transactionDao;
    }
    makeTransaction(queryRunner, body, customer, fromAccount, type, toCurrency) {
        return __awaiter(this, void 0, void 0, function* () {
            yield queryRunner.connect();
            yield queryRunner.startTransaction();
            try {
                /// get Dto from Body
                const dto = this.getTransactionDto(body, customer, fromAccount, toCurrency);
                // get ExhangeRate Entity to be saved
                const exchangeRate = this.getExchangeRateEntityFromDto(dto.exchangeRate, dto.amount);
                // save ExchangRateEntity
                yield queryRunner.manager.save(exchangeRate);
                // get TransactionEntity from dto
                const transactionEntity = this.getTransactionEntityFromDto(dto);
                /// assign to exhcangeRate to it
                transactionEntity.exchangeRate = exchangeRate;
                transactionEntity.type = type;
                // save Transaction entity
                yield queryRunner.manager.save(transactionEntity);
                return [queryRunner, transactionEntity, dto];
            }
            catch (e) {
                yield queryRunner.rollbackTransaction();
                yield queryRunner.release();
                logger_1.Logger.error(e);
                throw Error('Unable to create customer');
            }
        });
    }
    getTransactionDto(body, customer, fromAccount, toCurrency) {
        var _a;
        return {
            amount: Math.abs(body.amount),
            customer,
            fromAccount,
            balanceSnapshot: fromAccount.balance,
            exchangeRate: {
                fromCurrency: fromAccount.currency,
                toCurrency,
                rate: toCurrency.id === fromAccount.currency.id
                    ? 1
                    : Number.parseFloat(body.exchangeRate.rate),
            },
            comment: (_a = body.comment) !== null && _a !== void 0 ? _a : 'N/A',
        };
    }
    getExchangeRateEntityFromDto(dto, amount) {
        const entity = new exchange_rate_entity_1.TransactionExchangeRateEntity();
        entity.fromCurrency = dto.fromCurrency;
        entity.toCurrency = dto.toCurrency;
        entity.rate = dto.rate;
        entity.exchangedAmount = amount * dto.rate;
        return entity;
    }
    getTransactionEntityFromDto(dto) {
        var _a;
        const transactionEntity = new transaction_entity_1.TransactionEntity();
        transactionEntity.amount = dto.amount;
        transactionEntity.balanceSnapShot = dto.fromAccount.balance;
        transactionEntity.customer = dto.customer;
        transactionEntity.fromAccount = dto.fromAccount;
        transactionEntity.fromAccount.customerId = dto.customer.id;
        transactionEntity.comment = (_a = dto.comment) !== null && _a !== void 0 ? _a : 'N/A';
        return transactionEntity;
    }
    getAccountEntityFromDto(entities) {
        return entities.map((element) => {
            const updatedFromAccount = new customer_account_entity_1.AccountEntity();
            updatedFromAccount.id = element.account.id;
            updatedFromAccount.customerId = element.customer.id;
            // updatedFromAccount.currencyId = fromAccount.currency.id;
            updatedFromAccount.currency = element.account.currency;
            updatedFromAccount.balance = element.account.balance;
            return updatedFromAccount;
        });
    }
}
exports.ITransactionService = ITransactionService;


/***/ }),

/***/ 3089:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DepositeInfo = void 0;
const typeorm_1 = __webpack_require__(5250);
let DepositeInfo = class DepositeInfo {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], DepositeInfo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from', type: 'varchar', default: 'N/A', nullable: true }),
    __metadata("design:type", String)
], DepositeInfo.prototype, "from", void 0);
DepositeInfo = __decorate([
    (0, typeorm_1.Entity)({ name: 'deposite_info' })
], DepositeInfo);
exports.DepositeInfo = DepositeInfo;


/***/ }),

/***/ 6110:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var TransactionExchangeRateEntity_1;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionExchangeRateEntity = void 0;
const typeorm_1 = __webpack_require__(5250);
const currency_entity_1 = __webpack_require__(7206);
let TransactionExchangeRateEntity = TransactionExchangeRateEntity_1 = class TransactionExchangeRateEntity {
    static createInstanceFormDto(dto, amount) {
        const entity = new TransactionExchangeRateEntity_1();
        entity.fromCurrency = dto.fromCurrency;
        entity.toCurrency = dto.toCurrency;
        entity.rate = dto.rate;
        entity.exchangedAmount = amount * dto.rate;
        return entity;
    }
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], TransactionExchangeRateEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => currency_entity_1.CurrencyEntity, { eager: true, nullable: false }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", currency_entity_1.CurrencyEntity)
], TransactionExchangeRateEntity.prototype, "fromCurrency", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => currency_entity_1.CurrencyEntity, { eager: true, nullable: false }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", currency_entity_1.CurrencyEntity)
], TransactionExchangeRateEntity.prototype, "toCurrency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'rate',
        type: 'float',
        nullable: false,
        default: 1,
        unique: false,
    }),
    __metadata("design:type", Number)
], TransactionExchangeRateEntity.prototype, "rate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'exchanged_amount', type: 'float', nullable: false }),
    __metadata("design:type", Number)
], TransactionExchangeRateEntity.prototype, "exchangedAmount", void 0);
TransactionExchangeRateEntity = TransactionExchangeRateEntity_1 = __decorate([
    (0, typeorm_1.Entity)({ name: 'transaction_exchange_rate' })
], TransactionExchangeRateEntity);
exports.TransactionExchangeRateEntity = TransactionExchangeRateEntity;


/***/ }),

/***/ 6506:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalTransactionInfoEntity = void 0;
const typeorm_1 = __webpack_require__(5250);
const customer_entity_1 = __webpack_require__(2279);
const customer_account_entity_1 = __webpack_require__(5580);
let LocalTransactionInfoEntity = class LocalTransactionInfoEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], LocalTransactionInfoEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.CustomerEntity, { nullable: false, eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", customer_entity_1.CustomerEntity)
], LocalTransactionInfoEntity.prototype, "toCustomer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_account_entity_1.AccountEntity, { nullable: false, eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", customer_account_entity_1.AccountEntity)
], LocalTransactionInfoEntity.prototype, "toAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'balance_snapshot', type: 'float', nullable: false }),
    __metadata("design:type", Number)
], LocalTransactionInfoEntity.prototype, "balanceSnapshot", void 0);
LocalTransactionInfoEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'local_transaction_info' })
], LocalTransactionInfoEntity);
exports.LocalTransactionInfoEntity = LocalTransactionInfoEntity;


/***/ }),

/***/ 7917:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionEntity = void 0;
const typeorm_1 = __webpack_require__(5250);
const customer_entity_1 = __webpack_require__(2279);
const exchange_rate_entity_1 = __webpack_require__(6110);
const transaction_info_entity_1 = __webpack_require__(4129);
const local_transaction_info_entity_1 = __webpack_require__(6506);
const customer_account_entity_1 = __webpack_require__(5580);
const deposite_info_entity_1 = __webpack_require__(3089);
let TransactionEntity = class TransactionEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], TransactionEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'date' }),
    __metadata("design:type", String)
], TransactionEntity.prototype, "date", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_entity_1.CustomerEntity, { eager: true, nullable: false }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", customer_entity_1.CustomerEntity)
], TransactionEntity.prototype, "customer", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_account_entity_1.AccountEntity, { eager: true, nullable: false }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", customer_account_entity_1.AccountEntity)
], TransactionEntity.prototype, "fromAccount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'type' }),
    __metadata("design:type", String)
], TransactionEntity.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'amount', type: 'float', nullable: false }),
    __metadata("design:type", Number)
], TransactionEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'balance_snapshot', type: 'float', nullable: false }),
    __metadata("design:type", Number)
], TransactionEntity.prototype, "balanceSnapShot", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => exchange_rate_entity_1.TransactionExchangeRateEntity, {
        eager: true,
        nullable: false,
        cascade: true,
    }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", exchange_rate_entity_1.TransactionExchangeRateEntity)
], TransactionEntity.prototype, "exchangeRate", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => transaction_info_entity_1.TransactionInfoEntity, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Object)
], TransactionEntity.prototype, "transactionInfo", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => local_transaction_info_entity_1.LocalTransactionInfoEntity, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Object)
], TransactionEntity.prototype, "localTransactionInfo", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => deposite_info_entity_1.DepositeInfo, { nullable: true, eager: true }),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", Object)
], TransactionEntity.prototype, "depositeInfo", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'comment', nullable: false, type: 'varchar', default: 'N/A' }),
    __metadata("design:type", String)
], TransactionEntity.prototype, "comment", void 0);
TransactionEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'transactions' })
], TransactionEntity);
exports.TransactionEntity = TransactionEntity;


/***/ }),

/***/ 4129:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionInfoEntity = void 0;
const typeorm_1 = __webpack_require__(5250);
let TransactionInfoEntity = class TransactionInfoEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('increment'),
    __metadata("design:type", Number)
], TransactionInfoEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'full_name', type: 'varchar', nullable: false }),
    __metadata("design:type", String)
], TransactionInfoEntity.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'phone',
        type: 'varchar',
        length: 56,
        default: 'N/A',
        nullable: false,
    }),
    __metadata("design:type", String)
], TransactionInfoEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'bank_account',
        type: 'varchar',
        default: 'N/A',
        nullable: false,
    }),
    __metadata("design:type", String)
], TransactionInfoEntity.prototype, "bankAccount", void 0);
TransactionInfoEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'transaction_info' })
], TransactionInfoEntity);
exports.TransactionInfoEntity = TransactionInfoEntity;


/***/ }),

/***/ 617:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionDepositeController = void 0;
const base_transaction_controller_1 = __webpack_require__(9592);
const network_handler_1 = __importDefault(__webpack_require__(5166));
const transaction_deposite_service_1 = __webpack_require__(2296);
const logger_1 = __webpack_require__(6645);
class TransactionDepositeController extends base_transaction_controller_1.ITransactionController {
    constructor() {
        super(new transaction_deposite_service_1.TransactionDepositeService());
        this.makeTransactionDeposite = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [customer, fromAccount, toCurrency] = this.getTransactionData(req);
            try {
                const _entity = yield this.transactionService.makeAccountDeposite(req.body, customer, fromAccount, toCurrency);
                const transaction = yield this.transactionService.transactionDao.findSingleResource({
                    where: { id: _entity.id },
                });
                return res.json(transaction);
            }
            catch (e) {
                logger_1.Logger.error(e);
                return network_handler_1.default.serverError(res, 'Error Occured');
            }
        });
    }
}
exports.TransactionDepositeController = TransactionDepositeController;


/***/ }),

/***/ 2296:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionDepositeService = void 0;
const database_1 = __importDefault(__webpack_require__(3570));
const base_transaction_service_1 = __webpack_require__(9826);
const logger_1 = __webpack_require__(6645);
const deposite_info_entity_1 = __webpack_require__(3089);
class TransactionDepositeService extends base_transaction_service_1.ITransactionService {
    constructor() {
        super();
        this.makeAccountDeposite = (body, customer, fromAccount, toCurrency) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const _runner = database_1.default.createQueryRunner();
            const [queryRunner, transaction, dto] = yield this.makeTransaction(_runner, body, customer, fromAccount, 'deposite', toCurrency);
            try {
                const [updateAccountEntity] = yield this.getAccountEntityFromDto([
                    { customer, account: fromAccount },
                ]);
                updateAccountEntity.balance = fromAccount.balance + dto.amount;
                const depositeInfo = new deposite_info_entity_1.DepositeInfo();
                depositeInfo.from = (_a = body.from) !== null && _a !== void 0 ? _a : 'N/A';
                yield queryRunner.manager.save(depositeInfo);
                transaction.depositeInfo = depositeInfo;
                yield queryRunner.manager.save(transaction);
                yield queryRunner.manager.save(updateAccountEntity);
                yield queryRunner.commitTransaction();
                yield queryRunner.release();
                return transaction;
            }
            catch (e) {
                logger_1.Logger.error(e);
                yield queryRunner.rollbackTransaction();
                yield queryRunner.release();
                throw Error('Unable to create customer');
            }
        });
    }
}
exports.TransactionDepositeService = TransactionDepositeService;


/***/ }),

/***/ 7349:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionGlobalTransferController = void 0;
const base_transaction_controller_1 = __webpack_require__(9592);
const transaction_global_transfer_service_1 = __webpack_require__(7352);
const joi_1 = __importDefault(__webpack_require__(8506));
const network_handler_1 = __importDefault(__webpack_require__(5166));
const logger_1 = __webpack_require__(6645);
class TransactionGlobalTransferController extends base_transaction_controller_1.ITransactionController {
    constructor() {
        super(new transaction_global_transfer_service_1.TransactionGlobalTransferService());
        this.validateGlobalTransferSchema = (req, res, next) => {
            const { error } = this.globalTransferScheam.validate(req.body);
            if (error)
                return network_handler_1.default.badRequest(res, error.message);
            next();
        };
        this.handleGlobalTransfer = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [customer, account, toCurrency] = this.getTransactionData(req);
                const data = {
                    body: req.body,
                    customer,
                    fromAccount: account,
                    toCurrency,
                };
                const _entity = yield this.transactionService.handleGlobalTransfer(data);
                const transaction = yield this.transactionService.transactionDao.findSingleResource({
                    where: { id: _entity.id },
                });
                return res.json(transaction);
            }
            catch (e) {
                logger_1.Logger.error(e);
                network_handler_1.default.serverError(res, 'An Error Occured');
                return;
            }
        });
    }
    get globalTransferScheam() {
        return joi_1.default.object({
            transactionInfo: joi_1.default.object({
                fullName: joi_1.default.string().required(),
                phone: joi_1.default.string().pattern(RegExp(/[0-9]/)),
                bankAccount: joi_1.default.string().pattern(RegExp(/[0-9]/)),
            }).required(),
        }).unknown();
    }
}
exports.TransactionGlobalTransferController = TransactionGlobalTransferController;


/***/ }),

/***/ 7352:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionGlobalTransferService = void 0;
const base_transaction_service_1 = __webpack_require__(9826);
const transaction_info_entity_1 = __webpack_require__(4129);
const logger_1 = __webpack_require__(6645);
const database_1 = __importDefault(__webpack_require__(3570));
class TransactionGlobalTransferService extends base_transaction_service_1.ITransactionService {
    constructor() {
        super(...arguments);
        this.handleGlobalTransfer = (data) => __awaiter(this, void 0, void 0, function* () {
            const _runner = database_1.default.createQueryRunner();
            const [queryRunner, transaction, dto] = yield this.makeTransaction(_runner, data.body, data.customer, data.fromAccount, 'globalTransfer', data.toCurrency);
            try {
                const transactionInfo = this.getGlobalTransferEntity(data.body);
                const [fromAccount] = this.getAccountEntityFromDto([
                    { customer: data.customer, account: data.fromAccount },
                ]);
                fromAccount.balance = fromAccount.balance - dto.amount;
                yield queryRunner.manager.save(fromAccount);
                yield queryRunner.manager.save(transactionInfo);
                transaction.transactionInfo = transactionInfo;
                yield queryRunner.manager.save(transaction);
                yield queryRunner.commitTransaction();
                yield queryRunner.release();
                return transaction;
            }
            catch (e) {
                logger_1.Logger.error(e);
                throw Error('An Error occured');
            }
        });
        this.getGlobalTransferEntity = (body) => {
            var _a, _b, _c;
            const entity = new transaction_info_entity_1.TransactionInfoEntity();
            entity.fullName = (_a = body.transactionInfo.fullName) !== null && _a !== void 0 ? _a : 'N/A';
            entity.phone = (_b = body.transactionInfo.phone) !== null && _b !== void 0 ? _b : 'N/A';
            entity.bankAccount = (_c = body.transactionInfo.bankAccount) !== null && _c !== void 0 ? _c : 'N/A';
            return entity;
        };
    }
}
exports.TransactionGlobalTransferService = TransactionGlobalTransferService;


/***/ }),

/***/ 1068:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionLocalTransferController = void 0;
const base_transaction_controller_1 = __webpack_require__(9592);
const transaction_local_transfer_service_1 = __webpack_require__(6900);
const joi_1 = __importDefault(__webpack_require__(8506));
const network_handler_1 = __importDefault(__webpack_require__(5166));
const logger_1 = __webpack_require__(6645);
class TransactionLocalTransferController extends base_transaction_controller_1.ITransactionController {
    constructor() {
        super(new transaction_local_transfer_service_1.TransactionLocalTransferService());
        this.handleAccountToAccountTransfer = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [customer, fromAccount, toCurrency] = this.getTransactionData(req);
            const toAccount = req.toAccount;
            const toCustomer = req
                .toCustomer;
            try {
                const data = {
                    body: req.body,
                    customer: customer,
                    fromAccount: fromAccount,
                    toAccount: toAccount,
                    toCustomer: toCustomer,
                };
                const _entity = yield this.transactionService.handleAccountToAccountTransfer(data);
                const transaction = yield this.transactionService.transactionDao.findSingleResource({
                    where: { id: _entity.id },
                });
                return res.json(transaction);
            }
            catch (e) {
                logger_1.Logger.error(e);
                return network_handler_1.default.serverError(res, 'Error Occured');
            }
        });
        this.validateLocalTransferCreationSchema = (req, res, next) => {
            var _a;
            const { error } = this.localTransferSchema.validate(req.body);
            if (!error)
                return next();
            return network_handler_1.default.badRequest(res, (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : 'N/A');
        };
        this.validateIsToCustomerAndToAccountExists = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            const customerId = (_a = req.body.toCustomer.id) !== null && _a !== void 0 ? _a : 'N/A';
            const customer = yield this.customerService.getCustomer({ id: customerId });
            if (!customer) {
                network_handler_1.default.entityNotFound(res, 'toCustomer', customerId);
                return;
            }
            const fromAccountId = (_b = req.body.toAccount.id) !== null && _b !== void 0 ? _b : 'N/A';
            const account = yield this.accountService.getAccountById(fromAccountId);
            if (!account) {
                network_handler_1.default.entityNotFound(res, 'toAccount', fromAccountId);
                return;
            }
            const fromCustomer = req.customer;
            const fromAccount = req.fromAccount;
            if (fromCustomer.id === customer.id && fromAccount.id === account.id) {
                network_handler_1.default.badRequest(res, 'Cannot transfer to same with the same accounts');
            }
            req.toCustomer = customer;
            req.toAccount = account;
            next();
        });
    }
    get localTransferSchema() {
        return joi_1.default.object({
            toCustomer: joi_1.default.object({
                id: joi_1.default.string().uuid().required(),
                fullName: joi_1.default.string(),
                accounts: joi_1.default.array(),
                phone: joi_1.default.string(),
                updateDate: joi_1.default.string(),
            }).required(),
            toAccount: joi_1.default.object({
                id: joi_1.default.string().required(),
                currency: joi_1.default.object(),
                balance: joi_1.default.number(),
                createDate: joi_1.default.string(),
                updateDate: joi_1.default.string(),
            }).required(),
        }).unknown();
    }
}
exports.TransactionLocalTransferController = TransactionLocalTransferController;


/***/ }),

/***/ 6900:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionLocalTransferService = void 0;
const database_1 = __importDefault(__webpack_require__(3570));
const base_transaction_service_1 = __webpack_require__(9826);
const local_transaction_info_entity_1 = __webpack_require__(6506);
const logger_1 = __webpack_require__(6645);
class TransactionLocalTransferService extends base_transaction_service_1.ITransactionService {
    constructor() {
        super();
        this.handleAccountToAccountTransfer = (data) => __awaiter(this, void 0, void 0, function* () {
            const _runner = database_1.default.createQueryRunner();
            const [queryRunner, transaction, dto] = yield this.makeTransaction(_runner, data.body, data.customer, data.fromAccount, 'localeTransfer', data.toAccount.currency);
            try {
                const localeInfo = this.getLocalTransactionInfoEntity(data.toCustomer, data.toAccount);
                transaction.localTransactionInfo =
                    yield queryRunner.manager.save(localeInfo);
                yield queryRunner.manager.save(transaction);
                const [updatedToAccount, updatedFromAccount] = this.getAccountEntityFromDto([
                    { customer: data.toCustomer, account: data.toAccount },
                    {
                        customer: data.customer,
                        account: data.fromAccount,
                    },
                ]);
                updatedFromAccount.balance = updatedFromAccount.balance - dto.amount;
                updatedToAccount.balance =
                    updatedToAccount.balance + transaction.exchangeRate.exchangedAmount;
                yield queryRunner.manager.save(updatedToAccount);
                yield queryRunner.manager.save(updatedFromAccount);
                yield queryRunner.commitTransaction();
                yield queryRunner.release();
                return transaction;
            }
            catch (e) {
                logger_1.Logger.error(e);
                yield queryRunner.rollbackTransaction();
                yield queryRunner.release();
                throw Error('Unable to create customer');
            }
        });
        this.getLocalTransactionInfoEntity = (toCustomer, toAccount) => {
            const entity = new local_transaction_info_entity_1.LocalTransactionInfoEntity();
            entity.toAccount = toAccount;
            entity.balanceSnapshot = toAccount.balance;
            entity.toAccount.customerId = toCustomer.id;
            entity.toCustomer = toCustomer;
            return entity;
        };
    }
}
exports.TransactionLocalTransferService = TransactionLocalTransferService;


/***/ }),

/***/ 8424:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionWithdrawController = void 0;
const base_transaction_controller_1 = __webpack_require__(9592);
const transaction_withdraw_service_1 = __webpack_require__(331);
const network_handler_1 = __importDefault(__webpack_require__(5166));
const logger_1 = __webpack_require__(6645);
class TransactionWithdrawController extends base_transaction_controller_1.ITransactionController {
    constructor() {
        super(new transaction_withdraw_service_1.TransactionWithdrawService());
        this.makeTransactionDeposite = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const [customer, fromAccount, toCurrency] = this.getTransactionData(req);
            try {
                const _entity = yield this.transactionService.makeAccountWithdraw(req.body, customer, fromAccount, toCurrency);
                const transaction = yield this.transactionService.transactionDao.findSingleResource({
                    where: { id: _entity.id },
                });
                return res.json(transaction);
            }
            catch (e) {
                logger_1.Logger.error(e);
                return network_handler_1.default.serverError(res, 'Error Occured');
            }
        });
    }
}
exports.TransactionWithdrawController = TransactionWithdrawController;


/***/ }),

/***/ 331:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionWithdrawService = void 0;
const base_transaction_service_1 = __webpack_require__(9826);
const database_1 = __importDefault(__webpack_require__(3570));
const logger_1 = __webpack_require__(6645);
class TransactionWithdrawService extends base_transaction_service_1.ITransactionService {
    constructor() {
        super();
        this.makeAccountWithdraw = (body, customer, fromAccount, toCurrency) => __awaiter(this, void 0, void 0, function* () {
            const _runner = database_1.default.createQueryRunner();
            const [queryRunner, transaction, dto] = yield this.makeTransaction(_runner, body, customer, fromAccount, 'withdraw', toCurrency);
            try {
                const [updateAccountEntity] = yield this.getAccountEntityFromDto([
                    { customer, account: fromAccount },
                ]);
                logger_1.Logger.info(transaction);
                updateAccountEntity.balance = fromAccount.balance - dto.amount;
                yield queryRunner.manager.save(updateAccountEntity);
                yield queryRunner.commitTransaction();
                yield queryRunner.release();
                return transaction;
            }
            catch (e) {
                logger_1.Logger.error(e);
                yield queryRunner.rollbackTransaction();
                yield queryRunner.release();
                throw Error('Unable to create customer');
            }
        });
    }
}
exports.TransactionWithdrawService = TransactionWithdrawService;


/***/ }),

/***/ 5300:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionController = void 0;
const common_controller_1 = __webpack_require__(6577);
const network_handler_1 = __importDefault(__webpack_require__(5166));
const transaction_service_1 = __webpack_require__(8224);
const utils_1 = __webpack_require__(974);
const logger_1 = __webpack_require__(6645);
const joi_1 = __importDefault(__webpack_require__(8506));
const customers_service_1 = __webpack_require__(7545);
class TransactionController extends common_controller_1.ICommonController {
    constructor(service = new transaction_service_1.TransactionService()) {
        super();
        this.service = service;
        this.findSingleResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            //
            const transaction = yield this.service.getTransactionById(req.params);
            if (!transaction)
                return network_handler_1.default.entityNotFound(res, 'Transaction', req.params.id);
            return res.json(transaction);
        });
        this.findAllResources = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const page = req.query.page;
            if (page === '-1') {
                const data = yield this.service.getAllTransactions(req.query);
                res.json(data);
                return;
            }
            const [transactions, count] = yield this.service.getAllTransactionsAndCount(req.query);
            (0, utils_1.setTotalPagesHeader)(res, req.query, count);
            res.json(transactions);
            return;
        });
        this.getCustomerStatement = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            const { error } = this.customerStatementSchema.validate(data);
            if (error)
                return network_handler_1.default.badRequest(res, error.message);
            try {
                const customer = yield new customers_service_1.CustomerService().getCustomer({
                    id: data.customerId,
                });
                if (!customer) {
                    return network_handler_1.default.entityNotFound(res, 'Customer', data.customerId);
                }
                const transactions = yield this.service.getCustomerStatement(data);
                return res.json({ customer, transactions });
            }
            catch (e) {
                logger_1.Logger.error('getCustomerStatement', [e]);
                return network_handler_1.default.serverError(res, 'Error Occured');
            }
        });
        this.deleteResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const transaction = yield this.service.getTransactionById(req.params);
                if (!transaction)
                    return network_handler_1.default.entityNotFound(res, 'Transaction', req.params.id);
                const deletedTransaction = yield this.service.deleteTransactionById(transaction);
                res.json(deletedTransaction);
            }
            catch (e) {
                logger_1.Logger.error(e);
                network_handler_1.default.serverError(res, 'An Error Occured');
                return;
            }
        });
    }
    get creationSchema() {
        throw new Error('Method not implemented.');
    }
    get customerStatementSchema() {
        return joi_1.default.object({
            customerId: joi_1.default.string().required(),
            fromDate: joi_1.default.date().required(),
            toDate: joi_1.default.date().required(),
        });
    }
    addResource(req, res) {
        throw new Error('Method not implemented.');
    }
}
exports.TransactionController = TransactionController;


/***/ }),

/***/ 3640:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionDao = void 0;
const common_dao_1 = __webpack_require__(8626);
const transaction_entity_1 = __webpack_require__(7917);
class ITransactionDao extends common_dao_1.ICommonDao {
    constructor() {
        super(transaction_entity_1.TransactionEntity);
    }
}
// tslint:disable-next-line:max-classes-per-file
class TransactionDao extends ITransactionDao {
    constructor() {
        super();
    }
    insertNewResource(resource) {
        return this.repo.insert(resource);
    }
    addResource(resource) {
        return this.repo.save(resource);
    }
    findSingleResource(option) {
        return this.repo.findOne(option);
    }
    getAllResources(options) {
        return this.repo.find(Object.assign(Object.assign({}, options), { skip: 0, take: undefined }));
    }
    getAllResourcesAndCount(options) {
        return this.repo.findAndCount(options);
    }
    deleteResource(resource) {
        return this.repo.remove(resource);
    }
    updateResource(resource) {
        throw new Error('Method not implemented.');
    }
}
exports.TransactionDao = TransactionDao;


/***/ }),

/***/ 8224:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionService = void 0;
const transaction_dao_1 = __webpack_require__(3640);
const utils_1 = __webpack_require__(974);
const typeorm_1 = __webpack_require__(5250);
const logger_1 = __webpack_require__(6645);
class TransactionService {
    constructor(dao = new transaction_dao_1.TransactionDao()) {
        this.dao = dao;
        this.getTransactionById = (params) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const id = (_a = params.id) !== null && _a !== void 0 ? _a : 'N/A';
            return this.dao.findSingleResource({ where: { id } });
        });
        this.getAllTransactions = (queryParams) => __awaiter(this, void 0, void 0, function* () {
            const options = this.getTransactionQueryParams(queryParams);
            return this.dao.getAllResources(Object.assign(Object.assign({}, options), { skip: 0, take: undefined }));
        });
        this.getCustomerStatement = (data) => __awaiter(this, void 0, void 0, function* () {
            const fromDate = new Date(data.fromDate);
            // fromDate.setDate(fromDate.getDate()  1);
            const toDate = new Date(data.toDate);
            toDate.setDate(toDate.getDate() + 1);
            logger_1.Logger.warn('warn', { fromDate, toDate });
            return this.dao.getAllResources({
                where: {
                    customer: { id: data.customerId },
                    date: (0, typeorm_1.Between)(fromDate.toISOString().slice(0, 10), toDate.toISOString().slice(0, 10)),
                },
                order: { date: 'desc' },
            });
        });
        this.getAllTransactionsAndCount = (query) => __awaiter(this, void 0, void 0, function* () {
            const options = this.getTransactionQueryParams(query);
            return this.dao.getAllResourcesAndCount(options);
        });
        this.deleteTransactionById = (transaction) => __awaiter(this, void 0, void 0, function* () {
            return this.dao.deleteResource(transaction);
        });
        this.getTransactionQueryParams = (queryParams) => {
            const { skip, take } = (0, utils_1.getPagination)(queryParams);
            const where = [];
            if (queryParams.customerId)
                where.push({ customer: { id: queryParams.customerId } });
            if (queryParams.accountId)
                where.push({ fromAccount: { id: queryParams.accountId } });
            const date = queryParams.date;
            const transactionType = this.getTransactionType(queryParams.type);
            const customer = {
                fullName: queryParams.fullName !== undefined
                    ? (0, typeorm_1.Like)(`%${queryParams.fullName}%`)
                    : undefined,
                phone: queryParams.phone !== undefined
                    ? (0, typeorm_1.Like)(`%${queryParams.phone}%`)
                    : undefined,
            };
            if (transactionType !== undefined && date !== undefined) {
                where.push({
                    type: transactionType,
                    date: (0, typeorm_1.Like)(`%${queryParams.date}%`),
                });
            }
            else if (queryParams.date) {
                where.push({ date: (0, typeorm_1.Like)(`%${queryParams.date}%`) });
            }
            else if (transactionType !== undefined) {
                where.push({
                    type: transactionType,
                });
            }
            if (queryParams.fullName !== undefined || queryParams.phone !== undefined) {
                if (where.length >= 1) {
                    where[0].customer = customer;
                }
                else {
                    where.push({ customer: customer });
                }
            }
            const orderby = this.getOrderBy(queryParams.orderBy, queryParams.order);
            logger_1.Logger.warn({ orderby });
            // const data = !(
            //   transactionType === undefined || queryParams.date === undefined
            // )
            //   : [{ date: Like(`%${queryParams.date}%`), type: transactionType }];
            return {
                where: where.length >= 1 ? where : undefined,
                skip: skip,
                take: take,
                order: orderby,
            };
        };
        this.getTransactionType = (type) => {
            if (type === 'deposite')
                return 'deposite';
            if (type === 'localTransfer')
                return 'localeTransfer';
            if (type === 'globalTransfer')
                return 'globalTransfer';
            if (type === 'withdraw')
                return 'withdraw';
            return;
        };
        this.getOrderBy = (orderBy, order = 'desc') => {
            if (orderBy === 'amount')
                return { amount: order };
            return { date: order };
        };
    }
}
exports.TransactionService = TransactionService;


/***/ }),

/***/ 6426:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TransactionRoutes = void 0;
const common_route_config_1 = __webpack_require__(5906);
const transaction_deposite_controller_1 = __webpack_require__(617);
const transaction_withdraw_controller_1 = __webpack_require__(8424);
const transaction_local_transfer_controller_1 = __webpack_require__(1068);
const transaction_global_transfer_controller_1 = __webpack_require__(7349);
const transaction_controller_1 = __webpack_require__(5300);
class TransactionRoutes extends common_route_config_1.CommonRoutesConfig {
    constructor(app, roles = []) {
        super(app, 'TransactionsRoute', new transaction_controller_1.TransactionController(), roles);
    }
    configureRoutes() {
        /**
         * Deposite route transfer
         */
        const depositeController = new transaction_deposite_controller_1.TransactionDepositeController();
        this.app
            .route(this.route + '/deposite')
            .post(depositeController.validateCreationSchema, depositeController.validateIsCustomerAndFromAccountExists, depositeController.makeTransactionDeposite);
        /**
         * With route transfer
         */
        const withdrawController = new transaction_withdraw_controller_1.TransactionWithdrawController();
        this.app
            .route(this.route + '/withdraw')
            .post(withdrawController.validateCreationSchema, withdrawController.validateIsCustomerAndFromAccountExists, withdrawController.makeTransactionDeposite);
        /**
         * locale route transfer
         */
        const localTransferController = new transaction_local_transfer_controller_1.TransactionLocalTransferController();
        this.app
            .route(this.route + '/local-transfer')
            .post(localTransferController.validateCreationSchema, localTransferController.validateIsCustomerAndFromAccountExists, localTransferController.validateLocalTransferCreationSchema, localTransferController.validateIsToCustomerAndToAccountExists, localTransferController.handleAccountToAccountTransfer);
        /**
         * Global transfer route
         */
        const globalTransferController = new transaction_global_transfer_controller_1.TransactionGlobalTransferController();
        this.app
            .route(this.route + '/global-transfer')
            .post(globalTransferController.validateCreationSchema, globalTransferController.validateGlobalTransferSchema, globalTransferController.validateIsCustomerAndFromAccountExists, globalTransferController.handleGlobalTransfer);
        this.app
            .route(this.route + '/print')
            .post(this.controller.getCustomerStatement);
        /**
         * Get transaction by id
         */
        this.app.route(this.route + '/:id').get(this.controller.findSingleResource);
        this.app.route(this.route).get(this.controller.findAllResources);
        this.app.route(this.route + '/:id').delete(this.controller.deleteResource);
        return this.app;
    }
    get route() {
        return this.pathPrefix + '/transactions';
    }
}
exports.TransactionRoutes = TransactionRoutes;


/***/ }),

/***/ 8395:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserController = void 0;
const users_service_1 = __webpack_require__(1399);
const common_controller_1 = __webpack_require__(6577);
const joi_1 = __importDefault(__webpack_require__(8506));
const network_handler_1 = __importDefault(__webpack_require__(5166));
const utils_1 = __webpack_require__(974);
const logger_1 = __webpack_require__(6645);
class UserController extends common_controller_1.ICommonController {
    constructor(service = new users_service_1.UserService()) {
        super();
        this.service = service;
        this.addResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const resource = yield this.service.addResource(req.body);
                const entity = yield this.service.findSingleResource({ id: resource.id });
                return res.json(entity);
            }
            catch (e) {
                logger_1.Logger.error(e);
                return network_handler_1.default.badRequest(res, 'User Already exists');
            }
        });
        this.findSingleResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.Logger.info('here');
                const entity = yield this.service.findSingleResource(req.params);
                if (entity === null)
                    return network_handler_1.default.entityNotFound(res, 'User', req.params.id);
                return res.json(entity);
            }
            catch (e) {
                logger_1.Logger.error(e);
                return;
            }
        });
        this.findAllResources = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const [users, count] = yield this.service.findAllResources(req.query);
                (0, utils_1.setTotalPagesHeader)(res, req.query, count);
                return res.json(users);
            }
            catch (e) {
                logger_1.Logger.error(e);
                network_handler_1.default.serverError(res, 'Error Occured');
            }
        });
        this.deleteResource = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const user = yield this.service.findSingleResource(req.params);
            if (!user)
                return network_handler_1.default.entityNotFound(res, 'User', req.params.id);
            const removedUser = yield this.service.deleteResource(user);
            return res.json(removedUser);
        });
    }
    get creationSchema() {
        return joi_1.default.object({
            fullName: joi_1.default.string().required().min(3).max(200),
            phone: joi_1.default.string().required().pattern(new RegExp('[0-9]')).max(55),
            password: joi_1.default.string().required().min(4),
            role: joi_1.default.object({
                id: joi_1.default.number().required().positive(),
                role: joi_1.default.string().required(),
            }).required(),
        });
    }
}
exports.UserController = UserController;


/***/ }),

/***/ 1268:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserEntity = void 0;
const typeorm_1 = __webpack_require__(5250);
const role_entity_1 = __webpack_require__(7918);
let UserEntity = class UserEntity {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'phone',
        type: 'varchar',
        length: 20,
        unique: true,
        nullable: false,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'full_name',
        type: 'varchar',
        nullable: false,
        default: 'N/A',
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "fullName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password', type: 'text', nullable: false }),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => role_entity_1.RoleEntity, {
        nullable: true,
        eager: true,
        lazy: false,
    }),
    __metadata("design:type", role_entity_1.RoleEntity)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'create_date' }),
    __metadata("design:type", String)
], UserEntity.prototype, "createDate", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'update_date' }),
    __metadata("design:type", String)
], UserEntity.prototype, "updateDate", void 0);
UserEntity = __decorate([
    (0, typeorm_1.Entity)({
        name: 'users',
    }),
    (0, typeorm_1.Unique)(['id', 'phone'])
], UserEntity);
exports.UserEntity = UserEntity;


/***/ }),

/***/ 2348:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserDao = void 0;
const common_dao_1 = __webpack_require__(8626);
const user_entity_1 = __webpack_require__(1268);
class UserDao extends common_dao_1.ICommonDao {
    constructor() {
        super(user_entity_1.UserEntity);
    }
    addResource(resource) {
        return this.repo.save(resource);
    }
    findSingleResource(option) {
        return this.repo.findOne(option);
    }
    getAllResources(options) {
        return this.repo.find(options);
    }
    getAllResourcesAndCount(options) {
        return this.repo.findAndCount(options);
    }
    deleteResource(resource) {
        return this.repo.remove(resource);
    }
    updateResource(resource) {
        throw new Error('Method not implemented.');
    }
}
exports.UserDao = UserDao;


/***/ }),

/***/ 4799:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getUserFindMany = exports.getUserDto = void 0;
const typeorm_1 = __webpack_require__(5250);
const utils_1 = __webpack_require__(974);
const logger_1 = __webpack_require__(6645);
/**
 * takes request body and converted to user
 * @param requestBody
 * @returns {Promise<ICreateUserDto>}
 */
function getUserDto(requestBody) {
    const json = Object.assign({}, requestBody);
    return {
        fullName: json.fullName,
        phone: json.phone,
        password: json.password,
        role: {
            id: json.role.id,
            role: json.role.name,
        },
    };
}
exports.getUserDto = getUserDto;
function getUserFindMany(queryParams) {
    var _a, _b;
    const { skip, take } = (0, utils_1.getPagination)(queryParams);
    logger_1.Logger.info(queryParams.roleId);
    const where = [];
    if (queryParams.fullname !== undefined)
        where.push({ fullName: (0, typeorm_1.Like)(`%${queryParams.fullname}%`) });
    if (queryParams.phone !== undefined)
        where.push({ phone: (0, typeorm_1.Like)(`%${queryParams.phone}%`) });
    if (queryParams.roleId)
        where.push({ role: { id: Number.parseInt(queryParams.roleId) } });
    return {
        where: where.length > 0 ? where : undefined,
        select: ['fullName', 'id', 'createDate', 'phone', 'role', 'updateDate'],
        skip: skip,
        take: take,
        order: !queryParams.orderBy
            ? { createDate: 'desc' }
            : {
                createDate: queryParams.orderBy === 'createDate'
                    ? (_a = queryParams.order) !== null && _a !== void 0 ? _a : 'desc'
                    : undefined,
                fullName: queryParams.orderBy === 'fullName'
                    ? (_b = queryParams.order) !== null && _b !== void 0 ? _b : 'desc'
                    : undefined,
            },
    };
}
exports.getUserFindMany = getUserFindMany;


/***/ }),

/***/ 643:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserRoute = void 0;
const common_route_config_1 = __webpack_require__(5906);
const user_controller_1 = __webpack_require__(8395);
const authorization_middleware_1 = __webpack_require__(9683);
const logger_1 = __webpack_require__(6645);
class UserRoute extends common_route_config_1.CommonRoutesConfig {
    constructor(app, roles = [], controller = new user_controller_1.UserController()) {
        super(app, 'User', controller, roles);
    }
    get route() {
        var _a;
        return ((_a = process.env.PATH_PREFIX) !== null && _a !== void 0 ? _a : '') + '/users';
    }
    configureRoutes() {
        const authMid = new authorization_middleware_1.AuthorizationMiddleware();
        logger_1.Logger.info('user', this.adminRole);
        this.app.route(this.route).get(this.controller.findAllResources);
        this.app.route(`${this.route}/:id`).get(
        // authMid.isAuthorizedUser,
        // authMid.isAuthByRole(['admin']),
        this.controller.findSingleResource),
            this.app
                .route(this.route)
                .post(this.controller.validateCreationSchema, this.controller.addResource);
        this.app.route(this.route + '/:id').delete(this.controller.deleteResource);
        return this.app;
    }
}
exports.UserRoute = UserRoute;


/***/ }),

/***/ 1399:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserService = void 0;
const user_dto_1 = __webpack_require__(4799);
const utils_1 = __webpack_require__(974);
const user_dao_1 = __webpack_require__(2348);
class UserService {
    constructor(dao = new user_dao_1.UserDao()) {
        this.dao = dao;
    }
    addResource(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const userDto = (0, user_dto_1.getUserDto)(body);
            const password = yield (0, utils_1.encryptePassowrd)(userDto.password);
            userDto.password = password;
            return yield this.dao.addResource(userDto);
        });
    }
    findSingleResource(params) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const id = (_a = params === null || params === void 0 ? void 0 : params.id) !== null && _a !== void 0 ? _a : '';
            if (id === '')
                return null;
            const entity = yield this.dao.findSingleResource({
                where: { id: id },
            });
            return entity;
        });
    }
    findAllResources(queryParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const findOptions = (0, user_dto_1.getUserFindMany)(queryParams);
            return this.dao.getAllResourcesAndCount(findOptions);
        });
    }
    deleteResource(user) {
        return this.dao.deleteResource(user);
    }
}
exports.UserService = UserService;


/***/ }),

/***/ 6645:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Logger = void 0;
const winston = __importStar(__webpack_require__(7773));
const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
};
const winstonFormat = winston.format.combine(winston.format.json(), winston.format.prettyPrint(), winston.format.colorize({ all: true }));
const logger = winston.createLogger({
    levels,
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            dirname: 'logs',
            filename: 'error.log',
            level: 'error',
            format: winstonFormat,
        }),
    ],
    format: winstonFormat,
});
exports.Logger = logger;


/***/ }),

/***/ 5166:
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
class NetworkErrorHandler {
    badRequest(res, message) {
        const statusCode = 400;
        res.status(statusCode);
        return res.json({ statusCode, message });
    }
    notFound(res, message) {
        const statusCode = 404;
        res.status(statusCode);
        return res.json({ statusCode, message });
    }
    entityNotFound(res, type, id) {
        const statusCode = 404;
        const message = `${type} with the given id ${id} is not found`;
        res.status(statusCode);
        return res.json({ statusCode, message });
    }
    serverError(res, message) {
        const statusCode = 500;
        res.status(statusCode);
        return res.json({ statusCode, message });
    }
    unauthorized(res) {
        return res.status(401).json({ statusCode: 401, message: 'Unauthorized' });
    }
    forbidden(res) {
        return res.status(403).json({ statusCode: 403, message: 'forbidden' });
    }
}
exports["default"] = new NetworkErrorHandler();


/***/ }),

/***/ 974:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getPagination = exports.setTotalPagesHeader = exports.getJwtToken = exports.comparePassword = exports.encryptePassowrd = exports.generateSalt = exports.kPrivateKey = exports.kSaltRounds = void 0;
const bcrypt_1 = __importDefault(__webpack_require__(7096));
const jwt = __importStar(__webpack_require__(9344));
const logger_1 = __webpack_require__(6645);
exports.kSaltRounds = 10;
exports.kPrivateKey = (_a = process.env.PRIVATE_KEY) !== null && _a !== void 0 ? _a : 'Empty';
function generateSalt() {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt_1.default.genSalt(exports.kSaltRounds);
    });
}
exports.generateSalt = generateSalt;
function encryptePassowrd(password) {
    return __awaiter(this, void 0, void 0, function* () {
        const salt = yield generateSalt();
        const encryptedPassword = yield bcrypt_1.default.hash(password, salt);
        return encryptedPassword;
    });
}
exports.encryptePassowrd = encryptePassowrd;
function comparePassword(password, encryptedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt_1.default.compare(password, encryptedPassword);
    });
}
exports.comparePassword = comparePassword;
function getJwtToken(user, signOptions) {
    const token = jwt.sign(Object.assign({}, user), exports.kPrivateKey, signOptions !== null && signOptions !== void 0 ? signOptions : {
        expiresIn: '7d',
    });
    return 'Bearer ' + token;
}
exports.getJwtToken = getJwtToken;
const setTotalPagesHeader = (res, query, count) => {
    var _a;
    const limit = parseInt(query.limit || '10');
    const currentPage = parseInt((_a = query.page) !== null && _a !== void 0 ? _a : '1');
    const totalPages = Math.ceil(count / limit);
    const nextPage = currentPage + 1 >= totalPages ? totalPages : currentPage + 1;
    res.setHeader('total-pages', totalPages);
    res.setHeader('count', count);
    res.setHeader('current-page', currentPage);
    res.setHeader('next-page', nextPage);
    // res.setHeader('query', JSON.stringify(query));
};
exports.setTotalPagesHeader = setTotalPagesHeader;
function getPagination(params) {
    var _a, _b;
    const limit = Number.parseInt((_a = params.limit) !== null && _a !== void 0 ? _a : '10');
    let page = Number.parseInt((_b = params.page) !== null && _b !== void 0 ? _b : '1');
    page = page === 1 ? 0 : page - 1;
    logger_1.Logger.info({ page, limit });
    return {
        skip: page > 0 ? page * limit : 0,
        take: page >= 0 ? limit : undefined,
    };
}
exports.getPagination = getPagination;


/***/ }),

/***/ 7096:
/***/ ((module) => {

module.exports = require("bcrypt");

/***/ }),

/***/ 3582:
/***/ ((module) => {

module.exports = require("cors");

/***/ }),

/***/ 6974:
/***/ ((module) => {

module.exports = require("debug");

/***/ }),

/***/ 5142:
/***/ ((module) => {

module.exports = require("dotenv");

/***/ }),

/***/ 6860:
/***/ ((module) => {

module.exports = require("express");

/***/ }),

/***/ 3316:
/***/ ((module) => {

module.exports = require("express-winston");

/***/ }),

/***/ 7806:
/***/ ((module) => {

module.exports = require("helmet");

/***/ }),

/***/ 8506:
/***/ ((module) => {

module.exports = require("joi");

/***/ }),

/***/ 9344:
/***/ ((module) => {

module.exports = require("jsonwebtoken");

/***/ }),

/***/ 7993:
/***/ ((module) => {

module.exports = require("mysql2");

/***/ }),

/***/ 3236:
/***/ ((module) => {

module.exports = require("reflect-metadata");

/***/ }),

/***/ 5250:
/***/ ((module) => {

module.exports = require("typeorm");

/***/ }),

/***/ 7773:
/***/ ((module) => {

module.exports = require("winston");

/***/ }),

/***/ 3685:
/***/ ((module) => {

module.exports = require("http");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(6752);
/******/ 	
/******/ })()
;