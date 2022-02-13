---
layout: post
title: 富文本编辑器使用指南
categories: [case]
description: rich text editor
keywords: tinymce, rich text editor
---

## 富文本编辑器产出内容如何适配多端？

* 1、首先需要根据编辑需要，控制富文本编辑器的功能项，目的是缩小范围，做定制化开发
* 2、几种思路：
  * 2.1、将富文本编辑器样式inline更改为class-inline，然后针对class和device-type做适配。也就是需要富文本编辑器和图文底层页配合方案。
  * 2.2、富文本编辑模式做产出类型支持：比如支持原inline-style的形式；或者过滤产出的内容，做需要过滤样式的格式化。
  * 2.3、直接在底层页怼源数据或者dom结构进行样式处理，即遍历出inline-style，做操作。

## 富文本编辑器的坑

1、在从浏览器复制内容的时候，会自动将computed-style进行inline，这时候复制的内容才会有格式一致的效果；但是inline computed-style的操作，也相当于锁定了样式效果。**所以在必要的情况下，需要做样式清洗**
