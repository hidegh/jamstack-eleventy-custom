module.exports = function (eleventyConfig) {

    // NOTE: unlike in hugo, not the content of the assets folder, but the asset folder itself (with it's subfolders) will be copied...
    eleventyConfig.addPassthroughCopy("src/assets/**/!(*.scss)");

    eleventyConfig.addLayoutAlias('default', 'page.njk')

    eleventyConfig.setFrontMatterParsingOptions({ excerpt: true, excerpt_separator: '---' });

    // NOTE: need to set config here to be accessible in the addTransforms via: eleventyConfig.templateFormats
    // eleventyConfig.setTemplateFormats(["html", "njk", "ejs", "md"]);

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
