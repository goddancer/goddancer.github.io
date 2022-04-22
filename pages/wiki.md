---
layout: page
title: Wiki
description: 人越学越觉得自己无知
keywords: 维基, Wiki
comments: false
menu: 维基
permalink: /wiki/
---

> 记多少命令和快捷键会让脑袋爆炸呢？

<ul class="listing">
{% for wiki in site.wiki %}
{% if wiki.title != "Wiki Template" %}
  <li class="listing-item"><a href="{{ site.url }}{{ wiki.url }}">{{ wiki.title }}</a></li>
{% endif %}
{% endfor %}
</ul>

> Wiki Articles

<ul class="listing">
{% for category in site.data.articles %}
  <li class="listing-item">
    <strong>{{ category.category }}</strong>
    <ol type="1">
      {% for pageItem in category.page %}
      <li><a href="{{ pageItem.url }}" target="_blank">{{ pageItem.name }}</a></li>
      {% endfor %}
    </ol>
  </li>
{% endfor %}
</ul>

> Wiki Books

<ul class="listing">
{% for category in site.data.books %}
  <li class="listing-item">
    <strong>{{ category.category }}</strong>
    <ol type="1">
      {% for book in category.name %}
      <li><a href="{{ site.url }}/books/{{ category.category }}/{{ book }}.pdf" target="_blank">{{ book }}</a></li>
      {% endfor %}
    </ol>
  </li>
{% endfor %}
</ul>

> 面试题系列

<ul class="listing">
{% for category in site.data.interviews %}
  <li class="listing-item">
    <strong>{{ category.category }}</strong>
    <ol type="1">
      {% for pageItem in category.page %}
      <li><a href="{{ pageItem.url }}" target="_blank">{{ pageItem.name }}</a></li>
      {% endfor %}
    </ol>
  </li>
{% endfor %}
</ul>