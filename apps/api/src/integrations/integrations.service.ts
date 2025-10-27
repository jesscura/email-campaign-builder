import { Injectable } from '@nestjs/common';

@Injectable()
export class IntegrationsService {
  getIntegrations() {
    return { 
      integrations: [
        { id: 'zapier', name: 'Zapier', status: 'available' },
        { id: 'shopify', name: 'Shopify', status: 'available' },
        { id: 'hubspot', name: 'HubSpot', status: 'available' },
        { id: 'salesforce', name: 'Salesforce', status: 'available' },
        { id: 'google-sheets', name: 'Google Sheets', status: 'available' },
        { id: 'slack', name: 'Slack', status: 'available' },
        { id: 'zoho', name: 'Zoho CRM', status: 'available' },
      ] 
    };
  }

  connectIntegration(data: any) {
    return { success: true, data };
  }
}
