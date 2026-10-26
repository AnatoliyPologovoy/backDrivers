import { Router } from 'express';
import { BLOGS_ROUTES } from './constants';
import {
  createBlog,
  createPostByBlogId,
  getAllBlogs,
  getAllPostsByBlogId,
  getBlogById,
  updateById,
} from './handlers/blogsHadnlers';
import {
  inputBlogBodyValidation,
  idValidation,
} from '../validation/blog.validation';
import { inputValidationResultMiddleware } from '../../core/middlewares/validation/input-validation-result.middleware';
import { superAdminGuardMiddleware } from '../../auth/middlewares/super-admin.guard.middleware';
import { deleteById } from './handlers/blogsHadnlers';
import { paginationAndSortingValidation } from '../../core/middlewares/validation/query-pagination-sorting.validation';
import { SORT_BLOGS_FIELDS } from '../constants';
import {
  blogIdValidation,
  validationCreatePostByBlogId,
} from '../validation/createPostByBlogId.validation';
import { SORT_POST_FIELDS } from '../../post/constants';

export const blogsRouters = Router({});

//Get all
blogsRouters.get(
  BLOGS_ROUTES.ROOT,
  paginationAndSortingValidation(SORT_BLOGS_FIELDS),
  inputValidationResultMiddleware,
  getAllBlogs,
);

//createBlog
blogsRouters.post(
  BLOGS_ROUTES.ROOT,
  superAdminGuardMiddleware,
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
  superAdminGuardMiddleware,
  idValidation,
  inputBlogBodyValidation,
  inputValidationResultMiddleware,
  updateById,
);

//delete
blogsRouters.delete(
  BLOGS_ROUTES.ID,
  superAdminGuardMiddleware,
  idValidation,
  inputValidationResultMiddleware,
  deleteById,
);

//create post for a specific blog
blogsRouters.post(
  BLOGS_ROUTES.BLOG_ID_POSTS,
  superAdminGuardMiddleware,
  blogIdValidation,
  validationCreatePostByBlogId,
  inputValidationResultMiddleware,
  createPostByBlogId,
);

//get posts for a specific blog
blogsRouters.get(
  BLOGS_ROUTES.BLOG_ID_POSTS,
  blogIdValidation,
  paginationAndSortingValidation(SORT_POST_FIELDS),
  inputValidationResultMiddleware,
  getAllPostsByBlogId,
);
