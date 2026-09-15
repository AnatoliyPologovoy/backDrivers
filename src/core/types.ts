export type ValidationError = {
  message: string;
  field: string;
};

export type ErrorResponse = {
  errorsMessages: ValidationError[];
};
