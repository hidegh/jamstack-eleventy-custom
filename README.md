
# jamstack-eleventy-custom
A static site created with 11ty (elevent, @zachleat). The repo should serve as a demo/sample on creating 11ty sites from scratch - and also as a sample/basic for blog-sites.

This site was created from scratch and **blog related features were added**. The main idea was to have it as much flexible as it gets. 

## Update @2023-04-17:

### Changes:
- added support for **boostrap 5.3 color schemes**
- simplified layouts (removed styling classes, layout and styling is now moved into SCSS)
- **refactored CSS files** & changed styling
  - broke `main.scss` into fragments
  - most designed UI part now has 2 separate files: one for generic layout and one for styling
  - added support for `.dynamic-headings` (using EM units)
- added **future-readings** navigation to posts
- updated taxonomy screens styling
- simplified **cookie consent**
- integrated **gisqus**
- included some free background assets

### Future Plans:
- add google tag manager
- switch to TOC bot
- add image lazy renderer template

## Original release

### Features added:
- :cookie: cookie consent
- :camera: support for pictures stored locally (same folder as the posts markdown file) (so outise assets)
- bootstrap
- :pager: customizable pager (navigator)
- :eyes: **search** inside posts
- **nested paging**, see: https://hidegh.github.io/jamstack-eleventy-custom/tag/ddd/1/
- **taxonomy:** tags and nested categories
- :page_facing_up: **sticky sidebars** for:
  - **recent** articles
  - articles in **serie**
  - **similar** articles
  - tags and categories
  - tag cloud :cloud:
  - **table of contents**, see: https://hidegh.github.io/jamstack-eleventy-custom/post/writing-a-new-post/
- rss plugin
- mathjax and mermaid integration

### Extras:
- Github Actions **Workflow** also included!
- The package.json contains **scripts** for testing, building the app...
- We can now distinguish between **prod** and **dev** environment
  - there's a switch in the .eleventy.js
  - as this site ought to showcase all the features, the prod version will still contain all the sample posts
  - [This webpage](https://reflectivetechconsulting.com/) is based on this source, has the sample posts avail. in **dev** for testing purposes, but none of the samples is included on **prod**

**Important thing to note:** if you host the page via GitHub and under a custom domain, every re-deploy will make that setting perish, unless you add a CNAME file to the output, with the custom domain name as the content! [More info here.](https://github.com/tschaub/gh-pages/issues/213)
