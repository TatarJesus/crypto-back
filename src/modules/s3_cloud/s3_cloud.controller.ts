import { Controller } from '@nestjs/common';
import { S3CloudService } from '@/modules/s3_cloud/s3_cloud.service';

@Controller('s3-cloud')
export class S3CloudController {
  constructor(private readonly s3CloudService: S3CloudService) {}
}
