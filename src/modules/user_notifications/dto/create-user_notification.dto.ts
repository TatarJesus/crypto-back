import { IsNotEmpty, IsString } from 'class-validator';
import { NotificationsForUser } from '@/types/notifications';

export class CreateUserNotificationDto {
  user_id: number;

  type: NotificationsForUser;

  @IsNotEmpty()
  @IsString()
  description: string;
}
