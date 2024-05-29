import { IsNotEmpty, IsString } from 'class-validator';
import { NotificationsForUser } from '@/types/notifications';

export class SendNotificationsDto {
  type: NotificationsForUser;

  @IsNotEmpty()
  @IsString()
  description: string;
}
