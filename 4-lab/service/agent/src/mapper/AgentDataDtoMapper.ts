import { AgentData } from "src/domain/AgentData";
import { AgentDataDto } from "src/dto/AgentDataDto";

export const fromAgentData = (agentData: AgentData): AgentDataDto => {
  return {
    ...agentData,
    timestamp: agentData.timestamp.toISOString(),
  };
};
