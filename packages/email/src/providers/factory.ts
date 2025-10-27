import { SendGridProvider } from './sendgrid';
import { SESProvider } from './ses';
import type { EmailProvider } from '../types';

export function getEmailProvider(provider: string = 'sendgrid'): EmailProvider {
  switch (provider) {
    case 'sendgrid':
      if (!process.env.SENDGRID_API_KEY) {
        throw new Error('SENDGRID_API_KEY is required');
      }
      return new SendGridProvider(process.env.SENDGRID_API_KEY);

    case 'ses':
      if (!process.env.AWS_REGION || !process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
        throw new Error('AWS credentials are required for SES');
      }
      return new SESProvider({
        region: process.env.AWS_REGION,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      });

    default:
      throw new Error(`Unknown email provider: ${provider}`);
  }
}
