import { db } from '../../db/db';
import { Blog } from '../types/blog';

export const blogsRepositories = {
  findAllBlogs(): Blog[] {
    return db.blogs;
  },
};
