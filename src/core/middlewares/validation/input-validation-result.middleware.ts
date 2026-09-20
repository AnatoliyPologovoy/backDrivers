import { validationResult, ValidationError } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS } from '../../constants';
import { getErrorResponse } from '../../utils';

// Приводит ошибку express-validator к формату { field, message }.
// У ошибок типа 'field' (body/param) есть путь к полю.
const formatErrors = (error: ValidationError) => {
  if (error.type === 'field') {
    return { field: error.path, message: error.msg };
  }
  return { field: '', message: error.msg };
};

export const inputValidationResultMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const errors = validationResult(req)
    .formatWith(formatErrors)
    .array({ onlyFirstError: true });

  if (errors.length > 0) {
    res.status(HTTP_STATUS.BAD_REQUEST).json(getErrorResponse(errors));
    return;
  }

  next(); // Если ошибок нет, передаём управление дальше
};
