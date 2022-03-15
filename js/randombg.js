//随机背景图片数组,图片可以换成图床链接，注意最后一条后面不要有逗号
var backimg =[
  "url(https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203151750462.jpg)",
  "url(https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203151750458.jpg)",
  "url(https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203151752037.jpeg)",
  "url(https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203151750460.jpg)"
];
//获取背景图片总数，生成随机数
var bgindex =Math.floor(Math.random() * backimg.length);
//重设背景图片
document.getElementById("web_bg").style.backgroundImage = backimg[bgindex];
//随机banner数组,图片可以换成图床链接，注意最后一条后面不要有逗号
var bannerimg =[
  "url(https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203151750462.jpg)",
  "url(https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203151750458.jpg)",
  "url(https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203151752037.jpeg)",
  "url(https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203151750460.jpg)"
];
//获取banner图片总数，生成随机数
var bannerindex =Math.floor(Math.random() * bannerimg.length);
//重设banner图片
document.getElementById("page-header").style.backgroundImage = bannerimg[bannerindex];