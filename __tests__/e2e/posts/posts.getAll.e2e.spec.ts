import express from 'express';

import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { HTTP_STATUS } from '../../../src/core/constants';
import { BlogInput } from '../../../src/blogs/types/blog.input.dto';
import { PostInput } from '../../../src/post/types/post.input.dto';
import { PostOutData } from '../../../src/post/types/post.output';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/settings/config';

describe('Posts API: GET /posts (sorting, pagination)', () => {
  const app = express();
  setupApp(app);

  // Basic-токен для admin:qwerty
  const authHeader = {
    Authorization: `Basic ${Buffer.from('admin:qwerty').toString('base64')}`,
  };

  const seedBlogs: Record<string, BlogInput> = {
    alpha: {
      name: 'alpha blog',
      description: 'first blog',
      websiteUrl: 'https://alpha.com',
    },
    zulu: {
      name: 'zulu blog',
      description: 'second blog',
      websiteUrl: 'https://zulu.com',
    },
  };

  // Пост создаётся на сервере, поэтому createdAt в теле не нужен,
  // а blogId подставляем из созданных блогов по ключу
  type SeedPost = Omit<PostInput, 'createdAt' | 'blogId'> & { blogKey: string };

  const seedPosts: SeedPost[] = [
    {
      title: 'alpha post',
      shortDescription: 'first post',
      content: 'alpha content',
      blogKey: 'alpha',
    },
    {
      title: 'beta post',
      shortDescription: 'second post',
      content: 'beta content',
      blogKey: 'zulu',
    },
    {
      title: 'gamma post',
      shortDescription: 'third post',
      content: 'gamma content',
      blogKey: 'zulu',
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

  const createPost = async (
    post: SeedPost,
    blogIds: Record<string, string>,
  ) => {
    const res = await request(app)
      .post('/posts')
      .set(authHeader)
      .send({
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: blogIds[post.blogKey],
      })
      .expect(HTTP_STATUS.CREATED);

    return res.body;
  };

  const createSeedBlogs = async () => {
    const blogIds: Record<string, string> = {};
    for (const [key, blog] of Object.entries(seedBlogs)) {
      const created = await createBlog(blog);
      blogIds[key] = created.id;
    }
    return blogIds;
  };

  const createSeedData = async () => {
    const blogIds = await createSeedBlogs();

    for (const post of seedPosts) {
      await createPost(post, blogIds);
      // разводим createdAt, иначе сортировка по createdAt недетерминирована
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    return blogIds;
  };

  const getPosts = async (query: Record<string, string | number> = {}) => {
    const res = await request(app)
      .get('/posts')
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

  it('should return empty paginated result for empty collection', async () => {
    const posts = await getPosts();

    expect(posts).toEqual({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });

  it('should return default pagination and sorting values', async () => {
    await createSeedData();

    const posts = await getPosts();

    expect(posts.page).toBe(1);
    expect(posts.pageSize).toBe(10);
    expect(posts.totalCount).toBe(3);
    expect(posts.pagesCount).toBe(1);
    expect(posts.items).toHaveLength(3);
    // sortDirection по умолчанию — desc
    expect(getTitles(posts)).toEqual(['gamma post', 'beta post', 'alpha post']);
  });

  it('should sort by title desc by default', async () => {
    const blogIds = await createSeedBlogs();
    // создаём в порядке, обратном алфавитному, чтобы отличить title от createdAt
    const reversed = [...seedPosts].reverse();

    for (const post of reversed) {
      await createPost(post, blogIds);
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    const posts = await getPosts();

    // sortBy по умолчанию — title (первое поле в SORT_POST_FIELDS)
    expect(getTitles(posts)).toEqual(['gamma post', 'beta post', 'alpha post']);
  });

  it('should return posts view model without _id; GET /posts', async () => {
    const blogIds = await createSeedBlogs();
    await createPost(seedPosts[0], blogIds);

    const posts = await getPosts();

    expect(posts.items[0]).toEqual({
      id: expect.any(String),
      title: 'alpha post',
      shortDescription: 'first post',
      content: 'alpha content',
      blogId: blogIds.alpha,
      blogName: seedBlogs.alpha.name,
      createdAt: expect.any(String),
    });
    expect(posts.items[0]).not.toHaveProperty('_id');
  });

  it('should sort posts by title in both directions', async () => {
    await createSeedData();

    const asc = await getPosts({ sortBy: 'title', sortDirection: 'asc' });
    expect(getTitles(asc)).toEqual(['alpha post', 'beta post', 'gamma post']);

    const desc = await getPosts({ sortBy: 'title', sortDirection: 'desc' });
    expect(getTitles(desc)).toEqual(['gamma post', 'beta post', 'alpha post']);
  });

  it('should sort posts by shortDescription and content', async () => {
    await createSeedData();

    const byShortDescription = await getPosts({
      sortBy: 'shortDescription',
      sortDirection: 'asc',
    });
    expect(byShortDescription.items.map((p) => p.shortDescription)).toEqual([
      'first post',
      'second post',
      'third post',
    ]);

    const byContent = await getPosts({
      sortBy: 'content',
      sortDirection: 'desc',
    });
    expect(byContent.items.map((p) => p.content)).toEqual([
      'gamma content',
      'beta content',
      'alpha content',
    ]);
  });

  it('should sort posts by blogName', async () => {
    await createSeedData();

    const asc = await getPosts({ sortBy: 'blogName', sortDirection: 'asc' });
    expect(asc.items.map((p) => p.blogName)).toEqual([
      'alpha blog',
      'zulu blog',
      'zulu blog',
    ]);

    const desc = await getPosts({ sortBy: 'blogName', sortDirection: 'desc' });
    expect(desc.items.map((p) => p.blogName)).toEqual([
      'zulu blog',
      'zulu blog',
      'alpha blog',
    ]);
  });

  it('should sort posts by createdAt with respect to sortDirection', async () => {
    await createSeedData();

    const desc = await getPosts({ sortBy: 'createdAt', sortDirection: 'desc' });
    expect(getTitles(desc)).toEqual(['gamma post', 'beta post', 'alpha post']);

    const asc = await getPosts({ sortBy: 'createdAt', sortDirection: 'asc' });
    expect(getTitles(asc)).toEqual(['alpha post', 'beta post', 'gamma post']);
  });

  it('should paginate posts by pageSize and pageNumber', async () => {
    await createSeedData();

    const firstPage = await getPosts({
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

    const secondPage = await getPosts({
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
    await createSeedData();

    const posts = await getPosts({ pageSize: 2, pageNumber: 5 });

    expect(posts).toEqual({
      pagesCount: 2,
      page: 5,
      pageSize: 2,
      totalCount: 3,
      items: [],
    });
  });

  it('should apply sorting and pagination together', async () => {
    const blogIds = await createSeedData();
    await createPost(
      {
        title: 'delta post',
        shortDescription: 'fourth post',
        content: 'delta content',
        blogKey: 'alpha',
      },
      blogIds,
    );

    const posts = await getPosts({
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

  it('should return 400 for invalid pageNumber; GET /posts?pageNumber=0', async () => {
    const res = await request(app)
      .get('/posts')
      .query({ pageNumber: 0 })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('pageNumber');
  });

  it('should return 400 for non numeric pageNumber; GET /posts?pageNumber=abc', async () => {
    const res = await request(app)
      .get('/posts')
      .query({ pageNumber: 'abc' })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('pageNumber');
  });

  it('should return 400 for invalid pageSize; GET /posts?pageSize=0', async () => {
    const res = await request(app)
      .get('/posts')
      .query({ pageSize: 0 })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('pageSize');
  });

  it('should return 400 for too big pageSize; GET /posts?pageSize=101', async () => {
    const res = await request(app)
      .get('/posts')
      .query({ pageSize: 101 })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('pageSize');
  });

  it('should return 400 for invalid sortDirection; GET /posts?sortDirection=wrong', async () => {
    const res = await request(app)
      .get('/posts')
      .query({ sortDirection: 'wrong' })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('sortDirection');
  });

  it('should return 400 for invalid sortBy; GET /posts?sortBy=wrong', async () => {
    const res = await request(app)
      .get('/posts')
      .query({ sortBy: 'wrong' })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('sortBy');
  });
});
