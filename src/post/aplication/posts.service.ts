import { postsRepositories } from '../repositories/posts.repositories';
import { PostInput } from '../types/post.input.dto';
import { blogsRepositories } from '../../blogs/repositories/blogs.repositories';
import { Post } from '../types/post';

export const postsService = {
  async createPost(postInput: Omit<PostInput, 'createdAt'>) {
    // имя блога берём по blogId, чтобы не доверять данным клиента
    const blog = await blogsRepositories.getBlog(postInput.blogId);

    const newPost: Post = {
      ...postInput,
      createdAt: new Date(),
      blogName: blog?.name ?? '',
    };

    const createdPostId = await postsRepositories.createPost(newPost);
    return createdPostId.toString();
  },

  async updateById(id: string, postInput: PostInput) {
    const { createdAt, ...preparedPost } = postInput;
    const isUpdated = await postsRepositories.updatePost(id, preparedPost);
    return isUpdated;
  },

  async deleteById(id: string) {
    const isDeleted = await postsRepositories.deletePost(id);
    return isDeleted;
  },
};
