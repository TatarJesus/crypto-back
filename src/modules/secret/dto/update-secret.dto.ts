import { PartialType } from '@nestjs/mapped-types';
import { CreateSecretDto } from '@/modules/secret/dto/create-secret.dto';

export class UpdateSecretDto extends PartialType(CreateSecretDto) {}
