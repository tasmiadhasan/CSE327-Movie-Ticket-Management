import nodemailer from 'nodemailer';

// Support both SMTP_USER and legacy SMTP_USERS env var names
const SMTP_USER = process.env.SMTP_USER || process.env.SMTP_USERS;

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // TLS is started with STARTTLS on port 587
    auth: {
        user: SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

const sendEmail = async ({ to, subject, body }) => {
    try {
        if (!SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error("SMTP credentials are missing. Ensure SMTP_USER/SMTP_USERS and SMTP_PASS are set.");
        }

        const response = await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to,
            subject,
            html: body,
        });
        return response;
    } catch (err) {
        // Surface detailed error in logs to aid debugging
        console.error("Email send failed:", {
            message: err?.message,
            code: err?.code,
            response: err?.response,
        });
        throw err;
    }
};

export default sendEmail;