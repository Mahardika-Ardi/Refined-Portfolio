import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService {
  private readonly redis: Redis;

  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || 'localhost',
      port: Number(process.env.REDIS_PORT) || 6379,
      password: process.env.REDIS_PASSWORD,
    });
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.cache.get<T>(key);
    return data ?? null;
  }

  async set(key: string, value: unknown, ttl: number): Promise<void> {
    await this.cache.set(key, value, ttl * 1000);
  }

  async del(key: string): Promise<void> {
    await this.cache.del(key);
  }

  async delByPattern(pattern: string): Promise<void> {
    const key = await this.redis.keys(`*${pattern}`);
    if (key.length === 0) return;
    await Promise.all(key.map((key) => this.cache.del(key)));
  }
}
