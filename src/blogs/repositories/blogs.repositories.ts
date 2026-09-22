import { db } from '../../db/db';
import { Blog } from '../types/blog';
import { BlogInput } from '../types/blog.input.dto';

export const blogsRepositories = {
  findAllBlogs(): Blog[] {
    return db.blogs;
  },
  createBlog(blog: BlogInput): Blog {
    const lastId = db.blogs[db.blogs.length - 1]?.id;
    const newId: string = String(lastId ? +lastId + 1 : 1);

    const newBlog = {
      ...blog,
      id: newId,
    };

    db.blogs.push(newBlog);

    return newBlog;
  },

  getBlog(id: string) {
    const blog = db.blogs.find((blog) => blog.id === id);
    return blog ?? null;
  },
};
