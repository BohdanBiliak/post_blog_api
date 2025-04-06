import { Resend } from 'resend';

const resend = new Resend('re_6NoVLaTw_Lzdjm3YkYGQZGBdjYHZWjP9v');

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
           const data =  await resend.emails.send({
                from: 'Incubator <bohdan@incubatortest.com>',
                to: [email],
                subject: subject,
                html: message,
            });

          console.log(data);
    },
};
