---
layout: post
title: template page
categories: [cate1, cate2]
description: some word here
keywords: keyword1, keyword2
---

### 利用`property getter setter`

```javascript
let passiveSupported = false
try {
  document.body.addEventListener('__passive_check__', null, Object.defineProperty(Object.create(null), 'passive', {
    get: function() {
      passiveSupported = true
    }
  }))
} catch(ignore) {
  // ignore
}
```

### 利用`Object property get`

```javascript
let passiveSupported = false
try {
  document.body.addEventListener('__passive_check__', null, {
    get passive() {
      passiveSupported = true
      return false
    },
    once: true,
  })
} catch(ignore) {
  // ignore
}
```

### 利用`Object.prototype`

```javascript
let passiveSupported = false
try {
  document.body.addEventListener('__passive_check__', null, Object.create({
    get passive() {
      passiveSupported = true
      return false
    },
    once: true,
  }))
} catch(ignore) {
  // ignore
}
```