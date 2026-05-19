import 'dotenv/config';

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { LoggerService } from './infra/logger/logger.service';
import { GlobalExceptionFilter } from './shared/filters/http-exception.filter';
import { ResponseInterceptor } from './shared/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Refined Portfolio API')
    .setDescription(
      'Dokumentasi API untuk autentikasi, manajemen user, dan health check.',
    )
    .setVersion('1.0.0')
    .addCookieAuth('access_token', {
      type: 'apiKey',
      in: 'cookie',
      name: 'access_token',
      description: 'JWT access token yang disimpan pada cookie httpOnly',
    })
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: 'none',
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credential: true,
  });
  app.use(helmet());
  app.use(cookieParser());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter(app.get(LoggerService)));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const logger = app.get(LoggerService);
  app.useLogger(logger);
  const PORT = Number(process.env.PORT);

  await app.listen(PORT ?? 3000);
  logger.log(`Application started on port ${PORT}`, { context: 'Bootstrap' });
  logger.log('Swagger docs available at /docs', { context: 'Bootstrap' });
}
bootstrap(); // TODO update some of theese to production level
