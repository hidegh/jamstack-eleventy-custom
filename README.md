# jamstack-eleventy-custom
A static site created with 11ty (elevent, @zachleat). The repo should serve as a demo/sample on creating 11ty sites from scratch - and also as a sample/basic for blog-sites.

This site was created from scratch and **blog related features were added**. The main idea was to have it as much flexible as it gets. 

Features added:
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

Github Actions **Workflow** also included!

The package.json contains **scripts** for testing, building the app...

**Important thing to note:** if you host the page via GitHub and under a custom domain, every re-deploy will make that setting perish, unless you add a CNAME file to the output, with the custom domain name as the content! [More info here.](https://github.com/tschaub/gh-pages/issues/213)