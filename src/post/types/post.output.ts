import { WithId } from 'mongodb';
import { Post, PostView } from './post';

export type PostRepoData = { items: WithId<Post>[]; totalCount: number };

export type PostOutData = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostView[];
};
