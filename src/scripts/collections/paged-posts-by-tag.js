/**
 * The trick is simple:
 * ...ise 11ty pagination with size 1
 * ...that iterates each item in our array
 * ...and creates separate HTML output for each item
 * ...we just need to make sure that permalink is calculated based on some item parameter
 * ...and also introduce a property called items where we store the inner list we do paging for
 */

 /**
  * Assume [parent, child] value.
  * 
  * We then should have these combinations (if there's no pageNumber, then there's no paging of items there)
  *     parent/
  *     parent/1..n/
  *     parent/child/
  *     parent/child/1..n/
  * 
  * For parent/child/x:
  *     nonPagedPath is parent/child/
  *     pagedPath (current) is parent/child/x (or parent/child/ if no paging is desired)
  * 
  * NOTE: hrefs is just an array of pagedPaths for 1..N (if pageable), otherwise empty []
  */

  const util = require("util");

  const requireYaml = require("require-yml");
  const globals = requireYaml("src/data/globals.yaml");
  
  const tags = require("./tags");
  const filters = require("./../filters");
  const customPagination = require("./../custom-pagination");
  
  module.exports = {
  
      /**
       * 
       * @param {*} tagListCollectionName 
       * @param {*} postCollectionName 
       * }
       */
      for: function (tagListCollectionName, postCollectionName) {
  
          // return callback for eleventy.addCollection
          return function(collectionApi) {
  
              const tagCollection = this[tagListCollectionName](collectionApi);
              const postCollection = this[postCollectionName](collectionApi);
              const pageSize = globals.tag.postsPageSize;
              let result = [];
  
              tagCollection.forEach(tag => {
  
                  const tagValue = tag.value;
                  const tagName = tag.name;
  
                  // This get's all items with given tag:
                  // const tagPosts = tag.items;
                  // We want just posts from our collection:
                  const tagPosts = postCollection.filter(p => p.data && p.data.tags && (p.data.tags == tagName || p.data.tags.some(t => t == tagName)));
                  const nonPagedPath = filters.normalize(globals.tag.path) + filters.slugFilter(tagName) + "/";
  
                  if (pageSize > 0) {
                      
                      const pageCnt = Math.max(Math.ceil(tagPosts.length / pageSize), 1);
                      const hrefs = [];
  
                      for (let i = 0; i < pageCnt; i++) {
                          
                          // TODO: here's the issue
                          hrefs.push(customPagination.getPagedPath(nonPagedPath, i));
  
                          const sliceFrom = i * pageSize;
                          const sliceTo = sliceFrom + pageSize;
  
                          result.push({
                              name: tagName,
                              pagedPath: hrefs[i],
                              // items
                              items: tagPosts.slice(sliceFrom, sliceTo),
                              count: tagPosts.length,
                              // for the paginator
                              pageNumber: i,
                              hrefs: hrefs
                          })
                      }
  
                  } else {
                      result.push({
                          name: tagName,
                          pagedPath: nonPagedPath,
                          // items
                          items: tagPosts,
                          count: tagPosts.length,
                          // for the paginator
                          pageNumber: undefined,
                          hrefs: []
                      })
                  }
  
              });
  
              return result;
          };
  
      }
  
  }
  