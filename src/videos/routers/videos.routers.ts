import { Router } from 'express';

import {
  createVideoHandler,
  deleteVideoHandler,
  getAllVideosHandler,
  getVideoByIdHandler,
  updateVideoHandler,
} from './handlers/videosHandler';
import { VIDEOS_ROUTES } from './constants';

export const videosRouter = Router({});

videosRouter
  .get(VIDEOS_ROUTES.ROOT, getAllVideosHandler)
  .get(VIDEOS_ROUTES.ID, getVideoByIdHandler)
  .post(VIDEOS_ROUTES.ROOT, createVideoHandler)
  .put(VIDEOS_ROUTES.ID, updateVideoHandler)
  .delete(VIDEOS_ROUTES.ID, deleteVideoHandler);
