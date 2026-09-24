import { NextFunction, Request, Response } from 'express';
import { HTTP_STATUS } from '../../core/constants';
import { ADMIN_USERNAME, ADMIN_PASSWORD } from '../../settings/config';

export const superAdminGuardMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const auth = req.headers['authorization'] as string; // 'Basic xxxx'
  if (!auth) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED);
    return;
  }

  const [authType, token] = auth.split(' '); //admin:qwerty
  if (authType !== 'Basic') {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED);
    return;
  }

  const credentials = Buffer.from(token, 'base64').toString('utf-8');
  const [username, password] = credentials.split(':');

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    res.sendStatus(HTTP_STATUS.UNAUTHORIZED);
    return;
  }

  next(); // Успешная авторизация, продолжаем
};
