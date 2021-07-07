# About the plugin

**This plugin will copy over local assets from post folders.**

Also adds 2 filters to work with assets easily. Sample:
```html
{% if page | hasImage %}<img src="{{ page | absoluteImageUrl | url }}" class="img-fluid"></img>{% endif %}
<h1>{{ page.data.title }}</h1>
```


# Important notes:

Post folders must use HUGO-like folder structure.
Post folder can contain just a single post (transform templae) file (usually MD / HTML / ...) - otherwise asset-copy will be skipped!

# Reason for this plugin:

1. Extending eleventyConfig.setTemplateFormats(["html", "njk", "md"]); with image extensions won't work with permalinks
2. Same for eleventyConfig.addPassthroughCopy("**/*.jpg") - it fails with permalinks
3. The plugin [eleventy-plugin-page-assets](https://github.com/victornpb/eleventy-plugin-page-assets#readme) has a bug and due it's extra logic (parsing) won't work with images relative to root (starting with /)

# Configuration - add these lines to the main .eleventy.js

```javascript
const localPostImagesPlugin = require("./src/plugins/eleventy-hugo-style-local-post-images");

module.exports = function (eleventyConfig) {

    eleventyConfig.addPlugin(localPostImagesPlugin, { 
        excludes: ["src/plugins/**"]
    });

    // ...

}
```
