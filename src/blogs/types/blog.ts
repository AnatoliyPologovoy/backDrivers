export type Blog = {
  // id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date; //date-time
  isMembership: boolean; // default-false
};

export type BlogView = Blog & { id: string };
