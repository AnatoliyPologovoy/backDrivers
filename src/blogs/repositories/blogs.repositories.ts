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

  isExistId(id: string) {
    return db.blogs.findIndex((blog) => blog.id === id) !== -1;
  },

  updateBlog(id: string, blog: BlogInput) {
    db.blogs = db.blogs.map((item) => {
      if (item.id === id) {
        return { ...item, ...blog };
      }
      return item;
    });
  },

  deleteBlog(id: string) {
    db.blogs = db.blogs.filter((blog) => blog.id !== id);
  },
};
