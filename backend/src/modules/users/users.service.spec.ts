import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from 'src/infra/cache/cache.service';
import { CloudinaryService } from 'src/infra/cloudinary/cloudinary.service';
import { LoggerService } from 'src/infra/logger/logger.service';
import { PrismaService } from 'src/infra/prisma/prisma.service';

import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: PrismaService, useValue: {} },
        { provide: CacheService, useValue: {} },
        { provide: CloudinaryService, useValue: {} },
        { provide: LoggerService, useValue: { setContext: () => ({}) } },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
