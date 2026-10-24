import { blogsRepositories } from '../repositories/blogs.repositories';
import { mapToBlogsViewModel } from '../mappers/mapToBlogsViewModel';
import { BlogInput } from '../types/blog.input.dto';
import { Blog, BlogQuery } from '../types/blog';
import { mapToBlogsPaginationModel } from '../mappers/mapToBlogsPaginationModel';

export const blogsService = {
  async getAllBlogs(query: BlogQuery) {
    const blogsRepoData = await blogsRepositories.findAllBlogs(query);
    return mapToBlogsPaginationModel(query, blogsRepoData);
  },

  async createBlog(blogInput: BlogInput) {
    const newBlog: Blog = {
      ...blogInput,
      isMembership: false,
      createdAt: new Date(),
    };
    const createdBlog = await blogsRepositories.createBlog(newBlog);
    return mapToBlogsViewModel(createdBlog);
  },

  async getBlogById(id: string) {
    const blog = await blogsRepositories.getBlog(id);
    return blog;
  },

  async updateById(id: string, blog: Blog) {
    const { createdAt, ...preparedBlog } = blog;
    const isUpdated = await blogsRepositories.updateBlog(id, preparedBlog);
    return isUpdated;
  },

  async deleteById(id: string) {
    const isDeleted = await blogsRepositories.deleteBlog(id);
    return isDeleted;
  },
};
