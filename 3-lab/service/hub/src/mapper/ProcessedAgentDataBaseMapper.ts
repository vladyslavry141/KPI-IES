import { AgentDataDto } from "src/dto/AgentDataDto";
import { ProcessedAgentDataBase } from "src/service/StoreApiClient";

export const fromAgentDataDto = (
  agentData: AgentDataDto,
  roadState: string
): ProcessedAgentDataBase => {
  return {
    roadState,
    timestamp: agentData.timestamp,
    ...agentData.gps,
    ...agentData.accelerometer,
  };
};
