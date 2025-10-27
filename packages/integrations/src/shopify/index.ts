import { shopifyApi, LATEST_API_VERSION } from '@shopify/shopify-api';
import type { Integration } from '../types';

export class ShopifyIntegration implements Integration {
  id = 'shopify';
  name = 'Shopify';
  private shopify: any;

  constructor(config: { apiKey: string; apiSecret: string; scopes: string[] }) {
    this.shopify = shopifyApi({
      apiKey: config.apiKey,
      apiSecretKey: config.apiSecret,
      scopes: config.scopes,
      hostName: 'localhost',
      apiVersion: LATEST_API_VERSION,
      isEmbeddedApp: false,
    });
  }

  async connect(credentials: any) {
    // Shopify OAuth flow
    return { success: true };
  }

  async disconnect() {
    return { success: true };
  }

  async sync(data: any) {
    // Sync customers, orders from Shopify
    return { success: true };
  }
}
