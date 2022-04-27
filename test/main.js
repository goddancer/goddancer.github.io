/**
 * @param {string} s
 * @return {number}
 */
var threeSum = function (s) {
  let list = s.split(''), len = list.length
  if (len % 2 === 1) {
    return false
  }
  // 使用堆栈模拟
  const stack = []
  const map = new Map([
    ['(', ')'],
    ['{', '}'],
    ['[', ']']
  ])
  for (let i = 0; i < len; i++) {
    let hit = map.get(list[i])
    if (hit) {
      stack.push(hit)
    } else {
      if (list[i] !== stack.pop()) {
        return false
      }
    }
  }
  return stack.length === 0
};
console.log(threeSum("([)]"))
