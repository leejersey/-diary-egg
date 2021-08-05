'use strict';
const moment = require('moment')

const Controller = require('egg').Controller;

const defaultAvatar = 'http://s.yezgea02.com/1615973940679/WeChat77d6d2ac093e247c361f0b8a7aeb6c2a.png'

class UserController extends Controller {
    // 注册
    async register() {
        const { ctx } =this;
        const { username,  password } = ctx.request.body;
        const userInfo = await ctx.service.user.getUserByName(username)

        // 判断是否已经存在
        if (userInfo && userInfo.id) {
            ctx.body = {
                code: 500,
                msg: '账户名已被注册，请重新输入',
                data: null
            }
            return
        }

        // 注册
        const result = await ctx.service.user.register({
            username,
            password,
            signature: '123456abc',
            avatar: defaultAvatar,
            ctime: moment(new Date()).format('x')
        });

        if(result){
            ctx.body = {
                code: 200,
                msg: '注册成功',
                data: null
            }
        } else {
            ctx.body = {
                code: 500,
                msg: '注册失败',
                data: null
            }
        }
    }

    // 登录
    async login() {
        const { ctx, app } = this;
        const { username, password } = ctx.request.body;
        console.log(username);
        const userInfo = await ctx.service.user.getUserByName(username)
        // 没找到该用户
        if(!userInfo || !userInfo.id){
            ctx.body = {
                code: 500,
                msg: '账号不存在',
                data: null
              }
              return
        }

        // 找到用户，判断密码是否相同
        if(userInfo && password != userInfo.password) {
            ctx.body = {
                code: 500,
                msg: '账号密码错误',
                data: null
              }
              return
        }

        // 生成token
        const token = app.jwt.sign({
            id: userInfo.id,
            username: userInfo.username,
            exp: Math.floor(Date.now()/1000) + (24*60*60)
        }, app.config.jwt.secret);

        ctx.body = {
            code: 200,
            message: '登录成功',
            data: {
              token
            },
          };
    }
}

module.exports = UserController;
