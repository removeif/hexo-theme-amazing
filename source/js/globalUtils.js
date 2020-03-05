// author by removef
// https://removeif.github.io/
Storage.prototype.setExpire = (key, value, expire) => {
    let obj = {
        data: value,
        time: Date.now(),
        expire: expire
    };
    localStorage.setItem(key, JSON.stringify(obj));
}

Storage.prototype.getExpire = key => {
    let val = localStorage.getItem(key);
    if (!val) {
        return val;
    }
    val = JSON.parse(val);
    if (Date.now() - val.time > val.expire) {
        localStorage.removeItem(key);
        return null;
    }
    return val.data;
}

Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

function getDateDiff(dateTimeStamp) {
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;
    var now = new Date().getTime();
    var diffValue = now - dateTimeStamp;
    if (diffValue < 0) {
        return;
    }
    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
        result = " " + parseInt(monthC) + "月前";
    }
    else if (weekC >= 1) {
        result = " " + parseInt(weekC) + "周前";
    }
    else if (dayC >= 1) {
        result = " " + parseInt(dayC) + "天前";
    }
    else if (hourC >= 1) {
        result = " " + parseInt(hourC) + "小时前";
    }
    else if (minC >= 1) {
        result = " " + parseInt(minC) + "分钟前";
    } else
        result = " 刚刚";
    return result;
}

var expireTime1H = 1000 * 60 * 60; // 1小时过期
function isNightRange(beginTime, endTime) {
    let nowDate = new Date();
    var nowTime = nowDate.getHours() + ":" + nowDate.getMinutes();
    var strb = beginTime.split(":");
    if (strb.length != 2) {
        return false;
    }

    var stre = endTime.split(":");
    if (stre.length != 2) {
        return false;
    }

    var strn = nowTime.split(":");
    if (stre.length != 2) {
        return false;
    }

    var b = new Date();
    var e = new Date();
    var n = new Date();

    b.setHours(strb[0]);
    b.setMinutes(strb[1]);
    e.setHours(stre[0]);
    e.setMinutes(stre[1]);
    n.setHours(strn[0]);
    n.setMinutes(strn[1]);

    console.log(n.getTime());
    if (n.getTime() - b.getTime() > 0 && n.getTime() - e.getTime() < 0) {
        return true;
    } else {
        console.log("now Date is：" + n.getHours() + ":" + n.getMinutes() + "，is not Night！");
        return false;
    }
}

var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window));