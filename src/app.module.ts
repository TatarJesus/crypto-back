import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TokenCheckMiddleware } from '@/common/middleware/token-check.middleware';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '@/modules/user/user.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { EmailActionsModule } from '@/modules/email/email.module';
import { UserNotificationsModule } from '@/modules/user_notifications/user_notifications.module';
import { UserDeposits3CommasModule } from '@/modules/user_deposits_3commas/user_deposits_3commas.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: (configService: ConfigService) => ({
        type: 'mongodb',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        synchronize: false,
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
      }),
      inject: [ConfigService],
    }),

    // Импорт других модулей приложения],
    AuthModule,
    EmailActionsModule,
    UserDeposits3CommasModule,
    UserModule,
    UserNotificationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TokenCheckMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
