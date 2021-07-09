const urlFilterFnc = require("@11ty/eleventy/src/Filters/Url");
const slugFilterFnc = require("@11ty/eleventy/src/Filters/Slug");

module.exports = {

    /** use it on the final HTML only, it won't help too much without the prefixPath */
    urlFilter: function (path, pathPrefix) { return urlFilterFnc(path, pathPrefix); },

    slugFilter: function (path) { return slugFilterFnc(path); },

    /** Ensure path ends with / */
    normalize: function (path) {
        return path.endsWith("/")
            ? path
            : path + "/";
    },

    /** Merges path nodes, ensures node names are sluggified and that final path is normalized */
    mergePaths: function (nodes) {

        const mergedUrl = nodes.reduce((acc, node) => {
            
            const normalizedNode = this.normalize(node);
            
            // if node is absolute, drop prev. result
            if (normalizedNode.startsWith("/")) return normalizedNode;
            // otherwise append...
            return acc + normalizedNode;
        }, "");

        return mergedUrl;
    }

}