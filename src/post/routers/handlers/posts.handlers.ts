import { Response, Request } from 'express';
import { Post, PostView } from '../../types/post';
import { HTTP_STATUS } from '../../../core/constants';
import { postsRepositories } from '../../repositories/posts.repositories';
import { PostInput } from '../../types/post.input.dto';
import { postsCollection } from '../../../db/collections';
import { mapToPostsViewModel } from '../mappers/mapToPostsViewModel';
import { blogsRepositories } from '../../../blogs/repositories/blogs.repositories';
import { postsService } from '../../aplication/posts.service';

export const getAllPosts = async (
  req: Request<void, PostView[]>,
  res: Response,
) => {
  try {
    const posts = await postsService.getAllPosts();
    res.status(HTTP_STATUS.OK).send(posts);
  } catch {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const createPost = async (
  req: Request<Record<string, any> | undefined, Post, PostInput>,
  res: Response,
) => {
  try {
    const postView = await postsService.createPost(req.body);
    return res.status(HTTP_STATUS.CREATED).send(postView);
  } catch {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const getPostById = async (
  req: Request<{ id: string }, void, Post>,
  res: Response,
) => {
  try {
    const post = await postsService.getPostById(req.params.id);
    if (post) {
      return res.status(HTTP_STATUS.OK).send(mapToPostsViewModel(post));
    } else {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }
  } catch {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

export const updateById = async (
  req: Request<{ id: string }, void, PostInput>,
  res: Response,
) => {
  try {
    const isUpdated = await postsService.updateById(req.params.id, req.body);

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
    const isDeleted = await postsService.deleteById(req.params.id);
    if (isDeleted) {
      return res.sendStatus(HTTP_STATUS.NO_CONTENT);
    } else {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }
  } catch {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
