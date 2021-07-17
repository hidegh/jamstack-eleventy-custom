 const util = require("util");

 const requireYaml = require("require-yml");
 const globals = requireYaml("src/data/globals.yaml");
 
 const filters = require("./../filters");
 const customPagination = require("../custom-pagination.js");
 
 module.exports = {
 
     /**
      * 
      * @param {*} tagListCollectionName 
      * @param {*} postCollectionName 
      * }
      */
     forCollection: function (postCollectionName) {
 
         // return callback for eleventy.addCollection
         return function(collectionApi) {
 
            const postCollection = this[postCollectionName](collectionApi);
            const pageSize = globals.posts.pageSize;

            const nonPagedPath = filters.normalize(globals.posts.path);

            let result = [];
 
            if (pageSize > 0) {
                
                const pageCnt = Math.max(Math.ceil(postCollection.length / pageSize), 1);
                const hrefs = [];

                for (let i = 0; i < pageCnt; i++) {
                    
                    hrefs.push(customPagination.getPagedPath(nonPagedPath, i));

                    const sliceFrom = i * pageSize;
                    const sliceTo = sliceFrom + pageSize;

                    result.push({
                        name: 'paged-posts',
                        pagedPath: hrefs[i],
                        // items
                        items: postCollection.slice(sliceFrom, sliceTo),
                        count: postCollection.length,
                        // for the paginator
                        pageNumber: i,
                        hrefs: hrefs
                    })
                }

            } else {
                result.push({
                    name: 'paged-posts',
                    pagedPath: nonPagedPath,
                    // items
                    items: postCollection,
                    count: postCollection.length,
                    // for the paginator
                    pageNumber: undefined,
                    hrefs: []
                })
            }

            return result;
         };
 
     }
 
 }
 