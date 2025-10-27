import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AutomationService } from './automation.service';

@ApiTags('automation')
@Controller('automation')
export class AutomationController {
  constructor(private readonly automationService: AutomationService) {}

  @Get('workflows')
  @ApiOperation({ summary: 'Get all workflows' })
  getWorkflows() {
    return this.automationService.getWorkflows();
  }

  @Post('workflows')
  @ApiOperation({ summary: 'Create new workflow' })
  createWorkflow(@Body() data: any) {
    return this.automationService.createWorkflow(data);
  }

  @Get('templates')
  @ApiOperation({ summary: 'Get workflow templates' })
  getTemplates() {
    return this.automationService.getTemplates();
  }
}
