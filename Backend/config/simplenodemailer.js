import nodemailer from "nodemailer";
import fs from "fs/promises";

/**
 * Sends an email using a template file and dynamic values.
 *
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} text - Email text content.
 * @param {string} templatePath - Absolute path to the HTML template file.
 * @param {Object} templateValues - Data to replace placeholders in the template.
 */
const SimpleNodemailer = async (to, subject, text, templatePath, templateValues = {}) => {
  try {
    let html = "";

    // Read the HTML template file using the absolute path provided.
    if (templatePath) {
      html = await fs.readFile(templatePath, "utf8");

      // Replace placeholders in the form {{placeholder}} with provided values.
      for (const key in templateValues) {
        const regex = new RegExp(`{{\\s*${key}\\s*}}`, "g");
        html = html.replace(regex, templateValues[key]);
      }
    }

    // Create the transporter using Gmail's SMTP service.
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Define the email options.
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html,
    };

    // Send the email.
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("Error while sending email:", error);
    throw error;
  }
};

export default SimpleNodemailer;
