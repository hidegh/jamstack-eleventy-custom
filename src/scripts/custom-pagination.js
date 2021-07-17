const requireYaml = require("require-yml");
const globals = requireYaml("src/data/globals.yaml");

const filters = require("./filters");

module.exports = {

    /** Appends 1st page link to the path (in case of paging) */
    firstPage: function(path, doPaging) {
        const paging = globals.paging || {};

        if (paging.firstPageIndexed && doPaging) {
            return filters.normalize(path) + paging.pageBaseIndex + "/";
        }

        return path;
    },

    /**
     * Returns a paged path, while considering globals.paging: {
     *  pageBaseIndex:      0 | 1
     *  firstPageIndexed:   true | false
     * }
     * 
     * For defaults see data/globals paging property.
     */
    getPagedPath: function(nonPagedPath, pageIndex) {

        // defaults
        const pagingOptions = globals.paging || {};
      
        // fixes
        const normalizedNonPagedPath = filters.normalize(nonPagedPath);

        // url concat
        if (typeof(pageIndex) === "undefined" || pageIndex === null)
            return normalizedNonPagedPath;
        
        const isFirstPage = pageIndex == 0;
        if (isFirstPage && !pagingOptions.firstPageIndexed)
            return normalizedNonPagedPath;

        return normalizedNonPagedPath + (pagingOptions.pageBaseIndex + pageIndex) + "/";
    },

    // NOTE: 
    // How about a generic paging alg.?: createCustomPaginationData: function(distinctCategories, allItems, pageSize, filterCategoryItemsCallback) { ... }

}
