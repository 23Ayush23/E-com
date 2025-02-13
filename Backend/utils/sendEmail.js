import Nodemailer from "../config/nodemailer.js";

/**
 * Function to send an email using Nodemailer
 * @param {string} recipient - Email of the recipient
 * @param {string} subject - Subject of the email
 * @param {string} title - Title inside the email body
 * @param {Object} data - Data to be injected into the email
 * @param {string} pdfAttachment - Path to the PDF attachment
 */
const sendEmail = async (recipient, subject, title, data, pdfAttachment = null) => {
  try {
    if (!recipient) {
      throw new Error("Recipient email is missing.");
    }

    await Nodemailer(recipient, subject, title, data, pdfAttachment);
    console.log(`Email sent successfully to ${recipient}`);
  } catch (error) {
    console.error("Error sending email:", error.message);
  }
};

export default sendEmail;
