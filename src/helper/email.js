const nodemailer = require("nodemailer");
const {
    smtpUsername,
    smtpPassword
} = require("../secret");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        // TODO: replace `user` and `pass` values from <https://forwardemail.net>
        user: smtpUsername,
        pass: smtpPassword
    },
});

const sendWithNodemailer = async (emailData) => {
   try {
    const mailOptions = {
        from: smtpUsername, // sender address
        to: emailData.email, // list of receivers
        subject: emailData.subject, // Subject line
        html: emailData.body,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent', info.response);
   } catch (error) {
    console.error('Error happened sending email', error);
    throw new Error(error);
   }
}

module.exports = {
    sendWithNodemailer
}