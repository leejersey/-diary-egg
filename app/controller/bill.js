'use strict';

const moment = require('moment');
const Controller = require('egg').Controller;

class BillController extends Controller {
  // 新增账单
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
      return;
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

  // 账单列表获取
  async list() {
    const { ctx, app } = this;
    // 获取参数
    const { date, page = 1, page_size = 5, type_id = 'all' } = ctx.query;

    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;
      // 获取当前用户的账单列表
      const list = await ctx.service.bill.list(user_id);
      // 过滤出类型和月份对应的账单列表
      const _list = list.filter(item => {
        // console.log(item.date, moment(Number(item.date)).format('YYYY-MM'));
        if (type_id !== 'all') {
          return moment(Number(item.date)).format('YYYY-MM') === date && type_id === item.type_id;
        }
        return moment(Number(item.date)).format('YYYY-MM') === date;
      });
      // 格式化数据
      const listMap = _list.reduce((curr, item) => {
        // 格式化账单时间
        const date = moment(Number(item.date)).format('YYYY-MM-DD');
        // 如果在累加的数组中找到当前项日期date 那么在数组中的加入到当前项到bills数组
        if (curr && curr.length && curr.findIndex(item => item.date === date) > -1) {
          const index = curr.findIndex(item => item.date === date);
          curr[index].bills.push(item);
        }
        // 如果在累加的数组中找不到当前项日期 那么在新建一项
        if (curr && curr.length && curr.findIndex(item => item.date === date) === -1) {
          curr.push({
            date,
            bills: [ item ],
          });
        }
        // 如果curr为空 则默认添加第一项item
        if (!curr.length) {
          curr.push({
            date,
            bills: [ item ],
          });
        }
        return curr;
      }, []).sort((a, b) => moment(b.date) - moment(a.date));// 按时间排序
      // 分页
      const filterListMap = listMap.slice((page - 1) * page_size, page * page_size);

      // 计算当月总收入和支出
      // 获取当月所有账单列表
      const __list = list.filter(item => moment(Number(item.date)).format('YYYY-MM') === date);
      console.log(__list);
      // 累加计算支出
      const totalExpense = __list.reduce((curr, item) => {
        if (item.pay_type === 1) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);
      // 累加计算收入
      const totalIncome = __list.reduce((curr, item) => {
        if (item.pay_type === 2) {
          curr += Number(item.amount);
          return curr;
        }
        return curr;
      }, 0);

      // 返回处理的数据
      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: {
          totalExpense,
          totalIncome,
          totalPage: Math.ceil(listMap.length / page_size),
          list: filterListMap || [],
        },

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

  // 获取账单详情
  async detail() {
    const { ctx, app } = this;
    // 获取参数
    const { id = '' } = ctx.query;
    const token = ctx.request.header.authorization;
    // 获取当前用户信息
    const decode = await app.jwt.verify(token, app.config.jwt.secret);
    if (!decode) return;
    const user_id = decode.id;
    // 判断是否存在id
    if (!id) {
      ctx.body = {
        code: 500,
        msg: '订单id不能为空',
        data: null,
      };
      return;
    }

    try {
      const detail = await ctx.service.bill.detail(id, user_id);

      ctx.body = {
        code: 200,
        msg: '请求成功',
        data: detail,
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

  // 修改账单
  async update() {
    const { ctx, app } = this;
    // 获取参数
    const { id, amount, type_id, type_name, date, pay_type, remark = '' } = ctx.request.body;

    // 判断
    if (!id || !amount || !type_id || !type_name || !date || !pay_type) {
      ctx.body = {
        code: 400,
        msg: '参数错误',
        data: null,
      };
      return;
    }

    try {
      const token = ctx.request.header.authorization;
      const decode = await app.jwt.verify(token, app.config.jwt.secret);
      if (!decode) return;
      const user_id = decode.id;

      await ctx.service.bill.update({
        id,
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
