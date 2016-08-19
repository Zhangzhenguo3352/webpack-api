// 这是 后台约定好的接口
var originUlr = '/api/books/add';
// 目录服务器只能接收  /books.add.json

function replace(src){
  // (.+)   =》  . 点 代表任意字符， + 加 代表 一个或多个
  //（.*）   =》  0 或多个

  //  /$1  第一个 分组
  //  /$1.$1.json       两个分组 才形成  /books.add.json

  //  /  要转译  =》 \/
  //  .  要转译  =》  \.
  return src.replace(/\/api\/(.+)\/(.+)/,'\/$1\.$2\.json');
}
console.log(replace(originUlr))
//    /books.add.json
