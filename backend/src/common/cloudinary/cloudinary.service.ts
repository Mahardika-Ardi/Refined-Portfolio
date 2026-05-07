import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';
import { InjectQueue } from '@nestjs/bullmq';
import {
  CLOUDINARY_JOBS,
  CLOUDINARY_QUEUE,
} from '../constants/cloudinary-queue.constant';
import { Queue, QueueEvents } from 'bullmq';
import { CloudinaryUploadResult } from '../processor/cloudinary.processor';

@Injectable()
export class CloudinaryService {
  private readonly logger: LoggerService;
  private readonly queueEvents: QueueEvents;

  constructor(
    @InjectQueue(CLOUDINARY_QUEUE) private readonly cloudinaryQueue: Queue,
    private readonly loggerService: LoggerService,
  ) {
    this.logger = loggerService.setContext(CloudinaryService.name);
    this.queueEvents = new QueueEvents(CLOUDINARY_QUEUE, {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: Number(process.env.REDIS_PORT) || 6379,
      },
    });
  }

  async queueUpload(
    file: Express.Multer.File,
  ): Promise<CloudinaryUploadResult> {
    this.logger.debug('Queuing upload job');

    const job = await this.cloudinaryQueue.add(
      CLOUDINARY_JOBS.UPLOAD,
      {
        file: {
          ...file,
          buffer: file.buffer.toString('base64'),
          mimetype: file.mimetype,
          originalname: file.originalname,
        },
      },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    const result = (await job.waitUntilFinished(
      this.queueEvents,
    )) as CloudinaryUploadResult;

    return result;
  }

  async queueDelete(publicId: string): Promise<void> {
    this.logger.debug('Queuing delete job', { publicId });

    await this.cloudinaryQueue.add(
      CLOUDINARY_JOBS.DELETE,
      { publicId },
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      },
    );

    this.logger.debug('Delete job queued', { publicId });
  }
}
