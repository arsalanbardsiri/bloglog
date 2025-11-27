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
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #4F46E5;">Reset Your Password 🔐</h1>
                    <p>You requested a password reset for your Blog Lounge account.</p>
                    <p>Click the button below to set a new password. This link expires in 1 hour.</p>
                    <br/>
                    <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <br/><br/>
                    <p>If you didn't request this, please ignore this email.</p>
                    <p>Best,<br/>The Team</p>
                </div>
            `,
        });

        console.log("Reset email sent:", data);
        return data;
    } catch (error) {
        console.error("Error sending reset email:", error);
        return null;
    }
};
