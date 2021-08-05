'use strict';

// 登录验证中间件
module.exports = (secret) => {
    return async function jwtErr(ctx, next) {
        // 获取token
        const token = ctx.request.header.authorization;
        let decode;
        if (token != 'null' && token){
            try {
                decode = ctx.app.jwt.verify(token, secret) //验证token
                await next();
            } catch(err) {
                console.log('error', err)
                ctx.status = 200;
                ctx.body = {
                msg: 'token已过期，请重新登录',
                code: 401,
                }
                return;
            }
        } else {
            ctx.status = 200;
            ctx.body = {
                code: 401,
                msg: 'token不存在',
            };
            return;
        }
    }
}
