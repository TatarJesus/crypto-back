import { Controller, UseGuards, Post, Get, Req } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { LocalAuthGuard } from '@/modules/auth/guards/local-auth.guard';
import { RefreshJwtAuthGuard } from '@/modules/auth/guards/refresh-jwt-auth.guard';
import { ReqUser } from '@/types/request';
import { Request } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Авторизация пользователя' })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() req: Request & ReqUser) {
    return await this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Обновление refresh-токена' })
  @UseGuards(RefreshJwtAuthGuard)
  @Get('refresh')
  async refreshToken(@Req() req: Request & ReqUser) {
    return await this.authService.refreshToken(req.user, req.headers.authorization);
  }
}
