// 评论issues仓库 by.removeif https://removeif.github.io/
var repoIssuesUrl = "https://api.github.com/repos/removeif/blog_comment/issues";
// 对应仓库 clientId、clientSecret 关于这两个参数的安全问题，查看 https://removeif.github.io/2019/09/19/博客源码分享.html#1-热门推荐，最新评论：
var clientId = "46a9f3481b46ea0129d8";
var clientSecret = "79c7c9cb847e141757d7864453bcbf89f0655b24";
var authorizationToken = 'Basic ' + btoa(clientId + ':' + clientSecret);
// 写comment count值
var reqCommentCountUrl = repoIssuesUrl + "?t=" + new Date().getTime() + "&labels=Gitalk,";
// 评论缓存key
var COMMENT_CACHE_KEY = "commentKey";

// 管理员名称,评论时添加 [博主] 后缀
var ADMIN_NAME = "removeif";

function ajaxReqForGitHub(url, call) {
    $.ajax({
        type: "get",
        url: url,
        headers: {      //请求头
            Accept: "application/json; charset=utf-8",
            Authorization: "" + authorizationToken  //这是获取的token
        },
        data: "",
        contentType: "application/json",  //推荐写这个
        dataType: "json",
        error: function () {
            console.log('req error');
        },
        success: function (data) {
            call(data);
        }
    });
}

function writeHtmlCommentCountValueById(id) {
    ajaxReqForGitHub(reqCommentCountUrl + id, function (result) {
        try {
            if (result.length > 0) {
                $("#" + id).html(result[0].comments);
            }
        } catch (e) {
            console.error(e);
        }
    });
}

function fillComments(result) {
    var resultArr = [];
    var endIndex = result.length - 1;
    $.each(result, function (i, item) {
        var contentStr = item.body.trim();
        var isSubStr = true;
        contentStr = contentStr.replace(" ", "");
        contentStr = contentStr.replace("&nbsp;", "");
        // 第一次进来就有空格的情况
        let splitStr = "\n\n";
        let firstComm = contentStr.indexOf(">") > -1;
        let conArr = contentStr.split(splitStr);

        // 针对在github上回复的评论
        if (conArr.length != 2) {
            let splitStr1 = "\r\n\r\n";
            conArr = contentStr.split(splitStr1);
        }

        if (conArr.length == 2 && firstComm) {
            contentStr = conArr[1];
        } else if (conArr.length > 2 && firstComm) {
            contentStr = contentStr.substr(contentStr.indexOf(splitStr) + 4);
        } else {

            contentStr = contentStr.replace(/(-)+>/g, " to ");
            while (isSubStr) {
                if (contentStr.lastIndexOf(">") != -1) {
                    var temp = contentStr.substr(contentStr.lastIndexOf(">") + 1);
                    if (temp == undefined || temp == "") {
                        isSubStr = true;
                        contentStr = contentStr.substr(0, contentStr.lastIndexOf(">") - 1);
                    } else {
                        isSubStr = false;
                        contentStr = temp;
                    }
                } else {
                    isSubStr = false;
                }
            }

        }

        if (contentStr == undefined || contentStr == "") {
            contentStr = "内容为空！";
        }

        // 替换图片
        contentStr = contentStr.replace(/![\s\w\](?:http(s)?:\/\/)+[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+\)/g, "[图片]");

        // 替换网址
        contentStr = contentStr.replace(/(?:http(s)?:\/\/)+[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+/g, "[网址]");
        if (contentStr.length > 28) {
            contentStr = contentStr.substr(0, 28);
            contentStr += "...";

        }

        ajaxReqForGitHub(item.issue_url, function (data) {
            addCommentInfo(data, resultArr, item, endIndex, i, contentStr);
        });
    });
}

function addCommentInfo(result, resultArr, item, endIndex, i, contentStr) {

    var itemUrl = result.body.substr(0, result.body.indexOf("\n") - 1);
    // 放入
    let userName = item["user"].login;
    if (userName != undefined && userName != '' && userName == ADMIN_NAME) {
        userName += '[博主]';
    }
    resultArr.push({
        "content": contentStr,
        "date": item.created_at,
        "userName": userName,
        "userUrl": item["user"].html_url,
        "userAvatar": item["user"].avatar_url,
        "url": itemUrl
    });
    // 请求完之后渲染
    if (endIndex == i) {
        // 排序
        resultArr = resultArr.sort(function (a, b) {
            return b.date.localeCompare(a.date);
        });
        renderCommentData(resultArr);
        // 存入缓存
        var resultMap = {};
        resultMap["date"] = new Date().getTime();
        resultMap["data"] = resultArr;
        // 至少6条以上才缓存，有时候走到这里还没处理完，条数不够
        if (resultArr.length > 6) {
            localStorage.setItem(COMMENT_CACHE_KEY, JSON.stringify(resultMap));
        }
    }
}

// 加载最新评论数据
function loadCommentDataAndRender() {
    // sort=comments可以按评论数排序，此处更适合按更新时间排序,可以根据updated排序，但是0条评论的也会出来，所以此处还是全部查出来，内存排序
    // per_page 每页数量，根据需求配置
    // req(repoIssuesUrl + "/comments?sort=created&direction=desc&per_page=7&page=1",fillComments())
    ajaxReqForGitHub(repoIssuesUrl + "/comments?sort=created&direction=desc&per_page=7&page=1", function (data) {
        fillComments(data);
    });
}

// 渲染评论数据
function renderCommentData(COMMENT_ARR) {
    if (COMMENT_ARR.length > 0) {
        // 热门最新
        var htmlContentWidget = "<div class='comment-content'>";
        for (var i = 0; i < COMMENT_ARR.length; i++) {
            var item = COMMENT_ARR[i];
            var contentStr = item.content;
            htmlContentWidget +=
                "<div class='card-comment-item'>" + "<a href=\"" + item.userUrl + "\"target=\"_blank\">" + "<img class='ava' src='" + item.userAvatar + "'/></a>" +
                "<div class='item-header-text'><a href='" + item.userUrl + "' target='_blank'>" + item.userName + "</a>&nbsp;发表于" + getDateDiff(new Date(item.date).getTime()) + "</div>" + "<div class=\"item-text\"><a href =\"" + item.url + '#comment-container\">' + contentStr + "</a></div>" +
                "</div>";
        }
        htmlContentWidget += "</div>"
        $(".body_hot_comment").html(htmlContentWidget);
        loadPjax();
    } else {
        $(".body_hot_comment").html("无数据记录！");
    }
}

// 加载热门推荐数据
function loadIndexHotData() {
    var classDiv = "";
    var hotContent = "";
    if ($("#index_hot_div").length > 0) {
        var hotDiv = $("#index_hot_div");
        ajaxReqForGitHub(repoIssuesUrl + "?per_page=10&sort=comments", function (result) {

            $.each(result, function (i, item) {
                // 标签配色
                if (i >= 0 & i < 4) {
                    classDiv = "class=\"item level3\"";
                } else if (i >= 4 & i < 7) {
                    classDiv = "class=\"item level2\"";
                } else if (i >= 7 & i < 9) {
                    classDiv = "class=\"item level1\"";
                } else {
                    classDiv = "class=\"item level0\"";
                }
                hotContent += "<a href =\"" + item.body.substr(0, item.body.indexOf("\n") - 1) +'\" '+ classDiv + ">" + item.title.substr(0, item.title.indexOf("-") - 1) + "&nbsp;🔥" + (item.comments * 101) + "</a>&nbsp;&nbsp;"
            })
            hotDiv.html("");
            if (hotContent == "") {
                hotDiv.append("无数据记录！");
            } else {
                hotDiv.append(hotContent);
                loadPjax();
            }
        });
    }
}

function loadIssueData() {
    setTimeout(function () { // 延迟1s执行，保证其余的先加载
        var COMMENT_ARR = {};
        var COMMENT_CACHE = localStorage.getItem(COMMENT_CACHE_KEY);
        var COMMENT = {};

        if (COMMENT_CACHE != '' || COMMENT_CACHE != null) {
            // 异常不影响结果，继续往下执行
            try {
                COMMENT = JSON.parse(COMMENT_CACHE);
                COMMENT_ARR = COMMENT["data"];
            } catch (e) {
                COMMENT_CACHE = '';
                console.error(e);
            }
        }


        if (COMMENT_CACHE == '' || COMMENT_CACHE == null || new Date().getTime() - COMMENT["date"] > 60 * 1000) { // request per 10 minutes
            loadCommentDataAndRender();
        } else {
            console.log("load cache data...");
            // 渲染评论数据
            renderCommentData(COMMENT_ARR);
        }

        // 首页热门推荐
        loadIndexHotData();

        // 装载评论数到文章对应位置
        var gitalkIdsArr = document.getElementsByClassName('display-none-class');
        if (gitalkIdsArr != undefined && gitalkIdsArr.length > 0) {
            for (i = 0; i < gitalkIdsArr.length; i++) {
                var id = gitalkIdsArr[i].innerText;
                writeHtmlCommentCountValueById(id);
            }
        }
        console.clear();
        console.log("~~~~欢迎光临！记得有时间多来看看哦，https://removeif.github.io/ ~~~~")
    }
        ,
        500
    )
}
$(document).ready(loadIssueData());

//load issue data completely execute
function loadPjax(){
    var pjax = new Pjax({
        elements: "a",//代表点击链接就更新
        selectors: [  //代表要更新的节点
            ".section",
            "title"
        ],
        cache: true,
        cacheBust:false
    })
    document.addEventListener('pjax:complete', function () {
    });
}