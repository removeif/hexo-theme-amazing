/**
* Helper functions for page/post.
*
* @example
*     <%- is_categories(page) %>
*     <%- is_tags(page) %>
*/
module.exports = function (hexo) {
    hexo.extend.helper.register('is_categories', function (page = null) {
        return (page === null ? this.page : page).__categories === true;
    });

    hexo.extend.helper.register('is_tags', function (page = null) {
        return (page === null ? this.page : page).__tags === true;
    });

    // 获取路劲中最后一个字符串，针对于后面调整分类和链接格式时，id不受影响
    hexo.extend.helper.register('get_path_end_str', function (path, unique, title) {

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
    })
};
