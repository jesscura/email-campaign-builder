import { Injectable } from '@nestjs/common';

@Injectable()
export class AudienceService {
  findAll() {
    return { audiences: [] };
  }

  getSegments() {
    return { segments: [] };
  }

  createSegment(data: any) {
    return { success: true, data };
  }
}
