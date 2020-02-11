function urlEncode(String) {
    return encodeURIComponent(String).replace(/'/g, "%27").replace(/"/g, "%22");
}

function handleFiles(e) {
    let id = $(e).attr("id");
    console.log(id)
    let url = getObjectURL(e.files[0]);
    qrcode.decode(url);
    qrcode.callback = function (imgMsg) {
        if (imgMsg == 'error decoding QR Code') {
            alert('解析失败，请手动解码或者更换二维码！')
        }
        $('#' + id + '_url').val(imgMsg);
    }
}

function getObjectURL(file) {
    let url = null;
    if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file);
    } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file);
    }
    return url;
}

$(document).ready(function () {
    $("#alipay,#wechat,#qaq,#jd,#bd").change(function ($this) {
        handleFiles(this);
    });
    $("#qq").change(function ($this) {
        let formData = new FormData();
        formData.append('Filedata', $('#qq')[0].files[0]);
        let scan = layer.msg('识别中,请稍候！', {icon: 16, shade: 0.01, time: 2000000});
        $.ajax({
            url: 'https://upload.api.cli.im/upload.php?kid=cliim',
            type: 'POST',
            cache: false,
            data: formData,
            processData: false,
            contentType: false,
            success: function (a) {
                let data = $.parseJSON(a);
                console.log(data);
                if (data.status == 1) {
                    $.get('https://api.eei8.cn/api/qra.php?url=', {url: data.data.path}, function (qr) {
                        $('#qq_url').val(qr.qrurl);
                        layer.close(scan);
                        console.log(qr);
                    });
                } else {
                    layer.msg(data.msg);
                }
            },
            error: function (msg) {
                layer.msg('解码失败，请手动解码！');
            }
        });
    });
    $('#shorten').click(function () {
        let tpl_id = $(":radio[name=tpl_id]:checked").val();
        if (tpl_id == null) {
            layer.msg("请先选择生成模板！", {icon: 7});
            return false;
        }

        layer.msg('加载中,请稍候！', {icon: 16, shade: 0.01, time: 2000000});
        let ali = urlEncode($('#alipay_url').val()),
            wx = urlEncode($('#wechat_url').val()),
            qq = urlEncode($('#qq_url').val()),
            nick = $('#user_nick').val(),
            data = tpl_data[tpl_id];

        if(!nick){
            layer.msg("请输入昵称！", {icon: 7});
            return false;
        }
        if(!ali && !wx && !qq){
            layer.msg("至少选择一种收款方式！", {icon: 7});
            return false;
        }

        //前端直接生成二维码的方案
        /*
                let text = 'http://xpay.fiz.ink/pay.html?ali=' + ali + '&qq=' + qq + '&wx=' + wx + '&nick=' + nick;
                console.log(text);
                let qrbox = $("#qrbox").qrcode({
                    width: data['qrsize'], //宽度
                    height: data['qrsize'], //高度
                    text: text, //任意内容
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                });
                let canvas = qrbox.find('canvas').get(0);
                let imgdata = canvas.toDataURL('image/jpg');
                qrbox.find('canvas').remove();
                $('#temp').attr('src', imgdata);
                setTimeout(resetCanvas(data, tpl_id), 500);
                 */

        //后端生成二维码的方案，可以精简二维码
        //http://follow.fiz.ink
        let qrImg = document.getElementById("temp");
        qrImg.crossOrigin = 'Anonymous';
        qrImg.src = 'http://follow.fiz.ink/api/public/xpay/getQrCode?nick=' + nick + '&ali=' + ali + '&wx=' + wx + '&qq=' + qq;
        $(qrImg).load(function (e) {
            setTimeout(resetCanvas(data, tpl_id), 500);
        });
    });
});

function resetCanvas(data, id) {
    console.log('resetCanvas');
    let BjImg = document.getElementById("tpl_" + id),
        canvas = document.createElement("canvas"),
        cxt = canvas.getContext("2d");
    BjImg.src = data['tpl_src'];

    $(BjImg).load(function () {
        canvas.width = data['tpl_w'];
        canvas.height = data['tel_h'];
        cxt.fillStyle = "#fff";
        cxt.fillRect(0, 0, canvas.width, canvas.height);

        cxt.save();
        cxt.drawImage(BjImg, 0, 0);
        cxt.restore();

        createQr(canvas, data);
    });
}

function createQr(canvas, data) {
    console.log('createQr');
    let qrImg = document.getElementById("temp"),
        ncxt = canvas.getContext('2d');

    ncxt.drawImage(qrImg, data['qr_x'], data['qr_y'], data['qrsize'], data['qrsize']);
    mixEnd(canvas);
};

function mixEnd(canvas) {
    console.log('mixEnd');
    let img = document.getElementById("qrcode");
    img.src = canvas.toDataURL("image/jpeg");
    img.style.display = 'block';
    layer.close();
    layer.msg('长按保存图片，或者鼠标右键图片！');
};
