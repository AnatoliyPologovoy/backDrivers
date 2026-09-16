import express from 'express';

import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { HTTP_STATUS } from '../../../src/core/constants';
import { Video } from '../../../src/videos/types/video';
import {
  CreateVideoInputDto,
  UpdateVideoInputDto,
} from '../../../src/videos/dto/videos.input.dto';

describe('Videos API', () => {
  const app = express();
  setupApp(app);

  const mockVideo: Video = {
    id: 1,
    title: 'Introduction to TypeScript',
    author: 'John Doe',
    canBeDownloaded: false,
    minAgeRestriction: null,
    createdAt: '2026-09-15T20:26:01.667Z',
    publicationDate: '2026-09-16T20:26:01.667Z',
    availableResolutions: ['P720', 'P1080'],
  };

  beforeAll(async () => {
    await request(app)
      .delete('/api/testing/all-data')
      .expect(HTTP_STATUS.NO_CONTENT);
  });

  it('should create driver; POST /videos', async () => {
    const newVideo: CreateVideoInputDto = {
      ...mockVideo,
      title: 'Valentin',
    };

    await request(app)
      .post('/api/videos')
      .send(newVideo)
      .expect(HTTP_STATUS.OK);
  });

  it('should return videos list; GET /videos', async () => {
    await request(app)
      .post('/api/videos')
      .send({ ...mockVideo, title: 'Another Driver' })
      .expect(HTTP_STATUS.OK);

    await request(app)
      .post('/api/videos')
      .send({ ...mockVideo, title: 'Another Driver2' })
      .expect(HTTP_STATUS.OK);

    const videosListResponse = await request(app)
      .get('/api/videos')
      .expect(HTTP_STATUS.OK);

    expect(videosListResponse.body).toBeInstanceOf(Array);
    expect(videosListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should return driver by id; GET /videos/:id', async () => {
    const createResponse = await request(app)
      .post('/api/videos')
      .send({ ...mockVideo, title: 'Another Driver' })
      .expect(HTTP_STATUS.OK);

    const getResponse = await request(app)
      .get(`/api/videos/${createResponse.body.id}`)
      .expect(HTTP_STATUS.OK);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });
  });
});
