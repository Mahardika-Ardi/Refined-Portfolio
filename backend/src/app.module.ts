import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerStorageRedisService } from '@nest-lab/throttler-storage-redis';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { HashModule } from './common/hash/hash.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './common/logger/logger.module';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './common/mail/mail.module';
import { OtpService } from './common/otp/otp.service';
import { RedisModule } from './common/redis/redis.module';
import { BlacklistService } from './common/blacklist/blacklist.service';
import { BlacklistModule } from './common/blacklist/blacklist.module';
import { CacheService } from './common/cache/cache.service';
import { AppCacheModule } from './common/cache/cache.module';
import { APP_GUARD } from '@nestjs/core';
import { HttpLoggerMiddleware } from './common/middleware/http-logger.middleware';
import { BullModule } from '@nestjs/bullmq';

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
      }),
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
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
