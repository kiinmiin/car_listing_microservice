import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionCleanupService } from './subscription-cleanup.service';
import { SubscriptionController } from './subscription.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [SubscriptionService, SubscriptionCleanupService],
  controllers: [SubscriptionController],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}
