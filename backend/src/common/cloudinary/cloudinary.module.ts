import { Global, Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { BullModule } from '@nestjs/bullmq';
import { CLOUDINARY_QUEUE } from '../constants/cloudinary-queue.constant';
import { CloudinaryProcessor } from '../processor/cloudinary.processor';

@Global()
@Module({
  imports: [
    BullModule.registerQueue({
      name: CLOUDINARY_QUEUE,
    }),
  ],
  providers: [CloudinaryService, CloudinaryProcessor],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
