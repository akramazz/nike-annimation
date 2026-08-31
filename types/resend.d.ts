declare module "resend" {
  interface ResendEmail {
    from: string;
    to: string | string[];
    subject: string;
    html?: string;
    text?: string;
    replyTo?: string;
    cc?: string | string[];
    bcc?: string | string[];
    attachments?: Array<{
      filename?: string;
      content?: string;
      path?: string;
      href?: string;
    }>;
  }

  interface SendEmailResponse {
    id: string;
    from: string;
    to: string[];
    created_at: string;
  }

  class Resend {
    constructor(apiKey: string);
    emails: {
      send(params: ResendEmail): Promise<{ data?: SendEmailResponse; error?: { message: string } }>;
    };
  }

  export default Resend;
  export { Resend, ResendEmail, SendEmailResponse };
}
