import express, { Express } from 'express';
import { HTTP_STATUS } from './core/constants';
import { db } from './db/db';

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  // основной роут
  app.get('/', (req, res) => {
    res.status(HTTP_STATUS.OK).send('Hello world!');
  });

  app.get('/drivers', (req, res) => {
    res.status(HTTP_STATUS.OK).send(db.drivers);
  });

  app.get('/drivers/:id', (req, res) => {
    const driver = db.drivers.find((item) => item.id === +req.params.id);
    if (!driver) {
      res.sendStatus(HTTP_STATUS.NOT_FOUND);
      return;
    }
    res.status(HTTP_STATUS.OK).send(driver);
  });

  return app;
};
