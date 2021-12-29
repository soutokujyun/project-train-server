'use strict';

const { Service } = require('egg');
const nodemailer = require('nodemailer');
const path = require('path');
const fse = require('fs-extra');

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
  async mergeFile(filePath, hash, size) {
    const chunkDir = path.resolve(this.config.UPLOAD_DIR, hash); // 切片文件夹
    let chunks = await fse.readdir(chunkDir);
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1]);
    chunks = chunks.map(cp => path.resolve(chunkDir, cp));
    await this.mergeChunks(chunks, filePath, size);
  }

  async mergeChunks(files, dest, size) {
    const pipStream = (filePath, writeStream) => new Promise(resolve => {
      const readStrem = fse.createReadStream(filePath);
      readStrem.on('end', () => {
        fse.unlinkSync(filePath);
        resolve();
      });
      readStrem.pipe(writeStream);
    });

    await Promise.all(
      files.map((file, index) => {
        return pipStream(file, fse.createWriteStream(dest, {
          start: (index * size),
          end: ((index + 1) * size),
        }));
      })
    );

    return;
  }

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
