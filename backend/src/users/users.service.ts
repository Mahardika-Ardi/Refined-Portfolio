import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { LoggerService } from 'src/common/logger/logger.service';
import { userAdminSelect, userMeSelect } from './user-select';
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from 'src/common/config/cloudinary.config';
import { CacheService } from 'src/common/cache/cache.service';
import { CACHE_KEYS } from 'src/common/constants/cache-keys.constant';

const CACHE_TTL = 60 * 5;

@Injectable()
export class UsersService {
  private logger: LoggerService;

  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = loggerService.setContext(UsersService.name);
  }

  async findAll() {
    this.logger.log('Fetching all users');

    const cached = await this.cache.get(CACHE_KEYS.ALL_USERS);
    if (cached) {
      this.logger.debug('Users served from cache');
      return cached;
    }

    const user = await this.prisma.user.findMany({ select: userAdminSelect });

    if (!user) {
      this.logger.warn('Failed fetching users');
    }

    await this.cache.set(CACHE_KEYS.ALL_USERS, user, CACHE_TTL);

    this.logger.log('Users fetched from DB and cached', { count: user.length });

    return user;
  }

  async findOne(id: string) {
    this.logger.log('Fetching user');

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userMeSelect,
    });

    if (!user) {
      this.logger.warn('Failed fetching user', { userId: id });
    }

    this.logger.log('User fetched', { userId: id });

    return user;
  }

  async update(id: string, dto: UpdateUserDto, file?: Express.Multer.File) {
    this.logger.log('Updating user', { userId: id });

    let oldPublicId: string | null = null;

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { avatarPublicId: true },
    });

    oldPublicId = user?.avatarPublicId ?? null;

    if (file) {
      this.logger.debug('Uploading avatar to Cloudinary', { userId: id });

      const uploadResult = await uploadToCloudinary(file);

      dto.avatarUrl = uploadResult.url;
      dto.avatarPublicId = uploadResult.public_id;

      this.logger.debug('Avatar uploaded', {
        userId: id,
        publicId: uploadResult.public_id,
      });
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dto,
      select: userMeSelect,
    });

    if (file && oldPublicId) {
      this.logger.debug('Deleting old avatar from Cloudinary', {
        userId: id,
        oldPublicId,
      });

      await deleteFromCloudinary(oldPublicId);
    }

    await this.cache.del(CACHE_KEYS.ALL_USERS);

    this.logger.debug('Cache invalidated after user updated', { userId: id });
    this.logger.log('User updated', {
      userId: id,
      hasNewAvatar: !!file,
    });

    return updatedUser;
  }

  async remove(id: string) {
    this.logger.log('Deleting user', { userId: id });
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, avatarPublicId: true },
    });

    if (user?.avatarPublicId) {
      this.logger.debug('Deleting avatar from cloudinary', {
        userId: id,
        publicId: user.avatarPublicId,
      });

      await deleteFromCloudinary(user.avatarPublicId);
    }

    await this.prisma.user.delete({ where: { id } });

    await this.cache.del(CACHE_KEYS.ALL_USERS);
    this.logger.debug('Cache invalidated after user deleted', { userId: id });
    this.logger.log('User deleted', { userId: id });

    return 'User deleted';
  }
}
