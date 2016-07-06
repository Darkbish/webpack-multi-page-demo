var fs = require("fs");

function htmlLayoutWebpackPlugin(options) {
    this.template = fs.readFileSync(options.template, { encoding: "utf-8" });
}

htmlLayoutWebpackPlugin.prototype.apply = function(compiler) {
    let that = this;
    compiler.plugin("compilation", function(compilation) {
        compilation.plugin("html-webpack-plugin-before-html-processing", function(htmlPluginData, callback) {
            htmlPluginData.html = that.template.replace("{{ PAGE_CONTENT }}", htmlPluginData.html);
            callback(null, htmlPluginData);
        });
    });
}

module.exports = htmlLayoutWebpackPlugin;
