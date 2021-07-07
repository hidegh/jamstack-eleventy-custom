const path = require('path');
const imgCopier = require('./src/image-copier');

/*
Plugin setup:

    const localPostImagesPlugin = require("./src/plugins/eleventy-hugo-style-local-post-images");
    eleventyConfig.addPlugin(localPostImagesPlugin, { excludes: ["src/plugins/**"] });

    Notes:
    - currently just the excludes is the only option we can pass, it avoids the parsing of those directories and thus does no copying there...

Filter usage:

    <section class="pb-3">
        {% if (post | hasImage) -%}
        <img class="img-responsive" src="{{ post | absoluteImageUrl | url }}">
        {%- endif %}
        {{ content | safe }}
    </section>

*/
module.exports = function (eleventyConfig, pluginOptions) {

    pluginOptions = Object.assign({ /* defaults */ }, pluginOptions);

    eleventyConfig.addTransform('eleventy-hugo-style-local-post-images', function (content, outputPath) {
        // NOTE: we need current THIS (as it's the template) and thus we can't use arrow fnc. def.
        const transformOptions = {
            template: this,
            content: content,
            outputPath: outputPath
        };
        
        return imgCopier(transformOptions, pluginOptions);
    });

    eleventyConfig.addFilter('hasImage', function(page) { 
        const imgUrl = page.data.image;
        return imgUrl ? true : false;
    });

    eleventyConfig.addFilter('absoluteImageUrl', function(page) { 
        const imgUrl = page.data.image;
        const postUrl = page.url + (page.url.endsWith("/") ? "" : "/") /* normalize url */;
                
        if (typeof imgUrl === 'string' || imgUrl instanceof String) {           
            const isAbsolute = path.isAbsolute(imgUrl) || imgUrl.match(/^(file|(ht|f)tp(s?))\:\/\//igm);
            if (isAbsolute) return imgUrl;  // full (absolute) path
            else return postUrl + imgUrl;   // path rel. to article
        }
     });

}
