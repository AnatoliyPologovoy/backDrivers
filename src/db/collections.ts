import { Collection, Db } from 'mongodb';
import { Blog } from '../blogs/types/blog';
import { Post } from '../post/types/post';

export const BLOGS_COLLECTION_NAME = 'blogs';
export const POSTS_COLLECTION_NAME = 'posts';

// Коллекция инициализируется один раз в initCollections() после подключения к БД.
// До этого момента она undefined, поэтому обращаться к ней можно только после runDB().
export let blogsCollection: Collection<Blog>;
export let postsCollection: Collection<Post>;

// Создаём объект коллекции из подключённой базы.
export function initCollections(db: Db): void {
  blogsCollection = db.collection<Blog>(BLOGS_COLLECTION_NAME);
  postsCollection = db.collection<Post>(POSTS_COLLECTION_NAME);
}
