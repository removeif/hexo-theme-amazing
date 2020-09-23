---
title: 苹果6s ios12 nfc 模拟门禁
uniqueId: 苹果6s-ios12-nfc-模拟门禁.html
toc: true
recommend: 1
keywords: categories-ios,nfc
date: 2019-11-23 20:51:32
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191123214508.png
tags: [ios,nfc]
categories: ios
---
众所周知，ios系统封闭了对NFC的功能使用。据了解，国外是可以使用的，国内不行，实在搞不懂，有NFC又不能用，这不是浪费资源，多此一举嘛！
<!-- more -->

### 设备信息
<div class="img-y">

![设备信息](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191123204913.png)</div>
**本机信息6s ios12.4 16G**  
ios 11 直接就能读出卡，没这么复杂。
ios 12 可以使用，比较复杂。  
ios 13 好像不能使用。

### 步骤
#### 越狱
使用之前需要设备能够越狱，关于越狱后的一系列安全问题请自行百度。越狱方法可以进[威锋论坛](https://www.feng.com/)
找到自己机型版块里的对应教程。
本机是通过Windows爱思助手，一键越狱完成。

#### 安装插件
源为图中倒数第三个P开头那个，插件为插件图中打钩的那个，有些插件和源的不能用，目前测试这个源和插件是可用的。
<div class="img-y">

![源](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191123212225.png) ![插件](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191123212307.png)</div>

#### 使用插件
<div class="img-y">

![图1](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191123212532.png) ![图2](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191123212614.png) ![图3](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191123212642.png) ![图4](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191123212703.png) ![图5](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191123212727.png)![图6](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191123212755.png)</div>
1.图1，如果是ios11,点击最上面的scan按钮，靠近门禁卡或公交卡就能读出来，但是iOS12读不出。
2.图2，点最后一项。
3.图3，点击Connect按钮，把卡靠近手机后壳。
4.图4，已经读出UID。
5.图5，把UID填上。
6.图6，然后点击Start按钮，如图开始模拟nfc卡。靠近刷卡机刷卡。
我添加的是门禁卡，亲测成功。也能读取添加公交卡，没测试，应该是可以的。
每次只能模拟一张卡，使用另外一张需要手动更换UID。

### 免责声明
操作中造成的一切损失与博主无关，请自行掂量谨慎操作。


