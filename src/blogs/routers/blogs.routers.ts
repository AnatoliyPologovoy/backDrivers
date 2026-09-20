import { Router } from 'express';
import { BLOGS_ROUTES } from './constants';
import { createBlog, getAllBlogs } from './handlers/blogsHadnlers';
import { createBodyValidation } from '../validation/blog.validation';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';

export const blogsRouters = Router();

blogsRouters.get(BLOGS_ROUTES.ROOT, getAllBlogs);
blogsRouters.post(
  BLOGS_ROUTES.ROOT,
  createBodyValidation,
  inputValidationResultMiddleware,
  createBlog,
);
