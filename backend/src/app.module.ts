import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { BullModule } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  appConfig,
  cloudinaryConfig,
  dbConfig,
  jwtConfig,
  mailConfig,
  redisConfig,
  validationSchema,
} from './config/env.validation';
import { AppCacheModule } from './infra/cache/cache.module';
import { CacheService } from './infra/cache/cache.service';
import { CloudinaryModule } from './infra/cloudinary/cloudinary.module';
import { LoggerModule } from './infra/logger/logger.module';
import { MailModule } from './infra/mail/mail.module';
import { PrismaModule } from './infra/prisma/prisma.module';
import { RedisModule } from './infra/redis/redis.module';
import { AuthModule } from './modules/auth/auth.module';
import { BlacklistModule } from './modules/auth/blacklist/blacklist.module';
import { BlacklistService } from './modules/auth/blacklist/blacklist.service';
import { HashModule } from './modules/auth/security/password.module';
import { HealthModule } from './modules/health/health.module';
import { OtpService } from './modules/otp/otp.service';
import { UsersModule } from './modules/users/users.module';
import { HttpLoggerMiddleware } from './shared/middleware/http-logger.middleware';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'global',
          ttl: 60000,
          limit: 100,
        },
      ],
      storage: new ThrottlerStorageRedisService({
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
      }),
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
        password: process.env.REDIS_PASSWORD,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema,
      validationOptions: {
        abortEarly: true,
      },
      load: [
        appConfig,
        dbConfig,
        jwtConfig,
        redisConfig,
        cloudinaryConfig,
        mailConfig,
      ],
    }),
    PrismaModule,
    HashModule,
    UsersModule,
    LoggerModule,
    HealthModule,
    AuthModule,
    MailModule,
    RedisModule,
    BlacklistModule,
    AppCacheModule,
    CloudinaryModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
    OtpService,
    BlacklistService,
    CacheService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
