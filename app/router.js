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
  router.get('/user/current', auth, controller.login.getCurrentUser); // 获取当前用户信息（需认证）

  // 小程序端服务接口
  router.get('/miniprogram/services', controller.service.list);
  router.get('/miniprogram/services/:id', controller.service.detail);
  // 管理端
  router.get('/admin/services', controller.service.list);
  router.get('/admin/services/:id', controller.service.detail);
  router.post('/admin/addServices', auth, controller.service.create);
  router.put('/admin/updaServices/:id', app.middleware.auth(), controller.service.update);
  router.delete('/admin/delServices/:id', app.middleware.auth(), controller.service.destroy);

  // 小程序端通知接口
  router.get('/miniprogram/notices', controller.notice.list);
  router.get('/miniprogram/notices/:id', controller.notice.detail);
  // 管理端
  router.get('/admin/notices', controller.notice.list);
  router.get('/admin/notices/:id', controller.notice.detail);
  router.post('/admin/addNotices', app.middleware.auth(), controller.notice.create);
  router.put('/admin/updaNotices/:id', app.middleware.auth(), controller.notice.update);
  router.delete('/admin/delNotices/:id', app.middleware.auth(), controller.notice.destroy);

  // 小程序端工单接口
  router.get('/miniprogram/workOrders', controller.workOrder.list);
  // router.get('/miniprogram/workOrders/:id', controller.workOrder.detail);
  router.post('/miniprogram/addWorkOrders', controller.workOrder.create);
  // 注：auth()为你现有权限中间件，若没有可先保留，后续补充
  router.get('/admin/workOrders', app.middleware.auth(), controller.workOrder.list);
  router.get('/admin/workOrders/:id', app.middleware.auth(), controller.workOrder.detail);
  router.post('/admin/addWorkOrders', app.middleware.auth(), controller.workOrder.create);
  router.put('/admin/updaWorkOrders/:id', app.middleware.auth(), controller.workOrder.update);
  router.delete('/admin/delWorkOrders/:id', app.middleware.auth(), controller.workOrder.destroy);
};
