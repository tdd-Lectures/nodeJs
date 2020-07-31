export class VehicleServices {
  getVehicles(userId: string): Vehicle[] {
    return undefined;
  }
}

export class Vehicle {
  vehicleId: string;
  model: string;
  yearOfConstruction: number;
}

export class GatewayError implements Error {
  message: string;
  name: string;
}
