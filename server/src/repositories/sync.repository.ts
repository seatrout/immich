import { Injectable } from '@nestjs/common';
import { Insertable, Kysely } from 'kysely';
import { InjectKysely } from 'nestjs-kysely';
import { columns, whereCheckpoint } from 'src/database';
import { DB, SessionSyncCheckpoints } from 'src/db';
import { SyncUpsertCheckpoint } from 'src/types';

@Injectable()
export class SyncRepository {
  constructor(@InjectKysely() private db: Kysely<DB>) {}

  upsertCheckpoints(items: Insertable<SessionSyncCheckpoints>[]) {
    return this.db
      .insertInto('session_sync_checkpoints')
      .values(items)
      .onConflict((oc) =>
        oc.columns(['sessionId', 'type']).doUpdateSet((eb) => ({
          ack: eb.ref('excluded.ack'),
        })),
      )
      .execute();
  }

  getUserUpserts(checkpoint?: SyncUpsertCheckpoint) {
    return this.db
      .selectFrom('users')
      .select(columns.syncUser)
      .select(columns.epoch('updatedAt'))
      .$call((qb) => whereCheckpoint(qb, checkpoint))
      .orderBy(['users.updatedAt asc', 'users.id asc'])
      .stream();
  }
}
