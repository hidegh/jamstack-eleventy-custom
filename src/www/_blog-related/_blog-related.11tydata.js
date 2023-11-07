module.exports = function(configData) {
  return {
    extraLayoutClasses: "layout-blog-related",
    eleventyExcludeFromCollections: true,
    eleventyComputed: {
      aside: data => data.globals.site.defaultAside
    }
  };
};
