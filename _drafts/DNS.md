---
layout: post
title: 域名解析
categories: [dns]
description: 域名解析
keywords: CNAME, dns
---

## 解析类型

1. `A`:
2. `NS`:
3. `MX`:
4. `TXT`:
5. `CNAME`:
6. `SRV`:
7. `AAAA`:
8. `显性URL转发`:
9. `隐性URL转发`:

## 解析规则

1. `*` 泛解析
2. `www` 域名解析为`www.example.com`，访问需加`www`
3. `@` 域名解析为`example.com`，访问不需要加`www`
4. `mail` 邮箱服务器解析，域名解析为`mail.example.com`
5. `二级域名` 域名解析为`sub.example.com`
2. `手机网站` 域名解析为`m.example.com`

---

[1] [不带 www 的域名和带 www 域名都能访问网站](https://help.aliyun.com/document_detail/39786.html)