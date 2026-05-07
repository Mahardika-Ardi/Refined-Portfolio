import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from './common/logger/logger.service';
import { GlobalExceptionFilter } from './common/filter/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/respons.interceptor';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

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

  app.enableCors();
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

  await app.listen(process.env.PORT ?? 4000);
  logger.log('Application started on port 4000', { context: 'Bootstrap' });
  logger.log('Swagger docs available at /docs', { context: 'Bootstrap' });
}
bootstrap();
