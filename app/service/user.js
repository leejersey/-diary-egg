'use strict';

const Service = require('egg').Service;

class UserService extends Service {
    // 通过用户名获取用户信息
  async getUserByName(username) {
    const { ctx, app } = this;
    try{
        const result = await app.mysql.get('user', { username });
        return result;
    }catch(err) {
        console.log(err);
        return null;
    }
    
  }

  // 注册
  async register(param) {
    const { ctx, app } = this;
    try{
        const result = await app.mysql.insert('user', param);
        return result;
    }catch(err) {
        console.log(err);
        return null;
    }
    
  }

  // 修改个性签名
  async editUserInfo(params){
    const { ctx, app } = this;
    try{
        const result = await app.mysql.update('user', {
            ...params
        }, {
            id: params.id
        });
        return result;
    }catch(err) {
        console.log(err);
        return null;
    }

  }
  
}
module.exports = UserService;