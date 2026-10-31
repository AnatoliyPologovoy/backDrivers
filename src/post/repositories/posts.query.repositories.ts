import { PostQuery } from '../types/post.input.dto';
import { postsCollection } from '../../db/collections';
import { ObjectId } from 'mongodb';
import { mapToPostPaginationModel } from '../routers/mappers/mapToPostPaginationModel';
import { mapToPostsViewModel } from '../routers/mappers/mapToPostsViewModel';

export const postsQueryRepositories = {
  async findAllPosts(query: PostQuery) {
    const { pageNumber, pageSize, sortDirection, sortBy } = query;

    const skip = (pageNumber - 1) * pageSize;

    const items = await postsCollection
      .find()
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const totalCount = await postsCollection.countDocuments();

    const postRepoData = { items, totalCount };
    return mapToPostPaginationModel(query, postRepoData);
  },

  async findAllPostsByBlogId(query: PostQuery, blogId: string) {
    const { pageNumber, pageSize, sortDirection, sortBy } = query;

    const skip = (pageNumber - 1) * pageSize;

    const items = await postsCollection
      .find({ blogId })
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();
    const totalCount = await postsCollection.countDocuments({ blogId });

    const postRepoData = { items, totalCount };
    return mapToPostPaginationModel(query, postRepoData);
  },

  async getPostById(id: string) {
    const post = await postsCollection.findOne({ _id: new ObjectId(id) });
    return post !== null ? mapToPostsViewModel(post) : null;
  },
};
