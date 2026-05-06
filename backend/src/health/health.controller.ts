import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { SkipThrottle } from '@nestjs/throttler';
import { LoggerService } from 'src/common/logger/logger.service';
import { PrismaService } from 'src/common/prisma/prisma.service';

@SkipThrottle()
@Controller('health')
export class HealthController {
  private readonly logger: LoggerService;

  constructor(
    private readonly health: HealthCheckService,
    private readonly prismaHealth: PrismaHealthIndicator,
    private readonly prisma: PrismaService,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = loggerService.setContext(HealthController.name);
  }

  @Get()
  @HealthCheck()
  async check() {
    try {
      return await this.health.check([
        () => this.prismaHealth.pingCheck('database', this.prisma),
      ]);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      this.logger.error('Database health check failed', err.stack);
      throw error;
    }
  }
}
