import express from 'express';
import { HTTP_STATUS } from '../../../core/constants';
import { db } from '../../../db/db';

export const testingRouter = express.Router({});

testingRouter.delete('/all-data', (req, res) => {
  db.videos = [];
  db.blogs = [];
  res.sendStatus(HTTP_STATUS.NO_CONTENT);
});
