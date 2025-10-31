const getQueryStringByName = function (name: string) {
  var result = location.search.match(new RegExp('[?&]' + name + '=([^&]+)', 'i'));
  if (result == null || result.length < 1) {
    return '';
  }
  return result[1];
};

const transformData = function (data: any) {
  const params = new FormData();
  for (const item in data) {
    params.append(item, data[item]);
  }
  return params;
};

const DateFormat = function (date: any, fmt: string) {
  fmt = fmt || 'yyyy-MM-dd hh:mm:ss';
  if (date === null || typeof date === 'undefined' || date === '') {
    return null;
  } else {
    // 时间要转成obj，否则报错
    date = new Date(date);
  }
  var o: any = {
    'M+': date.getMonth() + 1, // 月
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return fmt;
};
function mergeObjects<T extends object>(...objs: T[]): T {
  return objs.reduce((acc, obj) => {
    Object.entries(obj).forEach(([key, value]) => {
      if (value) {
        (acc as any)[key] = value;
      }
    });
    return acc;
  }, {} as T);
}

//平铺树结构
function flattenTreeIterative(
  tree: any[],
  childrenKey = 'children',
  callback: (node: any) => void
) {
  const result = [];
  const stack = [...tree];

  while (stack.length) {
    const node = stack.pop();
    const { [childrenKey]: children, ...rest } = node;
    callback && callback(rest);
    result.push(rest);
    if (children && children.length > 0) {
      stack.push(...children);
    }
  }

  return result.reverse(); // reverse是为了保持原来的顺序
}

function traverseTreeDFS(
  tree: any[],
  callback: (node: any, parentNode: any) => void,
  childrenKey = 'children'
) {
  function dfs(nodes: any[], parent = null) {
    for (const node of nodes) {
      callback(node, parent); // 执行用户回调
      if (node[childrenKey] && node[childrenKey].length > 0) {
        dfs(node[childrenKey], node);
      }
    }
  }
  dfs(tree);
}
export {
  DateFormat,
  flattenTreeIterative,
  getQueryStringByName,
  mergeObjects,
  transformData,
  traverseTreeDFS
};
