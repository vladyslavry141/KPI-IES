import { AgentDataDto } from "src/dto/AgentDataDto";
import { EdgeDataDto } from "src/dto/EdgeDataDto";

export const processAgentData = (agentData: AgentDataDto): EdgeDataDto => {
  let roadState;

  if (agentData.accelerometer.y < 50) {
    roadState = "pit";
  } else if (agentData.accelerometer.z < 100) {
    roadState = "flat";
  } else {
    roadState = "hill";
  }

  return {
    ...agentData,
    road_state: roadState,
  };
};
