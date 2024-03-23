import { AggregatedData } from "src/domain/AggregatedData";
import { AggregatedDataDto } from "src/dto/AggregatedDataDto";

export const fromAggregatedData = (
  aggregatedData: AggregatedData
): AggregatedDataDto => {
  return {
    ...aggregatedData,
    timestamp: aggregatedData.timestamp.toISOString(),
  };
};
