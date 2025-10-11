import nodemailer from 'nodemailer';

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    secure: true,
    port: 465,
    timeout: 10000
  });
};

export const sendWelcomeEmail = async (userEmail, userName) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('Email not configured, skipping welcome email');
      return;
    }
    
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"SkillBridge - AI Resume Analyzer" <${process.env.EMAIL_USER}>`,
      replyTo: `"SkillBridge Support" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: '🎉 Welcome to SkillBridge - Your AI Resume Analyzer!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border-radius: 10px; overflow: hidden;">
          <div style="padding: 40px 30px; text-align: center;">
            <h1 style="margin: 0; font-size: 28px; font-weight: bold;">🚀 Welcome to SkillBridge!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your AI-Powered Career Companion</p>
          </div>
          
          <div style="background: white; color: #333; padding: 40px 30px;">
            <h2 style="color: #667eea; margin-top: 0;">Hello ${userName}! 👋</h2>
            
            <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
              Congratulations on joining <strong>SkillBridge</strong> - the most advanced AI-powered resume analyzer designed specifically for students and professionals like you!
            </p>
            
            <div style="background: #f8f9ff; padding: 25px; border-radius: 8px; margin: 25px 0;">
              <h3 style="color: #667eea; margin-top: 0;">🎯 What You Can Do Now:</h3>
              <ul style="margin: 15px 0; padding-left: 20px;">
                <li style="margin: 8px 0;">📄 <strong>Upload Your Resume</strong> - Get instant AI analysis</li>
                <li style="margin: 8px 0;">🎯 <strong>Match Job Descriptions</strong> - Find perfect role alignment</li>
                <li style="margin: 8px 0;">🤖 <strong>Practice Interviews</strong> - AI-powered mock interviews</li>
                <li style="margin: 8px 0;">📊 <strong>Track Your Progress</strong> - Monitor improvement over time</li>
                <li style="margin: 8px 0;">🗺️ <strong>Get Learning Paths</strong> - Personalized skill development</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.CLIENT_URL}" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: bold; display: inline-block;">
                🚀 Start Analyzing Your Resume
              </a>
            </div>
          </div>
          
          <div style="background: #2c3e50; color: white; padding: 25px 30px; text-align: center;">
            <p style="margin: 0; font-size: 14px; opacity: 0.8;">
              Made with ❤️ by the SkillBridge Team | Empowering Careers with AI
            </p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${userEmail}`);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

export const sendPasswordResetOTP = async (userEmail, userName, otp) => {
  try {
    console.log('Attempting to send OTP email to:', userEmail);
    console.log('Email config check:', {
      hasUser: !!process.env.EMAIL_USER,
      hasPass: !!process.env.EMAIL_PASS,
      user: process.env.EMAIL_USER
    });
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('❌ Email not configured, skipping OTP email');
      throw new Error('Email service not configured');
    }
    
    const transporter = createTransporter();
    
    // Verify transporter
    await transporter.verify();
    console.log('✅ Email transporter verified');
    
    const mailOptions = {
      from: `"SkillBridge" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `🔐 Your SkillBridge Password Reset Code: ${otp}`,
      text: `Your password reset code is: ${otp}. This code expires in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f5f5f5;">
          <div style="background: white; padding: 30px; border-radius: 10px; text-align: center;">
            <h1 style="color: #333; margin-bottom: 20px;">🔐 Password Reset</h1>
            <h2 style="color: #667eea;">Hello ${userName}!</h2>
            
            <p style="font-size: 16px; color: #666; margin: 20px 0;">
              Your password reset code is:
            </p>
            
            <div style="background: #f8f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <div style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 4px;">
                ${otp}
              </div>
              <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">
                Expires in 10 minutes
              </p>
            </div>
            
            <p style="color: #999; font-size: 14px;">
              If you didn't request this, please ignore this email.
            </p>
          </div>
        </div>
      `
    };

    console.log('Sending email with options:', {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject
    });

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Password reset OTP sent successfully:', {
      messageId: result.messageId,
      response: result.response,
      to: userEmail
    });
    
    return result;
  } catch (error) {
    console.error('❌ OTP email sending failed:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response
    });
    throw error;
  }
};