import { Response, Request } from 'express';
import { Blog } from '../../types/blog';
import { blogsRoutes } from '../blogs.routers';
import { HTTP_STATUS } from '../../../core/constants';
import { blogsRepositories } from '../../repositories/blogs.repositories';

export const getAllBlogs = async (
  req: Request<void, Blog[]>,
  res: Response,
) => {
  res.status(HTTP_STATUS.OK).send(blogsRepositories.findAllBlogs());
};
