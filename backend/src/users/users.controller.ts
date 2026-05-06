import {
  Controller,
  Get,
  UseGuards,
  Body,
  Patch,
  Delete,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Role } from 'src/common/decorators/role.decorator';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/common/config/multer.config';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role('ADMIN')
  @Get('findall')
  findAll() {
    const data = this.usersService.findAll();
    return {
      message: 'Successfully fetching all users',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findOne(@CurrentUser('id') id: string) {
    console.error();

    const data = await this.usersService.findOne(id);
    return {
      message: 'Succesfully getting user',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async update(
    @CurrentUser('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const data = await this.usersService.update(id, updateUserDto, file);
    return {
      message: 'Successfully updating user',
      data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('me')
  async remove(@CurrentUser('id') id: string) {
    const data = await this.usersService.remove(id);
    return { message: data };
  }
}
