const fs = require('fs');
const yaml = require("js-yaml");
const util = require("util");
const clip = require("text-clipper").default;
const { DateTime } = require("luxon");

const filters = require("./src/scripts/filters");
const customPagination = require("./src/scripts/custom-pagination");

const templateFormats = [
    "html",
    "njk",
    "ejs",
    "md"
];

//
// Custom plugins / filters / ...

// local assets
const localPostImagesPlugin = require("./src/plugins/eleventy-hugo-style-local-post-images");

//
// NuGet plugins / filters / ...

// Syntax-highlight for MD code-blocks
const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

// TOC: the main (eleventy-plugin-nesting-toc) plugin generates TOC, the markdown-it-anchor plugin adds ID's to headings...
const pluginTOC = require('eleventy-plugin-nesting-toc');
const markdownIt = require('markdown-it');
const markdownItAnchor = require('markdown-it-anchor');

// RSS
const pluginRss = require("@11ty/eleventy-plugin-rss");

// Reading time
const pluginReadingTime = require('eleventy-plugin-reading-time');

module.exports = function (eleventyConfig) {

    const env = (process.env.ELEVENTY_ENV || "").trim();
    console.log("Environment: ", env);

    const globals = yaml.load(fs.readFileSync("src/data/globals.yaml"));
    console.log("Loaded 'globals' from yaml", globals);

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

    // add Markdown filter
    eleventyConfig.addFilter("md", content => markdownIt({ html: true }).render(content ?? ""));

    //
    // Debugging
    eleventyConfig.addFilter("json", function (value) { return JSON.stringify(value); });
    eleventyConfig.addFilter("inspect", function (value) { return util.inspect(value); });

    //
    // Custom plugins / filters / ...

    eleventyConfig.addFilter('mergePaths', function(value) { return filters.mergePaths(value); });
    eleventyConfig.addFilter('normalize', function(value) { return filters.normalize(value); });
    eleventyConfig.addFilter('truthy', function(value) { return !!value; });
    eleventyConfig.addFilter('falsy', function(value) { return !value; });

    eleventyConfig.addFilter('truncateHtml', function(value, charLimit, lineLimit) { return clip(value, charLimit, { html: true, maxLines: lineLimit }); });

    // NOTE: 2019-08-11T00:34:00+0800 dates with offset are not accepted via 11ty v0.12.1
    eleventyConfig.addFilter("readableDate", dateObj => { return dateObj ? DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy") : 'N/A'; });

    eleventyConfig.addFilter('firstPage', function(value, doPaging) { return customPagination.firstPage(value, doPaging); });

    eleventyConfig.addFilter('getSeriesNavigationDetails', (...args) => require('./src/scripts/post-series.filter').getSeriesNavigationDetails(...args));

    eleventyConfig.addFilter('getRelatedNavigationDetails', (...args) => require('./src/scripts/post-related.filter').getRelatedNavigationDetails(...args));

    // using custom solution as the eleventy-plugin-page-assets has bugs, is too complex (uses even html parsing), ...
    eleventyConfig.addPlugin(localPostImagesPlugin, { eleventyConfig: eleventyConfig, templateFormats: templateFormats, excludes: ["src/plugins/**"] });

    //
    // NuGet plugins / filters / ...

    // syntax-highlight for MD code-blocks: https://prismjs.com/#supported-languages (also see Prism.languages.extend...)
    eleventyConfig.addPlugin(syntaxHighlight, {
        init: function({ Prism }) {
            // Not workign as expected, see: https://github.com/11ty/eleventy-plugin-syntaxhighlight/issues/47
            Prism.languages.mermaid = Prism.languages.extend('markup', {});
            Prism.languages.mathjax = Prism.languages.extend('markup', {});
        }
    });

    // add support for ```mermaid and ```mathjax higlighting inside MD
    //
    // don't forget to allow them via setting the corresponding parameter inside the front matter:
    // mermaid: true
    // mathjax: true 
    var markdownHighlighter = eleventyConfig.markdownHighlighter;

    eleventyConfig.addMarkdownHighlighter((str, language) => {        
        if (language === "mermaid") 
            return `<pre class="mermaid">${str}</pre>`;
        else if (language === "mathjax")
        // TODO: pre and code tags generated making problems
            return `<pre class="mathjax">$$ ${str} $$</pre>`;
        else
            return markdownHighlighter(str, language);
    });

    // TOC generator with required auto ID anchors creation
    eleventyConfig.addPlugin(pluginTOC);

    // Example Markdown configuration (to add IDs to the headers)
    eleventyConfig.setLibrary("md",
        markdownIt({
            html: true,
            linkify: true,
            typographer: true,
        }).use(markdownItAnchor, {})
    );

    // RSS
    eleventyConfig.addPlugin(pluginRss, {
        posthtmlRenderOptions: {
            closingSingleTag: "default" // opt-out of <img/>-style XHTML single tags
        }
    });

    // Reading time
    eleventyConfig.addPlugin(pluginReadingTime);

    //
    // Collections (posts)
    const postCollectionName = 'postCollection';
    eleventyConfig.addCollection(postCollectionName, require('./src/scripts/collections/posts').filterPagesByGlob('src/posts/**/*.md'));

    const pagedPostCollectionName = 'pagedPostCollection';
    eleventyConfig.addCollection(pagedPostCollectionName, require('./src/scripts/collections/paged-posts').forCollection(postCollectionName));

    const tagCollectionName = 'tagCollection';
    eleventyConfig.addCollection(tagCollectionName, require('./src/scripts/collections/tags').forCollection(postCollectionName));

    const pagedPostsByTagCollectionName = 'pagedPostsByTagCollection';
    eleventyConfig.addCollection(pagedPostsByTagCollectionName, require('./src/scripts/collections/paged-posts-by-tag').for(tagCollectionName, postCollectionName));

    const categoryCollectionName = 'categoryCollection';
    eleventyConfig.addCollection(categoryCollectionName, require('./src/scripts/collections/categories').forCollection(postCollectionName));

    const pagedPostsByCategoryCollectionName = 'pagedPostsByCategoryCollection';
    eleventyConfig.addCollection(pagedPostsByCategoryCollectionName, require('./src/scripts/collections/paged-posts-by-category').for(categoryCollectionName));
    
    const seriesCollectionName = 'seriesCollection';
    eleventyConfig.addCollection(seriesCollectionName, require('./src/scripts/collections/series').forCollection(postCollectionName));
   

    return {

        passthroughFileCopy: true,

        // NOTE:
        // IMPORTANT - @deprecated https://www.11ty.dev/docs/data-preprocessing/ in future versions
        // see workaround: src\www\_blog-related\_blog-related.11tydata.js
        // affected files:
        // - src\www\www.11tydata.json
        // - src\posts\posts.11tydata.json
        dataTemplateEngine: 'njk',

        htmlTemplateEngine: "njk",
        markdownTemplateEngine: "njk",

        templateFormats: templateFormats,

        dir: {
            input: "src",
            output: "_site",
            includes: "includes",
            layouts: "includes/layouts",
            data: "data",
        },

        //
        // NOTE:
        //
        //  DEV:
        //      it's always a good idea to test custom scripts with sub-folder support!
        //
        //  HOSTING:
        //
        //      when hosting under github with no custom domain and inside a sub-folder, then use the repo name as the pathPrefix ()
        //      same can be achieved with http/head/base (tested localy with partial path ending with /)
        //
        pathPrefix: "/jamstack-eleventy-custom"
    };

}
