export interface ProcessedAgentDataBase {
  roadState: string;
  x: number;
  y: number;
  z: number;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface ProcessedAgentData extends ProcessedAgentDataBase {
  id: number;
}

export class StoreApiClient {
  constructor(private readonly host: string) {}

  public async createBatch(data: ProcessedAgentDataBase[]) {
    const res = await fetch(`${this.host}/processed-agent-data/batch`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ batch: data }),
    });

    return res.json().then((value) => value as { data: ProcessedAgentData[] });
  }
}
