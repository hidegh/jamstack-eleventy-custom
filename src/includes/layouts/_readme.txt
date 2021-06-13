Finally we ended up with these layouts:
---------------------------------------
- base		- containing all the main HTML
- none		- a pure container so we can create content without any boundaries
- landing	- a landing page like layout (full screen width)
- main		- the default fluent layout, with auto-margins, configurable right-aside container and a search result container
- page		- the default page look (with right-aside container set up as desired)
- posts		- similarly to the default, but right container set up with post content related controls

Inheritance:
------------
+ base is the TOP
  + main inherits from base
    + landing
    + page
    + post

The way how we created them:
----------------------------

We could:
1) either the front matter layout - to merge layouts the 11ty way (and use just {{ content | safe }})
2) or nunjucks {% extends 'layout/base.njk' } with {% block side-block %}...{% endblock %}

NOTE:
    We can't mix both layout approaches, but we still are OK to use other front matter layout data and access custom data inside NJK / HTML template.


On the derived pages we will be able to use the YAML values defined on the 


The layout page might utilize YAML data values.

    ---
    fluid: true
    aside: 3
    asideBreak: xl
    asideMobile: true
    ---

These data values are then also accessible in the parent layout (the layout we extend).

The base page.njk will have these blocks defined, so same blocks can be then used on the layout we create.

    ---------------
    before
    ---------------
    content | aside
    ---------------
    after
    ---------------
