import { Response, Request } from 'express';
import { Blog, BlogView } from '../../types/blog';
import { blogsRouters } from '../blogs.routers';
import { HTTP_STATUS } from '../../../core/constants';
import { blogsRepositories } from '../../repositories/blogs.repositories';
import { BlogInput } from '../../types/blog.input.dto';
import { blogsCollection } from '../../../db/collections';
import { mapToBlogsViewModel } from '../../mappers/mapToBlogsViewModel';
import { blogsService } from '../../application/blogs.service';

export const getAllBlogs = async (
  req: Request<void, BlogView[]>,
  res: Response,
) => {
  try {
    const blogs = blogsService.getAllBlogs();
    res.status(HTTP_STATUS.OK).send(blogs);
  } catch {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const createBlog = async (
  req: Request<Record<string, any> | undefined, BlogView, BlogInput>,
  res: Response,
) => {
  try {
    const blogViewModel = blogsService.createBlog(req.body);
    return res.status(HTTP_STATUS.CREATED).send(blogViewModel);
  } catch {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getBlogById = async (
  req: Request<{ id: string }, void, Blog>,
  res: Response,
) => {
  try {
    const blog = await blogsService.getBlogById(req.params.id);
    if (blog) {
      return res.status(HTTP_STATUS.OK).send(mapToBlogsViewModel(blog));
    } else {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }
  } catch {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const updateById = async (
  req: Request<{ id: string }, void, Blog>,
  res: Response,
) => {
  const isUpdated = await blogsService.updateById(req.params.id, req.body);
  try {
    if (isUpdated) {
      return res.sendStatus(HTTP_STATUS.NO_CONTENT);
    } else {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }
  } catch {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const deleteById = async (
  req: Request<{ id: string }, void, void>,
  res: Response,
) => {
  try {
    const isDeleted = await blogsService.deleteById(req.params.id);
    if (isDeleted) {
      return res.sendStatus(HTTP_STATUS.NO_CONTENT);
    } else {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }
  } catch {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
