---
layout: categories
title: Categories
description: 哈哈，你找到了我的文章基因库
keywords: 分类
comments: false
menu: 分类
permalink: /categories/
---

<section class="container posts-content">
{% assign sorted_categories = site.categories | sort %}
{% for category in sorted_categories %}
{% assign firstCategory = category | first %}
{% if firstCategory != 'Hide' %}
<h3>{{ category | first }}</h3>
<ol class="posts-list" id="{{ category[0] }}">
{% for post in category.last %}
{% assign postFirstCategory = post.categories | first %}
{% if postFirstCategory != 'Hide' %}
<li class="posts-list-item">
<span class="posts-list-meta">{{ post.date | date:"%Y-%m-%d" }}</span>
<a class="posts-list-name" href="{{ site.url }}{{ post.url }}">{{ post.title }}</a>
</li>
{% endif %}
{% endfor %}
</ol>
{% endif %}
{% endfor %}
</section>
<!-- /section.content -->
