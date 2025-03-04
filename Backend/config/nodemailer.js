import nodemailer from "nodemailer";

const Nodemailer = async (to, subject, text, values = {}, pdfAttachment = null) => {
  try {
    const html = `
     <html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        margin: 0;
        padding: 0;
      }
      .container {
        width: 80%;
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
      }
      .header {
        text-align: center;
        padding-bottom: 15px;
        border-bottom: 2px solid #007bff;
      }
      .header h2 {
        color: #007bff;
        margin: 0;
      }
      .content {
        padding: 20px 0;
      }
      .content p {
        font-size: 16px;
        color: #333;
        line-height: 1.5;
      }
      .order-details {
        background-color: #f9f9f9;
        padding: 15px;
        border-radius: 5px;
        margin-top: 10px;
      }
      .order-details p {
        font-size: 14px;
        margin: 5px 0;
      }
      .order-id {
        font-weight: bold;
        font-size: 16px;
        color: #007bff;
      }
      .amount {
        font-weight: bold;
        color: #28a745;
        font-size: 18px;
      }
      .footer {
        text-align: center;
        margin-top: 20px;
        padding-top: 15px;
        border-top: 1px solid #ddd;
        font-size: 14px;
        color: #666;
      }
      .footer a {
        color: #007bff;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>Order Confirmation</h2>
      </div>
      <div class="content">
        <p>Dear <strong>${values.firstname} ${values.lastname}</strong>,</p>
        <p>Your order has been successfully placed, and your payment has been processed.</p>

        <div class="order-details">
          <p><strong>Order ID:</strong> <span class="order-id">${values._id}</span></p>
          <p><strong>Amount Paid:</strong> <span class="amount">$${values.amount}</span></p>
        </div>

        <p>For more details, please check the attached PDF of your order.</p>
      </div>
      
      <div class="footer">
        <p>Need help? <a href="mailto:support@yourshop.com">Contact Support</a></p>
        <p>&copy; ${new Date().getFullYear()} YourShop. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>

    `;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const emailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text:"Your order details are attached in the PDF.",
      html,
      attachments: pdfAttachment ? [{ filename: "order_confirmation.pdf", path: pdfAttachment }] : []
    };

    const info = await transporter.sendMail(emailOptions);
    console.log("Email sent successfully:", info.response);
    return info;
  } catch (error) {
    console.error("Error while sending email:", error);
    throw error;
  }
};

export default Nodemailer;
