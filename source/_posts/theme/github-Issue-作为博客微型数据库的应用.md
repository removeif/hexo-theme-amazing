---
title: github Issue 作为博客微型数据库的应用
uniqueId: github-Issue-作为博客微型数据库的应用.html
toc: true
recommend: 1
keywords: categories-github issue
date: 2019-11-28 22:02:05
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191128220618.png
tags: 工具教程
categories: [工具教程,主题工具]
---

### 背景

众所周知，对于hexo框架搭建的静态博客，难免会产生一些动态的数据，比如一些碎碎念、友链、音乐、时间轴等微型数据。目前一般的做法:

a.是创建一个json数据，来存储这些微型数据，但是如果数据太多的话，一是比较慢，二是有个硬伤问题，就是json数据不能分页请求，只能一次拿完，太多的话网络带宽占用太多。
<!-- more -->

b.或者有的直接后台写一些接口服务啥的，还得在买个服务器部署上去，然后博客中访问接口。

c.或者有些可能就直接写到html中。

对于a、c方法都比较麻烦，每次更新了都要编译部署，不能很方便的动态更新。对于b的话，成本以及技术要求可能就更多一些了。

基于上面出现的问题，目前想到的一个解决方案就是，利用github 的issue作为一个微型数据库。能够很方便的动态更新，也能分页，也不需要啥json文件，想想都很方便。

### issue数据库使用步骤

#### issue的创建

先创建一个Repository，对于此Repository可以专门作为微型的数据库，取名issue_database。创建好之后建立一些issue

如下所示

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191128213154.png)

目前博客中，所有的动态数据都放到issue中了。

#### issue中存储数据

对于创建好的issue，就可以往里面写数据了，比如我的友链数据为issue：blog_friends

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191128213427.png)

对于issue中存储的数据最好存json格式的，因为可以方便后面取出来使用。存储好数据后，如果太多的话，可以点击hide,隐藏起来。同时这个issue最好给`Lock conversation`这样的好处是，防止别人往里面加些脏数据，只能自己往里写数据。哈哈，一般也没有闲的无聊的网友恶作剧。这样就存储好数据了。

#### 博客中获取issue数据

博客中通过js获取issue中的数据，以博客友链为例，以下是获取代码，以及处理

```js
// author by removef
// https://removeif.github.io/
$(function () { //获取处理友链数据，来自issue，一次取完
    $.getJSON("https://api.github.com/repos/removeif/issue_database/issues/2/comments?per_page=100&client_id=46a9f3481b46ea0129d8&client_secret=79c7c9cb847e141757d7864453bcbf89f0655b24", function (source) {
        var data = [];
        var source1;
        source1 = source;
      	// 以后每次更新的都在后面，此处倒序，按时间降序排
        source1.reverse();
      	// 把所有的数据放到data的列表中
        $.each(source1, function (i, e) {
            data.push(...JSON.parse(e.body));
        });
      
        $.each(data, function (i, e) {
          // 博客中html文件的构建，渲染
   			 });
});


```

上面代码中client_id、client_secret在另一篇文章中**[博客源码分享](https://removeif.github.io/2019/09/19/%E5%8D%9A%E5%AE%A2%E6%BA%90%E7%A0%81%E5%88%86%E4%BA%AB.html)**有详细的说明,可以查看一下。这样就能获取到相应的数据，进行操作。

#### issue数据的更新

比如想更新任意一项数据都可以进github中对应的仓库的issue下进行更新，添加。然后实时去博客中查看。

### 扩展一下

对于有些爱唠叨的人（比如我），弄个类似碎碎念的东西就比较实用了。之前想过各种方案，存json数据太不方便；后台写个服务部署服务器也太麻烦。最后思来想去还是利用了下现成的优秀项目[gitalk](https://github.com/gitalk/gitalk),稍稍改改就能很好使用。

#### 博客中的碎碎念

对于博主而言，有发表框和修改的操作，能够方便发表和修改。

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191128215148.png)

可能有时候还会发表一些图片，对图片的样式做了一些控制

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191128215345.png)

对于网友的话只能查看以及点赞加❤️

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191128215555.png)

做法就是源码中改下返回html的文件内容，如果是管理员和非管理员返回一些不同的元素，能够很好的实现碎碎念的功能。
查看[碎碎念](https://removeif.github.io/self-talking/)。

### 总结

静态博客的动态数据是个痛点，GitHub Issue有很多可利用的地方。多去探索发掘其中的奥妙。

利用GitHub Issue来解决目前也是一种解决方法。希望后面会出现更好的解决方案。














