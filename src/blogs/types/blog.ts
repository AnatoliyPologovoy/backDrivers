import { BlogInput } from './blog.input.dto';
import { PaginationSorting } from '../../core/types/pagination-sorting.types';

export type Blog = BlogInput & {
  createdAt: Date; //date-time
  isMembership: boolean; // default-false
};

export type BlogView = Blog & { id: string };

export type BlogQuery = {
  searchNameTerm?: string; //Search term for blog Name: Name should contains this term in any position  Default value : null
} & PaginationSorting;
