import express from 'express';

import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { HTTP_STATUS } from '../../../src/core/constants';
import { Blog } from '../../../src/blogs/types/blog';
import { BlogInput } from '../../../src/blogs/types/blog.input.dto';
import { runDB, stopDb } from '../../../src/db/mongo.db';
import { SETTINGS } from '../../../src/settings/config';
import { PostInput } from '../../../src/post/types/post.input.dto';

describe('Blogs API', () => {
  const app = express();
  setupApp(app);

  // Basic-токен для admin:qwerty
  const authHeader = {
    Authorization: `Basic ${Buffer.from('admin:qwerty').toString('base64')}`,
  };

  const mockBlog: BlogInput = {
    description: 'Introduction to TypeScript',
    name: 'John Doe ',
    websiteUrl:
      'https://79SM8Uyd_lL9cgPmYqs.NEk6PyLhCMaH7dO9pw4QVR3kzzDx3EZoLca478AZDm5NAdtc6AoAwpGRu.M.hF3_tYl7tHmi',
  };

  beforeAll(async () => {
    await runDB(SETTINGS.MONGO_URI);
    await request(app)
      .delete('/testing/all-data')
      .expect(HTTP_STATUS.NO_CONTENT);
  });

  // Закрываем соединение с БД, чтобы процесс тестов корректно завершался.
  afterAll(async () => {
    await stopDb();
  });

  it('should return blog by id; GET /blogs/:id', async () => {
    const createResponse = await request(app)
      .post('/blogs')
      .set(authHeader)
      .send(mockBlog)
      .expect(HTTP_STATUS.CREATED);

    const getResponse = await request(app)
      .get(`/blogs/${createResponse.body.id}`)
      .expect(HTTP_STATUS.OK);

    expect(getResponse.body).toEqual(createResponse.body);
  });

  it('should updated blog by id; GET /blogs/:id', async () => {
    const createResponse = await request(app)
      .post('/blogs')
      .set(authHeader)
      .send(mockBlog)
      .expect(HTTP_STATUS.CREATED);

    const putResponse = await request(app)
      .put(`/blogs/${createResponse.body.id}`)
      .set(authHeader)
      .send({ ...mockBlog, name: 'Tolix' })
      .expect(HTTP_STATUS.NO_CONTENT);

    const getResponse = await request(app)
      .get(`/blogs/${createResponse.body.id}`)
      .expect(HTTP_STATUS.OK);

    expect(getResponse.body.name).toEqual('Tolix');
  });

  it('should delete blog by id; GET /blogs/:id', async () => {
    const createResponse = await request(app)
      .post('/blogs')
      .set(authHeader)
      .send(mockBlog)
      .expect(HTTP_STATUS.CREATED);

    const getResponse = await request(app)
      .get(`/blogs/${createResponse.body.id}`)
      .expect(HTTP_STATUS.OK);

    expect(getResponse.body).toEqual(createResponse.body);

    const delResponse = await request(app)
      .delete(`/blogs/${createResponse.body.id}`)
      .set(authHeader)
      .expect(HTTP_STATUS.NO_CONTENT);

    const newGetResponse = await request(app)
      .get(`/blogs/${createResponse.body.id}`)
      .expect(HTTP_STATUS.NOT_FOUND);
  });

  it('should return create a post for a specific blog POST - blogs/{id}/posts', async () => {
    const createResponse = await request(app)
      .post('/blogs')
      .set(authHeader)
      .send(mockBlog)
      .expect(HTTP_STATUS.CREATED);

    const mockInputPost = {
      title: 'Introduction to TypeScript',
      shortDescription: 'Post about TypeScript basics',
      content: 'Some content about TypeScript',
    };

    const createdPost = await request(app)
      .post(`/blogs/${createResponse.body.id}/posts`)
      .set(authHeader)
      .send(mockInputPost)
      .expect(HTTP_STATUS.CREATED);
    //
    const getResponse = await request(app)
      .get(`/posts/${createdPost.body.id}`)
      .expect(HTTP_STATUS.OK);
  });
});
