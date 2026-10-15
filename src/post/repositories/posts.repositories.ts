import { Post, PostView } from '../types/post';
import { PostInput } from '../types/post.input.dto';
import { blogsRepositories } from '../../blogs/repositories/blogs.repositories';
import { postsCollection } from '../../db/collections';
import { ObjectId, WithId } from 'mongodb';

export const postsRepositories = {
  async findAllPosts(): Promise<WithId<Post>[]> {
    return postsCollection.find({}).toArray();
  },

  async createPost(post: PostInput): Promise<WithId<Post>> {
    // имя блога берём по blogId, чтобы не доверять данным клиента
    const blog = await blogsRepositories.getBlog(post.blogId);
    // const blog = { name: 'qwre' };
    const newPost = {
      ...post,
      blogName: blog?.name ?? '',
    };

    const result = await postsCollection.insertOne(newPost);

    return { ...newPost, _id: result.insertedId };
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
