import express from 'express';

import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { HTTP_STATUS } from '../../../src/core/constants';
import { PostInput } from '../../../src/post/types/post.input.dto';

describe('Posts API validation', () => {
  const app = express();
  setupApp(app);

  // Basic-токен для admin:qwerty
  const authHeader = {
    Authorization: `Basic ${Buffer.from('admin:qwerty').toString('base64')}`,
  };

  const mockPost: PostInput = {
    title: 'Introduction to TypeScript',
    shortDescription: 'Post about TypeScript basics',
    content: 'Some content about TypeScript',
    blogId: '1',
  };

  beforeAll(async () => {
    await request(app)
      .delete('/testing/all-data')
      .expect(HTTP_STATUS.NO_CONTENT);

    await request(app)
      .post('/blogs')
      .set(authHeader)
      .send({
        description: 'Introduction to TypeScript',
        name: 'John Doe',
        websiteUrl: 'https://example.com',
      })
      .expect(HTTP_STATUS.CREATED);
  });

  it('check invalid title for POST', async () => {
    const res = await request(app)
      .post('/posts')
      .set(authHeader)
      // .send({ ...mockPost, title: 'T'.repeat(31) }) //over 30 length
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('title');
  });

  it('check invalid shortDescription for POST', async () => {
    const res = await request(app)
      .post('/posts')
      .set(authHeader)
      .send({ ...mockPost, shortDescription: 'D'.repeat(101) }) //over 100 length
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('shortDescription');
  });

  it('check invalid content for POST', async () => {
    const res = await request(app)
      .post('/posts')
      .set(authHeader)
      .send({ ...mockPost, content: 'C'.repeat(1001) }) //over 1000 length
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('content');
  });

  it('check missing blogId for POST', async () => {
    const { blogId, ...postWithoutBlogId } = mockPost;

    const res = await request(app)
      .post('/posts')
      .set(authHeader)
      .send(postWithoutBlogId)
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('blogId');
  });

  it('check invalid title for PUT', async () => {
    const createRes = await request(app)
      .post('/posts')
      .set(authHeader)
      .send(mockPost)
      .expect(HTTP_STATUS.CREATED);

    const res = await request(app)
      .put(`/posts/${createRes.body.id}`)
      .set(authHeader)
      .send({ ...mockPost, title: 'T'.repeat(31) }) //over 30 length
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('title');
  });

  it('check invalid shortDescription for PUT', async () => {
    const createRes = await request(app)
      .post('/posts')
      .set(authHeader)
      .send(mockPost)
      .expect(HTTP_STATUS.CREATED);

    const res = await request(app)
      .put(`/posts/${createRes.body.id}`)
      .set(authHeader)
      .send({ ...mockPost, shortDescription: 'D'.repeat(101) }) //over 100 length
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('shortDescription');
  });

  it('check invalid content for PUT', async () => {
    const createRes = await request(app)
      .post('/posts')
      .set(authHeader)
      .send(mockPost)
      .expect(HTTP_STATUS.CREATED);

    const res = await request(app)
      .put(`/posts/${createRes.body.id}`)
      .set(authHeader)
      .send({ ...mockPost, content: 'C'.repeat(1001) }) //over 1000 length
      .expect(HTTP_STATUS.BAD_REQUEST);

    expect(res.body.errorsMessages[0].field).toMatch('content');
  });
});
