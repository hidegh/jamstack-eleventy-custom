const he = require('he');
const lunr = require('lunr');
/* const category = require("./collections/categories"); */

/**
 * This module is used to extend eleventy with custom functions that can then be used in the JS front matter.
 * 
 * Inside .eleventy.js config just add:
 *  const fncs = require('./src/scripts/global-fncs');
 *
 * Inside the template simply use it:
 * ---JS
 *  {
 *      title: `Test /${fncs.echo('123')}/`
 *  }
 * ---
 */
module.exports = {

    echo: function (params) {
        console.debug('echo: ', params)
        return params;
    },

    fetchPlainTextFromHtml: function(html) {
        const strippedText = html.replace(/<[^>]+>/g, '') // strip tags
        const plainText = he.decode(strippedText); // decode special HTML syntax to readable
        return plainText;
    },

    getSearchData: function(posts) {
        const data = posts.map(post => {
            return {
                url: post.data.page.url,
                title: post.data.title,
                date: post.date,
                author: post.data.author,
                tags: post.data.tags ? post.data.tags : [],
                categories:  post.data.categories, /* category._getNormalizedCategoriesForCollectionItem(post), */
                summary: post.data.page.excerpt,
                text: fncs.fetchPlainTextFromHtml(post.templateContent)
            }    
        });

        return data;
    },

    getIndexedSearchData: function(searchData) {
        var idx = lunr(function () {
            this.ref('url')
            this.field('title')
            this.field('date')
            this.field('author')
            this.field('tags')
            this.field('categories')
            this.field('summary')
            this.field('text')
        
            searchData.forEach(function (doc) { this.add(doc) }, this)
          })
        
          return JSON.stringify(idx);
    },

    getLunr: function(indexedData) {
        var idx = lunr.Index.load(JSON.parse(indexedData));
        return idx;
    }
    
}
