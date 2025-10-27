// Email Provider Abstraction Layer
export { EmailProvider } from './providers/base';
export { SendGridProvider } from './providers/sendgrid';
export { SESProvider } from './providers/ses';
export { getEmailProvider } from './providers/factory';
export { compileMJML } from './mjml';
export type { EmailOptions, EmailProvider as IEmailProvider } from './types';
