import { Accelerometer } from "./Accelerometer";
import { Gps } from "./Gps";

export interface AgentData {
  accelerometer: Accelerometer;
  gps: Gps;
  timestamp: Date;
}
