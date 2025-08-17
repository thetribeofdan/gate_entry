// src/utils/email.ts
import { MailerSend, EmailParams, Recipient, Sender } from 'mailersend';

const mailerSend = new MailerSend({
  apiKey: process.env.MAILERSEND_API_KEY!,
});

const sentFrom = new Sender(
  process.env.MAILERSEND_FROM_EMAIL!,
  process.env.MAILERSEND_FROM_NAME!,
);

async function sendTemplateEmail(
  to: string,
  subject: string,
  templateId: string,
  variables: Record<string, any> = {},
) {
  const recipients = [new Recipient(to, to)];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(subject)
    .setTemplateId(templateId)
    .setPersonalization([
      {
        email: to,
        data: variables,
      },
    ]);

  return await mailerSend.email.send(emailParams);
}

/**
 * Onboarding email
 */
export async function sendOnboardingEmail(to: string, name: string, onboard_url: string, admin_name: string) {

    try{
            return sendTemplateEmail(
              to,
              'Welcome to Our App 🎉',
              process.env.MAILERSEND_TEMPLATE_ONBOARD!,
              { name: name, url: onboard_url, admin_name },
            );
    }catch(e){
      console.log(e);
    }
}

/**
 * QR code email
 */
export async function sendQrEmail(to: string, qrUrl: string) {
    try{
        return sendTemplateEmail(
          to,
          'Your Secure Access QR Code',
          process.env.MAILERSEND_TEMPLATE_QR!,
          { qr_url: qrUrl },
        );
    }catch(e){
      console.log(e);
    }
}
