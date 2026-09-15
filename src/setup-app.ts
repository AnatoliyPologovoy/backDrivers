import express, { Express, Request } from 'express';
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

  // app.post('/drivers', (req: Request<{}, Videos, VideosInputDto>, res) => {
  //   const inputItem = req.body;
  //   const errors: ValidationError[] = validationFieldsVideoInput(inputItem);
  //   if (errors.length > 0) {
  //     res.status(HTTP_STATUS.BAD_REQUEST).send();
  //   }
  //
  //   const lastDriverId = db.drivers[db.drivers.length - 1]?.id;
  //   const newDriver: Videos = {
  //     id: lastDriverId ? lastDriverId + 1 : 1,
  //     name: req.body.name,
  //     phoneNumber: req.body.phoneNumber,
  //     email: req.body.email,
  //     vehicleMake: req.body.vehicleMake,
  //     vehicleModel: req.body.vehicleModel,
  //     vehicleYear: req.body.vehicleYear,
  //     vehicleLicensePlate: req.body.vehicleLicensePlate,
  //     vehicleDescription: req.body.vehicleDescription,
  //     vehicleFeatures: req.body.vehicleFeatures,
  //     createdAt: new Date(),
  //   };
  //   db.drivers.push(newDriver);
  //   res.status(HTTP_STATUS.OK).send(newDriver);
  // });

  app.delete('/testing/all-data', (req, res) => {
    db.drivers = [];
    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });

  return app;
};
