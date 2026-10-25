import { PostOutData, PostRepoData } from '../../types/post.output';
import { mapToPostsViewModel } from './mapToPostsViewModel';
import { PostQuery } from '../../types/post.input.dto';

export const mapToBlogsPaginationModel = (
  query: PostQuery,
  postRepoData: PostRepoData,
): PostOutData => {
  return {
    pageSize: query.pageSize,
    page: query.pageNumber,
    pagesCount: Math.ceil(postRepoData.totalCount / query.pageSize),
    totalCount: postRepoData.totalCount,
    items: postRepoData.items.map(mapToPostsViewModel),
  };
};
