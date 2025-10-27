import sgMail from '@sendgrid/mail';
import { EmailProvider } from './base';
import type { EmailOptions } from '../types';

export class SendGridProvider extends EmailProvider {
  constructor(apiKey: string) {
    super();
    sgMail.setApiKey(apiKey);
  }

  async send(options: EmailOptions) {
    try {
      const [response] = await sgMail.send({
        to: options.to,
        from: options.from,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      return {
        success: true,
        messageId: response.headers['x-message-id'] as string,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}
