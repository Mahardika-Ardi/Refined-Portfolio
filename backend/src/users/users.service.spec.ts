import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CacheService } from 'src/common/cache/cache.service';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';
import { LoggerService } from 'src/common/logger/logger.service';

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
