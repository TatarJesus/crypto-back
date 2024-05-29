import { Module } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { UserController } from '@/modules/user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from '@/modules/auth/strategies/jwt.strategy';
import { Secret } from '@/modules/secret/entities/secret.entity';
import { UserNotification } from '@/modules/user_notifications/entities/user_notification.entity';
import { UserDeposits3Commas } from '@/modules/user_deposits_3commas/entities/user_deposits_3commas.entity';
import { UserDeposits3CommasModule } from '@/modules/user_deposits_3commas/user_deposits_3commas.module';

@Module({
  imports: [
    UserDeposits3CommasModule,
    TypeOrmModule.forFeature([User, Secret, UserDeposits3Commas, UserNotification]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: configService.get('LIFETIME_ACCESS_TOKEN') },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
