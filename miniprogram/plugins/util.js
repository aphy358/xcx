
/**
 * 获取指定的url参数值
 * @param {指定的url参数名} name
 */
export const queryString = function (name, targetStr) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r;
  if (!targetStr) {
    if(window.location.search){
      r = window.location.search.substr(1).match(reg);
    }else if(window.location.hash){
      if (window.location.hash.indexOf('?') !== -1){
        r = window.location.hash.split('?')[1].match(reg);
      }
    }
  } else {
    r = targetStr.match(reg);
  }
  return r != null ? unescape(r[2]) : null;
}

// 在给定的日期基础上加上若干天，并格式化成 '2017-10-01' 的字符串返回
export const addDays = function (d1, num, sep) {
  sep = sep || '-';
  num = num || 0;
  if (typeof d1 === 'string') d1 = new Date(d1.replace(/-/g, '/'));
  return new Date(+d1 + num * 24 * 60 * 60 * 1000).Format('yyyy' + sep + 'MM' + sep + 'dd');
}

// 对日期格式化1
export const formatDateOne = (dateStr) => {
  return dateStr.replace(/-/g, '/')
}

// 对日期格式化2
export const formatDateTwo = (dateStr) => {
  return dateStr.replace(/-/g, '/') + ' 00:00:00'
}

// 获取星级的字面表示
export const getStarText = (n) => {
  n.starText = 
    n.star <= 25 ? '经济型' : 
    n.star <= 35 ? '舒适型' : 
    n.star <= 45 ? '高档型' : '豪华型'
}
