---
layout: post
title: jekyll usecage demo
categories: [Jekyll]
description: jekyll usecage demo
keywords: jekyll
---

Content here

1、 插入图片

```markdown
![same-site]({{site.url}}/mind/cookie/same-site.png)
![same-site]({{site.url}}/assets/images/blog/same-site.png)
```

2、 插入一段可运行代码

```markdown
<iframe name="codemirror" font-size="14" src="{{ site.url }}/public/codemirror/index.html">
</iframe>
```

3、 jekyll自带代码高亮，指定语言即可

```markdown
{\% highlight javascript %}
function hello() {
  console.log('hello world')
}
{\% endhighlight %}
```

4、 在markdown中链接本地文章

```markdown
[Link to a document]({\% link _collection/name-of-document.md %})
<!-- 下面这种写法不需要声明文件后缀 -->
[Name of Link]({\% post_url 2010-07-21-name-of-post %})
```

5、 github gist

```markdown
{\% gist goddancer/909921aefdccd54d88eeab4ea0a9e995 %}
```
{% gist goddancer/909921aefdccd54d88eeab4ea0a9e995 %}

---

[1] [Nodejs打包构建时长优化](https://www.cnblogs.com/Dev0ps/p/15509671.html)