import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { Repository } from 'typeorm';
import { formatUiNotificationDate } from '@/utils/dateFormats';
import { UserNotification } from '@/modules/user_notifications/entities/user_notification.entity';

@Injectable()
export class UserNotificationsService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(UserNotification)
    private readonly userNotificationRepository: Repository<UserNotification>,
  ) {}

  async findAllNotificationsForUser(user_id: number) {
    const user = await this.userRepository.findOne({
      relations: ['notifications'],
      where: {
        id: user_id,
      },
    });

    return user.notifications.map((item) => {
      return {
        ...item,
        created_at: formatUiNotificationDate(item.created_at),
      };
    });
  }

  async readAllNotificationsForUser(user_id: number) {
    const user = await this.userRepository.findOne({
      relations: ['notifications'],
      where: {
        id: user_id,
      },
    });

    const notify = user.notifications.filter((not) => !not.check);

    for (const not of notify) {
      await this.userNotificationRepository.update(not.id, {
        check: true,
      });
    }

    return 'Successful';
  }
}
