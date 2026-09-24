import { Response, Request } from 'express';
import { Post } from '../../types/post';
import { HTTP_STATUS } from '../../../core/constants';
import { postsRepositories } from '../../repositories/posts.repositories';
import { PostInput } from '../../types/post.input.dto';

export const getAllPosts = async (
  req: Request<void, Post[]>,
  res: Response,
) => {
  res.status(HTTP_STATUS.OK).send(postsRepositories.findAllPosts());
};

export const createPost = (
  req: Request<Record<string, any> | undefined, Post, PostInput>,
  res: Response,
) => {
  return res
    .status(HTTP_STATUS.CREATED)
    .send(postsRepositories.createPost(req.body));
};

export const getPostById = (
  req: Request<{ id: string }, void, Post>,
  res: Response,
) => {
  const post = postsRepositories.getPost(req.params.id);
  if (post) {
    return res.status(HTTP_STATUS.OK).send(post);
  } else {
    return res.sendStatus(HTTP_STATUS.NOT_FOUND);
  }
};

export const updateById = (
  req: Request<{ id: string }, void, PostInput>,
  res: Response,
) => {
  const isExistId = postsRepositories.isExistId(req.params.id);
  if (isExistId) {
    postsRepositories.updatePost(req.params.id, req.body);
    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  } else {
    return res.sendStatus(HTTP_STATUS.NOT_FOUND);
  }
};

export const deleteById = (
  req: Request<{ id: string }, void, void>,
  res: Response,
) => {
  const isExistId = postsRepositories.isExistId(req.params.id);
  if (isExistId) {
    postsRepositories.deletePost(req.params.id);
    return res.sendStatus(HTTP_STATUS.NO_CONTENT);
  } else {
    return res.sendStatus(HTTP_STATUS.NOT_FOUND);
  }
};
