import {emailAdapter} from "../emailAdapter";

export const emailManager = {
    async sendConfirmationEmail(email: string, confirmationCode: string) {
        console.log("⚡ SENDING VIA RESEND TO:", email);
        const message = `
            <h1>Thank you for your registration</h1>
            <p>To finish registration please follow the link below:</p>
            <a href="https://some-front.com/confirm-registration?code=${confirmationCode}">Complete registration</a>
        `;

        await emailAdapter.sendEmail(email, "Confirm your registration", message);
    }
};