"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendWelcomeEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// Create a transporter using Ethereal (fake SMTP service) for testing
// In production, this would use real SMTP credentials from env vars
const createTransporter = () => __awaiter(void 0, void 0, void 0, function* () {
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    const testAccount = yield nodemailer_1.default.createTestAccount();
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });
    return { transporter, testAccount };
});
const sendWelcomeEmail = (email, username) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { transporter } = yield createTransporter();
        const info = yield transporter.sendMail({
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
        console.log("Preview URL: %s", nodemailer_1.default.getTestMessageUrl(info));
        return info;
    }
    catch (error) {
        console.error("Error sending email:", error);
        // Don't throw error to avoid blocking registration if email fails
        return null;
    }
});
exports.sendWelcomeEmail = sendWelcomeEmail;
