import {
  Controller,
  Post,
  Get,
  Body,
  ValidationPipe,
  UsePipes,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { RegisterUserDto } from '@/modules/user/dto/register-user.dto';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { ReqUser } from '@/types/request';
import { RecoveryPasswordDto } from '@/modules/user/dto/recovery-password.dto';
import { ChangePasswordDto } from '@/modules/user/dto/change-password.dto';
import { Throttle } from '@nestjs/throttler';
import { IN_1S_5REQUEST } from '@/const/throttle';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateUserInfoDto } from '@/modules/user/dto/update-user-info.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Регистрация пользователя' })
  @Throttle(IN_1S_5REQUEST)
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() registerUserDto: RegisterUserDto) {
    return await this.userService.register(registerUserDto);
  }

  @ApiOperation({ summary: 'Получение данных профиля (JWT)' })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getAccount(@Req() req: Request & ReqUser) {
    return this.userService.getAccount(req.user.email);
  }

  @ApiOperation({ summary: 'Обновление данных профиля (JWT)' })
  @UseGuards(JwtAuthGuard)
  @Post('profile/update')
  async updateAccount(@Req() req: Request & ReqUser, @Body() updateUserInfoDto: UpdateUserInfoDto) {
    return this.userService.updateAccount(req.user.id, updateUserInfoDto);
  }

  @ApiOperation({ summary: 'Получение всех депозитов (JWT)' })
  @UseGuards(JwtAuthGuard)
  @Get('deposits')
  async getDeposits(@Req() req: Request & ReqUser) {
    return this.userService.getDeposits(req.user.email);
  }

  @ApiOperation({ summary: 'Установка нового пароля' })
  @Post('recovery-password')
  @UsePipes(new ValidationPipe())
  async recoveryPassword(@Body() recoveryPasswordDto: RecoveryPasswordDto) {
    return this.userService.recoveryPassword(recoveryPasswordDto);
  }

  @ApiOperation({ summary: 'Изменение пароля (JWT)' })
  @Throttle(IN_1S_5REQUEST)
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @UsePipes(new ValidationPipe())
  async changePassword(
    @Req() req: Request & ReqUser,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.userService.changePassword(req, changePasswordDto);
  }
}
