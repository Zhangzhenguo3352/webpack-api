var originUrl = '/api/books2';

function replace(src){
  // (.+)   =》  . 点 代表任意字符， + 加 代表 一个或多个
  //（.*）   =》  0 或多个
  return src.replace(/\/api\/(.+)/,'\/$1\.json')
}
console.log(replace(originUrl))  //  /books2.json
