const path = require("path");
const fs = require("fs");
const glob = require("fast-glob");

const minimatch = require("minimatch");

module.exports = function (transformOptions, pluginOptions) {

    // HUGO logic:
    // - if multiple *.md are in a folder (ignoring _index.html) - then no asset-copy over will occure
    // - if single index.html (allowing extra _index.html), then no further sub-dirs will be processed, all sub-dirs and files will be copied (except *.md)
    //
    // Alg:
    // - get all md/html/njk in the directory and sub-dirs, ignoring _index.* (_index.* - could be later used to create list-templates)
    // - if only 1 found = we copy the entire sub-content
    // - otherwise do no copy-over nothing
    //
    // Note:
    // - always return original content (we do not transform it, we do just additional processing of assets)
    console.debug(`TRANSFORM - input: ${transformOptions.template.inputPath}, output: ${transformOptions.outputPath}`);     

    const templateFormats = 
        // ISSUE: https://github.com/11ty/eleventy/issues/1647
        // v0.12: transformOptions.template._config.templateFormats
        // v1.x: pluginOptions.eleventyConfig.templateFormats - does not work as when the plugin is configured, the eleventyConfig is not fully set (templateFormats is empty)
        // generic solution below:
        pluginOptions.templateFormats
        ;

    const outputDir = path.dirname(transformOptions.outputPath);
    const templateDir = path.dirname(transformOptions.template.inputPath).replace(/^\.\//, "");
    const templateFileName = path.basename(transformOptions.template.inputPath);

    const extensionsRegex = templateFormats.join(",");

    //
    // Check for exclusion
    if (pluginOptions.excludes && pluginOptions.excludes.length) {
        const matchedExcludePattern = pluginOptions.excludes.find(exclude => minimatch(templateDir, exclude));      
        if (matchedExcludePattern) {
            console.info(`Skipping copying over files from: ${templateDir} as exclusion ${matchedExcludePattern} is set over this source!`);
            return transformOptions.content;
        }
    }

    //
    // Handling copy-over for the concrete template
    const templatePattern = path.join(templateDir, `**\\*.{${extensionsRegex}}`).replace(/\\/g, "/");
    const templates = glob.sync(templatePattern, { onlyFiles: true });

    // only 1 template allowed when copying assets
    if (templates.length > 1) {
        console.warn(`Skipping copying over files from: ${templateDir} as multiple templates found in directory!`);
        return transformOptions.content;
    }

    // copy all hierarchically, except templates
    const assetSearchPattern = path.join(templateDir, `**\\*`).replace(/\\/g, "/");
    const filesToCopy = glob.sync(assetSearchPattern, { onlyFiles: true, ignore: [templatePattern] });
    if (filesToCopy.length) console.log('Files To Copy:', filesToCopy.join(", "))

    for (let filePath of filesToCopy) {
        // strip template dir
        // prepend output dir
        const destPath = path.join(
            outputDir,
            filePath.substr(templateDir.length)
        );

        const destDir = path.dirname(destPath);

        fs.mkdirSync(destDir, { recursive: true });
        fs.copyFileSync(filePath, destPath);
    }

    return transformOptions.content;
}
