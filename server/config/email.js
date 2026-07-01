const nodemailer = require('nodemailer');

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

/**
 * Sends an email notification to the admin when a new complaint is filed.
 * @param {Object} complaintData - The complaint details.
 */
const sendAdminNotification = async (complaintData) => {
    try {
        const adminEmail = process.env.ADMIN_EMAIL;
        
        // If email isn't configured, just skip silently (don't break the app)
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !adminEmail) {
            console.log('⚠️ Email credentials not set in .env. Skipping email notification.');
            return;
        }

        const mailOptions = {
            from: `"ElectroSafe System" <${process.env.EMAIL_USER}>`,
            to: adminEmail,
            subject: `🚨 New Electricity Complaint: ${complaintData.complaintId}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <h2 style="color: #0066ff; text-align: center;">New Complaint Registered</h2>
                    <p>A new electricity complaint has been submitted on the ElectroSafe portal.</p>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><strong>Complaint ID:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee; color: #0066ff; font-weight: bold;">${complaintData.complaintId}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><strong>Category:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${complaintData.category}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><strong>Village:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${complaintData.village}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><strong>District:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${complaintData.district}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee;"><strong>Submitted By:</strong></td>
                            <td style="padding: 10px; border-bottom: 1px solid #eeeeee;">${complaintData.name} (${complaintData.mobile})</td>
                        </tr>
                    </table>
                    
                    <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-left: 4px solid #f5a623;">
                        <strong>Description:</strong><br>
                        ${complaintData.description}
                    </div>
                    
                    <div style="margin-top: 30px; text-align: center;">
                        <a href="https://electro-safe.vercel.app/admin.html" style="background-color: #0066ff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">View Admin Dashboard</a>
                    </div>
                </div>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Admin notification email sent: ${info.messageId}`);
    } catch (error) {
        console.error('❌ Error sending admin email notification:', error);
    }
};

module.exports = { sendAdminNotification };
