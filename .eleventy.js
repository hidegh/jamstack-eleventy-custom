const yaml = require("js-yaml");
const util = require("util");

//
// Custom plugins / filters / ...

// local assets
const localPostImagesPlugin = require("./src/plugins/eleventy-hugo-style-local-post-images");

//
// NuGet plugins / filters / ...

// Syntax-highlight for MD code-blocks
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");


module.exports = function (eleventyConfig) {

    //
    // Default config
    eleventyConfig.setUseGitIgnore(false);

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
    // Custom plugins / filters / ...

    // using custom solution as the eleventy-plugin-page-assets has bugs, is too complex (uses even html parsing), ...
    eleventyConfig.addPlugin(localPostImagesPlugin, { excludes: ["src/plugins/**"] });

    //
    // NuGet plugins / filters / ...

    // syntax-highlight for MD code-blocks: https://prismjs.com/#supported-languages (also see Prism.languages.extend...)
    eleventyConfig.addPlugin(syntaxHighlight, {
        init: function({ Prism }) {
            // Not workign as expected, see: https://github.com/11ty/eleventy-plugin-syntaxhighlight/issues/47
            // Prism.languages.console = Prism.languages.extend('markup', {});
        }
    });

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
