import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { UserNotificationsService } from '@/modules/user_notifications/user_notifications.service';
import { Throttle } from '@nestjs/throttler';
import { IN_1S_5REQUEST } from '@/const/throttle';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ReqUser } from '@/types/request';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('notifications')
@Controller('notifications')
export class UserNotificationsController {
  constructor(private readonly userNotificationsService: UserNotificationsService) {}

  @ApiOperation({ summary: 'Получение всех уведомлений (JWT)' })
  @Throttle(IN_1S_5REQUEST)
  @UseGuards(JwtAuthGuard)
  @Get()
  findAllNotificationsForUser(@Req() req: Request & ReqUser) {
    return this.userNotificationsService.findAllNotificationsForUser(req.user.id);
  }

  @ApiOperation({ summary: 'Прочтение всех уведомлений (JWT)' })
  @Throttle(IN_1S_5REQUEST)
  @UseGuards(JwtAuthGuard)
  @Patch('read')
  readAllNotificationsForUser(@Req() req: Request & ReqUser) {
    return this.userNotificationsService.readAllNotificationsForUser(req.user.id);
  }
}
