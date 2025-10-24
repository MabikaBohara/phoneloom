const nodemailer = require("nodemailer");

// Create HTML email template for password reset
const createPasswordResetTemplate = (resetURL, userName) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - PhoneLoom</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
            }
            .logo {
                font-size: 28px;
                font-weight: bold;
                color: #3b82f6;
                margin-bottom: 10px;
            }
            .title {
                font-size: 24px;
                color: #1f2937;
                margin-bottom: 20px;
            }
            .content {
                margin-bottom: 30px;
            }
            .reset-button {
                display: inline-block;
                background-color: #3b82f6;
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                border-radius: 6px;
                font-weight: bold;
                margin: 20px 0;
                transition: background-color 0.3s;
            }
            .reset-button:hover {
                background-color: #2563eb;
            }
            .footer {
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #e5e7eb;
                font-size: 14px;
                color: #6b7280;
                text-align: center;
            }
            .warning {
                background-color: #fef3c7;
                border: 1px solid #f59e0b;
                border-radius: 6px;
                padding: 15px;
                margin: 20px 0;
                color: #92400e;
            }
            .link-fallback {
                background-color: #f3f4f6;
                padding: 15px;
                border-radius: 6px;
                margin: 20px 0;
                word-break: break-all;
                font-family: monospace;
                font-size: 12px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <div class="logo">📱 PhoneLoom</div>
                <h1 class="title">Password Reset Request</h1>
            </div>
            
            <div class="content">
                <p>Hello ${userName || 'User'},</p>
                
                <p>We received a request to reset your password for your PhoneLoom account. If you made this request, click the button below to reset your password:</p>
                
                <div style="text-align: center;">
                    <a href="${resetURL}" class="reset-button">Reset My Password</a>
                </div>
                
                <div class="warning">
                    <strong>⚠️ Important:</strong> This link will expire in 15 minutes for security reasons.
                </div>
                
                <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
                <div class="link-fallback">${resetURL}</div>
                
                <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
            </div>
            
            <div class="footer">
                <p>This email was sent by PhoneLoom</p>
                <p>If you have any questions, please contact our support team.</p>
                <p>© 2024 PhoneLoom. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

// Enhanced email sending function
const sendEmail = async (to, subject, text, html = null) => {
  try {
    console.log("📧 Sending email to:", to);

    // Create transporter with better error handling
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    // Verify transporter configuration
    await transporter.verify();
    console.log("✅ Email server connection verified");

    const mailOptions = {
      from: `"PhoneLoom Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html: html || text, // Use HTML if provided, otherwise use text
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", to);
    console.log("📧 Message ID:", result.messageId);
    
    return result;
  } catch (error) {
    console.error("❌ Email sending failed:", error);
    throw new Error(`Email sending failed: ${error.message}`);
  }
};

// Specific function for password reset emails
const sendPasswordResetEmail = async (email, resetURL, userName) => {
  const subject = "Reset Your PhoneLoom Password";
  const html = createPasswordResetTemplate(resetURL, userName);
  const text = `
Hello ${userName || 'User'},

We received a request to reset your password for your PhoneLoom account.

Click this link to reset your password: ${resetURL}

This link will expire in 15 minutes for security reasons.

If you didn't request a password reset, please ignore this email.

Best regards,
PhoneLoom Team
  `;

  return await sendEmail(email, subject, text, html);
};

module.exports = { sendEmail, sendPasswordResetEmail };