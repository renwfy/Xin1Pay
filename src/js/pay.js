$(document).ready(function () {
    $(document).bind("contextmenu", function (e) {
        return false;
    });
});
$(document).ready(function () {
    $(document).bind("keydown", function (e) {
        e = window.event || e;
        if (e.keyCode == 116) {
            e.keyCode = 0;
            return false;
        }
    });
});
$(document).ready(function () {
    $(document).bind("keydown", function (e) {
        e = window.event || e;
        if (e.keyCode == 118) {
            e.keyCode = 0;
            return false;
        }
    });
});
$(document).ready(function () {
    $(document).bind("keydown", function (e) {
        e = window.event || e;
        if (e.keyCode == 122) {
            e.keyCode = 0;
            return false;
        }
    });
});
$(document).ready(function () {
    $(document).bind("keydown", function (e) {
        e = window.event || e;
        if (e.keyCode == 123) {
            e.keyCode = 0;
            return false;
        }
    });
});
$(document).ready(function () {
    $(document).bind("keydown", function (e) {
        e = window.event || e;
        if (e.keyCode == 83) {
            e.keyCode = 0;
            return false;
        }
    });
});
function urlEncode(String) {
    return encodeURIComponent(String).replace(/'/g, "%27").replace(/"/g, "%22");
}

function urlDecode(String) {
    return decodeURIComponent(String).replace("%27", "%27").replace(/"/g, /'/g);
}

function GetQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}