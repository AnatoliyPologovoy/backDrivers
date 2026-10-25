import { PaginationSorting } from '../../core/types/pagination-sorting.types';

export type PostInput = {
  title: string; //maxLength: 30
  shortDescription: string; //maxLength: 100
  content: string; //maxLength: 1000
  blogId: string;
  createdAt: Date;
};

export type PostQuery = PaginationSorting;
