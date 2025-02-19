import { SyncResponseType } from 'src/enum';

export const mapJsonLine = (item: unknown) => JSON.stringify(item) + '\n';

// UserV1|9da1baf4-17b7-4112-96d9-a5165f260b93|1717588938.021021
export const fromAck = (ack: string) => {
  const [type, timestamp, ...ids] = ack.split('|');
  return { type: type as SyncResponseType, timestamp, ids, raw: ack };
};

export const toAck = ({ type, timestamp, ids }: { type: SyncResponseType; timestamp: string; ids: string[] }) =>
  [type, timestamp, ...ids].join('|');
