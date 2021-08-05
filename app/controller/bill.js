'use strict';

const Controller = require('egg').Controller;


class BillController extends Controller {
  async add() {
    const { ctx, app } = this;
    // 获取参数
    const { amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;

    // 判断
    if (!amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
    }

    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;

      await ctx.service.bill.add({
        amount,
        type_id,
        type_name,
        date,
        pay_type,
        remark,
        user_id,
      });

      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: null,
      };

    } catch (error) {
      console.log(error);
      ctx.body = {
        code: 500,
        msg: '系统错误',
        data: null,
      };
    }
  }
}

module.exports = BillController;
