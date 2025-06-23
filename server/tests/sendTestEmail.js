const emailService = require('../services/emailService');

emailService.sendEmail({
  to: 'ayalamedlov@gmail.com', 
  subject: 'בדיקה',
  text: 'האם זה הגיע בהצלחה מהמייל של RentBro?'
});