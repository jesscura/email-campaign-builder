import { EmailProvider, EmailOptions } from '../types';

export abstract class EmailProvider implements EmailProvider {
  abstract send(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }>;
}
