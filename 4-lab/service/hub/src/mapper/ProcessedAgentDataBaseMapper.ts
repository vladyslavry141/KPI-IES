import { EdgeDataDto } from "src/dto/EdgeDataDto";
import { ProcessedAgentDataBase } from "src/service/StoreApiClient";

export const fromEdgeDataDto = (
  edgeData: EdgeDataDto
): ProcessedAgentDataBase => {
  return {
    roadState: edgeData.road_state,
    timestamp: edgeData.timestamp,
    ...edgeData.gps,
    ...edgeData.accelerometer,
  };
};
