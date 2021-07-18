const util = require("util");

const requireYaml = require("require-yml");
const globals = requireYaml("src/data/globals.yaml");

const filters = require("./../filters");
const customPagination = require("./../custom-pagination");

module.exports = {

    _uncategorizedTitle: "Uncategorized",

    /**
     * Makes sure that we got categories from the posts in an expected structure!
     * Use '' (empty string) for no category, so: [ [''] ]!
     * 
     * @param {*} postCategories array of caregory names (values)
     * @returns [
     *  [ cat ]
     *  [ majorCat, minorCat]
     *  ...
     * ]
     */
    _getNormalizedCategoriesForCollectionItem: function (item) {

        // NOTE: extra space makes this item to be sorted as the 1st in case of name sort!
        const uncategorized = [[this._uncategorizedTitle]];

        if ('categories' in item.data == false)
            return uncategorized;

        const categories = item.data.categories;

        // no category supplied (empty string or empty array)
        if (categories.length == 0)
            return uncategorized;

        // if categories is single string:
        if (!Array.isArray(categories)) return [[categories]]

        // if categories is an array:
        // - if none of the category values is an array, we concatenate those values to a single hierarchical category (array) and return it as the single element of the resulting array
        // - otherwise we just change those inner non-array values to arrays (standardizing) - see @return
        const containsInnerArray = categories.some(i => Array.isArray(i));

        if (!containsInnerArray) return [categories];
        else return categories.map(i => Array.isArray(i) ? i : [i]);
    },

    /**
     * Creates an array of collection items with categories normalized.
     * @param {*} items collection item from 11ty
     * @returns [ { item, categories }]
     */
    _createItemCategoriesArray: function (items) {
        const self = this;
        return items.map(i => ({ item: i, categories: self._getNormalizedCategoriesForCollectionItem(i) }));
    },

    /**
     * Checks if testedCategory is a match for a searchCategory.
     * @param {*} testedCategory 
     * @param {*} searchCategory 
     * @param {*} includeSelf 
     * @param {*} includeNested 
     */
    _isCategoryMatch(testedCategory, searchCategory, includeSelf, includeNested) {
        if (testedCategory.length < searchCategory.length) return false;
        if (!includeNested && testedCategory.length > searchCategory.length) return false;
        if (!includeSelf && testedCategory.length == searchCategory.length) return false;
        const isMatch = searchCategory.every((searchCategoryNode, ix) => searchCategoryNode == testedCategory[ix]);
        return isMatch;
    },

    /** Returns the number of nodes that the 2 categories match - match must start with the 1st node and be conecutive! */
    _categoryNodeMatchCount(testedCategory, searchCategory) {
        const sizeToTest = Math.min(testedCategory.length, searchCategory.length);

        // get match
        testedCategory.forEach((node, idx) => {
            if (node != searchCategory[idx]) return idx;
        })

        // full match
        return sizeToTest;
    },

    /**
     * Filters an item-categories array for items with a given category...
     * @param {*} itemCategoriesArray 
     * @param {*} includeSelf 
     * @param {*} includeNested 
     */
    _findItemsWithCategory: function (itemCategoriesArray, normalizedCategory, includeSelf, includeNested) {
        const self = this;
        const filteredItems = itemCategoriesArray.filter(item => 
            item.categories.some(itemCategory => self._isCategoryMatch(itemCategory, normalizedCategory, includeSelf, includeNested))
        );
        // returning just items (posts)...
        return filteredItems.map(i => i.item);
    },

    /**
     * Get's unique categories from the itemCategoriesArray.
     * @param {*} itemCategoriesArray      
     * @returns Array of categopry hierarchies (category arrays).
     */
    _getDistinctCategories: function (itemCategoriesArray) {
        const distinctCategories = itemCategoriesArray
            .map(ic => ic.categories)
            .reduce((acc, categories) => {

                categories.forEach(c => {

                    const exists = acc.some(a => {
                        var equals = a.length == c.length && a.every((_, ix) => a[ix] == c[ix]);
                        return equals;
                    });

                    if (!exists) acc.push(c);

                });

                return acc;
            }, []);

        return distinctCategories;
    },

    _createCategoryTree: function (itemCategoriesArray, allCategories, treeParentNode, categoryNodes) {

        const self = this;

        const weArePaging = globals.category.postsPageSize > 0;

        if (typeof treeParentNode === "undefined") {

            // init
            let result = { level: 0, categoryName: undefined, categoryValue: [], subCategories: [] };
            allCategories.forEach(category => self._createCategoryTree(itemCategoriesArray, undefined, result, category));
            return result;

        } else {

            // expand tree
            if (!categoryNodes.length) return;

            const thisCategoryName = categoryNodes[0];
            const thisCategoryValue = [...treeParentNode.categoryValue, thisCategoryName];
            const thisCategoryUriNonPaged = filters.mergePaths([globals.category.path, ...thisCategoryValue.map(i => filters.slugFilter(i))]);

            const thisCategoryUri = customPagination.getPagedPath(thisCategoryUriNonPaged, weArePaging ? 0 : undefined);
            
            let thisNode = treeParentNode.subCategories.find(i => i.categoryName == thisCategoryName);                       
         
            if (!thisNode) {
                thisNode = {
                    level: treeParentNode.level + 1,
                    categoryName: thisCategoryName,
                    categoryValue: thisCategoryValue,
                    categoryUri: thisCategoryUri,
                    categoryUriNonPaged: thisCategoryUriNonPaged,
                    subCategories: []
                };

                treeParentNode.subCategories.push(thisNode);
            }

            self._createCategoryTree(itemCategoriesArray, undefined, thisNode, categoryNodes.slice(1));
        }
    },

    _extendCategoryTreeWithItems: function (treeNode, itemCategoriesArray) {
       
        const self = this;

        if (treeNode.level > 0)  {
            // extending for non-root nodes only...
            const searchCategory = treeNode.categoryValue;
            treeNode.items = self._findItemsWithCategory(itemCategoriesArray, searchCategory, true, false);
            treeNode.innerItems = self._findItemsWithCategory(itemCategoriesArray, searchCategory, false, true);
            treeNode.allItems = self._findItemsWithCategory(itemCategoriesArray, searchCategory, true, true);
        } else {
            // not interested in the root node, this just makes less "if" branches later...
            treeNode.items = [];
            treeNode.innerItems = [];
            treeNode.allItems = [];
        }

        // recursive call!
        treeNode.subCategories.forEach(subNode => self._extendCategoryTreeWithItems(subNode, itemCategoriesArray));
    },

    /**
     * Sorts the category nodes and items inside based on the provided option...
     * NOTE: maybe skip to 2 separate calls?
     * @param {*} treeNode 
     * @param {*} options {
     *      sortBy: name |  count
     *      sortDesc: true | false
     *      postSortBy: title | date
     *      postSortDesc: true | false
     * }
     */
    _sortCategoryTree: function (treeNode, options) {

        const self = this;

        //
        // sort

        // sort this node categories
        if (options.sortBy == "name")
            treeNode.subCategories = treeNode.subCategories.sort((a, b) => {

                if (a.categoryName == this._uncategorizedTitle) return -1 * (options.sortDesc ? -1 : 1)
                if (b.categoryName == this._uncategorizedTitle) return 1 * (options.sortDesc ? -1 : 1)
                return a.categoryName.localeCompare(b.categoryName) * (options.sortDesc ? -1 : 1);
            });
        else if (options.sortBy == "count")
            treeNode.subCategories = treeNode.subCategories.sort((a, b) => ((a.items.length + a.innerItems.length) - (b.items.length + b.innerItems.length)) * (options.sortDesc ? -1 : 1));

        // sort this node items
        if (options.postsSortBy == "title") {
            treeNode.items = treeNode.items.sort((a, b) => a.data.title.localeCompare(b.data.title) * (options.postsSortDesc ? -1 : 1));
            treeNode.innerItems = treeNode.innerItems.sort((a, b) => a.data.title.localeCompare(b.data.title) * (options.postsSortDesc ? -1 : 1));
            treeNode.allItems = treeNode.allItems.sort((a, b) => a.data.title.localeCompare(b.data.title) * (options.postsSortDesc ? -1 : 1));
        } else if (options.postsSortBy == "date") {
            treeNode.items = treeNode.items.sort((a, b) => (a.data.date - b.data.date) * (options.postsSortDesc ? -1 : 1));
            treeNode.innerItems = treeNode.innerItems.sort((a, b) => (a.data.date - b.data.date) * (options.postsSortDesc ? -1 : 1));
            treeNode.allItems = treeNode.allItems.sort((a, b) => (a.data.date - b.data.date) * (options.postsSortDesc ? -1 : 1));
        }

        //
        // recursive
        treeNode.subCategories.forEach(subNode => self._sortCategoryTree(subNode, options));
    },

    _fetchNavigationDetails(treeNode) {
        return {
            name: treeNode.categoryName,
            uri: treeNode.categoryUri,
            uriNonPaged: treeNode.categoryUriNonPaged,
            count: treeNode.items.length,
            innerCount: treeNode.innerItems.length,
            allCount: treeNode.allItems.length
        }
    },

    _extendCategoryTreeWithNavigationNodes: function (treeNode, parentTreeNodes) {

        const self = this;
        parentTreeNodes = parentTreeNodes || []
        
        //
        // recursive call:
        // collecting links (array) for every sub-categories
        // for each sub category we define the category as an array of treeNodes [ tn1, tn2 ... tn2 ]
        // the links is a similar flat structure as the tree, when flattened
        // so for a category hierarchy of [ c1, c2, c3, ... cn ], if we're on the c3 node we will get:
        // [
        //   [ treeNodeC4 ]
        //   [ treeNodeC4, treeNodeC5 ]
        //   ...
        //   [ treeNodeC4, treeNodeC5 ... treeNodeCn ]
        // ]
        // if there are other categories (sub-categories), they will be unfolded similarly as the one sample above
        let subCatTreeNodeArrays = [];       
        treeNode.subCategories.forEach(subNode => subCatTreeNodeArrays.push(...self._extendCategoryTreeWithNavigationNodes(subNode, treeNode.level > 0 ? [...parentTreeNodes, treeNode] : parentTreeNodes)));

        // We have also parentTreeNodes:
        // for a category hierarchy of [ c1, c2, c3, ... cn ], if we're on the c3 node we will get: [ treeNodeForC1, treeNodeForC2 ]
        
        //
        // extend tree based on collected date from nested nodes
        // or from the parent links
        
        /*
        treeNode.parentLinksTextual = parentTreeNodes.map(node => node.categoryName).join(" | ");
        treeNode.innerLinksTextual = subCatTreeNodeArrays.map(link => link.map(node => node.categoryName).join(" | "));        
        */
        treeNode.parentNavigationLinks = parentTreeNodes.map(tn => self._fetchNavigationDetails(tn));
        treeNode.innerNavigationLinks = subCatTreeNodeArrays.map(link => link.map(tn => self._fetchNavigationDetails(tn)));

        //
        // prepare subCatTreeNodeArrays links for the parent node
        let subCatTreeNodeArraysForCaller = [];
        subCatTreeNodeArraysForCaller.push([treeNode]);
        subCatTreeNodeArrays.forEach(innerLinkNodes => subCatTreeNodeArraysForCaller.push([treeNode, ...innerLinkNodes]))
        return subCatTreeNodeArraysForCaller;
    },

    _flattenCategoryTree: function (treeNode, result) {
        const self = this;

        result = result || [];

        treeNode.subCategories.forEach(subNode => {
            // just a shallow copy, without sub-categories, with items/allItems still referenced
            let flatNode = Object.assign({}, subNode);
            delete flatNode.subCategories;
            result.push(flatNode);

            self._flattenCategoryTree(subNode, result);
        });

        return result;
    },

    forCollection: function (collectionName) {

        const me = this;

        // defaults
        const categoriesOption = globals.categories || {};

        // return callback for eleventy.addCollection
        return function (collectionApi) {

            const posts = this[collectionName](collectionApi);

            // Normalizing - altering original input to ensure a given structure!
            posts.forEach(p => p.data.categories = me._getNormalizedCategoriesForCollectionItem(p))

            const itemCategoriesArray = me._createItemCategoriesArray(posts);
            const distinctCategories = me._getDistinctCategories(itemCategoriesArray);

            const hierarchyTree = me._createCategoryTree(itemCategoriesArray, distinctCategories);
            me._extendCategoryTreeWithItems(hierarchyTree, itemCategoriesArray);
            me._sortCategoryTree(hierarchyTree, categoriesOption);          
            me._extendCategoryTreeWithNavigationNodes(hierarchyTree);
           
            const flattenedHierarchyArray = me._flattenCategoryTree(hierarchyTree);

            /*
            // NOTE: due items/innerItems/allItems we got a circular dependency, this JSON.stringify would not work
            console.log('categories hierarchy', util.inspect(flattenedHierarchyArray));
            */

            /*
            // TEST (remove  some details to allow JSONIFY-ed output):
            flattenedHierarchyArray.forEach(i => delete i.items );
            flattenedHierarchyArray.forEach(i => delete i.innerItems );
            flattenedHierarchyArray.forEach(i => delete i.allItems );
            console.log('categories hierarchy', JSON.stringify(flattenedHierarchyArray));
            */

            return flattenedHierarchyArray;
        };

    }

}
