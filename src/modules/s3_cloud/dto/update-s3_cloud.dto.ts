import { PartialType } from '@nestjs/mapped-types';
import { CreateS3CloudDto } from '@/modules/s3_cloud/dto/create-s3_cloud.dto';

export class UpdateS3CloudDto extends PartialType(CreateS3CloudDto) {}
