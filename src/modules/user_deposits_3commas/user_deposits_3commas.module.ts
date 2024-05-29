import { Module } from '@nestjs/common';
import { UserDeposits3CommasService } from '@/modules/user_deposits_3commas/user_deposits_3commas.service';
import { UserDeposits3CommasController } from '@/modules/user_deposits_3commas/user_deposits_3commas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { UserDeposits3Commas } from '@/modules/user_deposits_3commas/entities/user_deposits_3commas.entity';
import { UserNotification } from '@/modules/user_notifications/entities/user_notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserDeposits3Commas, UserNotification])],
  controllers: [UserDeposits3CommasController],
  providers: [UserDeposits3CommasService],
  exports: [UserDeposits3CommasService],
})
export class UserDeposits3CommasModule {}
