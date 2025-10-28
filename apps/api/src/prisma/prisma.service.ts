import { INestApplication, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {

  async enableShutdownHooks(app: INestApplication) {
    // Cast to any to avoid type issues on event name in some Prisma versions
    (this as any).$on('beforeExit', async () => {
      await app.close();
    });
  }
}
