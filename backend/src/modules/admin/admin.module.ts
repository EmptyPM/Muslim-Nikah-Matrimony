import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { PublicPackagesController } from './admin.controller';
import { PaymentModule } from '../payment/payment.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({
  imports: [PaymentModule, ActivityLogModule],
  controllers: [AdminController, PublicPackagesController],
  providers: [AdminService],
})
export class AdminModule {}
