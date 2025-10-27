import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { IntegrationsService } from './integrations.service';

@ApiTags('integrations')
@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly integrationsService: IntegrationsService) {}

  @Get()
  @ApiOperation({ summary: 'Get available integrations' })
  getIntegrations() {
    return this.integrationsService.getIntegrations();
  }

  @Post('connect')
  @ApiOperation({ summary: 'Connect integration' })
  connectIntegration(@Body() data: any) {
    return this.integrationsService.connectIntegration(data);
  }
}
