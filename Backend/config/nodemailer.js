import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";  


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const Nodemailer = (to, subject, text, templatePath, values = {}) => {
    const htmlPath = path.join(__dirname, templatePath);
    let html = fs.readFileSync(htmlPath, "utf8");

    // Convert 'items' array into an HTML list
    if (Array.isArray(values.items)) {
        const itemsHtml = values.items.map(item => 
            `<li>${item.name} (x${item.quantity}) - $${item.price}</li>`
        ).join("");
        values.items = `<ul>${itemsHtml}</ul>`; 
    } else {
        values.items = "<p>No items found</p>";
    }

    // Replace placeholders in the template
    Object.keys(values).forEach(key => {
        const regex = new RegExp(`{{${key}}}`, "g");
        html = html.replace(regex, values[key]);
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const emailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text,
        html: html
    };

    transporter.sendMail(emailOptions, (error, info) => {
        if (error) {
            console.error("Error while sending email:", error);
        } else {
            console.log("Email sent successfully:", info.response);
        }
    });
};

export default Nodemailer;

