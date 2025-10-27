import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { EmailProvider } from './base';
import type { EmailOptions } from '../types';

export class SESProvider extends EmailProvider {
  private client: SESClient;

  constructor(config: { region: string; accessKeyId: string; secretAccessKey: string }) {
    super();
    this.client = new SESClient({
      region: config.region,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }

  async send(options: EmailOptions) {
    try {
      const command = new SendEmailCommand({
        Source: options.from,
        Destination: {
          ToAddresses: Array.isArray(options.to) ? options.to : [options.to],
        },
        Message: {
          Subject: { Data: options.subject },
          Body: {
            Html: { Data: options.html },
            ...(options.text && { Text: { Data: options.text } }),
          },
        },
      });

      const response = await this.client.send(command);

      return {
        success: true,
        messageId: response.MessageId,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
