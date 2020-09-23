---
title: 博客图片上传picgo工具github图传使用

toc: true
keywords: java
date: 2019-06-20 17:31:57
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620173650.png
tags: 工具教程
categories: [工具教程,主题工具]
---
> 摘要
对于每一个写博客的人来说，图片是至关重要。这一路经历了多次图片的烦恼，之前选择了微博个人文章那里粘贴图片的方式上传，感觉也挺方便的。但是由于新浪的图片显示问题，如果header中不设置<!-- <meta name="referrer" content="no-referrer" /> 解决图片过期问题--> 标签就不能异步访问图片，导致图裂，那之恶心。然而设置之后又与网站访客统计的插件冲突，使之不能统计，真是神仙打架。无赖之下使用了PicGo工具，使用后感觉真XX方便！
<!-- more -->
## PicGo工具下载安装配置

### 下载

- .[PicGo下载](https://github.com/Molunerfinn/PicGo) github网站提供三个版本的下载，MacOs、linux、windows覆盖市面上90%系统，还是很给力了。

- 我是mac用户，直接使用brew cask来安装PicGo: **brew cask install picgo**，简直方便到爆。

### 配置

- PicGo配置(使用github图传，免费方便，同时配合github.io博客真是方便)

  ![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620173723.png)

选上必填的就ok,一开始不知道token的设置，附赠token获取方法

图片上传相关的设置

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620173650.png)

链接格式：选择适合自己的，一般用户md文件中，选第一个，然后就可以疯狂使用了。

### 使用github图传，获取token

在github->setting->developer settings 选择generate new token

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620170732.png)

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620171238.png)

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620173443.png)

勾选好之后生成就好了

### 使用

- PicGo使用，简直方便

  1).默认网页上直接右键复制图片

  ![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620172136.png)

  2).点击等待中的图片，开始上传

  ![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620172046.png)

  3).上传完之后有个提示，同时粘贴板也会自动粘贴上

  ![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620173543.png)

  4).直接粘贴到想要的地方

  或者也可以直接截图，然后点击图片里的图片上传，很方便

- PicGo上传动图gif

  如果直接复制网页上的动图，去上传的话是截取的某帧，是静图。应该下载到本地，然后在拖进去上传就可以了。

  
  