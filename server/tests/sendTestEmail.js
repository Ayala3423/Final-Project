const emailService = require('../services/emailService');

async function testSendRenewalEmail() {
  const reservationId = '1'; // שימי כאן מזהה אמיתי של ההזמנה לבדיקה

  const confirmationUrl = `http://localhost:5173/renew-reservation/${reservationId}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right;">
      <h2>שלום!</h2>
      <p>האם תרצי לחדש את ההזמנה שלך לעוד חודש?</p>
      <a href="${confirmationUrl}" style="
        display: inline-block;
        padding: 10px 20px;
        margin-top: 10px;
        background-color: #007bff;
        color: white;
        text-decoration: none;
        border-radius: 5px;
      ">לחדש את ההזמנה</a>
      <p>אם אינך מעוניינת, פשוט תתעלמי מהמייל.</p>
      <br/>
      <small>נשלח על ידי RentBro</small>
    </div>
  `;

  try {
    await emailService.sendEmail({
      to: 'ayalamedlov@gmail.com',
      subject: 'האם לחדש את ההזמנה שלך?',
      text: 'לחצי על הקישור כדי לחדש את ההזמנה: ' + confirmationUrl,
      html: htmlContent
    });

    console.log('✅ Email sent successfully!');
  } catch (error) {
    console.error('❌ Failed to send email:', error);
  }
}

testSendRenewalEmail();