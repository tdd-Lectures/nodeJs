import { GatewayError, VehicleServices } from '../services';
import { instance, mock, when } from 'ts-mockito';

export function makeVehicleServices() : VehicleServices {
	const type = mock(VehicleServices);

	when(type.getVehicles('1')).thenReturn([]);

	when(type.getVehicles('gatewayError')).thenThrow(new GatewayError());

	when(type.getVehicles('internalError')).thenThrow(new Error('my stubbed error'));

	when(type.getVehicles('2')).thenReturn([
		{
			vehicleId: 'B2',
			model: 'S1',
			yearOfConstruction: 2015,
		}
	]);

	return instance(type);
}
