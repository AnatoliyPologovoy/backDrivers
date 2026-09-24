import { Video } from '../videos/types/video';
import { Blog } from '../blogs/types/blog';
import { Post } from '../post/types/post';

export const db: { videos: Video[]; blogs: Blog[]; posts: Post[] } = {
  videos: [],
  blogs: [],
  posts: [],
};
