// author by removef
// https://removeif.github.io/
function createTime(time) {
    var n = new Date(time);
    now.setTime(now.getTime() + 250),
        days = (now - n) / 1e3 / 60 / 60 / 24,
        dnum = Math.floor(days),
        hours = (now - n) / 1e3 / 60 / 60 - 24 * dnum,
        hnum = Math.floor(hours),
    1 == String(hnum).length && (hnum = "0" + hnum),
        minutes = (now - n) / 1e3 / 60 - 1440 * dnum - 60 * hnum,
        mnum = Math.floor(minutes),
    1 == String(mnum).length && (mnum = "0" + mnum),
        seconds = (now - n) / 1e3 - 86400 * dnum - 3600 * hnum - 60 * mnum,
        snum = Math.round(seconds),
    1 == String(snum).length && (snum = "0" + snum),
        document.getElementById("statistic-times").innerHTML = "❤️本站自<span><strong> "+time.split(" ")[0].replace(/\//g,".")+"</strong><span> 已运行 <strong>" + dnum + "</strong> 天 <strong>" + hnum + "</strong> 小时 <strong>" + mnum + "</strong> 分 <strong>" + snum + "</strong> 秒！❤️";
}