import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as process from 'process';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder().setTitle('API').setVersion('1.0').addTag('crypto').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('schemas', app, document);
  app.enableCors({
    origin: 'domain.com',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT);
}

bootstrap();
