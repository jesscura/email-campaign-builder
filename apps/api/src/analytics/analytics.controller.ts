import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get analytics dashboard' })
  getDashboard() {
    return this.analyticsService.getDashboard();
  }

  @Get('campaign/:id')
  @ApiOperation({ summary: 'Get campaign analytics' })
  getCampaignAnalytics(@Param('id') id: string) {
    return this.analyticsService.getCampaignAnalytics(id);
  }

  @Get('forecast/:id')
  @ApiOperation({ summary: 'Get campaign forecasts' })
  getForecast(@Param('id') id: string) {
    return this.analyticsService.getForecast(id);
  }
}
