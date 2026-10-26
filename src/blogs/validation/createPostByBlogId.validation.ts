import { body, checkSchema, param } from 'express-validator';

export const blogIdValidation = param('blogid')
  .exists()
  .withMessage('blogId is required')
  .isString()
  .withMessage('blogId must be a string')
  .isMongoId()
  .withMessage('Incorrect format of ObjectId'); // Проверка на формат ObjectId

export const validationCreatePostByBlogId = checkSchema(
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
  },
  ['body'],
);
