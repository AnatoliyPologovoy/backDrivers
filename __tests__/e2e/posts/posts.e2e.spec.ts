import express from 'express';

import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { HTTP_STATUS } from '../../../src/core/constants';
import { PostInput } from '../../../src/post/types/post.input.dto';

describe('Posts API', () => {
  const app = express();
  setupApp(app);

  // Basic-токен для admin:qwerty
  const authHeader = {
    Authorization: `Basic ${Buffer.from('admin:qwerty').toString('base64')}`,
  };

  const mockBlog = {
    description: 'Introduction to TypeScript',
    name: 'John Doe',
    websiteUrl: 'https://example.com',
  };

  const mockPost: PostInput = {
    title: 'Introduction to TypeScript',
    shortDescription: 'Post about TypeScript basics',
    content: 'Some content about TypeScript',
    blogId: '1',
  };

  const createPost = async (post: PostInput = mockPost) => {
    const res = await request(app)
      .post('/posts')
      .set(authHeader)
      .send(post)
      .expect(HTTP_STATUS.CREATED);

    return res.body;
  };

  beforeAll(async () => {
    await request(app)
      .delete('/testing/all-data')
      .expect(HTTP_STATUS.NO_CONTENT);

    // блог, на который ссылаются посты
    await request(app)
      .post('/blogs')
      .set(authHeader)
      .send(mockBlog)
      .expect(HTTP_STATUS.CREATED);
  });

  it('should return 401 without auth; POST /posts', async () => {
    await request(app)
      .post('/posts')
      .send(mockPost)
      .expect(HTTP_STATUS.UNAUTHORIZED);
  });

  it('should create post; POST /posts', async () => {
    const createdPost = await createPost();

    expect(createdPost).toEqual({
      ...mockPost,
      id: expect.any(String),
      blogName: mockBlog.name,
    });
  });

  it('should return posts list; GET /posts', async () => {
    await createPost({ ...mockPost, title: 'Another Post' });
    await createPost({ ...mockPost, title: 'Another Post 2' });

    const postsListResponse = await request(app)
      .get('/posts')
      .expect(HTTP_STATUS.OK);

    expect(postsListResponse.body).toBeInstanceOf(Array);
    expect(postsListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should return post by id; GET /posts/:id', async () => {
    const createdPost = await createPost();

    const getResponse = await request(app)
      .get(`/posts/${createdPost.id}`)
      .expect(HTTP_STATUS.OK);

    expect(getResponse.body).toEqual(createdPost);
  });

  it('should return 404 for not existing post; GET /posts/:id', async () => {
    await request(app).get('/posts/999').expect(HTTP_STATUS.NOT_FOUND);
  });

  it('should update post by id; PUT /posts/:id', async () => {
    const createdPost = await createPost();

    await request(app)
      .put(`/posts/${createdPost.id}`)
      .set(authHeader)
      .send({ ...mockPost, title: 'Updated title' })
      .expect(HTTP_STATUS.NO_CONTENT);

    const getResponse = await request(app)
      .get(`/posts/${createdPost.id}`)
      .expect(HTTP_STATUS.OK);

    expect(getResponse.body.title).toEqual('Updated title');
  });

  it('should return 401 without auth; PUT /posts/:id', async () => {
    const createdPost = await createPost();

    await request(app)
      .put(`/posts/${createdPost.id}`)
      .send({ ...mockPost, title: 'Updated title' })
      .expect(HTTP_STATUS.UNAUTHORIZED);
  });

  it('should delete post by id; DELETE /posts/:id', async () => {
    const createdPost = await createPost();

    await request(app)
      .delete(`/posts/${createdPost.id}`)
      .set(authHeader)
      .expect(HTTP_STATUS.NO_CONTENT);

    await request(app)
      .get(`/posts/${createdPost.id}`)
      .expect(HTTP_STATUS.NOT_FOUND);
  });

  it('should return 401 without auth; DELETE /posts/:id', async () => {
    const createdPost = await createPost();

    await request(app)
      .delete(`/posts/${createdPost.id}`)
      .expect(HTTP_STATUS.UNAUTHORIZED);
  });
});
