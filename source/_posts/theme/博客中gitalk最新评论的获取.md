---
title: 博客中gitalk最新评论的获取

toc: true
recommend: 2
keywords: categories-comment
date: 2019-09-13 01:03:06
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20190913010935.png
tags: [icarus主题配置,hexo主题]
categories: [工具教程,主题工具]
---

> 博客中，对于网友的评论以及每篇文章的评论数还是很重要的。但是基于静态的页面想要存储动态的评论数据是比较难的，一般博客主题中都内置了评论插件，但是博客主题中对于最新评论的支持显示还是很少的，至少目前我是没怎么发现。博客 Powered by [Hexo](http://hexo.io/) & [Icarus](http://github.com/ppoffice/hexo-theme-icarus)，采用[Gitalk](https://github.com/gitalk/gitalk)评论，再次感谢此三位作者的辛勤码代码，才有了以下的内容。基于此背景基础上，聊聊最新评论的实现。
<!-- more -->


博客的使用， [Hexo](http://hexo.io/) & [Icarus](http://github.com/ppoffice/hexo-theme-icarus)，采用[Gitalk](https://github.com/gitalk/gitalk)评论 的使用自行百度了。

### 使用场景

- 最新评论列表
- 最热文章列表（基于评论数判断是否最热，也比较片面，但是侧面也能反映，问题不大）

### 使用方法

主要参考自[官方文档](https://developer.github.com/v3/issues/)

目前主要用到`两个方法`，一个是获取仓库下所有的issue，每个issue节点下有相关的评论数，以及对应issue下的评论的url;还有一个是根据issue下评论的URL获取相应的所有的评论

#### 方法1：[List issues for a repository](https://developer.github.com/v3/issues/)

```java
GET /orgs/:org/issues
```

参数列表

|    Name     |         Type          |                         Description                          |
| :---------: | :-------------------: | :----------------------------------------------------------: |
| `milestone` | `integer` or `string` | If an `integer` is passed, it should refer to a milestone by its `number` field. If the string `*` is passed, issues with any milestone are accepted. If the string `none` is passed, issues without milestones are returned. |
|   `state`   |       `string`        | Indicates the state of the issues to return. Can be either `open`, `closed`, or `all`. Default: `open` |
| `assignee`  |       `string`        | Can be the name of a user. Pass in `none` for issues with no assigned user, and `*` for issues assigned to any user. |
|  `creator`  |       `string`        |               The user that created the issue.               |
| `mentioned` |       `string`        |            A user that's mentioned in the issue.             |
|  `labels`   |       `string`        | A list of comma separated label names. Example: `bug,ui,@high` |
|   `sort`    |       `string`        | What to sort results by. Can be either `created`, `updated`, `comments`. Default: `created` |
| `direction` |       `string`        | The direction of the sort. Can be either `asc` or `desc`. Default: `desc` |
|   `since`   |       `string`        | Only issues updated at or after this time are returned. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`. |

以上参数，主要用到 `sort 排序，page页数，per_page每页数量`，其余的参数看个人需要使用。**注意文档中的说明，排序的字段和返回的稍许不太一样。**

#### 方法2：[List comments on an issue](https://developer.github.com/v3/issues/comments/)

```java
GET /repos/:owner/:repo/issues/:issue_number/comments
```

Issue Comments are ordered by ascending ID. 排序根据 ascending (上升的，增长的；升（序）的)ID.也就是说，从老到新。这个比较坑，对于我们获取最新评论来说。

参数如下

|  Name   |   Type   |                         Description                          |
| :-----: | :------: | :----------------------------------------------------------: |
| `since` | `string` | Only comments updated at or after this time are returned. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`. |

根据尝试以及以上参数，试出`不支持排序，但是支持分页，page,per_page参数`，对于我们获取最新的评论来说可以根据评论数，算出分页数，拿到最后一条，即最新一条

```java
//如果只有一页
int page = 1;
int per_page = 1;
// 如果超出一页的话
int page = 2;
int per_page = commentsNumber-1;//commentsNumber:评论数
```

#### js代码中使用实例核心代码

```javascript
            var timesSet = [];
            var timesBodyMap = {};
            var timesSetMap = {};
            var resultArr = [];
            // 方法1：sort=comments可以按评论数排序，此处更适合按更新时间排序,可以根据updated排序，但是0条评论的也会出来，所以此处还是根据评论数排序全部查出来，过滤掉0条评论的，拿到每个issue下最新的一条评论详情和时间，根据时间内存排序
            // per_page 每页数量，根据需求配置
            $.getJSON("https://api.github.com/repos/{用户名}/{仓库}/issues?per_page=100&sort=comments", function (result) {
                $.each(result, function (i, item) {
                    var commentsCount = item.comments;
                    if (commentsCount > 0) {
                        $.ajaxSettings.async = false;
                        // 此处保证是最后一条，api没有排序参数，只能分页取最后一条，保证最少的数据量传输，快速处理
                        var page = 2;
                        var pageSize = commentsCount - 1;
                        if (commentsCount == 1) {
                            page = 1;
                            pageSize = 1;
                        }
                        // 方法2：的使用
                        $.getJSON(item.comments_url + "?page=" + page + "&per_page=" + pageSize, function (commentResult) {
                            var item1 = commentResult[0];
                            var contentStr = item1.body.trim();
                            if (contentStr.length > 50) {
                                contentStr = contentStr.substr(0, 60);
                                contentStr += "...";

                            }
                            timesSet.push(new Date(item1.created_at).getTime());
                            timesBodyMap[item1.created_at] = {
                                "title": item.title.substr(0, item.title.indexOf("-") - 1),
                                "url": item.body.substr(0, item.body.indexOf("\n") - 1),
                                "content": contentStr,
                                "date": item1.created_at,
                                "userName": item1["user"].login,
                                "userUrl": item1["user"].html_url,
                                "commentCount": commentsCount
                            };
                            timesSetMap[new Date(item1.created_at).getTime()] = item1.created_at;
                        });
                    }
                });
            });
            
            // 排序
            if (timesSet.length > 0) {
                timesSet.sort();
            }
            // 根据需要取10条
            if (timesSet.length > 10) {
                for (var i = timesSet.length - 1; i >= 0 && resultArr.length < 10; i--) {
                    resultArr.push(timesBodyMap[timesSetMap[timesSet[i]]]);
                }
            }
            else {
                for (var i = timesSet.length - 1; i >= 0; i--) {
                    resultArr.push(timesBodyMap[timesSetMap[timesSet[i]]]);
                }
            }
```
#### 方法1：请求接口地址示例
```java
https://api.github.com/repos/removeif/blog_comment/issues?per_page=100&sort=comments
```
**返回结果**
```json
[
  {
    "url": "https://api.github.com/repos/removeif/blog_comment/issues/3",
    "repository_url": "https://api.github.com/repos/removeif/blog_comment",
    "labels_url": "https://api.github.com/repos/removeif/blog_comment/issues/3/labels{/name}",
    "comments_url": "https://api.github.com/repos/removeif/blog_comment/issues/3/comments",
    "events_url": "https://api.github.com/repos/removeif/blog_comment/issues/3/events",
    "html_url": "https://github.com/removeif/blog_comment/issues/3",
    "id": 458985510,
    "node_id": "MDU6SXNzdWU0NTg5ODU1MTA=",
    "number": 3,
    "title": "留言板 - 辣椒の酱",
    "user": {
      "login": "removeif",
      "id": 10427139,
      "node_id": "MDQ6VXNlcjEwNDI3MTM5",
      "avatar_url": "https://avatars1.githubusercontent.com/u/10427139?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/removeif",
      "html_url": "https://github.com/removeif",
      "followers_url": "https://api.github.com/users/removeif/followers",
      "following_url": "https://api.github.com/users/removeif/following{/other_user}",
      "gists_url": "https://api.github.com/users/removeif/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/removeif/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/removeif/subscriptions",
      "organizations_url": "https://api.github.com/users/removeif/orgs",
      "repos_url": "https://api.github.com/users/removeif/repos",
      "events_url": "https://api.github.com/users/removeif/events{/privacy}",
      "received_events_url": "https://api.github.com/users/removeif/received_events",
      "type": "User",
      "site_admin": false
    },
    "labels": [
      {
        "id": 1416043904,
        "node_id": "MDU6TGFiZWwxNDE2MDQzOTA0",
        "url": "https://api.github.com/repos/removeif/blog_comment/labels/3306ea6632b94cc388b40cef9dda4a8f",
        "name": "3306ea6632b94cc388b40cef9dda4a8f",
        "color": "0e8a16",
        "default": false
      },
      {
        "id": 1415994590,
        "node_id": "MDU6TGFiZWwxNDE1OTk0NTkw",
        "url": "https://api.github.com/repos/removeif/blog_comment/labels/Gitalk",
        "name": "Gitalk",
        "color": "5319e7",
        "default": false
      }
    ],
    "state": "open",
    "locked": false,
    "assignee": null,
    "assignees": [

    ],
    "milestone": null,
    "comments": 33,
    "created_at": "2019-06-21T03:06:53Z",
    "updated_at": "2019-09-12T10:37:34Z",
    "closed_at": null,
    "author_association": "OWNER",
    "body": "https://removeif.github.io/message/\r\n\r\n留言板信息。"
  },
  {...}
  ]
```
#### 方法2：请求接口地址示例
```java
https://api.github.com/repos/removeif/blog_comment/issues/3/comments?per_page=32&page=2
```
**返回结果**
```json
[
  {
    "url": "https://api.github.com/repos/removeif/blog_comment/issues/comments/530767913",
    "html_url": "https://github.com/removeif/blog_comment/issues/3#issuecomment-530767913",
    "issue_url": "https://api.github.com/repos/removeif/blog_comment/issues/3",
    "id": 530767913,
    "node_id": "MDEyOklzc3VlQ29tbWVudDUzMDc2NzkxMw==",
    "user": {
      "login": "removeif",
      "id": 10427139,
      "node_id": "MDQ6VXNlcjEwNDI3MTM5",
      "avatar_url": "https://avatars1.githubusercontent.com/u/10427139?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/removeif",
      "html_url": "https://github.com/removeif",
      "followers_url": "https://api.github.com/users/removeif/followers",
      "following_url": "https://api.github.com/users/removeif/following{/other_user}",
      "gists_url": "https://api.github.com/users/removeif/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/removeif/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/removeif/subscriptions",
      "organizations_url": "https://api.github.com/users/removeif/orgs",
      "repos_url": "https://api.github.com/users/removeif/repos",
      "events_url": "https://api.github.com/users/removeif/events{/privacy}",
      "received_events_url": "https://api.github.com/users/removeif/received_events",
      "type": "User",
      "site_admin": false
    },
    "created_at": "2019-09-12T10:37:34Z",
    "updated_at": "2019-09-12T10:37:34Z",
    "author_association": "OWNER",
    "body": "> 哇 大佬你博客弄的好厉害啊  可以指点指点吗\n>> @xuelangjing 还好吧😂，简简单单的，可以多看下网页上的源码，有什么问题可以讨论讨论哦"
  }
]
```

博客中目前有两个页面使用,根据个人的需要放到各自的位置吧。

**[首页热门推荐](https://removeif.github.io/)**

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20190913005314.png)

**[还有个最新评论页：](https://removeif.github.io/comment/)**

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20190913005510.png)

### 扩展一个方法
上面的实例程序，`每个issue（因为我的每个issue关联一个文章链接）`只取了一条最新的评论，假如每个issue下有两个都是最新的评论，而我也不管是不是同一个issue下的评论，获取所有的最新评论，还有一个方法比较好用。
#### [List comments in a repository](https://developer.github.com/v3/issues/comments/#list-comments-in-a-repository)
```java
GET /repos/:owner/:repo/issues/comments
```
By default, Issue Comments are ordered by ascending ID. 和上面一样，但是以下参数就不一样了

|    Name     |   Type   |                         Description                          |
| :---------: | :------: | :----------------------------------------------------------: |
|   `sort`    | `string` |      Either `created` or `updated`. Default: `created`       |
| `direction` | `string` | Either `asc` or `desc`. Ignored without the `sort` parameter. |
|   `since`   | `string` | Only comments updated at or after this time are returned. This is a timestamp in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format: `YYYY-MM-DDTHH:MM:SSZ`. |

多了`排序字段和排序方式，也有per和per_page`，这是相当的有用啊
#### 扩展方法：请求接口地址示例
```java
https://api.github.com/repos/removeif/blog_comment/issues/comments?sort=updated&direction=desc&per_page=10&page=1
```
返回结果
```json
[
  {
    "url": "https://api.github.com/repos/removeif/blog_comment/issues/comments/530767913",
    "html_url": "https://github.com/removeif/blog_comment/issues/3#issuecomment-530767913",
    "issue_url": "https://api.github.com/repos/removeif/blog_comment/issues/3",
    "id": 530767913,
    "node_id": "MDEyOklzc3VlQ29tbWVudDUzMDc2NzkxMw==",
    "user": {
      "login": "removeif",
      "id": 10427139,
      "node_id": "MDQ6VXNlcjEwNDI3MTM5",
      "avatar_url": "https://avatars1.githubusercontent.com/u/10427139?v=4",
      "gravatar_id": "",
      "url": "https://api.github.com/users/removeif",
      "html_url": "https://github.com/removeif",
      "followers_url": "https://api.github.com/users/removeif/followers",
      "following_url": "https://api.github.com/users/removeif/following{/other_user}",
      "gists_url": "https://api.github.com/users/removeif/gists{/gist_id}",
      "starred_url": "https://api.github.com/users/removeif/starred{/owner}{/repo}",
      "subscriptions_url": "https://api.github.com/users/removeif/subscriptions",
      "organizations_url": "https://api.github.com/users/removeif/orgs",
      "repos_url": "https://api.github.com/users/removeif/repos",
      "events_url": "https://api.github.com/users/removeif/events{/privacy}",
      "received_events_url": "https://api.github.com/users/removeif/received_events",
      "type": "User",
      "site_admin": false
    },
    "created_at": "2019-09-12T10:37:34Z",
    "updated_at": "2019-09-12T10:37:34Z",
    "author_association": "OWNER",
    "body": "> 哇 大佬你博客弄的好厉害啊  可以指点指点吗\n>> @xuelangjing 还好吧😂，简简单单的，可以多看下网页上的源码，有什么问题可以讨论讨论哦"
  },
  {
    ...
  }
  ]
```
#### 总结此扩展方法
**优点：**对于不在乎issue数量，只在乎最新评论的就比较适用，能够精准拿出前10条，很赞
**不足：**一个issue下多个最新评论，如果想要显示的最新评论列表还包括文章标题，看起来可能不太好看，很多重复，但是看个人需要吧

#### 注意事项，采坑环节

- 对应接口的请求限制，目前接口有请求的限制，所以使用中不能频繁请求，调试的时候一会儿又限制，一会儿又限制比较麻烦，限制十几分钟之后就解除了。
- 对于页面中，一般很多个地方可能都需要展示这个列表，所以不能每次都去请求，必须缓存起来，一般缓存到本地，我的是存的cookie中，十分钟去请求一次，所以调好后一般不会出现限制情况。但是马上评论了的就看不到，有10分钟的延迟，不过也还好。
- 对于如果issue以及评论太多的情况，尽量的少请求，比如上面的分页优化，取最后一条。以及页面中请求时做出异步请求的方式，不要阻止其他元素的渲染。

本人主要做后端，对前端的`set/排序`不太熟悉，上面实现排序代码比较繁琐😂，如果有什么更好的方法，麻烦也告知一下，互相学习共同进步。