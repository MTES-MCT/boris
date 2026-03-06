export type MailerTo = {
  email: string;
  name: string;
  params: Record<string, any>;
};

export interface MailerServiceInterface {
  sendEmail(to: MailerTo[], subject: string, templateId: number): Promise<void>;
}
