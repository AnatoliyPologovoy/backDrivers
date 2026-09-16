import express, { Express, Request } from 'express';
import { HTTP_STATUS } from './core/constants';
import { db } from './db/db';
import {
  CreateVideoInputDto,
  UpdateVideoInputDto,
} from './videos/dto/videos.input.dto';
import { ErrorResponse, ValidationError } from './core/types';
import { Video } from './videos/types/video';
import {
  validationCreateVideoInput,
  validationUpdateVideoInput,
} from './videos/validation/video.input';
import { getErrorResponse } from './core/utils';

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  // основной роут
  app.get('/', (req, res) => {
    res.status(HTTP_STATUS.OK).send('Hello world!');
  });

  app.get('/hometask_01/api/videos', (req, res) => {
    res.status(HTTP_STATUS.OK).send(db.videos);
  });

  app.get('/hometask_01/api/videos/:id', (req, res) => {
    const video = db.videos.find((item) => item.id === +req.params.id);
    if (!video) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND);
      return;
    }
    res.status(HTTP_STATUS.OK).send(video);
  });

  app.post(
    '/hometask_01/api/videos',
    (req: Request<{}, Video | ErrorResponse, CreateVideoInputDto>, res) => {
      const inputItem = req.body;
      const errors: ValidationError[] = validationCreateVideoInput(inputItem);
      if (errors.length > 0) {
        res.status(HTTP_STATUS.BAD_REQUEST).send(getErrorResponse(errors));
      }

      const lastId = db.videos[db.videos.length - 1]?.id;
      const createdDate = new Date();
      const publicationDate = new Date(createdDate);
      publicationDate.setDate(publicationDate.getDate() + 1);

      const newVideo: Video = {
        ...inputItem,
        id: lastId ? lastId + 1 : 1,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: createdDate.toISOString(),
        publicationDate: publicationDate.toISOString(),
      };

      db.videos.push(newVideo);

      res.status(HTTP_STATUS.OK).send(newVideo);
    },
  );

  app.put(
    '/hometask_01/api/videos/:id',
    (
      req: Request<{ id: string }, void | ErrorResponse, UpdateVideoInputDto>,
      res,
    ) => {
      const reqId = req.params.id;
      const body = req.body;

      const errors: ValidationError[] = validationUpdateVideoInput(body);
      if (errors.length > 0) {
        res.status(HTTP_STATUS.BAD_REQUEST).send(getErrorResponse(errors));
      }

      db.videos = db.videos.map((item) => {
        if (item.id === +reqId) {
          return { ...item, ...body };
        }
        return item;
      });

      res.sendStatus(HTTP_STATUS.NO_CONTENT);
    },
  );

  app.delete('/hometask_01/api/testing/all-data', (req, res) => {
    db.videos = [];
    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });

  return app;
};
