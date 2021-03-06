//创建用户集合
//mongoose第三方模块
const mongoose = require('mongoose');
//引入joi模块
const Joi = require('joi');
//创建用户集合规则
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        //必须填写有户名
        required: true,
        minlength: 2,
        maxlength: 20
    },
    email: {
        type: String,
        //保证邮箱地址在插入数据库时不重复
        unique: true
    },
    password: {
        type: String,
        required: true,
        required: true
    },
    //admin 超级管理员
    //mormal 普通用户
    role: {
        type: String,
        required: true
    },
    //0 启用状态
    //1 禁用状态
    state: {
        type: Number,
        default: 0
    }
})
//创建集合
const User = mongoose.model('User', userSchema);

//创建初始化用户
// User.create({
//     username: 'liuzhen',
//     email: '2879341932@qq.com',
//     password: '123456',
//     role: 'admin',
//     state: 0
// }).then(() => {
//     console.log('用户创建成功')
// }).catch(() => {
//     console.log('用户创建失败')
// })

//验证用户信息
const validateUser = (user) => {
    //定义对象验证规则
    const schema = {
        username: Joi.string().min(2).max(12).required().error(new Error('用户名格式不符合验证规则')),
        email: Joi.string().email().error(new Error('邮箱格式不符合验证规则')),
        password: Joi.string().regex(/^[a-zA-Z0-9]{3,30}$/).required().error(new Error('密码格式不符合验证规则')),
        role: Joi.string().valid('normal', 'admin').required().error(new Error('角色值非法')),
        state: Joi.number().valid(0, 1).required().error(new Error('状态值非法')),
    };
    //实施验证
    return Joi.validate(user, schema);
};

//将用户集合作为模块进行导出
module.exports = {
    User,
    validateUser
}