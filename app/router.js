'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt({ app });
  router.get('/', controller.home.index);

  // 验证码
  router.get('/captcha', controller.utils.captcha);
  router.get('/sendcode', controller.utils.sendcode);
  // 文件
  router.post('/uploadfile', controller.utils.uploadfile);
  router.post('/mergefile', controller.utils.mergefile);
  router.post('/checkfile', controller.utils.checkfile);

  // 文件8个场景
  router.group({ name: 'upload', prefix: '/upload' }, router => {
    const { single, multiple, directory } = controller.upload;
    router.post('/single', single);
    router.post('/multiple', multiple);
    router.post('/directory', directory);
  });

  // 用户
  router.group({ name: 'user', prefix: '/user' }, router => {
    const { info, register, login, verify } = controller.user;
    router.post('/register', register);
    router.post('/login', login);
    router.get('/info', jwt, info);
    router.get('/detail', jwt, info);
    router.get('/verify', verify);
  });

  router.group({ name: 'article', prefix: '/article' }, router => {
    router.get('/', controller.article.index);
  });
};
