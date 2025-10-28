import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CampaignsService {
  constructor(private prisma: PrismaService) {}

  list(userId?: string) {
    return this.prisma.campaign.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  get(id: string) {
    return this.prisma.campaign.findUnique({ where: { id } });
  }

  create(data: {
    userId: string;
    name: string;
    subject: string;
    fromName: string;
    fromEmail: string;
    preheader?: string;
    htmlContent?: string;
    mjmlContent?: string;
    jsonContent?: string;
  }) {
    return this.prisma.campaign.create({ data });
  }

  update(id: string, data: Record<string, any>) {
    return this.prisma.campaign.update({ where: { id }, data });
  }

  delete(id: string) {
    return this.prisma.campaign.delete({ where: { id } });
  }
}
 
