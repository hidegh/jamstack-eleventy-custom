const requireYaml = require("require-yml");
const globals = requireYaml("src/data/globals.yaml");

module.exports = {

    _getNormalizedTagsForCollectionItem: function (item) {

        // NOTE: extra space makes this item to be sorted as the 1st in case of name sort!
        const uncategorized = [];

        if ('tags' in item.data == false)
            return uncategorized;

        const tags = item.data.tags;

        // no tags supplied (empty string or empty array)
        if (tags.length == 0)
            return uncategorized;

        // if categories is single string:
        // NOTE: *** this won't ever happen, a simple string in tags is automatically converted to an array
        if (!Array.isArray(tags))
            return tags.split(",").map(t => t.trim());

        // if tag is an array:
        // - if none of the tag values is an array, we're ok
        // - otherwise we consider inner arrays as a speific category (joining them to a string)
        const containsInnerArray = tags.some(i => Array.isArray(i));

        if (!containsInnerArray) return tags;
        else return tags.map(i => Array.isArray(i) ? i.join(" - ") : i);
    },

    filterPagesByTag: (postCollection, tagName) => postCollection.filter(item => {
        // NOTE: this logic does not considers a tag value other than string...
        if (!tagName) return true;
        else if (Array.isArray(item.data.tags)) return item.data.tags.some(tag => tag === tagName);
        else return item.data.tags == tagName;
    }),

    /**
     * Get array of tags (sorted) with:
     * - count
     * - posts to tag (sorted)

     * For options see: globals.tags

     * @param {*} collectionName 
     * @returns
     *  [
     *      {
     *          value:  any,
     *          count:  numeric,
     *          items:  [],
     *          name:   string,
     *          size:   numeric
     *      },
     *      ...
     *  ]
     */
    forCollection: function (collectionName) {
        
        const me = this;

        // return callback for eleventy.addCollection
        return function(collectionApi) {

            // NOTE:
            // Theme vredeburg uses JS files to define these functions, before applying then in eleventyConfig...
            // Also theme uses count: collectionApi.getFilteredByTag(tag).length - which might pick up all pages not just from the postList (see: 11ty/eleventy::TemplateCollection.js)
            // So we fixed this
            const postCollection = this[collectionName](collectionApi);

            // Normalizing - altering original input to ensure a given structure!
            postCollection.forEach(p => p.data.tags = me._getNormalizedTagsForCollectionItem(p))

            const tagList = postCollection.reduce((tags, post) => {
                if ('tags' in post.data) tags = tags.concat(post.data.tags);
                return [...new Set(tags)];
            }, []);

            //
            // creating data for final output: items, count

            let tagListWithCount = tagList.map((tag) => {
                const items = me.filterPagesByTag(postCollection, tag);
                return {
                    value: tag,
                    count: items.length,
                    items: items,
                    // flatten and join name in case of "tag-array"
                    name: Array.isArray(tag) ? [].concat(...tag).join(" - ") : tag
                };
            });

            //
            // sort
            
            // tags
            if (globals.tags.sortBy == "count") {
                tagListWithCount = tagListWithCount.sort((a, b) => (a.count - b.count) * (globals.tags.sortDesc ? -1 : 1))
            } else if (globals.tags.sortBy == "name") {
                tagListWithCount = tagListWithCount.sort((a, b) => a.name.localeCompare(b.name) * (globals.tags.sortDesc ? -1 : 1))
            }

            // posts to every tag
            if (globals.tag.postsSortBy == "title") {
                tagListWithCount.forEach(t => t.items = t.items.sort((a, b) => a.data.title.localeCompare(b.data.title) * (globals.tag.postsSortDesc ? -1 : 1)));
            } else if (globals.tag.postsSortBy == "date") {
                tagListWithCount.forEach(t => t.items = t.items.sort((a, b) => (a.data.date - b.data.date) * (globals.tag.postsSortDesc ? -1 : 1)));
            }

            //
            // cloud data
            const minFontSize = globals.tags['tag-cloud'].minFontSize;
            const maxFontSize = globals.tags['tag-cloud'].maxFontSize;
            const fontStretch = maxFontSize - minFontSize;

            const maxCount = Math.max(...tagListWithCount.map(i => i.count));
            const minCount = 1;
            const countStretch = maxCount - minCount;

            tagListWithCount.forEach(i => i.size = minFontSize + fontStretch * (i.count - minCount)  / countStretch);

            //
            // ...
            return tagListWithCount;
        };

    }

}
