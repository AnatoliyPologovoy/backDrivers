import { blogsRepositories } from '../repositories/blogs.repositories';
import { mapToBlogsViewModel } from '../mappers/mapToBlogsViewModel';
import { BlogInput } from '../types/blog.input.dto';
import { Blog, BlogQuery } from '../types/blog';
import { mapToBlogsPaginationModel } from '../mappers/mapToBlogsPaginationModel';
import { Request } from 'express';
import { Post, PostView } from '../../post/types/post';
import { PostInput, PostQuery } from '../../post/types/post.input.dto';
import { postsService } from '../../post/aplication/posts.service';

export const blogsService = {
  async createBlog(blogInput: BlogInput) {
    const newBlog: Blog = {
      ...blogInput,
      isMembership: false,
      createdAt: new Date(),
    };
    const createdBlogId = await blogsRepositories.createBlog(newBlog);
    return createdBlogId.toString();
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

  async createPostByBlogId(
    req: Request<
      { blogid: string },
      PostView,
      Omit<PostInput, 'blogId' | 'createdAt'>
    >,
  ) {
    const blog = await blogsRepositories.getBlog(req.params.blogid);
    if (!blog) {
      return null;
    }
    const createdPostId = await postsService.createPost({
      ...req.body,
      blogId: req.params.blogid,
    });

    return createdPostId;
  },

  async getAllPostsByBlogId(query: PostQuery, blogId: string) {
    const blog = await blogsRepositories.getBlog(blogId);

    return Boolean(blog);
  },
};
