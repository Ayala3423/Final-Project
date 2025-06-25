const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async ({ to, subject, text }) => {
  try {
    await transporter.sendMail({
      from: `"RentBro" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text
    });
    console.log(`📧 Email sent to ${to}`);
  } catch (err) {
    console.error('❌ Failed to send email:', err);
  }
};

const sendRenewalEmail = async (reservation) => {
  const renewalLink = `https://your-frontend-url.com/reservations/renew/${reservation.id}`;

  const emailText = `
    שלום,

    ההזמנה שלך עומדת לפוג. האם ברצונך להמשיך ולחדש את ההזמנה לחודש הקרוב?

    לחץ כאן כדי לחדש: ${renewalLink}

    תודה,
    צוות RentBro
  `;

  try {
    await sendEmail({
      to: reservation.renterEmail, 
      
      subject: 'חידוש הזמנת חניה',
      text: emailText,
    });
  } catch (error) {
    console.error('Failed to send renewal email:', error);
  }
};

module.exports = { sendEmail, sendRenewalEmail };