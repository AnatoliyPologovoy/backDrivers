import { Post } from '../types/post';
import { PostInput, PostQuery } from '../types/post.input.dto';
import { blogsRepositories } from '../../blogs/repositories/blogs.repositories';
import { postsCollection } from '../../db/collections';
import { ObjectId, WithId } from 'mongodb';
import { PostRepoData } from '../types/post.output';

export const postsRepositories = {
  async findAllPosts(query: PostQuery): Promise<PostRepoData> {
    const { pageNumber, pageSize, sortDirection, sortBy } = query;

    const skip = (pageNumber - 1) * pageSize;

    const items = await postsCollection
      .find()
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const totalCount = await postsCollection.countDocuments();

    return { items, totalCount };
  },

  async findAllPostsByBlogId(
    query: PostQuery,
    blogId: string,
  ): Promise<PostRepoData> {
    const { pageNumber, pageSize, sortDirection, sortBy } = query;

    const skip = (pageNumber - 1) * pageSize;

    const items = await postsCollection
      .find({ blogId })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const totalCount = await postsCollection.countDocuments({ blogId });

    return { items, totalCount };
  },

  async createPost(post: Post) {
    const result = await postsCollection.insertOne(post);

    return result.insertedId;
  },

  async getPost(id: string) {
    return postsCollection.findOne({ _id: new ObjectId(id) });
  },

  async updatePost(id: string, post: Omit<PostInput, 'createdAt'>) {
    const result = await postsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: post },
    );

    return result.modifiedCount > 0;
  },

  async deletePost(id: string) {
    const result = await postsCollection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  },
};
