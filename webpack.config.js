var glob = require("glob");
var path = require("path");
var fs = require("fs");
var layout = fs.readFileSync(path.resolve(__dirname, "src/pages/layout/layout.html"), { encoding: "utf-8" });
var webpack = require("webpack");
var extractTextPlugin = require("extract-text-webpack-plugin");
var htmlWebpackPlugin = require("html-webpack-plugin");
var htmlLayoutWebpackPlugin = require("./html-layout-webpack-plugin.js");
var entries = getEntry("src/js/**/*.js", "src/js/", ["src/js/common.js"]);
var config = {
    entry: entries,
    output: {
        path: path.join(__dirname, "dist"),
        publicPath: "/dist/",
        filename: "js/[name].js",
        chunkFilename: "js/[id].chunk.js?[chunkhash]"
    },
    module: {
        loaders: [{
            test: /\.css$/,
            loader: extractTextPlugin.extract("style-loader", "css-loader")
        }, {
            test: /\.less$/,
            loader: extractTextPlugin.extract("css!less")
        }, {
            test: /\.html$/,
            loader: "html?attrs=img:src img:data-src"
        }, {
            test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader?name=./fonts/[name].[ext]"
        }, {
            test: /\.(png|jpg|gif)$/,
            loader: "url-loader?limit=8192&name=./img/[hash].[ext]"
        }]
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendors",
            chunks: Object.keys(entries),
            minChunks: Object.keys(entries).length
        }),
        new extractTextPlugin("css/[name].css"),
        new webpack.HotModuleReplacementPlugin(),
        new htmlLayoutWebpackPlugin({
            template: "./src/pages/layout/layout.html"
        })
    ],
    devServer: {
        contentBase: "./dist/",
        host: "localhost",
        port: 8080,
        inline: false,
        hot: true
    }
};
var pages = Object.keys(getEntry("src/pages/**/*.html", "src/pages/", ["src/pages/layout/"]));
pages.push("index");
pages.forEach(pathname => {
    var isIndex = pathname === "index";
    var fileName = isIndex ? `${pathname}.html` : `pages/${pathname}.html`;
    var conf = {
        filename: "./" + fileName,
        template: `./src/${fileName}`,
        inject: false
    }
    if (pathname in config.entry) {
        conf.inject = "body";
        conf.chunks = ["vendors", pathname];
        conf.hash = true;
        conf.minify = {
            removeComments: true,
            collapseWhitespace: false
        };
    }
    config.plugins.push(new htmlWebpackPlugin(conf));
});
module.exports = config;

function getEntry(globPath, pathDir, exclude) {
    var files = glob.sync(globPath).filter(function(item) {
        return !(exclude && exclude.some(ex => item.indexOf(ex) !== -1));
    });;
    var entries = {},
        dirname, basename, pathname, extname;
    for (var file of files) {
        dirname = path.dirname(file);
        extname = path.extname(file);
        basename = path.basename(file, extname);
        pathname = path.join(dirname, basename);
        pathname = pathDir ? pathname.replace(new RegExp('^' + pathDir), '') : pathname;
        pathname = pathname.replace(/src\\\w+\\/, "").replace(/\\/g, "/");
        entries[pathname] = ['./' + file];
    }
    return entries;
}

function generateTemplate(template) {
    const pageContent = fs.readFileSync(template, { encoding: "utf-8" });
    return layout.replace("{{ PAGE_CONTENT }}", pageContent);
}
