const yaml = require("js-yaml");
const util = require("util");

module.exports = function (eleventyConfig) {

    //
    // Default config

    // NOTE:
    // unlike in hugo, not the content of the assets folder, but the asset folder itself (with it's subfolders) will be copied...
    // SCSS is also stored in assets, but we're interested just in the final CSS build (so ignoring SCSS)...
    eleventyConfig.addPassthroughCopy("src/assets/**/!(*.scss)");

    eleventyConfig.addLayoutAlias('default', 'page.njk')

    eleventyConfig.setFrontMatterParsingOptions({ excerpt: true, excerpt_separator: '---' });

    // NOTE: need to set config here to be accessible in the addTransforms via: eleventyConfig.templateFormats
    // eleventyConfig.setTemplateFormats(["html", "njk", "ejs", "md"]);

    // add YAML support
    eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

    //
    // Debugging
    eleventyConfig.addFilter("json", function (value) { return JSON.stringify(value); });
    eleventyConfig.addFilter("inspect", function (value) { return util.inspect(value); });


    //
    // Collections (posts)
    const postCollectionName = 'postCollection';
    eleventyConfig.addCollection(postCollectionName, require('./src/scripts/collections/posts').filterPagesByGlob('src/posts/**/*.md'));
   
    return {

        passthroughFileCopy: true,

        dataTemplateEngine: 'njk',
        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",

        templateFormats: [
            "html",
            "njk",
            "ejs",
            "md"
        ],

        dir: {
            input: "src",
            output: "_site",
            includes: "includes",
            layouts: "includes/layouts",
            data: "data",
        },

        // NOTE: it's always a good idea to test custom scripts with sub-folder support!
        pathPrefix: "/my-site"
    };

}
