import { Response, Request } from 'express';
import { Blog, BlogQuery, BlogView } from '../../types/blog';
import { HTTP_STATUS } from '../../../core/constants';
import { BlogInput } from '../../types/blog.input.dto';
import { mapToBlogsViewModel } from '../../mappers/mapToBlogsViewModel';
import { blogsService } from '../../application/blogs.service';
import { BlogsOutData } from '../../types/blogs.output';
import { matchedData } from 'express-validator';
import { Post, PostView } from '../../../post/types/post';
import { PostInput, PostQuery } from '../../../post/types/post.input.dto';
import { postsService } from '../../../post/aplication/posts.service';
import { PostOutData } from '../../../post/types/post.output';
import { getQueryWithDefault } from '../../../core/utils/getQueryWithDefault';
import { postsQueryRepositories } from '../../../post/repositories/posts.query.repositories';
import { blogsQueryRepositories } from '../../repositories/blogs.query.repositories';
import { PaginationSorting } from '../../../core/types/pagination-sorting.types';

export const getAllBlogs = async (
  // ParsedQs из express не совместим с BlogQuery, поэтому приводим query к доменному типу
  req: Request<{}, BlogsOutData, {}, Record<string, any>>,
  res: Response,
) => {
  try {
    const query = getQueryWithDefault<PaginationSorting>(req);

    const blogs = await blogsQueryRepositories.findAllBlogs(query);
    res.status(HTTP_STATUS.OK).send(blogs);
  } catch (e) {
    console.log('Error getAllBlogs ' + e);
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const createBlog = async (
  req: Request<Record<string, any> | undefined, BlogView, BlogInput>,
  res: Response,
) => {
  try {
    const createdBlogId = await blogsService.createBlog(req.body);
    const blog = await blogsQueryRepositories.getBlog(createdBlogId);
    if (!blog) {
      throw new Error('createdBlogId not found');
    }
    return res.status(HTTP_STATUS.CREATED).send(blog);
  } catch (e) {
    console.log('Error createBlog ' + e);
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getBlogById = async (
  req: Request<{ id: string }, void, Blog>,
  res: Response,
) => {
  try {
    const blog = await blogsQueryRepositories.getBlog(req.params.id);
    if (blog) {
      return res.status(HTTP_STATUS.OK).send(blog);
    } else {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }
  } catch (e) {
    console.log('Error getBlogById ' + e);
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
  } catch (e) {
    console.log('Error updateById ' + e);
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
  } catch (e) {
    console.log('Error deleteById ' + e);
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const createPostByBlogId = async (
  req: Request<
    { blogid: string },
    PostView,
    Omit<PostInput, 'blogId' | 'createdAt'>
  >,
  res: Response,
) => {
  try {
    const createdPostId = await blogsService.createPostByBlogId(req);
    if (createdPostId) {
      const post = await postsQueryRepositories.getPostById(createdPostId);
      return res.status(HTTP_STATUS.CREATED).send(post);
    } else {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }
  } catch (e) {
    console.log('Error createPostByBlogId ' + e);
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getAllPostsByBlogId = async (
  req: Request<{ blogid: string }, PostOutData[], {}, Record<string, any>>,
  res: Response,
) => {
  try {
    const query = getQueryWithDefault<PostQuery>(req);

    const isHasBlog = await blogsService.getAllPostsByBlogId(
      query,
      req.params.blogid,
    );
    if (!isHasBlog) {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }

    const posts = await postsQueryRepositories.findAllPostsByBlogId(
      query,
      req.params.blogid,
    );

    res.status(HTTP_STATUS.OK).send(posts);
  } catch (e) {
    console.log('Error getAllPostsByBlogId ' + e);
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
