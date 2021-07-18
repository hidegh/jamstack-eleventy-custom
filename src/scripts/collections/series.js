const requireYaml = require("require-yml");
const globals = requireYaml("src/data/globals.yaml");

module.exports = {

    filterPagesBySerieName: (postCollection, serieName) => postCollection.filter(item => {
        return (item.data.series || "").toUpperCase() == serieName.toUpperCase();
    }),

    forCollection: function (collectionName) {
        
        const me = this;

        // return callback for eleventy.addCollection
        return function(collectionApi) {

            const postCollection = this[collectionName](collectionApi);

            const seriesList = postCollection.reduce((seriesList, post) => {
                if ('series' in post.data) seriesList = seriesList.concat(post.data.series);
                return [...new Set(seriesList)];
            }, []);

            //
            // creating data for final output: items, count

            let seriesListWithCount = seriesList.map((serieName) => {
                const items = me.filterPagesBySerieName(postCollection, serieName);
                return {
                    name: serieName,
                    count: items.length,
                    items: items
                };
            });

            //
            // sort
            
            // series
            if (globals.series.sortBy == "date") {
                seriesListWithCount.forEach(t => t.items = t.items.sort((a, b) => (a.data.date - b.data.date) * (globals.series.sortDesc ? -1 : 1)));
            } else if (globals.series.sortBy == "count") {
                seriesListWithCount = seriesListWithCount.sort((a, b) => (a.count - b.count) * (globals.series.sortDesc ? -1 : 1))
            } else if (globals.tags.sortBy == "name") {
                seriesListWithCount = seriesListWithCount.xort((a, b) => a.name.localeCompare(b.name) * (globals.series.sortDesc ? -1 : 1))
            }

            // posts to every series
            seriesListWithCount.forEach(t => t.items = t.items.sort((a, b) => ((a.data.series_no || 0) - (b.data.series_no || 0))));

            //
            // ...
            return seriesListWithCount;
        };

    }

}
