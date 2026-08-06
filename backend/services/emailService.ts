import nodemailer from 'nodemailer';

interface EmailDetail {
  label: string;
  value: string;
}

interface EmailNotificationOptions {
  subject: string;
  heading: string;
  details: EmailDetail[];
  message?: string;
  ctaUrl?: string;
}

const emailHost = process.env.EMAIL_HOST || '';
const emailPort = Number(process.env.EMAIL_PORT || '465');
const emailUser = process.env.EMAIL_USER || '';
const emailPass = process.env.EMAIL_PASS || '';
const emailFrom = process.env.EMAIL_FROM || emailUser;
const adminReceiver = process.env.ADMIN_RECEIVER || emailUser;

const transporter = nodemailer.createTransport({
  host: emailHost,
  port: emailPort,
  secure: emailPort === 465,
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

const buildPlainText = (options: EmailNotificationOptions): string => {
  const fieldsText = options.details
    .map((detail) => `${detail.label}: ${detail.value}`)
    .join('\n');
  return `${options.heading}\n\n${fieldsText}${options.message ? `\n\n${options.message}` : ''}`;
};

const buildHtml = (options: EmailNotificationOptions): string => {
  const rows = options.details
    .map(
      (detail) =>
        `<tr><td style="padding: 10px 15px; background: #f9f9f9; border-bottom: 1px solid #e5e5e5; font-size: 14px; color: #333;"><strong>${detail.label}</strong></td><td style="padding: 10px 15px; background: #f9f9f9; border-bottom: 1px solid #e5e5e5; font-size: 14px; color: #111;">${detail.value || '-'}</td></tr>`
    )
    .join('');

  return `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6;">
      <div style="max-width: 680px; margin: 0 auto; padding: 24px; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="margin: 0; color: #e11d48; font-size: 24px;">${options.heading}</h1>
        </div>
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px;">
          ${rows}
        </table>
        ${options.message ? `<p style="margin: 0 0 18px; color: #4b5563; font-size: 14px;">${options.message}</p>` : ''}
        ${options.ctaUrl ? `<p style="text-align: center;"><a href="${options.ctaUrl}" style="display: inline-block; padding: 12px 24px; background: #e11d48; color: #ffffff; border-radius: 10px; text-decoration: none; font-weight: bold;">Review in Admin Panel</a></p>` : ''}
        <p style="margin: 24px 0 0; color: #6b7280; font-size: 12px;">This email was generated automatically by the Online Degree Diploma system.</p>
      </div>
    </div>
  `;
};

export const sendEmail = async (options: {
  to?: string;
  subject: string;
  text: string;
  html: string;
}) => {
  console.log('Email configuration:', {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    receiver: process.env.ADMIN_RECEIVER
  });

  if (!emailHost || !emailUser || !emailPass) {
    console.warn('Email service is not configured. Skipping email delivery.');
    return false;
  }

  const mailOptions = {
    from: emailFrom,
    to: options.to || adminReceiver,
    subject: options.subject,
    text: options.text,
    html: options.html
  };

  try {
    console.log('Calling sendAdminNotification...');
    await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent to ${mailOptions.to}: ${mailOptions.subject}`);
    return true;
  } catch (error: any) {
    console.error('❌ Email sending failed:', error);
    if (error && error.stack) {
      console.error(error.stack);
    }
    return false;
  }
};

export const sendAdminNotification = async (options: EmailNotificationOptions) => {
  console.log('Calling sendAdminNotification...');
  const text = buildPlainText(options);
  const html = buildHtml(options);
  return sendEmail({
    subject: options.subject,
    text,
    html
  });
};
