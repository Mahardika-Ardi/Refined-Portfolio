import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Endpoint root aplikasi' })
  @ApiResponse({ status: 200, description: 'Pesan hello dari aplikasi' })
  getHello(): string {
    return this.appService.getHello();
  }
}
