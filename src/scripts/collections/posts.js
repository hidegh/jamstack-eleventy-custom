module.exports = {

    /**
     * Gets a list of pages by the given GLOB filter.
     * @param {*} globFilter 
     */
    filterPagesByGlob: function (globFilter) {

        // return callback for eleventy.addCollection
        return function(collectionApi) {
            const posts = collectionApi
                .getFilteredByGlob(globFilter)
                .sort((a, b) => (a.score - b.score) * +1 /* +1 asc, -1 desc */);
                
            return posts;
        };

    }

}
