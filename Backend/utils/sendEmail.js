import Nodemailer from "../config/nodemailer.js";

const sendEmail = async (
  recipient,
  subject,
  title,
  data,
  pdfAttachment = null
) => {
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
