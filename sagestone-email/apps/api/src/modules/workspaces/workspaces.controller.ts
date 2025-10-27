import { Controller, Get, Query } from '@nestjs/common'
import { WorkspacesService } from './workspaces.service'

@Controller('workspaces')
export class WorkspacesController {
  constructor(private svc: WorkspacesService) {}

  @Get()
  async byUser(@Query('userId') userId: string) {
    if (!userId) return []
    const rows = await this.svc.listByUser(userId)
    return rows.map((m) => m.workspace)
  }
}
