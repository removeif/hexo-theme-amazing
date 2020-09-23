---
title: 安装、部分配置icarus主题中文版
categories: [工具教程,主题工具]

toc: true
keywords: java
date: 2019-02-28 10:36:56
thumbnail: https://blog.zhangruipeng.me/hexo-theme-icarus/gallery/preview.png
tags: [icarus主题配置,hexo主题]
---
> 摘要
发现icarus主题还不错，花了一两个小时研究了下安装、部分配置icarus主题中文版
<!-- more -->

## 安装icarus

- 直接下载主题模块放到blog项目 ,blog项目根目录执行

```java
git clone https://github.com/ppoffice/hexo-theme-icarus.git themes/icarus
```

此时已经下载到项目中。

- 顶级_config.yml中选择`icarus`主题

  ```java
  # Extensions
  ## Plugins: https://hexo.io/plugins/
  ## Themes: https://hexo.io/themes/
  theme: icarus
  ```

- 此时主题已经安装好，清除、编译、部署可以看到效果了

  ![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620160640.png)

## 配置icarus

- 完全参照[官网](https://blog.zhangruipeng.me/hexo-theme-icarus/categories/Configuration/Posts/)配置，进行翻译解说

### 配置文章部分

#### 顶部图片添加

icarus 主题中的配置_config.yml中开启图片开关

```java
article:
    thumbnail: true
```

文章.md文件头中添加图片绝对/相对地址

```java
title: Getting Started with Icarus
thumbnail: /gallery/thumbnails/desert.jpg
// thumbnail:https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620152744.png
---
Post content...
```

配置完成后部署显示效果如下(最新文章列表显示缩略图、文章开头显示一张设置图片)

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620160657.png)

#### 左边文章导航栏开启

icarus 主题中的配置_config.yml中开关

```java
widgets:
    -
        type: toc
        position: left
```

同事文章顶部加入标签

```Java
title: Table of Contents Example
toc: true
---
Post content...
```

配置效果

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620160721.png)

##### 评论系统开启

icarus 主题中的配置_config.yml中开启（部分评论系统需要翻墙才能使用，valine不用翻墙个人推荐，[valine安装参考](https://valine.js.org/quickstart.html)）

```java
comment:
    type: valine
    app_id: xxxxxxxx        # (required) LeanCloud application id
    app_key: xxxxxxxx       # (required) LeanCloud application key
    notify: false           # (optional) receive email notification
    verify: false           # (optional) show verification code
    placeholder: xxxxxxxx   # (optional) comment box placeholder text
```

开启效果

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620160740.png)

#### 捐赠收款开启

icarus 主题中的配置_config.yml中开启 注意如果默认不配置，编译时有报错，可以# 把它注释掉，不启用功能 

```java
donate:
    -
        # Donation entry name
        type: alipay
        # Qrcode image URL
        qrcode: 'https://wx2.sinaimg.cn/large/b5d1b710gy1g0lvxdcwm0j20p011i4bg.jpg' 
    -
        # Donation entry name
        type: wechat
        # Qrcode image URL
        qrcode: 'https://wx2.sinaimg.cn/large/b5d1b710gy1g0lvwdcpb5j20u014qgy2.jpg'
```

开启配置效果如下

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620160805.png)

### 全局搜索开启

icarus 主题中的配置_config.yml中开启,不同的搜索类型需要[安装插件参考官网](https://blog.zhangruipeng.me/hexo-theme-icarus/categories/Plugins/Search/),type: insight此类型不需要安装，已经内置

```java
search:
    type: insight

```

效果如下

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620161155.png)

### 更多配置请参考官网配置

目前配置基本已经够使用，还需要更多配置请参考[连接](https://blog.zhangruipeng.me/hexo-theme-icarus/categories/Configuration/Posts/)

[参考自](https://blog.zhangruipeng.me/hexo-theme-icarus/categories/Configuration/Posts/)