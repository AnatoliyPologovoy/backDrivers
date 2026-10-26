import { postsRepositories } from '../repositories/posts.repositories';
import { mapToPostsViewModel } from '../routers/mappers/mapToPostsViewModel';
import { PostInput, PostQuery } from '../types/post.input.dto';
import { mapToBlogsPaginationModel } from '../routers/mappers/mapToPostPaginationModel';

export const postsService = {
  async getAllPosts(query: PostQuery) {
    const postRepoData = await postsRepositories.findAllPosts(query);
    const postOutData = mapToBlogsPaginationModel(query, postRepoData);
    return postOutData;
  },

  async getAllPostsByBlogId(query: PostQuery, blogId: string) {
    const postRepoData = await postsRepositories.findAllPostsByBlogId(
      query,
      blogId,
    );
    const postOutData = mapToBlogsPaginationModel(query, postRepoData);
    return postOutData;
  },

  async createPost(postInput: Omit<PostInput, 'createdAt'>) {
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
