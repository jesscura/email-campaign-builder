import { Injectable } from '@nestjs/common';

@Injectable()
export class AnalyticsService {
  getDashboard() {
    return { 
      totalCampaigns: 0,
      totalSent: 0,
      openRate: 0,
      clickRate: 0,
    };
  }

  getCampaignAnalytics(id: string) {
    return { id, analytics: {} };
  }

  getForecast(id: string) {
    return { id, forecast: {} };
  }
}
