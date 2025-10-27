import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common'
import { CampaignsService } from './campaigns.service'

@Controller('campaigns')
export class CampaignsController {
  constructor(private campaignsService: CampaignsService) {}

  @Post()
  async create(
    @Body('workspaceId') workspaceId: string,
    @Body() campaignData: any
  ) {
    const { workspaceId: _, ...data } = campaignData
    return this.campaignsService.create(workspaceId, data)
  }

  @Get()
  async findAll(
    @Query('workspaceId') workspaceId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.campaignsService.findAll(
      workspaceId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50
    )
  }

  @Get(':id')
  async findOne(
    @Query('workspaceId') workspaceId: string,
    @Param('id') id: string
  ) {
    return this.campaignsService.findOne(workspaceId, id)
  }

  @Get(':id/stats')
  async getStats(
    @Query('workspaceId') workspaceId: string,
    @Param('id') id: string
  ) {
    return this.campaignsService.getStats(workspaceId, id)
  }

  @Put(':id')
  async update(
    @Query('workspaceId') workspaceId: string,
    @Param('id') id: string,
    @Body() data: any
  ) {
    return this.campaignsService.update(workspaceId, id, data)
  }

  @Delete(':id')
  async delete(
    @Query('workspaceId') workspaceId: string,
    @Param('id') id: string
  ) {
    await this.campaignsService.delete(workspaceId, id)
    return { success: true }
  }

  @Post(':id/schedule')
  async scheduleSend(
    @Query('workspaceId') workspaceId: string,
    @Param('id') id: string,
    @Body('sendAt') sendAt: string
  ) {
    return this.campaignsService.scheduleSend(workspaceId, id, new Date(sendAt))
  }
}
