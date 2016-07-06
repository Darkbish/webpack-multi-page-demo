require("./common.js");
require("../../node_modules/font-awesome/css/font-awesome.css");
require("../css/index.less");
var $ = require("jquery");
require("../../node_modules/bootstrap/dist/css/bootstrap.css");
require("../../node_modules/bootstrap/dist/js/bootstrap.js");
require("./lib/jquery-ui/jquery-ui.js");
require("../../node_modules/jquery.fancytree/dist/skin-bootstrap/ui.fancytree.less");
require("../../node_modules/jquery.fancytree/dist/jquery.fancytree-all.js");
require("../../node_modules/select2/dist/css/select2.css");
require("../../node_modules/select2/dist/js/select2.js");
$(function() {
    $("#result").append("<p>This is from index.js</p>");
    $("#tree").fancytree({
        extensions: ["glyph"],
        checkbox: true,
        selectMode: 3,
        glyph: {
            map: {
                doc: "fa fa-file-o",
                docOpen: "fa fa-folder-o",
                checkbox: "glyphicon glyphicon-unchecked",
                checkboxSelected: "glyphicon glyphicon-check",
                expanderClosed: "glyphicon glyphicon-menu-right",
                expanderLazy: "glyphicon glyphicon-menu-right", // glyphicon-plus-sign
                expanderOpen: "glyphicon glyphicon-menu-down", // glyphicon-collapse-down
                folder: "glyphicon glyphicon-folder-close",
                folderOpen: "glyphicon glyphicon-folder-open",
                loading: "glyphicon glyphicon-refresh glyphicon-spin"
            }
        },
        source: [{
            title: "XXX",
            folder: true,
            children: [{
                title: "subA"
            }, {
                title: "subB"
            }]
        }, {
            title: "BBBB",
            folder: true,
            children: [{
                title: "BBB sub a"
            }, {
                title: "BBB sub b"
            }]
        }]
    });

    $("#test").select2();

    $("#change").click(function() {
        $("#test").val("1").trigger('change');
    });
});
