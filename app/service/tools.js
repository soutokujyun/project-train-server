'use strict';

const { Service } = require('egg');
const nodemailer = require('nodemailer');

const userEmail = 'soutokujyun@163.com';

const transporter = nodemailer.createTransport({
  service: '163', // no need to set host or port etc.
  secure: true,
  auth: {
    user: userEmail,
    pass: 'KUCMHVNDXGFZTTGT',
  },
});

class ToolsService extends Service {
  async sendMail(email, subject, text, html) {
    // 邮件发送的时候 cc 给自己可以避免被视为垃圾邮件
    const mailOptions = {
      from: userEmail,
      cc: userEmail,
      to: email,
      subject,
      text,
      html,
    };
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      console.log('email error: ', error);
      return false;
    }
  }
}

module.exports = ToolsService;
