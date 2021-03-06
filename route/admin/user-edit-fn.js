//引入用户集合的构造函数
const {User, validateUser} = require('../../model/user');
module.exports = async (req, res, next) => {
    try {
        await validateUser(req.body);
    } catch (error) {
        //验证没有通过
        // error.message
        //重定向回用户添加页面
        
        //JSON.stringify()将对象数据类型转换为字符串数据类型
        return next(JSON.stringify({path: '/admin/user-edit', message: error.message}))
    }
    //根据邮箱地址查询用户是否存在
    let user = await User.findOne({email: req.body.email});
    //如果用户已经存在，邮箱地址已经被别人占有
    if(user) {
        //重定向回用户添加页面
        // return res.redirect('/admin/user-edit?message=邮箱地址已经被占用');
        return next(JSON.stringify({path: '/admin/user-edit', message: '邮箱地址已经被占用'}));
    }
    //将用户信息添加到数据库中
    await User.create(req.body);
    //将页面重定向到用户列表页面
    res.redirect('/admin/user');
};