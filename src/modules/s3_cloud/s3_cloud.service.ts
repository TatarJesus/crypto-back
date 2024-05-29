import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3CloudService {
  private readonly bucketName: string;
  private readonly s3: S3;

  constructor(private readonly configService: ConfigService) {
    this.bucketName = this.configService.get('AWS_S3_BUCKET');

    const s3Config: S3.ClientConfiguration = {
      credentials: {
        accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
      },
    };

    this.s3 = new S3(s3Config);
  }

  async uploadFile(file: Express.Multer.File) {
    const { originalname } = file;

    return await this.s3_upload(file.buffer, this.bucketName, originalname, file.mimetype);
  }

  async s3_upload(file: any, bucket: string, name: any, mimetype: any) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
      ContentType: mimetype,
    };

    try {
      const uploadResult = await this.s3.upload(params).promise();

      return uploadResult.Key;
    } catch (e) {
      console.log('Error', e);
    }
  }

  async s3GetLink(objectKey: string, expiration = 100) {
    if (!objectKey) return null;

    const object = this.s3.getSignedUrl('getObject', {
      Bucket: this.bucketName,
      Key: objectKey,
      Expires: expiration,
    });
    return object.split('?AWSAccessKeyId')[0];
  }
}
