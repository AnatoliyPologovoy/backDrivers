import { Router } from 'express';
import { BLOGS_ROUTES } from './constants';
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  updateById,
} from './handlers/blogsHadnlers';
import {
  inputBlogBodyValidation,
  idValidation,
} from '../validation/blog.validation';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { deleteById } from './handlers/blogsHadnlers';

export const blogsRouters = Router();

//Get all
blogsRouters.get(BLOGS_ROUTES.ROOT, getAllBlogs);

//createBlog
blogsRouters.post(
  BLOGS_ROUTES.ROOT,
  inputBlogBodyValidation,
  inputValidationResultMiddleware,
  createBlog,
);

//getBlogById
blogsRouters.get(
  BLOGS_ROUTES.ID,
  idValidation,
  inputValidationResultMiddleware,
  getBlogById,
);

//updateById
blogsRouters.put(
  BLOGS_ROUTES.ID,
  idValidation,
  inputBlogBodyValidation,
  inputValidationResultMiddleware,
  updateById,
);

//delete
blogsRouters.delete(
  BLOGS_ROUTES.ID,
  idValidation,
  inputValidationResultMiddleware,
  deleteById,
);
