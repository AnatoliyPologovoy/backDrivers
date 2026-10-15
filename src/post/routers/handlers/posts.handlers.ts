import { Response, Request } from 'express';
import { Post, PostView } from '../../types/post';
import { HTTP_STATUS } from '../../../core/constants';
import { postsRepositories } from '../../repositories/posts.repositories';
import { PostInput } from '../../types/post.input.dto';
import { postsCollection } from '../../../db/collections';
import { mapToPostsViewModel } from '../mappers/mapToPostsViewModel';
import { blogsRepositories } from '../../../blogs/repositories/blogs.repositories';

export const getAllPosts = async (
  req: Request<void, PostView[]>,
  res: Response,
) => {
  try {
    const posts = (await postsRepositories.findAllPosts()).map(
      mapToPostsViewModel,
    );
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
    const newPost = {
      ...req.body,
      createdAt: new Date(),
    };
    const createdPost = await postsRepositories.createPost(newPost);
    const postView = mapToPostsViewModel(createdPost);
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
    const post = await postsRepositories.getPost(req.params.id);
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
    const { createdAt, ...preparedPost } = req.body;

    const isUpdated = await postsRepositories.updatePost(
      req.params.id,
      preparedPost,
    );
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
    const isDeleted = await postsRepositories.deletePost(req.params.id);
    if (isDeleted) {
      return res.sendStatus(HTTP_STATUS.NO_CONTENT);
    } else {
      return res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }
  } catch {
    return res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};
