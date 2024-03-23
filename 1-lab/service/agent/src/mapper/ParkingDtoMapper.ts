import { Parking } from "src/domain/Parking";
import { ParkingDto } from "src/dto/ParkingDto";

export const fromParking = (parking: Parking): ParkingDto => {
  return { gps: parking.gps, empty_count: parking.emptyCount };
};
