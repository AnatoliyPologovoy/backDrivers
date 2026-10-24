import { WithId } from 'mongodb';
import { Blog, BlogView } from './blog';

export type BlogsRepoData = { items: WithId<Blog>[]; totalCount: number };

export type BlogsOutData = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: BlogView[];
};
