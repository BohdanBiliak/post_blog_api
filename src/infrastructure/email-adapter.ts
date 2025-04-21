import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_6NoVLaTw_Lzdjm3YkYGQZGBdjYHZWjP9v');

export const emailAdapter = {
  async sendEmail(email: string, subject: string, message: string) {
    try {
      const data = await resend.emails.send({
        from: 'Incubator <bohdan@incubatortest.com>',
        to: [email],
        subject,
        html: message,
      });

      console.log('Email sent successfully:', data);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  },
};
