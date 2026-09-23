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

export const getBlogById = (
  req: Request<{ id: string }, void, Blog>,
  res: Response,
) => {
  const blog = blogsRepositories.getBlog(req.params.id);
  if (blog) {
    return res.status(HTTP_STATUS.OK).send(blog);
  } else {
    return res.sendStatus(HTTP_STATUS.NOT_FOUND);
  }
};

export const updateById = (
  req: Request<{ id: string }, void, BlogInput>,
  res: Response,
) => {
  const isExistId = blogsRepositories.isExistId(req.params.id);
  if (isExistId) {
    blogsRepositories.updateBlog(req.params.id, req.body);
    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  } else {
    return res.sendStatus(HTTP_STATUS.NOT_FOUND);
  }
};
