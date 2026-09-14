import express, { Express, Request } from 'express';
import { HTTP_STATUS } from './core/constants';
import { db } from './db/db';
import { Driver } from './drivers/types/driver';
import { DriverInputDto } from './drivers/dto/driver.input.dto';

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

  app.post('/drivers', (req: Request<{}, Driver, DriverInputDto>, res) => {
    const lastDriverId = db.drivers[db.drivers.length - 1]?.id;
    const newDriver: Driver = {
      id: lastDriverId ? lastDriverId + 1 : 1,
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      vehicleMake: req.body.vehicleMake,
      vehicleModel: req.body.vehicleModel,
      vehicleYear: req.body.vehicleYear,
      vehicleLicensePlate: req.body.vehicleLicensePlate,
      vehicleDescription: req.body.vehicleDescription,
      vehicleFeatures: req.body.vehicleFeatures,
      createdAt: new Date(),
    };
    db.drivers.push(newDriver);
    res.status(HTTP_STATUS.OK).send(newDriver);
  });

  app.delete('/testing/all-data', (req, res) => {
    db.drivers = [];
    res.sendStatus(HTTP_STATUS.NO_CONTENT);
  });

  return app;
};
