const obj = {
  a: 1,
  [Symbol('name')]: 'hola',
  b: function () { },
  b1: () => 2,
  c: new RegExp(/\d/, 'ig'),
  d: undefined,
  e: /\d/ig,
  f: new Date(),
}
// 深拷贝其实挺简单的，或者说所有的递归其实都很简单，首先考虑好递归终止条件，一一列出，然后根据发生递归的条件递归即可
const deepClone = (obj, weakObj = new WeakMap()) => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }
  if (obj instanceof Date) {
    return new Date(obj)
  }
  if (obj instanceof RegExp) {
    return new RegExp(obj)
  }
  if (weakObj.has(obj)) {
    return weakObj.get(obj)
  }
  weakObj.set(obj)
  const resObj = Array.isArray(obj) ? [] : {}
  Reflect.ownKeys(obj).forEach(key => {
    resObj[key] = deepClone(obj[key], weakObj)
  })
  return resObj
}
console.log('deepClone(obj): ', deepClone(obj));
