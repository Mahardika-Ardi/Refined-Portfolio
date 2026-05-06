import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import type { Cache } from 'cache-manager';

@Injectable()
export class BlacklistService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async blacklist(token: string, ttl: number): Promise<void> {
    await this.cache.set(`blacklist:${token}`, true, ttl * 1000);
  }

  async isBlacklist(token: string): Promise<boolean> {
    const result = await this.cache.get(`blacklist:${token}`);
    return result != null && result != undefined;
  }
}
