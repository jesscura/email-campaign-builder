import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AudiencesService } from './audiences.service';

@Controller()
export class AudiencesController {
  constructor(private service: AudiencesService) {}

  @Get('audiences')
  listAudiences(@Query('userId') userId?: string) {
    return this.service.listAudiences(userId);
  }

  @Post('audiences')
  createAudience(@Body() body: { userId: string; name: string; description?: string }) {
    return this.service.createAudience(body);
  }

  @Get('audiences/:id/subscribers')
  listSubscribers(@Param('id') id: string) {
    return this.service.listSubscribers(id);
  }

  @Post('audiences/:id/subscribers')
  addSubscriber(
    @Param('id') id: string,
    @Body() body: { email: string; firstName?: string; lastName?: string },
  ) {
    return this.service.addSubscriber(id, body);
  }
}
