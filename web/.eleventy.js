const { DateTime } = require("luxon");
const util = require('util')
const CleanCSS = require("clean-css");
const path = require("path");

module.exports = function(eleventyConfig) {
  // https://www.11ty.io/docs/quicktips/inline-css/
  eleventyConfig.addFilter("cssmin", function(code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addFilter("debug", function(value) {
    return util.inspect(value, {compact: false})
   });

   eleventyConfig.addFilter("readableDate", dateObj => {
    return new Date(dateObj).toDateString()
  });

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  });

  eleventyConfig.addFilter('sort_array', (arr, order, type) => {
    return arr;
  });

  eleventyConfig.addFilter('relative_url', (value) => {
    return path;
  });

  eleventyConfig.addFilter('where', (arr, prop , val) => {
    return arr.filter(item => item[prop] === val)
  });

  eleventyConfig.addFilter('not_where', (arr, prop , val) => {
    return arr.filter(item => item[prop] !== val)
  });

  eleventyConfig.addFilter('first', (arr) => {
    return arr[0];
  });

  return {
    templateFormats: [
      "md",
      "njk",
      "html",
      "liquid",
      "jpg",
      "svg"
    ],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: "/",

    markdownTemplateEngine: "liquid",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
    dir: {
      input: ".",
      includes: "_includes",
      data: "_data",
      output: "_site"
    }
  };
}
