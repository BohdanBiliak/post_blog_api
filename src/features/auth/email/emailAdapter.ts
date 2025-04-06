
import nodemailer from "nodemailer";
export const emailAdapter ={
    async sendEmail(email:string, subject:string, message:string){
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: "furergop@gmail.com",
                pass: "umuv gzdt msor rmdb",
            },
        });

        let info = await transporter.sendMail({
            from: '"Maddison Foo Koch 👻" <biliakbohdan74@gmail.com>',
            to:  email,
            subject: subject,
            html: message,
        });

        return info;


    }
}
