import { body, checkSchema, param } from 'express-validator';

export const idValidation = param('id')
  .exists()
  .withMessage('id is required')
  .isString()
  .withMessage('id must be a string');

export const inputPostBodyValidation = checkSchema(
  {
    title: {
      trim: true,
      exists: true,
      isLength: { options: { min: 1, max: 30 } },
    },
    shortDescription: {
      trim: true,
      exists: true,
      isLength: { options: { min: 1, max: 100 } },
    },
    content: {
      trim: true,
      exists: true,
      isLength: { options: { min: 1, max: 1000 } },
    },
    blogId: { trim: true, exists: true, isString: true },
  },
  ['body'],
);
