import { db } from '../../db/db';
import { Blog } from '../types/blog';
import { BlogInput } from '../types/blog.input.dto';
import { blogsCollection } from '../../db/collections';
import { ObjectId, WithId } from 'mongodb';

export const blogsRepositories = {
  async findAllBlogs(): Promise<WithId<Blog>[]> {
    return blogsCollection.find().toArray();
  },

  async createBlog(blog: Blog): Promise<WithId<Blog>> {
    const insertResult = await blogsCollection.insertOne(blog);
    return { ...blog, _id: insertResult.insertedId };
  },

  async getBlog(id: string) {
    return blogsCollection.findOne({ _id: new ObjectId(id) });
  },

  // isExistId(id: string) {
  //   return db.blogs.findIndex((blog) => blog.id === id) !== -1;
  // },

  async updateBlog(id: string, blog: Omit<Blog, 'createdAt'>) {
    const result = await blogsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: blog },
    );
    return result.modifiedCount > 0;
  },

  async deleteBlog(id: string) {
    const result = await blogsCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
};
