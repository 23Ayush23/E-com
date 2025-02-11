import Nodemailer from '../config/nodemailer.js';

/**
 * Function to send an email using Nodemailer
 * @param {string} recipient - Email of the recipient
 * @param {string} subject - Subject of the email
 * @param {string} title - Title inside the email body
 * @param {string} templatePath - Path to the email template
 * @param {Object} data - Data to be injected into the template
 */
const sendEmail = (recipient, subject, title, templatePath, data) => {
    try {
        if (!recipient) {
            console.error("Recipient email is missing.");
            return;
        }

        Nodemailer(recipient, subject, title, templatePath, data);
        console.log(`Email sent successfully to ${recipient}`);
    } catch (error) {
        console.error("Error sending email:", error.message);
    }
};

export default sendEmail;
