const path = require('path');
const imgCopier = require('./src/image-copier');

/*
Plugin setup:

    const localPostImagesPlugin = require("./src/plugins/eleventy-hugo-style-local-post-images");
    eleventyConfig.addPlugin(localPostImagesPlugin, { excludes: ["src/plugins/**"] });

    Notes:
    - currently just the excludes is the only option we can pass, it avoids the parsing of those directories and thus does no copying there...

Filter usage:

    When the image is defined inside post meta-data:

        <section class="pb-3">
            {% if (post | hasImage) -%}
            <img class="img-responsive" src="{{ post | absoluteImageUrl | url }}">
            {%- endif %}
            {{ content | safe }}
        </section>

    When there's any other local-image we want to use:

        <img src="{{ page | absoluteImageUrl('local asset path.jpg') | url }}">

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

    eleventyConfig.addFilter('absoluteImageUrl', function(page, imageUrl) { 
        const imgUrl = imageUrl ?? page.data.image ?? '';
        const postUrl = page.url + (page.url.endsWith("/") ? "" : "/") /* normalize path */;
                
        if (typeof imgUrl === 'string' || imgUrl instanceof String) {
            // normalized URL (slash at end) sometimes results in image not being shown e.g. inside background-image: url(...)
            const patchedImgUrl = imgUrl.endsWith("/") ? imgUrl.slice(0, -1) : imgUrl;

            const isAbsolute = path.isAbsolute(patchedImgUrl) || patchedImgUrl.match(/^(file|(ht|f)tp(s?))\:\/\//igm);
            if (isAbsolute) return patchedImgUrl;  // full (absolute) path
            else return postUrl + patchedImgUrl;   // path rel. to article
        }
     });

}
