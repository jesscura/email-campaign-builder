import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CampaignsModule } from './campaigns/campaigns.module';
import { AudienceModule } from './audience/audience.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { AutomationModule } from './automation/automation.module';
import { IntegrationsModule } from './integrations/integrations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    CampaignsModule,
    AudienceModule,
    AnalyticsModule,
    AutomationModule,
    IntegrationsModule,
  ],
})
export class AppModule {}
