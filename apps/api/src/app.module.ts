import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { HealthController } from './health/health.controller';
import { CampaignsController } from './campaigns/campaigns.controller';
import { CampaignsService } from './campaigns/campaigns.service';
import { AudiencesController } from './audiences/audiences.controller';
import { AudiencesService } from './audiences/audiences.service';

@Module({
  imports: [],
  controllers: [HealthController, CampaignsController, AudiencesController],
  providers: [PrismaService, CampaignsService, AudiencesService],
})
export class AppModule {}
