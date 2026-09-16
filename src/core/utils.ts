import { ValidationError } from './types';

export const getErrorResponse = (errors: ValidationError[]) => ({
  errorsMessages: errors,
});
