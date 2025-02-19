import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsPositive } from 'class-validator';
import { AssetResponseDto } from 'src/dtos/asset-response.dto';
import { SyncResponseType } from 'src/enum';
import { ValidateDate, ValidateUUID } from 'src/validation';

export class AssetFullSyncDto {
  @ValidateUUID({ optional: true })
  lastId?: string;

  @ValidateDate()
  updatedUntil!: Date;

  @IsInt()
  @IsPositive()
  @ApiProperty({ type: 'integer' })
  limit!: number;

  @ValidateUUID({ optional: true })
  userId?: string;
}

export class AssetDeltaSyncDto {
  @ValidateDate()
  updatedAfter!: Date;

  @ValidateUUID({ each: true })
  userIds!: string[];
}

export class AssetDeltaSyncResponseDto {
  needsFullSync!: boolean;
  upserted!: AssetResponseDto[];
  deleted!: string[];
}

export class SyncUserV1 {
  id!: string;
  name!: string;
  email!: string;
  deletedAt!: Date | null;
}

const responseDtos = [
  //
  SyncUserV1,
];

export const extraSyncModels = responseDtos;

export class SyncStreamDto {
  @IsEnum(SyncResponseType, { each: true })
  @ApiProperty({ enum: SyncResponseType, isArray: true })
  types!: SyncResponseType[];
}
