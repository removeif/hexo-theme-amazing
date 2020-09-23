const crypto = require('crypto');
/**
 * some global method
 */
module.exports = function (hexo) {
    // 获取路劲中最后一个字符串，针对于后面调整分类和链接格式时，id不受影响
    hexo.extend.helper.register('_get_path_end_str', function (path, unique, title) {

        // 原格式 2020-02-06 02:29:04/"test1".html -> 20200206022904/test1.html
        if (unique != undefined && unique != '') {
            unique = unique.toLocaleLowerCase();
            // 标题中有空格的需要在自动生成的uniqueId中自动替换成"-"中横线
            if (unique.indexOf("\"") > -1) {
                // 自动生成的需要去
                return unique.replace(/\"|\:|\ |\:|\-/gi, "");
            } else {
                // 老版本修改标题后填原来的 原来的post格式-uniqueId: 秒杀系统如何支撑百万QPS.html 文章-uniqueId: about/index.html
                // 同时需要去相应的issueli修改相应的文章连接，热门推荐和最新评论需要跳转修改后的数据
                return unique;
            }
        } else {
            // 对于短连接模式，原来有issue评论的，使用title关联，如果有最新评论以及热门推荐的需要 更爱相应issue中的文章url
            // 对于page 有可能是 有title的情况需要排除
            if (title != undefined && title != "" && path.indexOf("/index.html") < 0) {
                title += ".html";
                title = title.toLocaleLowerCase();
                return title.replace(/\ /gi, "-");
            }
        }
        // 兼容老版本 原来的post格式：uniqueId: 秒杀系统如何支撑百万QPS.html 文章 uniqueId: about/index.html
        let pathArr = path.split("/");
        let pathArrEndIndex = pathArr.length - 1;
        // 对于页的处理
        if (pathArr[pathArrEndIndex] == "index.html") {
            return (pathArr[pathArrEndIndex - 1] + "/" + pathArr[pathArrEndIndex]).toLocaleLowerCase();
        } else {
            return pathArr[pathArrEndIndex].toLocaleLowerCase();
        }
    });

    hexo.extend.helper.register('_get_md5', function (str) {
        return crypto.createHash('md5').update(str).digest('hex');
    });

    // filename resource abs url
    hexo.extend.helper.register('my_cdn', function (filename) {

        // https://cdn.jsdelivr.net/gh/removeif/removeif.github.io@v1.0.6/json_data/record.json
        // full url,return
        if (filename.startsWith("https://cdn.jsdelivr.net")) {
            return filename;
        } else {

            const myCdnPre = this.config.providers.my_cdn_pre;
            if (myCdnPre != undefined && myCdnPre != "") {

                if (filename.startsWith(this.config.root)) {
                    filename = filename.replace(this.config.root, "");
                }

                if (filename.endsWith(".css") && !filename.endsWith(".min.css") && myCdnPre.indexOf("cdn.jsdelivr.net") > -1) {
                    filename = filename.replace(".css", ".min.css");
                } else if (filename.endsWith(".js") && !filename.endsWith(".min.js") && myCdnPre.indexOf("cdn.jsdelivr.net") > -1) {
                    filename = filename.replace(".js", ".min.js");
                }
                return this.config.providers.my_cdn_pre + filename;
            } else {
                return filename;
            }
        }
    });
};