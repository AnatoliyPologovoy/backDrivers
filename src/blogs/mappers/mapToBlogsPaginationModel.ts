import { BlogQuery } from '../types/blog';
import { BlogsOutData, BlogsRepoData } from '../types/blogs.output';
import { mapToBlogsViewModel } from './mapToBlogsViewModel';

export const mapToBlogsPaginationModel = (
  query: BlogQuery,
  blogsRepoData: BlogsRepoData,
): BlogsOutData => {
  return {
    pageSize: query.pageSize,
    page: query.pageNumber,
    pagesCount: Math.ceil(blogsRepoData.totalCount / query.pageSize),
    totalCount: blogsRepoData.totalCount,
    items: blogsRepoData.items.map(mapToBlogsViewModel),
  };
};
