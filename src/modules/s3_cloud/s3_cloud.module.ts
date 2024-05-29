import { Module } from '@nestjs/common';
import { S3CloudService } from '@/modules/s3_cloud/s3_cloud.service';
import { S3CloudController } from '@/modules/s3_cloud/s3_cloud.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [S3CloudController],
  providers: [S3CloudService],
  exports: [S3CloudService],
})
export class S3CloudModule {}
