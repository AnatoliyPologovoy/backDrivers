import express, { Express, Request } from 'express';
import { HTTP_STATUS } from './core/constants';
import { db } from './db/db';
import { videosRouter } from './videos/routers/videos.routers';
import { testingRouter } from './videos/testing/routers/testing.routers';
import { blogsRouters } from './blogs/routers/blogs.routers';

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  // основной роут
  app.get('/', (req, res) => {
    res.status(HTTP_STATUS.OK).send('Hello world!');
  });

  app.use('/videos', videosRouter);
  app.use('/testing', testingRouter);
  app.use('/blogs', blogsRouters);

  return app;
};
