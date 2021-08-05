'use strict';

const Service = require('egg').Service;

class BillService extends Service {
  async add(params) {
    const { app } = this;
    const result = await app.mysql.insert('bill', params);
    return result;
  }
}

module.exports = BillService;
