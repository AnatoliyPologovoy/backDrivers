import { postsRepositories } from '../repositories/posts.repositories';
import { mapToPostsViewModel } from '../routers/mappers/mapToPostsViewModel';
import { PostInput } from '../types/post.input.dto';

export const postsService = {
  async getAllPosts() {
    const posts = (await postsRepositories.findAllPosts()).map(
      mapToPostsViewModel,
    );
    return posts;
  },

  async createPost(postInput: PostInput) {
    const newPost = {
      ...postInput,
      createdAt: new Date(),
    };
    const createdPost = await postsRepositories.createPost(newPost);
    return mapToPostsViewModel(createdPost);
  },

  async getPostById(id: string) {
    const post = await postsRepositories.getPost(id);
    return post;
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
