import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AudiencesService {
  constructor(private prisma: PrismaService) {}

  listAudiences(userId?: string) {
    return this.prisma.audience.findMany({
      where: userId ? { userId } : undefined,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }

  createAudience(data: { userId: string; name: string; description?: string }) {
    return this.prisma.audience.create({ data });
  }

  listSubscribers(audienceId: string) {
    return this.prisma.subscriber.findMany({
      where: { audienceId },
      orderBy: { createdAt: 'desc' },
      take: 250,
    });
  }

  addSubscriber(audienceId: string, data: { email: string; firstName?: string; lastName?: string }) {
    return this.prisma.subscriber.create({
      data: { audienceId, ...data },
    });
  }
}
