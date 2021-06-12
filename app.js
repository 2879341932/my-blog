//引入ecpress框架
const express = require('express');
//处理路径
const path = require('path');
//下载并引入body-parser模块
const bodyParser = require('body-parser');
//下载并导入express-session模块
const session = require('express-session');
//创建网站服务器
const app = express();
//数据库连接
require('./model/connect');
//处理post请求参数
app.use(bodyParser.urlencoded({extended: false}));
//配置session
app.use(session({secret: 'secret key'}));
// app.use(session({
//     resave: false, //添加 resave 选项
//     saveUninitialized: true, //添加 saveUninitialized 选项
//     secret: 'aF,.j)wBhq+E9n#aHHZ91Ba!VaoMfC', // 建议使用 128 个字符的随机字符串
//     cookie: { maxAge: 60 * 1000 }
//   }));
//告诉express框架模板所在的位置
app.set('views', path.join(__dirname, 'views'));
//告诉express框架模板的默认后缀
app.set('view engine', 'art');
//当渲染后缀为art的模板时，所使用的模板引擎时什么
app.engine('art', require('express-art-template'));
//开放静态资源
app.use(express.static(path.join(__dirname, 'public')));

//引入路由模块
const home = require('./route/home.js');
const admin = require('./route/admin.js');
const { nextTick } = require('process');

//拦截请求，判断用户登录状态
app.use('/admin', require('./middleware/loginGuard'));

//为路由匹配请求路径
app.use('/home', home);
app.use('/admin', admin);

app.use((err, req, res, next) => {
    //JSON。parse()将字符串对象转换欸对象类型
    const result = JSON.parse(err);
    let params = [];
    for (let attr in result) {
        if (attr != 'path') {
            params.push(attr + '=' + result[attr]);
        }
    }
    res.redirect(result.path + '?' + params.join('&'));
})
//监听端口
app.listen(80);
console.log('网站服务器启动成功，请访问localhost');