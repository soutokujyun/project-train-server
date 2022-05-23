'use strict';

const BaseController = require('./base.js');
const fse = require('fs-extra');
const path = require('path');

class FileController extends BaseController {

  // 1. 单文件上传
  async single() {
    // /public/file
    const { ctx } = this;
    const file = ctx.request.files[0];
    const publicPath = path.resolve(this.config.UPLOAD_DIR);

    // if (!fse.existsSync(chunkPath)) {
    //   await fse.mkdir(chunkPath);
    // }
    try {
      await fse.move(file.filepath, `${publicPath}/${file.filename}`);
    } catch (error) {
      console.log(error);
    }

    this.success({
      url: `/public/${file.filename}`,
    });

  }

  // 2. 多文件上传
  async multiple() {
    const { ctx } = this;
    const files = ctx.request.files;
    const publicPath = path.resolve(this.config.UPLOAD_DIR);

    const urls = [];
    await Promise.all(
      files.map(file => {
        return new Promise((resolve, reject) => {
          try {
            fse.move(file.filepath, `${publicPath}/${file.filename}`);
            urls.push(`/public/${file.filename}`);
            resolve();
          } catch (error) {
            console.log(error);
            reject(error);
          }
        });
      })
    );

    this.success({
      url: urls,
    });
  }

  // 3. 文件夹上传
  async directory() {
    const { ctx } = this;
    const files = ctx.request.files;
    const urls = [];

    const fileMove = file => new Promise(async resolve => {
      // 提取文件夹
      const relativePath = file.filename.replace(/@/g, path.sep);
      const index = relativePath.lastIndexOf(path.sep);
      const publicPath = path.join(this.config.UPLOAD_DIR, relativePath.substr(0, index));
      // 提取文件名
      const fileParts = file.filename.split('@');
      const fileName = fileParts[fileParts.length - 1];
      // 判断文件夹是否存在
      await fse.ensureDir(publicPath);
      await fse.move(file.filepath, `${publicPath}/${fileName}`);
      urls.push(path.join(`/public/${relativePath}`));
      resolve();
    });

    await Promise.all(
      files.map(file => {
        return fileMove(file);
      })
    );

    this.success({
      url: urls,
    });
  }


}

module.exports = FileController;
