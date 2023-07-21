const urlFilterFnc = require("@11ty/eleventy/src/Filters/Url");
const slugFilterFnc = require("@11ty/eleventy/src/Filters/Slug");

// TODO: use later, replace | slug with | slugify, slugifyModule.slugify(value)
// import slugifyModule from "@sindresorhus/slugify";

module.exports = {

    /** use it on the final HTML only, it won't help too much without the prefixPath */
    urlFilter: function (path, pathPrefix) { return urlFilterFnc(path, pathPrefix); },

    slugFilter: function (path) { return slugFilterFnc(path); },

    slugifyPath: function (path) {
        return path
            .split("/")
            .filter((segment) => segment.trim() !== "")
            .map((segment) => this.slugFilter(segment))
            .join("/");
    },

    trimStart: function(originalString, trimString) {
        return originalString.startsWith(trimString) ? originalString.slice(trimString.length) : originalString;
    },

    trimEnd: function(originalString, trimString) {
        return originalString.endsWith(trimString) ? originalString.slice(0, -trimString.length) : originalString;
    },

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