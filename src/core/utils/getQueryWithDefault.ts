import { Request } from 'express';
import { matchedData } from 'express-validator';

export const getQueryWithDefault = <T extends object>(req: Request) => {
  const defaultData = matchedData<T>(req);

  return { ...req.query, ...defaultData };
};
