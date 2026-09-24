import express from 'express';

import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { HTTP_STATUS } from '../../../src/core/constants';

import { BlogInput } from '../../../src/blogs/types/blog.input.dto';

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
    await request(app)
      .delete('/testing/all-data')
      .expect(HTTP_STATUS.NO_CONTENT);
  });

  it('check invalid websiteUrl for POST', async () => {
    const res = await request(app)
      .post('/blogs')
      .set(authHeader)
      .send({ ...mockBlog, websiteUrl: 'AoAwpGRu.M.hF3_tYl7tHmi' })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('websiteUrl');
  });

  it('check invalid name for POST', async () => {
    const res = await request(app)
      .post('/blogs')
      .set(authHeader)
      .send({
        ...mockBlog,
        name: 'AoAwpGRu.M.hF3_tYl7tHmi AoAwpGRu AoAwpGRu AoAwpGRu', //over 15 length
      })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('name');
  });

  it('check invalid websiteUrl for PUT', async () => {
    const createRes = await request(app)
      .post('/blogs')
      .set(authHeader)
      .send({
        ...mockBlog,
      });

    const res = await request(app)
      .put('/blogs/' + createRes.body.id)
      .set(authHeader)
      .send({ ...mockBlog, websiteUrl: 'AoAwpGRu.M.hF3_tYl7tHmi' })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('websiteUrl');
  });

  it('check invalid name for PUT', async () => {
    const createRes = await request(app)
      .post('/blogs')
      .set(authHeader)
      .send({
        ...mockBlog,
      });

    const res = await request(app)
      .put('/blogs/' + createRes.body.id)
      .set(authHeader)
      .send({
        ...mockBlog,
        name: 'AoAwpGRu.M.hF3_tYl7tHmi AoAwpGRu AoAwpGRu AoAwpGRu', //over 15 length
      })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('name');
  });
});