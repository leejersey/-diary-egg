'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  const _jwt = middleware.jwtErr(app.config.jwt.secret);
  router.get('/', controller.home.index);
  router.get('/user', controller.home.user);
  router.post('/add_user', controller.home.addUser);
  router.post('/api/user/register', controller.user.register);
  router.post('/api/user/login', controller.user.login);
  router.get('/api/user/get_userinfo', _jwt, controller.user.getUserInfo);
  router.post('/api/user/edit_userinfo', _jwt, controller.user.editUserInfo);

  router.get('/api/type/list', _jwt, controller.type.list); // 获取类型列表

  router.post('/api/bill/add', _jwt, controller.bill.add); // 新增账单
  router.get('/api/bill/list', _jwt, controller.bill.list); // 账单类表
  router.get('/api/bill/detail/:id', _jwt, controller.bill.detail); // 账单详情
  router.post('/api/bill/update', _jwt, controller.bill.update); // 修改账单

  router.post('/api/upload', _jwt, controller.upload.upload); // 图片上传

  router.get('/api/user/test', _jwt, controller.user.test); // 测试token

};
