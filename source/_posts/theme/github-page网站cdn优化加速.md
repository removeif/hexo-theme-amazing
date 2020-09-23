---
title: github page网站cdn优化加速
uniqueId: github-page网站cdn优化加速.html
toc: true
keywords: categories-tool
date: 2019-09-25 16:41:46
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20190925164508.png
tags: 工具教程
categories: [工具教程,主题工具]
---

CDN的全称是Content Delivery Network，即内容分发网络。CDN是构建在网络之上的内容分发网络，依靠部署在各地的边缘服务器，通过中心平台的负载均衡、内容分发、调度等功能模块，使用户就近获取所需内容，降低网络拥塞，提高用户访问响应速度和命中率。CDN的关键技术主要有内容存储和分发技术。——百度百科

放在Github的资源在国内加载速度比较慢，因此需要使用CDN加速来优化网站打开速度，jsDelivr + Github便是免费且好用的CDN，非常适合博客网站使用。
<!-- more -->

### 图片加速

关于图传以及GitHub作为图库的使用方法请参考文章：[博客图片上传picgo工具github图传使用](https://removeif.github.io/2019/06/20/博客图片上传picgo工具github图传使用.html)。

在上面参考文章的基础之上只需要修改以下配置：**（指定相关cdn域名）**

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20190925161709.png)

原来项目中使用了原来的方式，进行全局替换，**Mac idea**直接快捷键`command+shift+R`全局替换

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20190925162235.png)

**【ps：题外话】**原来是统一用的GitHub的仓库中的图片，通过这样替换，可以看到图片统一管理是多么的重要，多么的方便管理操作。

至此，博客中的相关图片都加上了cdn。

### 其余资源文件

用法：

```text
https://cdn.jsdelivr.net/gh/你的用户名/你的仓库名@发布的版本号/文件路径
```

例如：

```text
https://cdn.jsdelivr.net/gh/TRHX/CDN-for-itrhx.com@1.0/images/trhx.png
https://cdn.jsdelivr.net/gh/TRHX/CDN-for-itrhx.com@2.0.1/css/style.css
https://cdn.jsdelivr.net/gh/moezx/cdn@3.1.3//The%20Pet%20Girl%20of%20Sakurasou.mp4
```

注意：版本号不是必需的，是为了区分新旧资源，如果不使用版本号，将会直接引用最新资源，除此之外还可以使用某个范围内的版本，查看所有资源等，具体使用方法如下：

```text
// 加载任何Github发布、提交或分支
https://cdn.jsdelivr.net/gh/user/repo@version/file

// 加载 jQuery v3.2.1
https://cdn.jsdelivr.net/gh/jquery/jquery@3.2.1/dist/jquery.min.js

// 使用版本范围而不是特定版本
https://cdn.jsdelivr.net/gh/jquery/jquery@3.2/dist/jquery.min.js
https://cdn.jsdelivr.net/gh/jquery/jquery@3/dist/jquery.min.js

// 完全省略该版本以获取最新版本
https://cdn.jsdelivr.net/gh/jquery/jquery/dist/jquery.min.js

// 将“.min”添加到任何JS/CSS文件中以获取缩小版本，如果不存在，将为会自动生成
https://cdn.jsdelivr.net/gh/jquery/jquery@3.2.1/src/core.min.js

// 在末尾添加 / 以获取资源目录列表
https://cdn.jsdelivr.net/gh/jquery/jquery/
```
至此，github page 博客基本需要加速的完成。

参考文章:  
[参考链接1](https://blog.csdn.net/qq_36759224/article/details/86936453)  
[参考链接2](https://blog.csdn.net/qq_36759224/article/details/98058240)



