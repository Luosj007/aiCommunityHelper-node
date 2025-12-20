/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const auth = app.middleware.auth();
  // 登录相关路由
  // 新增创建管理员接口（仅开发环境使用，生产环境需加权限）
  router.post('/admin/create-admin', controller.login.createAdmin); // 创建/重置管理员账号（仅开发环境）
  router.post('/admin/login', controller.login.adminLogin); // 登录接口（无需认证）
  router.post('/miniprogram/login', controller.login.wxLogin); // 登录接口（无需认证）
  // 需认证的接口
  router.get('/user/current', auth, controller.login.getCurrentUser); // 获取当前用户信息

  // 小程序端服务接口
  router.get('/miniprogram/services', controller.service.list);
  router.get('/miniprogram/services/:id', controller.service.detail);
  // 管理端
  router.post('/admin/upload/serviceImg', auth, controller.upload.uploadImage);
  router.get('/admin/services', controller.service.list);
  router.get('/admin/services/:id', controller.service.detail);
  router.post('/admin/addServices', auth, controller.service.create);
  router.put('/admin/updaServices/:id', auth, controller.service.update);
  router.delete('/admin/delServices/:id', auth, controller.service.destroy);

  // 小程序端通知接口
  router.get('/miniprogram/notices', controller.notice.list);
  router.get('/miniprogram/notices/:id', controller.notice.detail);
  // 管理端
  router.get('/admin/notices', controller.notice.list);
  router.get('/admin/notices/:id', controller.notice.detail);
  router.post('/admin/addNotices', auth, controller.notice.create);
  router.put('/admin/updaNotices/:id', auth, controller.notice.update);
  router.delete('/admin/delNotices/:id', auth, controller.notice.destroy);

  // 小程序端工单接口
  router.get('/miniprogram/workOrders', controller.workOrder.list);
  // router.get('/miniprogram/workOrders/:id', controller.workOrder.detail);
  router.post('/miniprogram/addWorkOrders', controller.workOrder.create);
  // 注：auth()为你现有权限中间件，若没有可先保留，后续补充
  // 管理端
  router.get('/admin/workOrders', controller.workOrder.list);
  router.get('/admin/workOrders/:id', controller.workOrder.detail);
  router.post('/admin/addWorkOrders', auth, controller.workOrder.create);
  router.put('/admin/updaWorkOrders/:id', auth, controller.workOrder.update);
  router.delete('/admin/delWorkOrders/:id', auth, controller.workOrder.destroy);

  // 问答表
  router.get('/admin/qas', controller.qa.list);
};
