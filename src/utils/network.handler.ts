import { Response } from 'express';

class NetworkErrorHandler {
  badRequest(res: Response, message: string) {
    const statusCode = 400;
    res.status(statusCode);
    return res.json({ statusCode, message });
  }

  notFound(res: Response, message: string) {
    const statusCode = 404;
    res.status(statusCode);
    return res.json({ statusCode, message });
  }

  entityNotFound(res: Response, type: string, id: string) {
    const statusCode = 404;
    const message = `${type} with the given id ${id} is not found`;
    res.status(statusCode);
    return res.json({ statusCode, message });
  }

  serverError(res: Response, message: string) {
    const statusCode = 500;
    res.status(statusCode);
    return res.json({ statusCode, message });
  }

  unauthorized(res: Response) {
    return res.status(401).json({ statusCode: 401, message: 'Unauthorized' });
  }

  forbidden(res: Response) {
    return res.status(403).json({ statusCode: 403, message: 'forbidden' });
  }
}

export default new NetworkErrorHandler();
