import { RedisClientType } from "@redis/client";
import { AgentDataDto } from "src/dto/AgentDataDto";

export class AgentDataRedisStore {
  constructor(
    private readonly client: RedisClientType,
    private readonly key: string
  ) {}

  public async add(agentData: AgentDataDto) {
    await this.client.rPush(this.key, JSON.stringify(agentData));
  }

  public async count() {
    return await this.client.lLen(this.key);
  }

  public async popMany(count: number) {
    return await this.client
      .lPopCount(this.key, count)
      .then((dataArr) =>
        (dataArr ?? []).map((data) => JSON.parse(data) as AgentDataDto)
      );
  }
}
