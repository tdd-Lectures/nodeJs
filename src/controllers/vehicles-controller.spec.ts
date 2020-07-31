import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesController } from '.';
import { appModuleMetadata } from '../app.module';
import { HttpException, HttpStatus } from '@nestjs/common';
import { VehicleServices } from '../services';
import { makeVehicleServices } from './vehicle-services-mock';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule(appModuleMetadata)
      .overrideProvider(VehicleServices)
      .useValue(makeVehicleServices())
      .compile();
  });

  function makeController(): VehiclesController {
    return app.get<VehiclesController>(VehiclesController);
  }

  [null, undefined, '', (0 as unknown) as string].forEach(value => {
    it('throws BAD REQUEST when userid is ' + value, () => {
      const controller = makeController();

      try {
        controller.getVehicles(value);
        fail('should throw exception.');
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
        expect((e as HttpException).getStatus()).toBe(HttpStatus.BAD_REQUEST);
        expect((e as HttpException).message).toBe('missing user');
      }
    });
  });

  it('throws FAILED DEPENDENCY when service throws GatewayError', () => {
    const controller = makeController();

    try {
      controller.getVehicles('gatewayError');
      fail('should throw exception.');
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException);
      expect((e as HttpException).getStatus()).toBe(HttpStatus.FAILED_DEPENDENCY);
      expect((e as HttpException).message).toBe('unable to get vehicles');
    }
  });

  it('throws Error when service throws Error', () => {
    const controller = makeController();

    expect(() => controller.getVehicles('internalError'))
      .toThrow(new Error('my stubbed error'));
  });

  it('returns empty list when user doesnt have vehicles', () => {
    const controller = makeController();

    const vehicles = controller.getVehicles('1');

    expect(vehicles).toEqual([]);
  });

  it('returns list of vehicles for the given user', () => {
    const controller = makeController();

    const vehicles = controller.getVehicles('2');

    expect(vehicles).toEqual([
      {
        vehicleId: 'B2',
        model: 'S1',
        yearOfConstruction: 2015,
      }
    ]);
  });

});
