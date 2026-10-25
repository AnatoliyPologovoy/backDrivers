import { Response, Request } from 'express';
import { Post, PostView } from '../../types/post';
import { HTTP_STATUS } from '../../../core/constants';
import { PostInput, PostQuery } from '../../types/post.input.dto';
import { mapToPostsViewModel } from '../mappers/mapToPostsViewModel';
import { postsService } from '../../aplication/posts.service';
import { matchedData } from 'express-validator';

export const getAllPosts = async (
  req: Request<{}, PostView[], {}, Record<string, any>>,
  res: Response,
) => {
  try {
    const defaultData = matchedData(req);
    const query = { ...req.query, ...defaultData } as PostQuery;
    const posts = await postsService.getAllPosts(query);
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
