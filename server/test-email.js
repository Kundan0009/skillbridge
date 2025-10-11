import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const testEmail = async () => {
  try {
    console.log('Testing email configuration...');
    console.log('EMAIL_USER:', process.env.EMAIL_USER);
    console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET' : 'NOT SET');
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      secure: true,
      port: 465
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Email transporter verified');

    // Send test email
    const result = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: 'SkillBridge Email Test',
      text: 'Test OTP: 123456',
      html: '<h1>Test Email</h1><p>OTP: <strong>123456</strong></p>'
    });

    console.log('✅ Test email sent:', result.messageId);
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
  }
};

testEmail();