import { checkSchema, query, validationResult } from 'express-validator';
import { SORT_DIRECTION } from '../../constants';
import { NextFunction, Request, Response } from 'express';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SORT_DIRECTION.DESC;

export const paginationAndSortingValidation = (
  sortFields: Record<string, string>,
) => {
  // const sortFieldsArr = Object.values(sortFields);
  return checkSchema(
    {
      pageNumber: {
        in: ['query'],
        default: { options: DEFAULT_PAGE },
        toInt: true,
        isInt: {
          options: { min: 1 },
          errorMessage: 'Page number must be a positive integer',
        },
      },
      pageSize: {
        default: { options: DEFAULT_PAGE_SIZE },
        in: ['query'],
        toInt: true,
        isInt: {
          options: { min: 1, max: 100 },
          errorMessage: 'Page size must be between 1 and 100',
        },
      },
      sortBy: {
        default: { options: Object.values(sortFields)[0] },
        in: ['query'],
        isIn: {
          options: [Object.values(sortFields)],
          errorMessage: `Allowed sort fields: ${Object.values(sortFields).join(', ')}`,
        },
      },
      sortDirection: {
        default: { options: DEFAULT_SORT_DIRECTION },
        in: ['query'],
        isIn: {
          options: [Object.values(SORT_DIRECTION)],
          errorMessage: `Sort direction must be one of: ${Object.values(SORT_DIRECTION).join(', ')}`,
        },
      },
    },
    ['query'],
  );
};

export const defaultPaginationAndSortingValidation = [
  query('pageNumber')
    .default(DEFAULT_PAGE)
    .isInt({ min: 1 })
    .withMessage('Page number must be a positive integer')
    .toInt(),
];

export const defaultPaginationAndSortingMiddleware =
  (sortFields: Record<string, string>) =>
  (req: Request, res: Response, next: NextFunction) => {
    const queryFields = [
      { field: 'pageNumber', defaultValue: DEFAULT_PAGE },
      { field: 'pageSize', defaultValue: DEFAULT_PAGE_SIZE },
      { field: 'sortDirection', defaultValue: DEFAULT_SORT_DIRECTION },
      // { field: 'sortBy', defaultValue: Object.values(sortFields)[0] },
    ];

    queryFields.forEach(({ field, defaultValue }) => {
      if (!req.query[field]) {
        req.query[field] = defaultValue.toString();
      }
    });

    const reqq = req.query;
    console.log(reqq);
    next(); // Если ошибок нет, передаём управление дальше
  };
