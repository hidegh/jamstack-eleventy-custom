module.exports = {

    /**
     * Gets a list of pages by the given GLOB filter.
     * @param {*} globFilter 
     */
    filterPagesByGlob: function (globFilter) {

        // return callback for eleventy.addCollection
        return function(collectionApi) {
            const posts = collectionApi.getFilteredByGlob(globFilter).reverse();
            return posts;
        };

    }

}
