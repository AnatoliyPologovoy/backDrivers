import { Router } from 'express';
import { BLOGS_ROUTES } from './constants';
import { getAllBlogs } from './handlers/blogsHadnlers';

export const blogsRoutes = Router();

blogsRoutes.get(BLOGS_ROUTES.ROOT, getAllBlogs);
