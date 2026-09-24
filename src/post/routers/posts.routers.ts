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

export const postsRouter = Router();

//Get all
postsRouter.get(POSTS_ROUTES.ROOT, getAllPosts);

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
