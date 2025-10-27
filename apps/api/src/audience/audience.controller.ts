import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AudienceService } from './audience.service';

@ApiTags('audience')
@Controller('audience')
export class AudienceController {
  constructor(private readonly audienceService: AudienceService) {}

  @Get()
  @ApiOperation({ summary: 'Get all audiences' })
  findAll() {
    return this.audienceService.findAll();
  }

  @Get('segments')
  @ApiOperation({ summary: 'Get all segments' })
  getSegments() {
    return this.audienceService.getSegments();
  }

  @Post('segments')
  @ApiOperation({ summary: 'Create new segment' })
  createSegment(@Body() data: any) {
    return this.audienceService.createSegment(data);
  }
}
