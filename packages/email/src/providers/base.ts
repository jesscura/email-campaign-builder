import { EmailProvider as IEmailProvider, EmailOptions } from '../types';

export abstract class EmailProvider implements IEmailProvider {
  abstract send(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }>;
}
