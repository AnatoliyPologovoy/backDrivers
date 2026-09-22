import express from 'express';

import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { HTTP_STATUS } from '../../../src/core/constants';
import { Video } from '../../../src/videos/types/video';
import {
  CreateVideoInputDto,
  UpdateVideoInputDto,
} from '../../../src/videos/dto/videos.input.dto';
import { Blog } from '../../../src/blogs/types/blog';
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
