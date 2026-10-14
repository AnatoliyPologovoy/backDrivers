import express from 'express';
import { HTTP_STATUS } from '../../../core/constants';
import { db } from '../../../db/db';
import { blogsCollection } from '../../../db/collections';

export const testingRouter = express.Router({});

testingRouter.delete('/all-data', async (req, res) => {
  try {
    await blogsCollection.deleteMany({});
    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  } catch {
    res.sendStatus(HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
});
