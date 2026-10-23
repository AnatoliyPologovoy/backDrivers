import { body, checkSchema, param } from 'express-validator';
import { SORT_DIRECTION } from '../../core/constants';
import { SORT_BLOGS_FIELDS } from '../constants';

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT_DIRECTION = SORT_DIRECTION.DESK;

export const paginationAndSortingValidation = (
  sortFields: Record<string, string>,
) =>
  checkSchema(
    {
      pageNumber: {
        toInt: true,
        isInt: {
          options: { min: 1 },
          errorMessage: 'Page number must be a positive integer',
        },
        default: { options: DEFAULT_PAGE },
      },
      pageSize: {
        toInt: true,
        isInt: {
          options: { min: 1, max: 100 },
          errorMessage: 'Page size must be between 1 and 100',
        },
        default: { options: DEFAULT_PAGE_SIZE },
      },
      sortBy: {
        default: { options: Object.values(sortFields)[0] },
        isIn: {
          options: Object.values(sortFields),
          errorMessage: `Allowed sort fields: ${Object.values(sortFields).join(', ')}`,
        },
      },
      sortDirection: {
        default: { options: DEFAULT_SORT_DIRECTION },
        isIn: {
          options: Object.values(SORT_DIRECTION),
          errorMessage: `Sort direction must be one of: ${Object.values(SORT_DIRECTION).join(', ')}`,
        },
      },
    },
    ['params'],
  );
