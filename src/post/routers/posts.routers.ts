import { Router } from 'express';
import { POSTS_ROUTES } from './constants';
import {
  createPost,
  deleteById,
  getAllPosts,
  getPostById,
  updateById,
} from './handlers/posts.handlers';
import {
  inputPostBodyValidation,
  idValidation,
} from '../validation/post.validation';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard.middleware';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation';
import { SORT_POST_FIELDS } from '../constants';

export const postsRouter = Router();

//Get all
postsRouter.get(
  POSTS_ROUTES.ROOT,
  paginationAndSortingValidation(SORT_POST_FIELDS),
  inputValidationResultMiddleware,
  getAllPosts,
);

//createPost
postsRouter.post(
  POSTS_ROUTES.ROOT,
  superAdminGuardMiddleware,
  inputPostBodyValidation,
  inputValidationResultMiddleware,
  createPost,
);

//getPostById
postsRouter.get(
  POSTS_ROUTES.ID,
  idValidation,
  inputValidationResultMiddleware,
  getPostById,
);

//updateById
postsRouter.put(
  POSTS_ROUTES.ID,
  superAdminGuardMiddleware,
  idValidation,
  inputPostBodyValidation,
  inputValidationResultMiddleware,
  updateById,
);

//delete
postsRouter.delete(
  POSTS_ROUTES.ID,
  superAdminGuardMiddleware,
  idValidation,
  inputValidationResultMiddleware,
  deleteById,
);
