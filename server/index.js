module.exports = {
  devTest: { // 部署到测试服务器上
    remotePath: 'XXX', // 部署到服务器的路径
    host: 'XXX', // ip地址
    user: 'XXX', // 帐号
    pass: 'td!YMHGbFZ*4', // 密码
    port: 22 // 端口
  },
  devDist: { // 部署正式服务器上
    remotePath: '/pxpc/', // 部署到服务器的路径
    host: 'XXX', // ip地址
    user: 'XXX', // 帐号
    pass: 'XXX', // 密码
    port: 22 // 端口
  },
  publicPath: '/pxpc/', // 程序在网站根路径地址（必须与打包文件名相同 见config-index-build-assetsPublicPath）
  target: 'https://cnodejs.org/' // 连接的服务器地址
}
