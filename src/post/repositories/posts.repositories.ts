import { db } from '../../db/db';
import { Post } from '../types/post';
import { PostInput } from '../types/post.input.dto';
import { blogsRepositories } from '../../blogs/repositories/blogs.repositories';

export const postsRepositories = {
  findAllPosts(): Post[] {
    return db.posts;
  },
  createPost(post: PostInput): Post {
    const lastId = db.posts[db.posts.length - 1]?.id;
    const newId: string = String(lastId ? +lastId + 1 : 1);

    // имя блога берём по blogId, чтобы не доверять данным клиента
    const blog = blogsRepositories.getBlog(post.blogId);

    const newPost = {
      ...post,
      id: newId,
      blogName: blog?.name ?? '',
    };

    db.posts.push(newPost);

    return newPost;
  },

  getPost(id: string) {
    const post = db.posts.find((post) => post.id === id);
    return post ?? null;
  },

  isExistId(id: string) {
    return db.posts.findIndex((post) => post.id === id) !== -1;
  },

  updatePost(id: string, post: PostInput) {
    db.posts = db.posts.map((item) => {
      if (item.id === id) {
        return { ...item, ...post };
      }
      return item;
    });
  },

  deletePost(id: string) {
    db.posts = db.posts.filter((post) => post.id !== id);
  },
};
