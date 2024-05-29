import { Module } from '@nestjs/common';
import { UserNotificationsService } from '@/modules/user_notifications/user_notifications.service';
import { UserNotificationsController } from '@/modules/user_notifications/user_notifications.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { UserNotification } from '@/modules/user_notifications/entities/user_notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserNotification])],
  controllers: [UserNotificationsController],
  providers: [UserNotificationsService],
  exports: [UserNotificationsService],
})
export class UserNotificationsModule {}
