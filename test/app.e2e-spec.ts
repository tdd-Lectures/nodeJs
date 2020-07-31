import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { appModuleMetadata } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import { VehicleServices } from '../src/services';
import { makeVehicleServices } from '../src/controllers/vehicle-services-mock';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule(appModuleMetadata)
      .overrideProvider(VehicleServices)
      .useValue(makeVehicleServices())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('api/v1/vehicles/1 (200)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/vehicles/1')
      .expect(200);
  });

  it('api/v1/vehicles/2 (200) with vehicle list', () => {
    return request(app.getHttpServer())
      .get('/api/v1/vehicles/2')
      .expect(200)
      .expect([
        {
          vehicleId: 'B2',
          model: 'S1',
          yearOfConstruction: 2015,
        }
      ]);
  });

  it('api/v1/vehicles/gatewayError (424)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/vehicles/gatewayError')
      .expect(424);
  });

  it('api/v1/vehicles/internalError (500)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/vehicles/internalError')
      .expect(500);
  });

  it('api/v1/vehicles/ (404)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/vehicles/')
      .expect(404);
  });

  it('api/v1/vehicles// (404)', () => {
    return request(app.getHttpServer())
      .get('/api/v1/vehicles//')
      .expect(404);
  });

  it("api/v1/vehicles?userId='' (404)", () => {
    return request(app.getHttpServer())
      .get("/api/v1/vehicles?userId=''")
      .expect(404);
  });

});
