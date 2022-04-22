---
layout: post
title: typescript use case
categories: [Typescript]
description: typescript use case
keywords: typescript, record, keyof, typeof
---

## useCase

### type数组转对象 && 对象元素小写化

```typescript
// const COMMON_HEADERS: readonly ["App-Ver", "Accept-Language", "X-requestid", "X-antispams", "X-device", "X-timestamp", "X-product"]
export const COMMON_HEADERS = ['App-Ver', 'Accept-Language', 'X-requestid', 'X-antispams', 'X-device', 'X-timestamp', 'X-product'] as const
const COMMON_HEADERS_LOWERCASE: string[]
export const COMMON_HEADERS_LOWERCASE = COMMON_HEADERS.map(it => it.toLocaleLowerCase())

// type COMMON_HEADERS_TYPE = "App-Ver" | "Accept-Language" | "X-requestid" | "X-antispams" | "X-device" | "X-timestamp" | "X-product"
export type COMMON_HEADERS_TYPE = typeof COMMON_HEADERS[number]
// type COMMON_HEADERS_LOWERCASE_TYPE = "app-ver" | "accept-language" | "x-requestid" | "x-antispams" | "x-device" | "x-timestamp" | "x-product"
export type COMMON_HEADERS_LOWERCASE_TYPE = Lowercase<typeof COMMON_HEADERS[number]>
/* 
  type GetCommonHeadersData = {
    "App-Ver": string | number;
    "Accept-Language": string | number;
    "X-requestid": string | number;
    "X-antispams": string | number;
    "X-device": string | number;
    "X-timestamp": string | number;
    "X-product": string | number;
  }
 */
export type GetCommonHeadersData = Record<COMMON_HEADERS_TYPE, string | number>
/* 
  type NormalizeHeadersData = {
    "app-ver": string | number;
    "accept-language": string | number;
    "x-requestid": string | number;
    "x-antispams": string | number;
    "x-device": string | number;
    "x-timestamp": string | number;
    "x-product": string | number;
  }
 */
export type NormalizeHeadersData = Record<COMMON_HEADERS_LOWERCASE_TYPE, string | number>
```
--

[1] [TypeScript入门教程](https://ts.xcatliu.com/basics/type-of-function.html)
[2] [深入理解TypeScript](https://jkchao.github.io/typescript-book-chinese/faqs/type-guards.html#%E4%B8%BA%E4%BB%80%E4%B9%88-x-instanceof-foo-%E4%B8%8D%E8%83%BD%E5%B0%86-x-%E7%9A%84%E7%B1%BB%E5%9E%8B%E7%BC%A9%E5%B0%8F%E8%87%B3-foo%EF%BC%9F)
[3] [基于TypeScript的Vue3.0初体验](https://juejin.cn/post/6883388734273191944#heading-38)
[3] [TypeScript - 简单易懂的 keyof typeof 分析](https://juejin.cn/post/7023238396931735583)
