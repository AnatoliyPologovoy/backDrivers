import express from 'express';

import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { HTTP_STATUS } from '../../../src/core/constants';
import { BlogInput } from '../../../src/blogs/types/blog.input.dto';
import { PostInput } from '../../../src/post/types/post.input.dto';
import { PostOutData } from '../../../src/post/types/post.output';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/settings/config';

describe('Posts API: GET /blogs/:blogid/posts (sorting, pagination)', () => {
  const app = express();
  setupApp(app);

  // Basic-токен для admin:qwerty
  const authHeader = {
    Authorization: `Basic ${Buffer.from('admin:qwerty').toString('base64')}`,
  };

  const seedBlog: BlogInput = {
    name: 'alpha blog',
    description: 'first blog',
    websiteUrl: 'https://alpha.com',
  };

  // Пост создаётся на сервере, поэтому createdAt и blogId в теле не нужны
  type SeedPost = Omit<PostInput, 'createdAt' | 'blogId'>;

  const seedPosts: SeedPost[] = [
    {
      title: 'alpha post',
      shortDescription: 'first post',
      content: 'alpha content',
    },
    {
      title: 'beta post',
      shortDescription: 'second post',
      content: 'beta content',
    },
    {
      title: 'gamma post',
      shortDescription: 'third post',
      content: 'gamma content',
    },
  ];

  const createBlog = async (blog: BlogInput) => {
    const res = await request(app)
      .post('/blogs')
      .set(authHeader)
      .send(blog)
      .expect(HTTP_STATUS.CREATED);

    return res.body;
  };

  const createPost = async (post: SeedPost, blogId: string) => {
    const res = await request(app)
      .post(`/blogs/${blogId}/posts`)
      .set(authHeader)
      .send({
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
      })
      .expect(HTTP_STATUS.CREATED);

    return res.body;
  };

  const createSeedBlog = async () => {
    const created = await createBlog(seedBlog);
    return created.id as string;
  };

  const createSeedData = async () => {
    const blogId = await createSeedBlog();

    for (const post of seedPosts) {
      await createPost(post, blogId);
      // разводим createdAt, иначе сортировка по createdAt недетерминирована
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    return blogId;
  };

  const getPosts = async (
    blogId: string,
    query: Record<string, string | number> = {},
  ) => {
    const res = await request(app)
      .get(`/blogs/${blogId}/posts`)
      .query(query)
      .expect(HTTP_STATUS.OK);

    return res.body as PostOutData;
  };

  const getTitles = (posts: PostOutData) => posts.items.map((p) => p.title);

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URI);
  }, 100000);

  beforeEach(async () => {
    await request(app)
      .delete('/testing/all-data')
      .expect(HTTP_STATUS.NO_CONTENT);
  });

  // Закрываем соединение с БД, чтобы процесс тестов корректно завершался.
  afterAll(async () => {
    await stopDb();
  });

  it('should return default pagination and sorting values', async () => {
    const blogId = await createSeedData();

    const posts = await getPosts(blogId);

    expect(posts.page).toBe(1);
    expect(posts.pageSize).toBe(10);
    expect(posts.totalCount).toBe(3);
    expect(posts.pagesCount).toBe(1);
    expect(posts.items).toHaveLength(3);
    // sortDirection по умолчанию — desc
    expect(getTitles(posts)).toEqual(['gamma post', 'beta post', 'alpha post']);
  });

  it('should sort posts by title in both directions', async () => {
    const blogId = await createSeedData();

    const asc = await getPosts(blogId, {
      sortBy: 'title',
      sortDirection: 'asc',
    });
    expect(getTitles(asc)).toEqual(['alpha post', 'beta post', 'gamma post']);

    const desc = await getPosts(blogId, {
      sortBy: 'title',
      sortDirection: 'desc',
    });
    expect(getTitles(desc)).toEqual(['gamma post', 'beta post', 'alpha post']);
  });

  it('should sort posts by shortDescription and content', async () => {
    const blogId = await createSeedData();

    const byShortDescription = await getPosts(blogId, {
      sortBy: 'shortDescription',
      sortDirection: 'asc',
    });
    expect(byShortDescription.items.map((p) => p.shortDescription)).toEqual([
      'first post',
      'second post',
      'third post',
    ]);

    const byContent = await getPosts(blogId, {
      sortBy: 'content',
      sortDirection: 'desc',
    });
    expect(byContent.items.map((p) => p.content)).toEqual([
      'gamma content',
      'beta content',
      'alpha content',
    ]);
  });

  it('should sort posts by createdAt with respect to sortDirection', async () => {
    const blogId = await createSeedData();

    const desc = await getPosts(blogId, {
      sortBy: 'createdAt',
      sortDirection: 'desc',
    });
    expect(getTitles(desc)).toEqual(['gamma post', 'beta post', 'alpha post']);

    const asc = await getPosts(blogId, {
      sortBy: 'createdAt',
      sortDirection: 'asc',
    });
    expect(getTitles(asc)).toEqual(['alpha post', 'beta post', 'gamma post']);
  });

  it('should paginate posts by pageSize and pageNumber', async () => {
    const blogId = await createSeedData();

    const firstPage = await getPosts(blogId, {
      sortBy: 'title',
      sortDirection: 'asc',
      pageSize: 2,
      pageNumber: 1,
    });

    expect(firstPage).toMatchObject({
      pagesCount: 2,
      page: 1,
      pageSize: 2,
      totalCount: 3,
    });
    expect(getTitles(firstPage)).toEqual(['alpha post', 'beta post']);

    const secondPage = await getPosts(blogId, {
      sortBy: 'title',
      sortDirection: 'asc',
      pageSize: 2,
      pageNumber: 2,
    });

    expect(secondPage).toMatchObject({
      pagesCount: 2,
      page: 2,
      pageSize: 2,
      totalCount: 3,
    });
    expect(getTitles(secondPage)).toEqual(['gamma post']);
  });

  it('should return empty items for pageNumber out of range', async () => {
    const blogId = await createSeedData();

    const posts = await getPosts(blogId, { pageSize: 2, pageNumber: 5 });

    expect(posts).toEqual({
      pagesCount: 2,
      page: 5,
      pageSize: 2,
      totalCount: 3,
      items: [],
    });
  });

  it('should apply sorting and pagination together', async () => {
    const blogId = await createSeedData();
    await createPost(
      {
        title: 'delta post',
        shortDescription: 'fourth post',
        content: 'delta content',
      },
      blogId,
    );

    const posts = await getPosts(blogId, {
      sortBy: 'title',
      sortDirection: 'asc',
      pageSize: 2,
      pageNumber: 2,
    });

    expect(posts).toMatchObject({
      pagesCount: 2,
      page: 2,
      pageSize: 2,
      totalCount: 4,
    });
    expect(getTitles(posts)).toEqual(['delta post', 'gamma post']);
  });
});