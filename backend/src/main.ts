import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LoggerService } from './common/logger/logger.service';
import { GlobalExceptionFilter } from './common/filter/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/respons.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

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
}
bootstrap();
