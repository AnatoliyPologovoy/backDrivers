import { WithId } from 'mongodb';
import { Blog, BlogView } from '../types/blog';

export const mapToBlogsViewModel = (item: WithId<Blog>): BlogView => {
  const withIdBlog = { ...item, id: item._id.toString() };
  const { _id, ...blogView } = withIdBlog;
  return blogView;
};
