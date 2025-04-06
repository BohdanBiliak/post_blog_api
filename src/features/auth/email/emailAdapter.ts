import {Resend} from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailAdapter = {
    async sendEmail(email: string, subject: string, html: string) {
        return await resend.emails.send({
            from: 'Your App <noreply@yourdomain.com>',
            to: [email],
            subject: subject,
            html: html,
        });
    },
};
