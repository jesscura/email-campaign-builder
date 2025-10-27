import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common'
import { ContactsService } from './contacts.service'

@Controller('contacts')
export class ContactsController {
  constructor(private contactsService: ContactsService) {}

  @Post()
  async create(
    @Body('workspaceId') workspaceId: string,
    @Body() contactData: any
  ) {
    const { workspaceId: _, ...data } = contactData
    return this.contactsService.create(workspaceId, data)
  }

  @Get()
  async findAll(
    @Query('workspaceId') workspaceId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    return this.contactsService.findAll(
      workspaceId,
      page ? parseInt(page) : 1,
      limit ? parseInt(limit) : 50
    )
  }

  @Get('stats')
  async getStats(@Query('workspaceId') workspaceId: string) {
    return this.contactsService.getStats(workspaceId)
  }

  @Get(':id')
  async findOne(
    @Query('workspaceId') workspaceId: string,
    @Param('id') id: string
  ) {
    return this.contactsService.findOne(workspaceId, id)
  }

  @Put(':id')
  async update(
    @Query('workspaceId') workspaceId: string,
    @Param('id') id: string,
    @Body() data: any
  ) {
    return this.contactsService.update(workspaceId, id, data)
  }

  @Delete(':id')
  async delete(
    @Query('workspaceId') workspaceId: string,
    @Param('id') id: string
  ) {
    await this.contactsService.delete(workspaceId, id)
    return { success: true }
  }

  @Post('import')
  async bulkImport(
    @Body('workspaceId') workspaceId: string,
    @Body('contacts') contacts: Array<{ email: string; [key: string]: any }>
  ) {
    return this.contactsService.bulkImport(workspaceId, contacts)
  }
}
