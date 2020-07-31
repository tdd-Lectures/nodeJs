import { Controller, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { GatewayError, Vehicle, VehicleServices } from '../services';

@Controller('api/v1/vehicles')
export class VehiclesController {
  constructor(private readonly services: VehicleServices) {}

  @Get(':userId')
  getVehicles(@Param('userId') userId: string): Vehicle[] {

    if (userId != null && userId != '') {
      try {
        return this.services.getVehicles(userId);
      } catch (e) {
        if (e instanceof GatewayError)
          throw new HttpException('unable to get vehicles', HttpStatus.FAILED_DEPENDENCY);

        throw e;
      }
    }

    throw new HttpException('missing user', HttpStatus.BAD_REQUEST);
  }
}
