import { AgentData } from "src/domain/AgentData";
import { AgentDataDto } from "src/dto/AgentDataDto";

export const fromAgentData = (aggregatedData: AgentData): AgentDataDto => {
  return {
    ...aggregatedData,
    timestamp: aggregatedData.timestamp.toISOString(),
  };
};
