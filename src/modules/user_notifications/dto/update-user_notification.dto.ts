import { PartialType } from '@nestjs/mapped-types';
import { CreateUserNotificationDto } from '@/modules/user_notifications/dto/create-user_notification.dto';

export class UpdateUserNotificationDto extends PartialType(CreateUserNotificationDto) {}
