import nodemailer from 'nodemailer';

// Create a reusable transporter object using the default SMTP transport
const getTransporter = async () => {
    // Check if we have production credentials
    if (process.env.EMAIL_HOST && process.env.EMAIL_USER) {
        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || '587'),
            secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });
    }

    // Fallback to Ethereal for development if no real credentials
    console.log("⚠️ No Email Credentials found. Using Ethereal for testing.");
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};

export const sendWelcomeEmail = async (email: string, username: string) => {
    try {
        const transporter = await getTransporter();
        const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"Blog Lounge" <no-reply@bloglounge.com>',
            to: email,
            subject: "Welcome to Blog Lounge! 🚀",
            text: `Hi ${username},\n\nWelcome to Blog Lounge! We're excited to have you on board.\n\nBest,\nThe Team`,
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

        console.log("Message sent: %s", info.messageId);

        // Only log preview URL if using Ethereal (test account)
        if (info.messageId && !process.env.EMAIL_HOST) {
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        // Don't throw error to avoid blocking registration if email fails
        return null;
    }
};
