import express from 'express';

import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { HTTP_STATUS } from '../../../src/core/constants';
import { BlogInput } from '../../../src/blogs/types/blog.input.dto';
import { BlogsOutData } from '../../../src/blogs/types/blogs.output';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/settings/config';

describe('Blogs API: GET /blogs (search, sorting, pagination)', () => {
  const app = express();
  setupApp(app);

  // Basic-токен для admin:qwerty
  const authHeader = {
    Authorization: `Basic ${Buffer.from('admin:qwerty').toString('base64')}`,
  };

  const seedBlogs: BlogInput[] = [
    {
      name: 'alpha',
      description: 'first blog',
      websiteUrl: 'https://alpha.com',
    },
    {
      name: 'beta',
      description: 'second blog',
      websiteUrl: 'https://beta.com',
    },
    {
      name: 'gamma',
      description: 'third blog',
      websiteUrl: 'https://gamma.com',
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

  const createSeedBlogs = async () => {
    for (const blog of seedBlogs) {
      await createBlog(blog);
      // разводим createdAt, иначе сортировка по умолчанию недетерминирована
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
  };

  const getBlogs = async (query: Record<string, string | number> = {}) => {
    const res = await request(app)
      .get('/blogs')
      .query(query)
      .expect(HTTP_STATUS.OK);

    return res.body as BlogsOutData;
  };

  const getNames = (blogs: BlogsOutData) => blogs.items.map((b) => b.name);

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URI);
  });

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
    const blogs = await getBlogs();

    expect(blogs).toEqual({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });

  it('should return default pagination and sorting values', async () => {
    await createSeedBlogs();

    const blogs = await getBlogs();

    expect(blogs.page).toBe(1);
    expect(blogs.pageSize).toBe(10);
    expect(blogs.totalCount).toBe(3);
    expect(blogs.pagesCount).toBe(1);
    expect(blogs.items).toHaveLength(3);
    // sortBy по умолчанию — createdAt, sortDirection — desc
    expect(getNames(blogs)).toEqual(['gamma', 'beta', 'alpha']);
  });

  it('should return blogs view model without _id; GET /blogs', async () => {
    await createBlog(seedBlogs[0]);

    const blogs = await getBlogs();

    expect(blogs.items[0]).toEqual({
      id: expect.any(String),
      name: 'alpha',
      description: 'first blog',
      websiteUrl: 'https://alpha.com',
      createdAt: expect.any(String),
      isMembership: false,
    });
    expect(blogs.items[0]).not.toHaveProperty('_id');
  });

  it('should filter blogs by searchNameTerm in any position and case insensitive', async () => {
    await createSeedBlogs();

    const partialMatch = await getBlogs({ searchNameTerm: 'et' });
    expect(partialMatch.totalCount).toBe(1);
    expect(getNames(partialMatch)).toEqual(['beta']);

    const caseInsensitive = await getBlogs({ searchNameTerm: 'ALPHA' });
    expect(caseInsensitive.totalCount).toBe(1);
    expect(getNames(caseInsensitive)).toEqual(['alpha']);

    const allMatched = await getBlogs({ searchNameTerm: 'a' });
    expect(allMatched.totalCount).toBe(3);
  });

  it('should return empty items when searchNameTerm matches nothing', async () => {
    await createSeedBlogs();

    const blogs = await getBlogs({ searchNameTerm: 'not-existing-blog' });

    expect(blogs).toEqual({
      pagesCount: 0,
      page: 1,
      pageSize: 10,
      totalCount: 0,
      items: [],
    });
  });

  it('should sort blogs by name in both directions', async () => {
    await createSeedBlogs();

    const asc = await getBlogs({ sortBy: 'name', sortDirection: 'asc' });
    expect(getNames(asc)).toEqual(['alpha', 'beta', 'gamma']);

    const desc = await getBlogs({ sortBy: 'name', sortDirection: 'desc' });
    expect(getNames(desc)).toEqual(['gamma', 'beta', 'alpha']);
  });

  it('should sort blogs by description and websiteUrl', async () => {
    await createSeedBlogs();

    const byDescription = await getBlogs({
      sortBy: 'description',
      sortDirection: 'asc',
    });
    expect(byDescription.items.map((b) => b.description)).toEqual([
      'first blog',
      'second blog',
      'third blog',
    ]);

    const byWebsiteUrl = await getBlogs({
      sortBy: 'websiteUrl',
      sortDirection: 'desc',
    });
    expect(byWebsiteUrl.items.map((b) => b.websiteUrl)).toEqual([
      'https://gamma.com',
      'https://beta.com',
      'https://alpha.com',
    ]);
  });

  it('should sort blogs by createdAt with respect to sortDirection', async () => {
    for (const blog of seedBlogs) {
      await createBlog(blog);
      // гарантируем разное createdAt у соседних блогов
      await new Promise((resolve) => setTimeout(resolve, 10));
    }

    const desc = await getBlogs({ sortBy: 'createdAt', sortDirection: 'desc' });
    expect(getNames(desc)).toEqual(['gamma', 'beta', 'alpha']);

    const asc = await getBlogs({ sortBy: 'createdAt', sortDirection: 'asc' });
    expect(getNames(asc)).toEqual(['alpha', 'beta', 'gamma']);
  });

  it('should paginate blogs by pageSize and pageNumber', async () => {
    await createSeedBlogs();

    const firstPage = await getBlogs({
      sortBy: 'name',
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
    expect(getNames(firstPage)).toEqual(['alpha', 'beta']);

    const secondPage = await getBlogs({
      sortBy: 'name',
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
    expect(getNames(secondPage)).toEqual(['gamma']);
  });

  it('should return empty items for pageNumber out of range', async () => {
    await createSeedBlogs();

    const blogs = await getBlogs({ pageSize: 2, pageNumber: 5 });

    expect(blogs).toEqual({
      pagesCount: 2,
      page: 5,
      pageSize: 2,
      totalCount: 3,
      items: [],
    });
  });

  it('should apply search, sorting and pagination together', async () => {
    await createSeedBlogs();
    await createBlog({
      name: 'delta',
      description: 'fourth blog',
      websiteUrl: 'https://delta.com',
    });

    const blogs = await getBlogs({
      searchNameTerm: 'a',
      sortBy: 'name',
      sortDirection: 'asc',
      pageSize: 2,
      pageNumber: 2,
    });

    expect(blogs).toMatchObject({
      pagesCount: 2,
      page: 2,
      pageSize: 2,
      totalCount: 4,
    });
    expect(getNames(blogs)).toEqual(['delta', 'gamma']);
  });

  it('should return 400 for invalid pageNumber; GET /blogs?pageNumber=0', async () => {
    const res = await request(app)
      .get('/blogs')
      .query({ pageNumber: 0 })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('pageNumber');
  });

  it('should return 400 for non numeric pageNumber; GET /blogs?pageNumber=abc', async () => {
    const res = await request(app)
      .get('/blogs')
      .query({ pageNumber: 'abc' })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('pageNumber');
  });

  it('should return 400 for invalid pageSize; GET /blogs?pageSize=0', async () => {
    const res = await request(app)
      .get('/blogs')
      .query({ pageSize: 0 })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('pageSize');
  });

  it('should return 400 for too big pageSize; GET /blogs?pageSize=101', async () => {
    const res = await request(app)
      .get('/blogs')
      .query({ pageSize: 101 })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('pageSize');
  });

  it('should return 400 for invalid sortDirection; GET /blogs?sortDirection=wrong', async () => {
    const res = await request(app)
      .get('/blogs')
      .query({ sortDirection: 'wrong' })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('sortDirection');
  });

  it('should return 400 for invalid sortBy; GET /blogs?sortBy=wrong', async () => {
    const res = await request(app)
      .get('/blogs')
      .query({ sortBy: 'wrong' })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('sortBy');
  });
});
