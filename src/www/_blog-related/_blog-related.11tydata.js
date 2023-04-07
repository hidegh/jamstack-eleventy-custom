module.exports = function(configData) {
  return {
    theme: "light",
    extraLayoutClasses: "layout-blog-related",
    eleventyExcludeFromCollections: true,
    eleventyComputed: {
      aside: data => data.globals.site.defaultAside
    }
  };
};
