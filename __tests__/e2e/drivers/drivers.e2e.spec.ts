import express from 'express';

import request from 'supertest';
import { setupApp } from '../../../src/setup-app';
import { DriverInputDto } from '../../../src/drivers/dto/driver.input.dto';
import { HTTP_STATUS } from '../../../src/core/constants';

describe('Driver API', () => {
  const app = express();
  setupApp(app);

  const testDriverData: DriverInputDto = {
    name: 'Valentin',
    phoneNumber: '123-456-7890',
    email: 'valentin@example.com',
    vehicleMake: 'BMW',
    vehicleModel: 'X5',
    vehicleYear: 2021,
    vehicleLicensePlate: 'ABC-123',
    vehicleDescription: null,
    vehicleFeatures: [],
  };

  beforeAll(async () => {
    await request(app)
      .delete('/testing/all-data')
      .expect(HTTP_STATUS.NO_CONTENT);
  });

  it('should create driver; POST /drivers', async () => {
    const newDriver: DriverInputDto = {
      ...testDriverData,
      name: 'Valentin',
      phoneNumber: '123-456-7890',
      email: 'valentin@example.com',
    };

    await request(app).post('/drivers').send(newDriver).expect(HTTP_STATUS.OK);
  });

  it('should return drivers list; GET /drivers', async () => {
    await request(app)
      .post('/drivers')
      .send({ ...testDriverData, name: 'Another Driver' })
      .expect(HTTP_STATUS.OK);

    await request(app)
      .post('/drivers')
      .send({ ...testDriverData, name: 'Another Driver2' })
      .expect(HTTP_STATUS.OK);

    const driverListResponse = await request(app)
      .get('/drivers')
      .expect(HTTP_STATUS.OK);

    expect(driverListResponse.body).toBeInstanceOf(Array);
    expect(driverListResponse.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should return driver by id; GET /drivers/:id', async () => {
    const createResponse = await request(app)
      .post('/drivers')
      .send({ ...testDriverData, name: 'Another Driver' })
      .expect(HTTP_STATUS.OK);

    const getResponse = await request(app)
      .get(`/drivers/${createResponse.body.id}`)
      .expect(HTTP_STATUS.OK);

    expect(getResponse.body).toEqual({
      ...createResponse.body,
      id: expect.any(Number),
      createdAt: expect.any(String),
    });
  });
});
