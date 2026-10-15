import { WithId } from 'mongodb';
import { Post, PostView } from '../../types/post';

export const mapToPostsViewModel = (item: WithId<Post>): PostView => {
  const withId = { ...item, id: item._id.toString() };
  const { _id, ...view } = withId;
  return view;
};
