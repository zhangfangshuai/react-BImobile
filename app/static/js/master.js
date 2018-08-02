var version = '4.0.1';

// let http = 'http://39.107.226.244/';
var http = 'http://bi.shouqiev.com/';
// let http = 'http://172.27.3.68:8080/SQBIServer-web/';


/**
 * Author: zhangfs by Atom
 * Func: 日期格式化原生属性拓展
 */
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,   // 月份
        "d+": this.getDate(),        // 日
        "h+": this.getHours(),       // 小时
        "m+": this.getMinutes(),     // 分
        "s+": this.getSeconds(),     // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3),  // 季度
        "S": this.getMilliseconds()  // 毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}


/**
 * Created: zhangfs by Atom
 * Time: 2018/06/04 10:21
 * Func: 设置单时间选择器的周几数据
 * Params: 0个或1个： 偏移的天数，正数表示以后几天，负数表示以前几天
 */
function getWeekOffset(offset) {
    offset = parseInt(offset) || 0;
    var d = new Date().getDay() + offset%7;
    return '周' + '日一二三四五六'.substr(d,1);
}

function getDateOffset(offset) {
    offset = parseInt(offset) || 0;
    var d = new Date();
    d.setDate(d.getDate() + offset);
    return d.format("yyyyMMdd");
}


function updateWeek(dateStr, offset){
    var o = offset || 0;
    var date = str2Date(dateStr);
    var d = date.getDay() + parseInt(o);
    return '周' + '日一二三四五六'.substr(d,1);
};


/**
 * Created: zhangfs by Atom
 * Time: 2018/06/04
 * Func: 字符创转日期格式, 长度不足8位需要补齐以便适配safari
 */
function str2Date(str) {
    str = (str.length == 8) ? (str.slice(0,4)+'/'+str.slice(4,6)+'/'+str.slice(6,8)) : (str.slice(0,4)+'/'+str.slice(4,6)+'/01');
    return new Date(str);
}



/**
 * Created: zhangfs by Atom
 * Time: 2018/06/05
 * Func: url生成
 */
function buildGetUrl(param) {
    try {
        var baseUrl = http + 'mobile/' + param.interface;
        var url = "";
        for(let i in param) {
            if (i != 'interface') {
                url += i + '=' + encodeURI(param[i]) + '&';
            }
        }
        if (param.interface === 'loginOn') {
            url = url.slice(0, url.length-1);
        } else {
            url += 'token=' + sessionStorage.token;
        }
        url = url.length ? baseUrl + '?' + url : baseUrl;
        return url;
    } catch (e) {
        Tip.error(e);
        return;
    }
}



/**
 * Created: zhangfs by Atom
 * Time: 2018/06/06 20:01
 * Func: 构造请求函数
 */
function axiosGet(params, s, f) {
    var url = buildGetUrl(params);
    axios.get(url).then(function(response){
        if (response.data.code == '401') {
            Tip.success('会话已过期');
            window.location.href = "login";
        } else if (response.data.code == '200'){
            s && s(response.data.data);
        } else {
            Tip.error(response.data.desc + " (" + response.data.code + ")");
            f && f();
        }
    }).catch(function(error) {
        var errObj = {
            title: '错误',
            content: error,
            mainBtn: '我知道了'
        }
        Tip.popups(errObj);
        f && f();
        // Tip.addLoading({txt: '正在加载中...'});
        // setTimeout(function(){
        //     Tip.changeLoading({txt: '網絡有點糟糕...'});
        //     setTimeout(function(){
        //         Tip.removeLoading();
        //     }, 2000)
        // }, 2000)
    })
}


/**
 * Created: zhangfs by Atom
 * Time: 2018/06/06 10:57
 * Func: 检查请求参数是否合理
 */
function isParamValid(param, section) {
    section = section || '';
    for (var i in param) {
        if (i == undefined || i == null) {
            Tip.error(section + '参数错误');
            return false;
        }
    }
    return true;
}







/**
 * Update: zhangfs by Atom
 * Date: 2018/06/06 10:48
 * Func: 类原生toast错误提示效果
 */
function GlobalTip(config){
    this.timeout = (config&&config.timeout)||2000;
    this.hasInit = false;
    this.$tipEle = $("<p style='z-index: 9999;word-break:break-all;max-width: 7rem;min-height:1.067rem;color:white;font-size:0.373rem;padding:0.2rem 0.35rem;position:fixed;top:40%;left:50%;-webkit-transform: translate(-50%);-ms-transform: translate(-50%);transform: translate(-50%);background:rgba(46,55,53,0.90);border-radius: 0.133rem;-webkit-box-shadow: 0 0.053rem 0.08rem 0 rgba(66,75,71,0.20);-moz-box-shadow: 0 0.053rem 0.08rem 0 rgba(66,75,71,0.20);box-shadow: 0 0.053rem 0.08rem 0 rgba(66,75,71,0.20);-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;text-align: center;'><i class='icon icon-tipright' style='vertical-align:middle;margin-right:10px;text-align: center'></i><span></span></p></p>");
    this.tip=$('<div style="position: fixed;left: 0;top: 0;right: 0;bottom: 0;background-color: rgba(0,0,0,0.40);z-index: 9999;" id="doubleAlert">\n' +
        '\t<div style="position: absolute;left: 50%;top: 50%;width: 7.467rem;-webkit-transform: translateX(-50%) translateY(-50%);-moz-transform: translateX(-50%) translateY(-50%);-ms-transform: translateX(-50%) translateY(-50%);-o-transform: translateX(-50%) translateY(-50%);transform: translateX(-50%) translateY(-50%);background: #FFFFFF;-webkit-box-shadow:  0 0.053rem 0.133rem 0 rgba(0,0,0,0.10);-moz-box-shadow:  0 0.053rem 0.133rem 0 rgba(0,0,0,0.10);box-shadow:  0 0.053rem 0.133rem 0 rgba(0,0,0,0.10);-webkit-border-radius: 0.133rem;-moz-border-radius: 0.133rem;border-radius: 0.133rem;">\n' +
        '\t\t<h2 class="tipTitle" style="font-size: 0.4rem;color: #696969;letter-spacing: 0;width: 100%;\n' +
        '\t\theight: 1.067rem;padding-top: 0.4rem;text-align: center;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;"></h2>\n' +
        '\t\t<p class="tipContent" style="width: 5.973rem;margin:0 auto;font-size: 0.373rem;color: #AAAAAA;\n' +
        'line-height: 0.533rem;padding: 0.373rem 0;word-break:break-all;"></p>\n' +
        '\t\t<div class="tipBtn" style="width: 100%;border: 0.027rem solid #FAFAFA;height: 1.173rem;text-align: center;line-height: 1.173rem;color: #0DB95F;font-size: 0.373rem;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;-webkit-border-radius: 0 0 0.133rem 0.133rem;-moz-border-radius: 0 0 0.133rem 0.133rem;border-radius:0 0 0.133rem 0.133rem;display: flex;">\n' +
        '            <div class="tipBtn1" style="height: 100%;border-right: 0.027rem solid #FAFAFA;height: 1.1rem;text-align: center;line-height: 1.17rem;color: #0DB95F;font-size: 0.373rem;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;flex: 1"></div>\n' +
        '            <div class="tipBtn2" style="height: 100%;height: 1.1rem;text-align: center;line-height: 1.1rem;color: #0DB95F;font-size: 0.373rem;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;flex: 1;"></div>\n' +
        '        </div>\n' +
        '\t</div>\n' +
        '</div>');
    this.loading=$('<div class="lodingbg-gofun clearfix">\n' +
            '    <div class="loading-gofun clearfix">\n' +
            '        <div class="loadingL-gofun clearfix">\n' +
            '            <div class="sk-fading-circle">\n' +
            '                <div class="sk-circle sk-circle1"></div>\n' +
            '                <div class="sk-circle sk-circle2"></div>\n' +
            '                <div class="sk-circle sk-circle3"></div>\n' +
            '                <div class="sk-circle sk-circle4"></div>\n' +
            '                <div class="sk-circle sk-circle5"></div>\n' +
            '                <div class="sk-circle sk-circle6"></div>\n' +
            '                <div class="sk-circle sk-circle7"></div>\n' +
            '                <div class="sk-circle sk-circle8"></div>\n' +
            '                <div class="sk-circle sk-circle9"></div>\n' +
            '                <div class="sk-circle sk-circle10"></div>\n' +
            '                <div class="sk-circle sk-circle11"></div>\n' +
            '                <div class="sk-circle sk-circle12"></div>\n' +
            '            </div>\n' +
            '        </div>\n' +
            '        <p id="londingtxt" class="clearfix">12阿瑟费噶1122阿瑟</p>\n' +
            '    </div>\n' +
            '</div>');
}

var Tip = new GlobalTip();
GlobalTip.prototype.initDom=function(){
    $('body').append(this.$tipEle);
    this.hasInit = true;
};
GlobalTip.prototype.showTip=function(type, msg){
    if(!this.hasInit){
        this.initDom();
    }
    var icon_class = "icon icon-tipright";
    if(type=="error"){
        icon_class = "icon icon-tipwarn";
    }
    this.$tipEle.stop(true).fadeIn().delay(this.timeout).fadeOut().find("span").text(msg).end().find(".icon").attr("class", icon_class);
};
GlobalTip.prototype.success = function(msg){
    this.showTip("success", msg);
};
GlobalTip.prototype.error = function(msg){
    this.showTip("error", msg);
};
GlobalTip.prototype.popups=function(obj){

    $('body').append(this.tip);
    if(obj.title){
        this.tip.find('.tipTitle').show().html(obj.title);
    }else{
        this.tip.find('.tipTitle').hide();
    }
    this.tip.find('.tipContent').html(obj.content);
    if(obj.leftBtn){
        this.tip.find('.tipBtn1').show().html(obj.leftBtn);
        if(obj.leftBtnColor){
            this.tip.find('.tipBtn1').css({'color':obj.leftBtnColor})
        }
        this.tip.find('.tipBtn1').on('click',function(){
            if(obj.leftBtnCb){
                obj.leftBtnCb()
            }
            $('#doubleAlert').remove();
        });
    }else{
        this.tip.find('.tipBtn1').hide();
    }
    this.tip.find('.tipBtn2').html(obj.mainBtn);
    if(obj.rightBtnColor){
        this.tip.find('.tipBtn2').css({'color':obj.rightBtnColor})
    }
    this.tip.find('.tipBtn2').on('click',function(){
        if(obj.mainCb){
            obj.mainCb()
        }
        $('#doubleAlert').remove();
    });
};
GlobalTip.prototype.addLoading=function(obj){
    $('body').append(this.loading);
    this.loading.find('#londingtxt').html(obj.txt)
};
GlobalTip.prototype.changeLoading=function(obj){
    this.loading.find('#londingtxt').html(obj.txt)
};
GlobalTip.prototype.removeLoading=function(obj){
    $('body').find(this.loading).remove();
};
