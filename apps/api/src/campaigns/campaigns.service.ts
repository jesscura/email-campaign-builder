import { Injectable } from '@nestjs/common';

@Injectable()
export class CampaignsService {
  findAll() {
    return { campaigns: [] };
  }

  findOne(id: string) {
    return { id, campaign: null };
  }

  create(data: any) {
    return { success: true, data };
  }

  update(id: string, data: any) {
    return { success: true, id, data };
  }

  remove(id: string) {
    return { success: true, id };
  }
}
