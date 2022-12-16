const requireYaml = require("require-yml");
const globals = requireYaml("src/data/globals.yaml");

module.exports = {

    /**
     * Gets a list of pages by the given GLOB filter.
     * @param {*} globFilter 
     */
    filterPagesByGlob: function (globFilter) {

        // return callback for eleventy.addCollection
        return function(collectionApi) {
            
            const sortPinnedFirst = globals.posts.sortPinnedFirst;
            const sortBy = globals.posts.sortBy;
            const sortDesc = globals.posts.sortDesc;

            const posts = collectionApi
                .getFilteredByGlob(globFilter)
                /*
                .map(_ =>{
                    console.log(`pin: ${_.data.pin}, date: ${_.data.date}, title: ${_.data.title}`);
                    return _;
                })
                */
                .sort((a,b) => 
                    (sortPinnedFirst && (!!b.data.pin - !!a.data.pin))
                    || (sortBy == "title" && (a.data.title.localeCompare(b.data.title) * (sortDesc ? -1 : 1)))  
                    || (sortBy == "date" && ((new Date(a.data.date) - new Date(b.data.date)) * (sortDesc ? -1 : 1)))              
                );
                
            return posts;
        };

    }

}
