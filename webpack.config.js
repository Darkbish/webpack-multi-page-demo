var glob = require("glob");
var path = require("path");
var webpack = require("webpack");
var extractTextPlugin = require("extract-text-webpack-plugin");
var htmlWebpackPlugin = require("html-webpack-plugin");
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
            $: "jquery"
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendors",
            chunks: Object.keys(entries),
            minChunks: Object.keys(entries).length
        }),
        new extractTextPlugin("css/[name].css"),
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer: {
        contentBase: "./",
        host: "localhost",
        port: 8080,
        inline: true,
        hot: true
    }
};
var pages = Object.keys(getEntry("src/pages/**/*.html", "src/pages/"));
pages.push("index");
pages.forEach(pathname => {
    var isIndex = pathname === "index";
    var conf = {
        filename: isIndex ? `./${pathname}.html` : `./pages/${pathname}.html`,
        template: isIndex ? `./src/${pathname}.html` : `./src/pages/${pathname}.html`,
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
        return !(exclude && exclude.some(ex => ex == item));
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
