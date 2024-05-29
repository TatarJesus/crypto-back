import { Module } from '@nestjs/common';
import { EmailActionsController } from '@/modules/email/email.controller';
import { EmailService } from '@/modules/email/email.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { Secret } from '@/modules/secret/entities/secret.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Secret])],
  controllers: [EmailActionsController],
  providers: [EmailService],
})
export class EmailActionsModule {}
