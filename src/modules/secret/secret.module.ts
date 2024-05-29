import { Module } from '@nestjs/common';
import { SecretService } from '@/modules/secret/secret.service';
import { SecretController } from '@/modules/secret/secret.controller';

@Module({
  controllers: [SecretController],
  providers: [SecretService],
})
export class SecretModule {}
