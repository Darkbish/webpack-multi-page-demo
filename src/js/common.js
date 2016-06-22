require("../css/common.less");
var $ = require("jquery");
$(function () {
    var btn = $("<button class='btn btn-primary>click me</button>");
    btn.click(function() {
        alert("from common.js");
    });
    $("#result").append(btn);
});