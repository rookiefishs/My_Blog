/*
 * @Author: wangzhiyu <w19165802736@163.com>
 * @Date: 2023-12-29 09:22:13
 * @LastEditTime: 2024-01-26 09:03:06
 * @Descripttion: 工具函数
 */

/**
 * 设置本地存储
 * @param {string} k 本地存储的key
 * @param {any} v 本地存储的value
 */
export const setItem = (k, v) => {
  if (typeof v === 'object') {
    localStorage.setItem(k, JSON.stringify(v));
  } else {
    localStorage.setItem(k, v);
  }
};

/**
 * 获取本地存储数据
 * @param {string} k 本地存储的key
 * @returns 获取到的本地存储
 */
export const getItem = k => {
  const data = localStorage.getItem(k);
  try {
    return JSON.parse(data);
  } catch (error) {
    return data;
  }
};

/**
 * 清除指定的 本地存储的 数据
 * @param {string} k 本地存储的标识
 */
export const removeItem = k => {
  localStorage.removeItem(k);
};

/**
 * 解析时间,将此时的时间从英文状态转换为中文
 * @param {number|string|Date} time - 要解析的时间，可以是时间戳、日期字符串或 Date 对象
 * @param {string} [cFormat] - 输出时间的格式，默认为 '{y}-{m}-{d} {h}:{i}:{s}'
 * @returns {string|null} 格式化后的时间字符串，如果输入时间无效则返回 null
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null;
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
  let date;
  if (typeof time === 'object') {
    date = time;
  } else {
    if (typeof time === 'string') {
      if (/^[0-9]+$/.test(time)) {
        time = parseInt(time);
      } else {
        time = time.replace(new RegExp(/-/gm), '/');
      }
    }

    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000;
    }
    date = new Date(time);
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    return value.toString().padStart(2, '0');
  });
  return time_str;
}

/**
 * 格式化时间并返回人性化的时间描述
 * @param {number|string} time - 要格式化的时间，可以是时间戳或日期字符串
 * @param {string} [option] - 输出时间的格式选项（参考 parseTime 函数的 cFormat 参数）
 * @returns {string} 格式化后的时间描述字符串
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000;
  } else {
    time = +time;
  }
  const d = new Date(time);
  const now = Date.now();

  const diff = (now - d) / 1000;

  if (diff < 30) {
    return '刚刚';
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前';
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前';
  } else if (diff < 3600 * 24 * 2) {
    return '1天前';
  }
  if (option) {
    return parseTime(time, option);
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分';
  }
}

/**
 * url参数转换为对象
 * @param {string} url url链接
 * @returns
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ');
  if (!search) {
    return {};
  }
  const obj = {};
  const searchArr = search.split('&');
  searchArr.forEach(v => {
    const index = v.indexOf('=');
    if (index !== -1) {
      const name = v.substring(0, index);
      const val = v.substring(index + 1, v.length);
      obj[name] = val;
    }
  });
  return obj;
}

/**
 * 将数据转换为树形结构
 * @param {array} list 要转换为树形结构的一维数组
 * @param {number|undefined} pid 最上面一层tree的标识,同时保证后续的children也都是按照某一个标识来划分父子的
 * @returns 转换之后的树形结构
 */
export const transTreeData = (list, pid) => {
  const arr = [];
  list.forEach(item => {
    if (item.pid === pid) {
      const children = transTreeData(list, item.id);
      if (children.length > 0) {
        item.children = children;
      }
      arr.push(item);
    }
  });
  return arr;
};

/**
 * 生成十六进制随机色
 * @returns 十六进制随机色
 */
export const generateRandomHexColor = () => `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;

/**
 * 将指定的文本复制到粘贴板
 * @param {string} text 指定的文本
 */
export const copyToClipboard = text => {
  navigator.clipboard && navigator.clipboard.writeText && navigator.clipboard.writeText(text);
};

/**
 * 滚动到顶部
 * @param {HTMLElement} element 需要滚动到顶部的dom元素
 * @param {string} behavior 滚动时的过渡方式 smooth:滚动应该是平滑的动画 | instant:滚动应该通过一次跳跃立刻发生 | auto:滚动行为由 scroll-behavior 的计算值决定
 */
export const scrollToTop = (element, behavior) => {
  element.scrollIntoView({ behavior, block: 'start' });
};

/**
 * 滚动到底部
 * @param {HTMLElement} element 需要滚动到底部的dom元素
 * @param {string} behavior 滚动时的过渡方式 smooth:滚动应该是平滑的动画 | instant:滚动应该通过一次跳跃立刻发生 | auto:滚动行为由 scroll-behavior 的计算值决定
 */
export const scrollToBottom = (element, behavior) => {
  element.scrollIntoView({ behavior, block: 'end' });
};

/**
 * 防抖函数
 * @param {function} func 需要进行防抖的函数
 * @param {number} wait 防抖等待时间
 * @param {boolean} immediate 判定是否初始就调用过了
 * @returns 处理过防抖之后的函数
 */
export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result;

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last);
    } else {
      timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      }
    }
  };

  return function (...args) {
    context = this;
    timestamp = +new Date();
    const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait);
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };
}

/**
 * 递归深拷贝
 * @param {object} source 深克隆对象
 * @returns 深克隆之后的对象
 */
export function deepClone(source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'deepClone');
  }
  const targetObj = source.constructor === Array ? [] : {};
  Object.keys(source).forEach(keys => {
    if (source[keys] && typeof source[keys] === 'object') {
      targetObj[keys] = deepClone(source[keys]);
    } else {
      targetObj[keys] = source[keys];
    }
  });
  return targetObj;
}

/**
 * 给指定dom添加class类名
 * @param {HTMLElement} elm 指定html元素
 * @param {string} cls class类名
 */
export function addClass(ele, cls) {
  if (!hasClass(ele, cls)) ele.className += ' ' + cls;
}

/**
 * 给指定dom删除class类名
 * @param {HTMLElement} elm 指定html元素
 * @param {string} cls class类名
 */
export function removeClass(ele, cls) {
  if (hasClass(ele, cls)) {
    const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
    ele.className = ele.className.replace(reg, ' ');
  }
}

/**
 * 首字母大写
 * @param {string} str 首字母大写的字符串
 * @returns 首字母大写后的字符串
 */
export function titleCase(str) {
  return str.replace(/( |^)[a-z]/g, L => L.toUpperCase());
}

/**
 * 下划转驼峰
 * @param {string} str 需要下划转驼峰的字符串
 * @returns 下划转驼峰之后的字符串
 */
export function camelCase(str) {
  return str.replace(/_[a-z]/g, str1 => str1.substr(-1).toUpperCase());
}

/**
 * 下载文件流
 * @param {blbo} res 二进制文件流
 * @param {string} type 文件流的MIME
 * @param {string} fileName 下载的文件名称
 */
export const downloadFileStream = (res, type, fileName) => {
  const blob = new Blob([res], { type });
  const elink = document.createElement('a');
  elink.download = fileName;
  elink.style.display = 'none';
  elink.href = URL.createObjectURL(blob);
  document.body.appendChild(elink);
  elink.click();
  URL.revokeObjectURL(elink.href);
  document.body.removeChild(elink);
};

/**
 * 快捷执行回调函数,内部进行函数类型判断
 * @param {Function} callback
 * @param  {...any} args 携带的参数
 */
export const callBackHandler = (callback, ...args) => {
  if (callback && typeof callback === 'function' && callback instanceof Function) {
    return callback(...args);
  }
};
