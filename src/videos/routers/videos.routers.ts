import { Request, Router } from 'express';
import { HTTP_STATUS } from '../../core/constants';
import { db } from '../../db/db';
import { Video } from '../types/video';
import { ErrorResponse, ValidationError } from '../../core/types';
import {
  CreateVideoInputDto,
  UpdateVideoInputDto,
} from '../dto/videos.input.dto';
import {
  validationCreateVideoInput,
  validationUpdateVideoInput,
} from '../validation/video.input';
import { getErrorResponse } from '../../core/utils';

export const videosRouter = Router({});

videosRouter
  .get('', (req, res) => {
    res.status(HTTP_STATUS.OK).send(db.videos);
  })
  .get('/:id', (req, res) => {
    const video = db.videos.find((item) => item.id === +req.params.id);
    if (!video) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND);
      return;
    }
    res.status(HTTP_STATUS.OK).send(video);
  })
  .post(
    '',
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

      res.status(HTTP_STATUS.CREATED).send(newVideo);
    },
  )
  .put(
    '/:id',
    (
      req: Request<{ id: string }, void | ErrorResponse, UpdateVideoInputDto>,
      res,
    ) => {
      const reqId = req.params.id;
      const body = req.body;

      const isExists = db.videos.find((item) => item.id === +reqId);
      if (!isExists) {
        res.sendStatus(HTTP_STATUS.NOT_FOUND);
      }

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
  )
  .delete('/:id', (req, res) => {
    const reqId = req.params.id;
    const isExists = db.videos.find((item) => item.id === +reqId);
    if (!isExists) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND);
    }
    db.videos = db.videos.filter((item) => item.id !== +reqId);
    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });
