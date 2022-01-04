---
layout: post
title: less
categories: [linux]
description: linux cmd less
keywords: linux, less, cmd
---

> less是对文件或其他输出进行分页显示的工具，linux正统查看文件内容的工具，功能强大。

## 文档基础操作

### 1、全屏导航

1. `ctrl + F`: Forward 向前移动一屏
2. `ctrl + B`: Backward 向后移动一屏
3. `ctrl + D`: 向前移动半屏
4. `ctrl + U`: 向后移动半屏

### 2、单行导航

1. `j`: 向前移动一行
2. `k`: 向后移动一行

### 3、跳转导航

1. `G`: 移动到最后一行
2. `g`: 移动到第一行

## 文档进阶操作

### 1、使用默认编辑器编辑当前文件

1. 键入`v`

### 2、标记导航

1. 标记：`ma` - 使用`a`标记文本的当前位置
2. 导航到标记：`'a` - 导航到标记a处

### 3、动态刷新

1. less查看内容，键入`F`
2. `less +F <filename>`

### 4、搜索内容

1. `/<string>`: 向下搜索`<string>`内容
2. `?<string>`: 向上搜索`<string>`内容
3. `n`: 前往下一个搜索匹配项
4. `N`: 前往上一个搜索匹配项