---
layout: post
title: jekyll usecage demo
categories: [Algorithm]
description: jekyll usecage demo
keywords: jekyll
---

## 算法

### 贪心算法

**贪心算法的本质就是通过选择每一个阶段的局部最优解，从而达到全局最优**

贪心算法的一般解题步骤：
* 将问题分解为若干个子问题
* 找出合适的贪心策略
* 求解每一个问题的最优解
* 将局部最优解堆叠为全局最优解

什么时候考虑使用贪心算法：
* 处理一个问题的时候，我们结合常理推到，是否能通过一个个局部最优解达到全局最优解的效果，如果可以，那么使用
* 如果不能确定，那么能够举出反例，证明贪心算法并不可行，证不出来，就尝试使用

### 动态规划Dynamic Programming


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
