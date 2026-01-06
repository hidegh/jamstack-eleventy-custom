const slugify = require("@sindresorhus/slugify").default || require("@sindresorhus/slugify");

/** Simple URL normalizer: ensures path starts with / and removes double slashes */
function urlFilter(path, pathPrefix = "") {
    if (!path) return "";

    // normalize slashes
    let normalized = path.replace(/\/+/g, "/");

    // ensure it starts with /
    if (!normalized.startsWith("/")) normalized = "/" + normalized;

    // optionally prepend pathPrefix
    if (pathPrefix) {
        let prefix = pathPrefix.endsWith("/") ? pathPrefix.slice(0, -1) : pathPrefix;
        normalized = prefix + normalized;
    }

    return normalized;
}

/** Slugify a single path segment */
function slugFilter(segment) {
    return slugify(segment);
}

module.exports = {

    urlFilter,
    slugFilter,

    /** Slugify a full path */
    slugifyPath: function (path) {
        return path
            .split("/")
            .filter((segment) => segment.trim() !== "")
            .map((segment) => slugFilter(segment))
            .join("/");
    },

    trimStart: function (originalString, trimString) {
        return originalString.startsWith(trimString)
            ? originalString.slice(trimString.length)
            : originalString;
    },

    trimEnd: function (originalString, trimString) {
        return originalString.endsWith(trimString)
            ? originalString.slice(0, -trimString.length)
            : originalString;
    },

    /** Ensure path ends with / */
    normalize: function (path) {
        return path.endsWith("/") ? path : path + "/";
    },

    /** Merges path nodes, sluggifies, and normalizes */
    mergePaths: function (nodes) {
        const mergedUrl = nodes.reduce((acc, node) => {
            const normalizedNode = this.normalize(node);
            // if node is absolute, drop previous
            if (normalizedNode.startsWith("/")) return normalizedNode;
            return acc + normalizedNode;
        }, "");

        return mergedUrl;
    }
};