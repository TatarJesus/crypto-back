import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Req,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { IN_1S_5REQUEST } from '@/const/throttle';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { Request } from 'express';
import { ReqUser } from '@/types/request';
import { UserDeposits3CommasService } from '@/modules/user_deposits_3commas/user_deposits_3commas.service';
import { CreateUserDeposits3CommasDto } from '@/modules/user_deposits_3commas/dto/create-user_deposits_3commas.dto';

@ApiTags('user_deposits_3commas')
@Controller('user_deposits_3commas')
export class UserDeposits3CommasController {
  constructor(private readonly userDeposits3CommasService: UserDeposits3CommasService) {}

  @ApiOperation({ summary: 'Создание депозитов (JWT)' })
  @Throttle(IN_1S_5REQUEST)
  @UseGuards(JwtAuthGuard)
  @Post('create')
  @UsePipes(new ValidationPipe())
  async createDeposit(
    @Body() createUserDeposits3CommasDto: CreateUserDeposits3CommasDto,
    @Req() req: Request & ReqUser,
  ) {
    return await this.userDeposits3CommasService.createDeposit(
      createUserDeposits3CommasDto,
      req.user.id,
    );
  }

  @ApiOperation({ summary: 'Получение определенного депозита (JWT)' })
  @Throttle(IN_1S_5REQUEST)
  @UseGuards(JwtAuthGuard)
  @Get('definite/:deposit_id')
  @UsePipes(new ValidationPipe())
  async getAccountsForUserByDeposit(@Param('deposit_id') deposit_id: string) {
    return await this.userDeposits3CommasService.getAccountsForUserByDeposit(+deposit_id);
  }
}
