---
title: Pictures - post using image from local folder
author: BaHI
date: 2020-07-01
categories:
  - [Samples, Pictures]
tags: samples, 11ty-customized
image:  intro.jpg
---

By adding the custom **eleventy-hugo-style-local-post-images** plugin we gain the possibility to create a post folder where we can place and use local images.
---

To support this new behavior, we had to alter the template that is responsible of listing the posts and the template responsible for displaying the post. Both of them use the 2 **filters** that are part of the plugin:
- hasImage
- absoluteImageUrl

These filters need full access to the page data object, so we use the base getCollectionItem(page) filter of 11ty.

The plugin has some limitation:
- it allows just a **single post document** (MD/HTML) in a post-folder (otherwise the extra content won't be copied over)
- posts **can't safely cross-use** those assets (remember, the final position depends on the permalink defintion)

---

Check out the basic post.njk template:
```
{% raw %}
---
aside: 3
asideBreak: xl
asideMobile: false
---
{% extends './main.njk' %}

{% block content %}

    <section class="print-container p-3 mb-3">
        <h1>{{ title }}</h1>
        {# need to load full page data #}
        {% set post = collections[globals.posts.collectionName] | getCollectionItem(page) %}
        {% if post | hasImage %}<img src="{{ post | absoluteImageUrl | url }}" class="w-25"></img>{% endif %}
        {{ content | safe }}
    </section>
  
{% endblock %}

{% block aside %}

{% endblock %}
{% endraw %}
```
