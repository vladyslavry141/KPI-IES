import { Accelerometer } from "./Accelerometer";
import { Gps } from "./Gps";

export interface AggregatedData {
  accelerometer: Accelerometer;
  gps: Gps;
  timestamp: Date;
}
