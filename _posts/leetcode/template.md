---
layout: post
title: leetcode
categories: [Leetcode]
description: leetcode
keywords: leetcode
---

## leetcode

### [求最长回文字符串](https://leetcode-cn.com/problems/longest-palindromic-substring/)

**回文字符串即以中心元素左右对称的字符串结构**

```javascript
// longestPalindrome("babad") // bab或aba
// longestPalindrome("abca") // a
// longestPalindrome("bbbaad") // bbb
// longestPalindrome("bbabbad") // bbabb
// longestPalindrome("abbbc") // bbb

var longestPalindrome = function(s) {
  const list = s.split(''), temp = []
  const everyOneIsSame = arr => arr.every((it, i, s) => it === s[0])
  for (let i = 0, len = list.length; i < len; i++) {
    // mid为中心位，可拓展多个相同元素
    let left = i - 1, right = i + 1, cur = list[i], mid = [cur]
    if (i === 0) {
      while (list[right] === list[i]) {
        mid.push(list[right])
        right ++
      }
    } else {
      while (left >= 0 && right <= len) {
        if (cur === list[right] && everyOneIsSame(mid)) {
          mid.push(list[right])
          right++
        } else if (list[left] === list[right]) {
          mid = [list[left], ...mid, list[right]]
          left--
          right++
        } else {
          break
        }
      }
    }
    temp[i] = mid
  }
  temp.sort((a, b) => b.length - a.length)
  return temp[0].join('')
};
longestPalindrome("babad") // bab或aba
longestPalindrome("abca") // a
longestPalindrome("bbbaad") // bbb
longestPalindrome("bbabbad") // bbabb
longestPalindrome("abbbc") // bbb
```

解题要点：
* 双指针遍历，以index=0顺序遍历为基准，left-- right++
* mid为中心位，中心位可能包含至少一个，至多N个相同元素
* index对应的值和right相同时，单指针right++递增，mid中心位拓展
  * 在拓展中心位的场景下，不需要考虑left--的情况，因为遍历从左至右，left都会包含
需要考虑的几种情况：
* 所有字符无法回文时，返回第一个元素

<iframe name="codemirror" font-size="14" src="{{ site.url }}/public/codemirror/index.html">
var longestPalindrome = function(s) {
  const list = s.split(''), temp = []
  const everyOneIsSame = arr => arr.every((it, i, s) => it === s[0])
  for (let i = 0, len = list.length; i < len; i++) {
    let left = i - 1, right = i + 1, cur = list[i], mid = [cur]
    if (i === 0) {
      while (list[right] === list[i]) {
        mid.push(list[right])
        right ++
      }
    } else {
      while (left >= 0 && right <= len) {
        if (cur === list[right] && everyOneIsSame(mid)) {
          mid.push(list[right])
          right++
        } else if (list[left] === list[right]) {
          mid = [list[left], ...mid, list[right]]
          left--
          right++
        } else {
          break
        }
      }
    }
    temp[i] = mid
  }
  temp.sort((a, b) => b.length - a.length)
  return temp[0].join('')
};
longestPalindrome("babad") // bab或aba
longestPalindrome("abca") // a
longestPalindrome("bbbaad") // bbb
longestPalindrome("bbabbad") // bbabb
longestPalindrome("abbbc") // bbb
</iframe>

```javascript
```

```javascript
```

```javascript
```

```javascript
```

---

[1] [Nodejs打包构建时长优化](https://www.cnblogs.com/Dev0ps/p/15509671.html)
