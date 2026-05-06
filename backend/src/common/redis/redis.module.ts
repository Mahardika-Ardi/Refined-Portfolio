import { Global, Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      useFactory: () => ({
        stores: [
          new KeyvRedis(
            `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
          ),
        ],
        ttl: 0,
      }),
      isGlobal: true,
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
