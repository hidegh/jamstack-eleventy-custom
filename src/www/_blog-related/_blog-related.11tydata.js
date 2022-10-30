module.exports = function(configData) {
  return {
    eleventyExcludeFromCollections: true,
    eleventyComputed: {
      aside: data => data.globals.site.defaultAside
    }
  };
};
