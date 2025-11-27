import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (email: string, username: string) => {
    try {
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
        const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

        const data = await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: "Welcome to Blog Lounge! 🚀",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #4F46E5;">Welcome to Blog Lounge! 🚀</h1>
                    <p>Hi <strong>${username}</strong>,</p>
                    <p>We're excited to have you on board. Start exploring and sharing your thoughts with the world!</p>
                    <br/>
                    <a href="${clientUrl}/explore" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Exploring</a>
                    <br/><br/>
                    <p>Best,<br/>The Team</p>
                </div>
            `,
        });

        console.log("Welcome email sent:", data);
        return data;
    } catch (error) {
        console.error("Error sending welcome email:", error);
        return null;
    }
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
    try {
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
        const resetUrl = `${clientUrl}/reset-password/${token}`;
        const fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev';

        const data = await resend.emails.send({
            from: fromEmail,
            to: email,
            subject: "Reset Your Password 🔐",
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: 'Courier New', Courier, monospace; background-color: #f4f4f4; padding: 20px; }
                        .container { max-width: 600px; margin: 0 auto; background-color: #fdfbf7; padding: 40px; border: 1px solid #e5e7eb; box-shadow: 5px 5px 0px rgba(0,0,0,0.1); }
                        .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 30px; }
                        .title { font-size: 24px; font-weight: bold; color: #1f2937; text-transform: uppercase; letter-spacing: 2px; }
                        .content { color: #4b5563; line-height: 1.6; font-size: 16px; }
                        .button { display: inline-block; background-color: #1f2937; color: #ffffff !important; padding: 12px 24px; text-decoration: none; font-weight: bold; margin-top: 20px; border: 2px solid #000; text-transform: uppercase; letter-spacing: 1px; }
                        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <div class="title">Blog Lounge</div>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>We received a request to reset the password for your account.</p>
                            <p>If you made this request, please click the button below to securely reset your password:</p>
                            <div style="text-align: center;">
                                <a href="${resetUrl}" class="button">Reset Password</a>
                            </div>
                            <p>This link will expire in 1 hour.</p>
                            <p>If you didn't request this, you can safely ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} Blog Lounge. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `,
        });

        console.log("Reset email sent:", data);
        return data;
    } catch (error) {
        console.error("Error sending reset email:", error);
        return null;
    }
};
