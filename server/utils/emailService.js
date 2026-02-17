const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

// Create Transporter
// Ideally use OAuth2 or App Password for Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // Your Gmail
        pass: process.env.EMAIL_PASS  // Your App Password
    }
});

const sendComplaintNotification = async (complaintData) => {
    try {
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.ADMIN_EMAIL) {
            console.warn("Email credentials missing. Skipping email notification.");
            return;
        }

        const mailOptions = {
            from: `"ElectroSafe System" <${process.env.EMAIL_USER}>`,
            to: process.env.ADMIN_EMAIL, // The Electricity Dept Employee
            subject: `New Complaint: ${complaintData.category} - ${complaintData.village}`,
            html: `
                <h2>New Electricity Complaint Registered</h2>
                <p><strong>Complaint ID:</strong> ${complaintData.complaintId}</p>
                <p><strong>Category:</strong> ${complaintData.category}</p>
                <p><strong>Village:</strong> ${complaintData.village}</p>
                <p><strong>Description:</strong> ${complaintData.description}</p>
                <br>
                <h3>Reporter Details:</h3>
                <p><strong>Name:</strong> ${complaintData.name}</p>
                <p><strong>Mobile:</strong> ${complaintData.mobile}</p>
                <p><strong>Email:</strong> ${complaintData.email}</p>
                <br>
                <p><em>Please login to the Admin Dashboard to take action.</em></p>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent: " + info.response);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

module.exports = { sendComplaintNotification };
