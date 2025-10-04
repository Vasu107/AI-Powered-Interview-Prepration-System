// Email service for sending acknowledgment emails
export const sendLoginAcknowledgment = async (userEmail, userName) => {
    try {
        // Simulate email sending (replace with actual email service like SendGrid, Nodemailer, etc.)
        const emailData = {
            to: userEmail,
            subject: 'Login Acknowledgment - AskUp Virtual Interview',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
                        <h1 style="color: white; margin: 0;">AskUp Virtual Interview</h1>
                    </div>
                    
                    <div style="padding: 30px; background: #f9f9f9;">
                        <h2 style="color: #333;">Hello ${userName || 'User'}!</h2>
                        
                        <p style="color: #666; line-height: 1.6;">
                            We wanted to let you know that you've successfully logged into your AskUp Virtual Interview account.
                        </p>
                        
                        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
                            <h3 style="color: #333; margin-top: 0;">Login Details:</h3>
                            <p style="margin: 5px 0;"><strong>Email:</strong> ${userEmail}</p>
                            <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
                            <p style="margin: 5px 0;"><strong>Platform:</strong> AskUp Virtual Interview</p>
                        </div>
                        
                        <p style="color: #666; line-height: 1.6;">
                            If this wasn't you, please contact our support team immediately.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
                               style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                                Go to Dashboard
                            </a>
                        </div>
                        
                        <p style="color: #999; font-size: 12px; text-align: center;">
                            This is an automated message. Please do not reply to this email.
                        </p>
                    </div>
                </div>
            `
        };
        
        // Store email in localStorage for demo (replace with actual email service)
        const emailHistory = JSON.parse(localStorage.getItem('emailHistory') || '[]');
        emailHistory.push({
            ...emailData,
            sentAt: new Date().toISOString(),
            status: 'sent'
        });
        localStorage.setItem('emailHistory', JSON.stringify(emailHistory));
        
        console.log('Login acknowledgment email sent to:', userEmail);
        return { success: true, message: 'Email sent successfully' };
        
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, message: 'Failed to send email' };
    }
};

// Function to get email history (for demo purposes)
export const getEmailHistory = () => {
    if (typeof window !== 'undefined') {
        return JSON.parse(localStorage.getItem('emailHistory') || '[]');
    }
    return [];
};