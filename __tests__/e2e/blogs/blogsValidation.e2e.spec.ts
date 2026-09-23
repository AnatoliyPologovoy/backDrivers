import express from 'express';

import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { HTTP_STATUS } from '../../../src/core/constants';

import { BlogInput } from '../../../src/blogs/types/blog.input.dto';

describe('Blogs API', () => {
  const app = express();
  setupApp(app);

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
      .send({ ...mockBlog, websiteUrl: 'AoAwpGRu.M.hF3_tYl7tHmi' })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('websiteUrl');
  });

  it('check invalid name for POST', async () => {
    const res = await request(app)
      .post('/blogs')
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
      .send({
        ...mockBlog,
      });

    const res = await request(app)
      .put('/blogs/' + createRes.body.id)
      .send({ ...mockBlog, websiteUrl: 'AoAwpGRu.M.hF3_tYl7tHmi' })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('websiteUrl');
  });

  it('check invalid name for PUT', async () => {
    const createRes = await request(app)
      .post('/blogs')
      .send({
        ...mockBlog,
      });

    const res = await request(app)
      .put('/blogs/' + createRes.body.id)
      .send({
        ...mockBlog,
        name: 'AoAwpGRu.M.hF3_tYl7tHmi AoAwpGRu AoAwpGRu AoAwpGRu', //over 15 length
      })
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('name');
  });

  // it('should return videos list; GET /videos', async () => {
  //   await request(app)
  //     .post('/videos')
  //     .send({ ...mockVideo, title: 'Another Driver' })
  //     .expect(HTTP_STATUS.CREATED);
  //
  //   await request(app)
  //     .post('/videos')
  //     .send({ ...mockVideo, title: 'Another Driver2' })
  //     .expect(HTTP_STATUS.CREATED);
  //
  //   const videosListResponse = await request(app)
  //     .get('/videos')
  //     .expect(HTTP_STATUS.OK);
  //
  //   expect(videosListResponse.body).toBeInstanceOf(Array);
  //   expect(videosListResponse.body.length).toBeGreaterThanOrEqual(2);
  // });
  //
  // it('should return driver by id; GET /videos/:id', async () => {
  //   const createResponse = await request(app)
  //     .post('/videos')
  //     .send({ ...mockVideo, title: 'Another Driver' })
  //     .expect(HTTP_STATUS.CREATED);
  //
  //   const getResponse = await request(app)
  //     .get(`/videos/${createResponse.body.id}`)
  //     .expect(HTTP_STATUS.OK);
  //
  //   expect(getResponse.body).toEqual({
  //     ...createResponse.body,
  //     id: expect.any(Number),
  //     createdAt: expect.any(String),
  //   });
  // });
});
