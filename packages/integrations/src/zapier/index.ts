import type { Integration } from '../types';

export class ZapierIntegration implements Integration {
  id = 'zapier';
  name = 'Zapier';

  async connect(credentials: any) {
    // Zapier OAuth flow
    return { success: true };
  }

  async disconnect() {
    return { success: true };
  }

  async sync(data: any) {
    // Sync data with Zapier
    return { success: true };
  }
}
