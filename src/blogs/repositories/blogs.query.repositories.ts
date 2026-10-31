import { BlogQuery } from '../types/blog';
import { blogsCollection } from '../../db/collections';
import { ObjectId } from 'mongodb';
import { mapToBlogsPaginationModel } from '../mappers/mapToBlogsPaginationModel';
import { mapToBlogsViewModel } from '../mappers/mapToBlogsViewModel';

export const blogsQueryRepositories = {
  async findAllBlogs(query: BlogQuery) {
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
    const blogsRepoData = { items, totalCount };

    return mapToBlogsPaginationModel(query, blogsRepoData);
  },

  async getBlog(id: string) {
    const blog = await blogsCollection.findOne({ _id: new ObjectId(id) });
    return blog !== null ? mapToBlogsViewModel(blog) : blog;
  },
};
