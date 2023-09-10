---
layout: post
title: Vocabularies
categories: [English]
description: Vocabularies
keywords: vocabulary， vocabularies
---

## Vocabularies

{% for item in site.data.english.vocabulary.lesson1 %}
{% assign index = forloop.index %}
### {{ index }}. {{ item.name }}
{% for wordItem in item.words %}
{% assign innerIndex = forloop.index %}
<strong style="color: green;">{{ index }}.{{ innerIndex }}. {{ wordItem.word }}</strong>
<p></p>
<details>
<summary><strong>【Translate】</strong></summary>
<pre>
{{ wordItem.translate }}
</pre>
</details>

---
{% endfor %}
{% endfor %}
