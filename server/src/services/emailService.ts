import nodemailer from 'nodemailer';

// Create a transporter using Ethereal (fake SMTP service) for testing
// In production, this would use real SMTP credentials from env vars
const createTransporter = async () => {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    return { transporter, testAccount };
};

export const sendWelcomeEmail = async (email: string, username: string) => {
    try {
        const { transporter } = await createTransporter();

        const info = await transporter.sendMail({
            from: '"Blog Lounge" <no-reply@bloglounge.com>', // sender address
            to: email, // list of receivers
            subject: "Welcome to Blog Lounge! 🚀", // Subject line
            text: `Hi ${username},\n\nWelcome to Blog Lounge! We're excited to have you on board.\n\nBest,\nThe Team`, // plain text body
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #4F46E5;">Welcome to Blog Lounge! 🚀</h1>
                    <p>Hi <strong>${username}</strong>,</p>
                    <p>We're excited to have you on board. Start exploring and sharing your thoughts with the world!</p>
                    <br/>
                    <a href="http://localhost:3000/explore" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Exploring</a>
                    <br/><br/>
                    <p>Best,<br/>The Team</p>
                </div>
            `, // html body
        });

        console.log("Message sent: %s", info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

        return info;
    } catch (error) {
        console.error("Error sending email:", error);
        // Don't throw error to avoid blocking registration if email fails
        return null;
    }
};
