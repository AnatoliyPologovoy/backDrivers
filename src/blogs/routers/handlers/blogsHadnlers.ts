import { Response, Request } from 'express';
import { Blog } from '../../types/blog';
import { blogsRouters } from '../blogs.routers';
import { HTTP_STATUS } from '../../../core/constants';
import { blogsRepositories } from '../../repositories/blogs.repositories';
import { BlogInput } from '../../types/blog.input.dto';

export const getAllBlogs = async (
  req: Request<void, Blog[]>,
  res: Response,
) => {
  res.status(HTTP_STATUS.OK).send(blogsRepositories.findAllBlogs());
};

export const createBlog = (
  req: Request<Record<string, any> | undefined, Blog, BlogInput>,
  res: Response,
) => {
  return res
    .status(HTTP_STATUS.CREATED)
    .send(blogsRepositories.createBlog(req.body));
};
