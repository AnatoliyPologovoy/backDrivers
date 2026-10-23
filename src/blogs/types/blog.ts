import { BlogInput } from './blog.input.dto';

export type Blog = BlogInput & {
  createdAt: Date; //date-time
  isMembership: boolean; // default-false
};

export type BlogView = Blog & { id: string };
