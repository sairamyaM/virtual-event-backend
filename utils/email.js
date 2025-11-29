const isTest = process.env.NODE_ENV === "test";

let sendEmail = async () => {};

if (!isTest) {
  const nodemailer = require('nodemailer');

  let transporter;

  (async () => {
    const testAccount = await nodemailer.createTestAccount();

    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });

    console.log("Ethereal email ready. Emails will show preview URLs in console.");
  })();

  sendEmail = async (to, subject, message) => {
    if (!transporter) return;

    const info = await transporter.sendMail({
      from: "no-reply@events.com",
      to,
      subject,
      text: message
    });

    console.log("Email sent:", nodemailer.getTestMessageUrl(info));
  };
}
module.exports.sendEmail = sendEmail;
