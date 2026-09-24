import { body, checkSchema, param } from 'express-validator';

export const idValidation = param('id')
  .exists()
  .withMessage('id is required')
  .isString()
  .withMessage('id must be a string');

const URL_REGEX =
  /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
export const inputBlogBodyValidation = checkSchema(
  {
    name: { exists: true, isLength: { options: { min: 1, max: 15 } } },
    description: { exists: true, isLength: { options: { min: 1, max: 500 } } },
    websiteUrl: {
      trim: true,
      exists: true,
      isLength: { options: { min: 1, max: 100 } },
      matches: { options: URL_REGEX },
    },
  },
  ['body'],
);
