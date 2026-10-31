import { Blog, BlogQuery } from '../types/blog';
import { blogsCollection } from '../../db/collections';
import { ObjectId, WithId } from 'mongodb';
import { BlogsRepoData } from '../types/blogs.output';

export const blogsRepositories = {
  async findAllBlogs(query: BlogQuery): Promise<BlogsRepoData> {
    const { pageNumber, pageSize, sortDirection, sortBy, searchNameTerm } =
      query;

    const filter: Record<string, object> = {};
    if (searchNameTerm) {
      filter.name = { $regex: searchNameTerm, $options: 'i' };
    }

    const skip = (pageNumber - 1) * pageSize;

    const items = await blogsCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await blogsCollection.countDocuments(filter);
    return { items, totalCount };
  },

  async createBlog(blog: Blog) {
    const insertResult = await blogsCollection.insertOne(blog);
    return insertResult.insertedId;
  },

  async getBlog(id: string) {
    return blogsCollection.findOne({ _id: new ObjectId(id) });
  },

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
