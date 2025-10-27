export interface EmailOptions {
  to: string | string[];
  from: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
  }>;
}

export interface EmailProvider {
  send(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }>;
}
