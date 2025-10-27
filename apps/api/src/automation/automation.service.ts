import { Injectable } from '@nestjs/common';

@Injectable()
export class AutomationService {
  getWorkflows() {
    return { workflows: [] };
  }

  createWorkflow(data: any) {
    return { success: true, data };
  }

  getTemplates() {
    return { 
      templates: [
        { id: 'welcome', name: 'Welcome Series', type: 'email' },
        { id: 'abandoned-cart', name: 'Abandoned Cart', type: 'multi-channel' },
        { id: 'post-purchase', name: 'Post Purchase', type: 'email' },
      ] 
    };
  }
}
