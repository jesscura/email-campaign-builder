import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma.service'

@Injectable()
export class WorkspacesService {
  constructor(private prisma: PrismaService) {}

  listByUser(userId: string) {
    return this.prisma.workspaceMember.findMany({
      where: { userId },
      include: { workspace: true }
    })
  }
}
