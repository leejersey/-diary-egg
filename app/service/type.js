'use strict';

const Service = require('egg').Service;

class TypeService extends Service {
  async list(id) {
    const { app } = this;
    try {
      const QUERY_STR = 'id, name, type, user_id';
      const result = await app.mysql.query(`select ${QUERY_STR} from type where user_id = 0 or user_id = ${id}`);
      return result;
    } catch (error) {
      console.log(error);
    }
  }

}

module.exports = TypeService;
