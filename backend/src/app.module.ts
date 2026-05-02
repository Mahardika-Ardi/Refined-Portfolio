import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './common/prisma/prisma.module';
import { HashModule } from './common/hash/hash.module';
import { UsersModule } from './users/users.module';
import { LoggerModule } from './common/logger/logger.module';
import { HttpLoggerMiddleware } from './common/logger/http-logger.middleware';
import { HealthModule } from './health/health.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    PrismaModule,
    HashModule,
    UsersModule,
    LoggerModule,
    HealthModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
