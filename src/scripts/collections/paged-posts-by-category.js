const util = require("util");

const requireYaml = require("require-yml");
const globals = requireYaml("src/data/globals.yaml");

const filters = require("../filters");
const customPagination = require("../custom-pagination");

/**
 * Unlike posts paged by tag, we did all the necessary filtering, tree building and flattening inside the categories.js...
 * ...here we just need to split that flat category array further to pages!
 * ...it's not enough to do the fetching here, as we might need the post-count when displaying categories!
 */
module.exports = {

    /**
     * 
     * @param {*} tagListCollectionName 
     * @param {*} postCollectionName 
     * @param {*} options {
     *      pageSize: number (lte 0 will select all)
     * }
     */
    for: function (categoryCollectionName) {

        // return callback for eleventy.addCollection
        return function(collectionApi) {

            const categoriesCollection = this[categoryCollectionName](collectionApi);
            const pageSize = globals.category.postsPageSize;
            
            let result = [];

            categoriesCollection.forEach(category => {

                 // NOTE: we page current items only, not interested in nested ones this time!
                const posts = category.items;

                const nonPagedPath = category.categoryUriNonPaged;

                if (pageSize > 0) {
                    
                    const pageCnt = Math.max(Math.ceil(posts.length / pageSize), 1);
                    const hrefs = [];

                    for (let i = 0; i < pageCnt; i++) {
                        
                        // Important!
                        hrefs.push(customPagination.getPagedPath(nonPagedPath, i));

                        const sliceFrom = i * pageSize;
                        const sliceTo = sliceFrom + pageSize;

                        result.push({
                            categoryName: category.categoryName,
                            categoryUri: category.categoryUri,
                            categoryUriNonPaged: category.categoryUriNonPaged,
                            items: posts.slice(sliceFrom, sliceTo),
                            parentNavigationLinks: category.parentNavigationLinks,
                            innerNavigationLinks: category.innerNavigationLinks,
                            // for the paginator
                            pageNumber: i,
                            pagedPath: hrefs[i],
                            hrefs: hrefs,
                            
                            count: posts.length,
                            innerCount: category.innerItems.length,
                            allCount: category.allItems.length
                        })
                    }

                } else {
                    result.push({
                        categoryName: category.categoryName,
                        categoryUri: category.categoryUri,
                        categoryUriNonPaged: category.categoryUriNonPaged,
                        items: posts,
                        parentNavigationLinks: category.parentNavigationLinks,
                        innerNavigationLinks: category.innerNavigationLinks,
                        // for the paginator
                        pageNumber: undefined,
                        pagedPath: nonPagedPath,
                        hrefs: [],

                        count: posts.length,
                        innerCount: category.innerItems.length,
                        allCount: category.allItems.length
                    })
                }

            });

            return result;
        };

    }

}
