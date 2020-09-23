---
title: 替代web-cookie存储方案实现

toc: true
keywords: categories-front
date: 2019-10-23 18:33:34
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191023175949.png

tags: 前端技术
categories: 前端技术
---
随着移动网络的发展与演化，我们手机上现在除了有原生 App，还能跑“WebApp”——它即开即用，用完即走。一个优秀的 WebApp 甚至可以拥有和原生 App 媲美的功能和体验。
WebApp 优异的性能表现，有一部分原因要归功于浏览器存储技术的提升。cookie存储数据的功能已经很难满足开发所需，逐渐被WebStorage、IndexedDB所取代，本文将介绍这几种存储方式的差异和优缺点。
<!-- more -->

##  Cookie

### 1、Cookie的来源

**Cookie 的本职工作并非本地存储，而是“维持状态”**。因为**HTTP协议是无状态的，HTTP协议自身不对请求和响应之间的通信状态进行保存**，通俗来说，服务器不知道用户上一次做了什么，这严重阻碍了交互式Web应用程序的实现。

在典型的网上购物场景中，用户浏览了几个页面，买了一盒饼干和两瓶饮料。最后结帐时，由于HTTP的无状态性，不通过额外的手段，服务器并不知道用户到底买了什么，于是就诞生了Cookie。它就是用来绕开HTTP的无状态性的“额外手段”之一。服务器可以设置或读取Cookies中包含信息，借此维护用户跟服务器会话中的状态。

我们可以把Cookie 理解为一个存储在浏览器里的一个小小的文本文件，它附着在 HTTP 请求上，在浏览器和服务器之间“飞来飞去”。它可以携带用户信息，当服务器检查 Cookie 的时候，便可以获取到客户端的状态。

在刚才的购物场景中，当用户选购了第一项商品，服务器在向用户发送网页的同时，还发送了一段Cookie，记录着那项商品的信息。当用户访问另一个页面，浏览器会把Cookie发送给服务器，于是服务器知道他之前选购了什么。用户继续选购饮料，服务器就在原来那段Cookie里追加新的商品信息。结帐时，服务器读取发送来的Cookie就行了。

### 2、什么是Cookie及应用场景？

**Cookie指某些网站为了辨别用户身份而储存在用户本地终端上的数据(通常经过加密)。 cookie是服务端生成，客户端进行维护和存储**。通过cookie,可以让服务器知道请求是来源哪个客户端，就可以进行客户端状态的维护，比如登陆后刷新，请求头就会携带登陆时response header中的set-cookie,Web服务器接到请求时也能读出cookie的值，根据cookie值的内容就可以判断和恢复一些用户的信息状态。

**Cookie 以键值对的形式存在**。

典型的应用场景有：

- 记住密码，下次自动登录；
- 购物车功能；
- 记录用户浏览数据，进行商品（广告）推荐。

### 3、Cookie的原理及生成方式

Cookie的原理：

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191023180445.png)

第一次访问网站的时候，浏览器发出请求，服务器响应请求后，会在响应头里面添加一个Set-Cookie选项，将cookie放入到响应请求中，在浏览器第二次发请求的时候，会通过Cookie请求头部将Cookie信息发送给服务器，服务端会辨别用户身份，另外，Cookie的过期时间、域、路径、有效期、适用站点都可以根据需要来指定。

Cookie的生成方式主要有两种：

- **生成方式一：http response header中的set-cookie**

我们可以通过响应头里的 Set-Cookie 指定要存储的 Cookie 值。默认情况下，domain 被设置为设置 Cookie 页面的主机名，我们也可以手动设置 domain 的值。

```json
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2018 07:28:00 GMT;//可以指定一个特定的过期时间（Expires）或有效期（Max-Age）
```

- **生成方式二：js中可以通过document.cookie可以读写cookie，以键值对的形式展示**

例如我们在掘金社区控制台输入以下三句代码，便可以在Chrome 的 Application 面板查看生成的cookie：

```js
document.cookie="userName=hello"
document.cookie="gender=male"
document.cookie='age=20;domain=.baidu.com'
```

**Domain 标识指定了哪些域名可以接受Cookie**。如果没有设置domain，就会自动绑定到执行语句的当前域。 如果设置为”.baidu.com”,则所有以”baidu.com”结尾的域名都可以访问该Cookie，所以在掘金社区上读取不到第三条代码存储Cookie值。

### 4、Cookie的缺陷

- **Cookie 不够大**

Cookie的大小限制在4KB左右，对于复杂的存储需求来说是不够用的。当 Cookie 超过 4KB 时，它将面临被裁切的命运。这样看来，Cookie 只能用来存取少量的信息。此外很多浏览器对一个站点的cookie个数也是有限制的。

这里需注意：各浏览器的cookie每一个`name=value`的value值大概在4k，所以4k并不是一个域名下所有的cookie共享的,而是一个name的大小。

- **过多的 Cookie 会带来巨大的性能浪费**

Cookie 是紧跟域名的。同一个域名下的所有请求，都会携带 Cookie。大家试想，如果我们此刻仅仅是请求一张图片或者一个 CSS 文件，我们也要携带一个 Cookie 跑来跑去（关键是 Cookie 里存储的信息并不需要），这是一件多么劳民伤财的事情。Cookie 虽然小，请求却可以有很多，随着请求的叠加，这样的不必要的 Cookie 带来的开销将是无法想象的。

cookie是用来维护用户信息的，而域名(domain)下所有请求都会携带cookie，但对于静态文件的请求，携带cookie信息根本没有用，此时可以通过cdn（存储静态文件的）的域名和主站的域名分开来解决。 - 由于在HTTP请求中的Cookie是明文传递的，所以安全性成问题，除非用HTTPS。

### 5、Cookie与安全

HttpOnly 不支持读写，浏览器不允许脚本操作document.cookie去更改cookie， 所以为避免跨域脚本 (XSS) 攻击，通过JavaScript的 Document.cookie API无法访问带有 HttpOnly 标记的Cookie，它们只应该发送给服务端。如果包含服务端 Session 信息的 Cookie 不想被客户端 JavaScript 脚本调用，那么就应该为其设置 HttpOnly 标记。

```js
Set-Cookie: id=a3fWa; Expires=Wed, 21 Oct 2015 07:28:00 GMT; Secure; HttpOnly
```

标记为 Secure 的Cookie只应通过被HTTPS协议加密过的请求发送给服务端。但即便设置了 Secure 标记，敏感信息也不应该通过Cookie传输，因为Cookie有其固有的不安全性，Secure 标记也无法提供确实的安全保障。

为了弥补 Cookie 的局限性，让“专业的人做专业的事情”，Web Storage 出现了。

**HTML5中新增了本地存储的解决方案——Web Storage，它分成两类：sessionStorage和localStorage**。这样有了WebStorage后，cookie能只做它应该做的事情了——作为客户端与服务器交互的通道，保持客户端状态。

## LocalStorage

### 1、LocalStorage的特点

- 保存的数据长期存在，下一次访问该网站的时候，网页可以直接读取以前保存的数据；
- 大小为5M左右；
- 仅在客户端使用，不和服务端进行通信；
- 接口封装较好。

基于上面的特点，LocalStorage可以作为浏览器本地缓存方案，用来提升网页首屏渲染速度(根据第一请求返回时，将一些不变信息直接存储在本地)。

### 2、存入/读取数据

localStorage保存的数据，以“键值对”的形式存在。也就是说，每一项数据都有一个键名和对应的值。所有的数据都是以文本格式保存。 存入数据使用setItem方法。它接受两个参数，第一个是键名，第二个是保存的数据。 

```js
localStorage.setItem("key","value");
```

读取数据使用getItem方法。它只有一个参数，就是键名。 

```js
var valueLocal = localStorage.getItem("key");
```

具体步骤，请看下面的例子：

```html
<script>
if(window.localStorage){
  localStorage.setItem（'name','world'）
  localStorage.setItem（“gender','famale'）
}
</script>
<body>
<div id="name"></div>
<div id="gender"></div>
<script>
var name=localStorage.getItem('name')
var gender=localStorage.getItem('gender')
document.getElementById('name').innerHTML=name
document.getElementById('gender').innerHTML=gender
</script>
</body>
```

### 3、使用场景

LocalStorage在存储方面没有什么特别的限制，理论上 Cookie 无法胜任的、可以用简单的键值对来存取的数据存储任务，都可以交给 LocalStorage 来做。

这里给大家举个例子，考虑到 LocalStorage 的特点之一是持久，有时我们更倾向于用它来存储一些内容稳定的资源。比如图片内容丰富的电商网站会用它来存储 Base64 格式的图片字符串：

## sessionStorage

sessionStorage保存的数据用于浏览器的一次会话，当会话结束（通常是该窗口关闭），数据被清空；sessionStorage 特别的一点在于，**即便是相同域名下的两个页面，只要它们不在同一个浏览器窗口中打开，那么它们的 sessionStorage 内容便无法共享**；localStorage 在所有同源窗口中都是共享的；cookie也是在所有同源窗口中都是共享的。除了保存期限的长短不同，SessionStorage的属性和方法与LocalStorage完全一样。

### 1、sessionStorage的特点

- 会话级别的浏览器存储；
- 大小为5M左右；
- 仅在客户端使用，不和服务端进行通信；
- 接口封装较好。

基于上面的特点，sessionStorage 可以有效对表单信息进行维护，比如刷新时，表单信息不丢失。

### 2、使用场景

sessionStorage 更适合用来存储生命周期和它同步的会话级别的信息。这些信息只适用于当前会话，当你开启新的会话时，它也需要相应的更新或释放。比如微博的 sessionStorage就主要是存储你本次会话的浏览足迹：

lasturl 对应的就是你上一次访问的 URL 地址，这个地址是即时的。当你切换 URL 时，它随之更新，当你关闭页面时，留着它也确实没有什么意义了，干脆释放吧。这样的数据用 sessionStorage 来处理再合适不过。

### 3、sessionStorage 、localStorage 和 cookie 之间的区别

- 共同点：都是保存在浏览器端，且都遵循同源策略。
- 不同点：在于生命周期与作用域的不同

作用域：localStorage只要在相同的协议、相同的主机名、相同的端口下，就能读取/修改到同一份localStorage数据。sessionStorage比localStorage更严苛一点，除了协议、主机名、端口外，还要求在同一窗口（也就是浏览器的标签页）下。

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191023181403.png)

生命周期：localStorage 是持久化的本地存储，存储在其中的数据是永远不会过期的，使其消失的唯一办法是手动删除；而 sessionStorage 是临时性的本地存储，它是会话级别的存储，当会话结束（页面被关闭）时，存储内容也随之被释放。

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191023181420.png)

Web Storage 是一个从定义到使用都非常简单的东西。它使用键值对的形式进行存储，这种模式有点类似于对象，却甚至连对象都不是——**它只能存储字符串**，要想得到对象，我们还需要先对字符串进行一轮解析。对于对象存储

```js
if (COMMENT_CACHE != '') {
            // 异常不影响结果，继续往下执行
            try {
                COMMENT = JSON.parse(COMMENT_CACHE);
                COMMENT_ARR = COMMENT["data"];
            } catch (e) {
                COMMENT_CACHE = '';
                console.error(e);
            }
}

if (COMMENT_ARR.length > 0) {
                localStorage.setItem(COMMENT_CACHE_KEY, JSON.stringify(resultMap));
}
```

说到底，Web Storage 是对 Cookie 的拓展，它只能用于存储少量的简单数据。当遇到大规模的、结构复杂的数据时，Web Storage 也爱莫能助了。这时候我们就要清楚我们的终极大 boss——IndexedDB！

## IndexedDB

ndexedDB 是一种低级API，**用于客户端存储大量结构化数据(包括文件和blobs)**。该API使用索引来实现对该数据的高性能搜索。IndexedDB 是一个运行在浏览器上的非关系型数据库。

既然是数据库了，那就不是 5M、10M 这样小打小闹级别了。理论上来说，IndexedDB 是没有存储上限的（一般来说不会小于 250M）。它不仅可以存储字符串，还可以存储二进制数据。

### 1、IndexedDB的特点

- 键值对储存

IndexedDB 内部采用对象仓库（object store）存放数据。所有类型的数据都可以直接存入，包括 JavaScript 对象。对象仓库中，数据以"键值对"的形式保存，每一个数据记录都有对应的主键，主键是独一无二的，不能有重复，否则会抛出一个错误。

- 异步

IndexedDB 操作时不会锁死浏览器，用户依然可以进行其他操作，这与 LocalStorage 形成对比，后者的操作是同步的。异步设计是为了防止大量数据的读写，拖慢网页的表现。

- 支持事务

IndexedDB 支持事务（transaction），这意味着一系列操作步骤之中，只要有一步失败，整个事务就都取消，数据库回滚到事务发生之前的状态，不存在只改写一部分数据的情况。

- 同源限制

IndexedDB 受到同源限制，每一个数据库对应创建它的域名。网页只能访问自身域名下的数据库，而不能访问跨域的数据库。

- 储存空间大

IndexedDB 的储存空间比 LocalStorage 大得多，一般来说不少于 250MB，甚至没有上限。

- 支持二进制储存

IndexedDB 不仅可以储存字符串，还可以储存二进制数据（ArrayBuffer 对象和 Blob 对象）。

### 2、IndexedDB的常见操作

在IndexedDB大部分操作并不是我们常用的调用方法，返回结果的模式，而是请求——响应的模式。

- 建立打开IndexedDB——`window.indexedDB.open("testDB")`

这条指令并不会返回一个DB对象的句柄，我们得到的是一个`IDBOpenDBRequest`对象，而我们希望得到的DB对象在其result属性中。

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191023181750.png)

除了result，IDBOpenDBRequest接口定义了几个重要属性：

- onerror: 请求失败的回调函数句柄；
- onsuccess:请求成功的回调函数句柄；
- onupgradeneeded:请求数据库版本变化句柄。

如下使用：

```js
<script>
function openDB(name){
  var request=window.indexedDB.open(name)//建立打开IndexedDB
  request.onerror=function (e){
  console.log('open indexdb error')
}
request.onsuccess=function (e){
  myDB.db=e.target.result//这是一个 IDBDatabase对象，这就是IndexedDB对象
  console.log(myDB.db)//此处就可以获取到db实例
}
}
var myDB={
  name:'testDB',
  version:'1',
  db:null
}
openDB(myDB.name)
</script>
```

控制台得到一个 IDBDatabase对象，这就是IndexedDB对象：

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20191023181829.png)

- 关闭IndexedDB：

```js
function closeDB(db){
    db.close();
}
```

- 删除IndexedDB：

```js
function deleteDB(name) {
  indexedDB.deleteDatabase(name)
}
```

简单示例

### object store

有了数据库后我们自然希望创建一个表用来存储数据，但indexedDB中没有表的概念，而是objectStore，一个数据库中可以包含多个objectStore，objectStore是一个灵活的数据结构，可以存放多种类型数据。也就是说一个objectStore相当于一张表，里面存储的每条数据和一个键相关联。

我们可以使用每条记录中的某个指定字段作为键值（keyPath），也可以使用自动生成的递增数字作为键值（keyGenerator），也可以不指定。选择键的类型不同，objectStore可以存储的数据结构也有差异

| 键类型       | 存储数据                                                     |
| ------------ | ------------------------------------------------------------ |
| 不使用       | 任意值，但是没添加一条数据的时候需要指定键参数               |
| keyPath      | Javascript对象，对象必须有一属性作为键值                     |
| keyGenerator | 任意值                                                       |
| 都使用       | Javascript对象，如果对象中有keyPath指定的属性则不生成新的键值，如果没有自动生成递增键值，填充keyPath指定属性 |

```js
// 调用
var myDB={
            name:'test',
            version:3,
            db:null
        };
        openDB(myDB.name,myDB.version);
        setTimeout(function(){
            closeDB(myDB.db);
            deleteDB(myDB.name);
        },500);

//给object store添加数据
function openDB (name,version) {
            var version=version || 1;
            var request=window.indexedDB.open(name,version);
            request.onerror=function(e){
                console.log(e.currentTarget.error.message);
            };
            request.onsuccess=function(e){
                myDB.db=e.target.result;
            };
            request.onupgradeneeded=function(e){
                var db=e.target.result;
                if(!db.objectStoreNames.contains('students')){
                    db.createObjectStore('students',{keyPath:"id"});
                }
                console.log('DB version changed to '+version);
            };
        }
// 数据
var students=[{ 
            id:1001, 
            name:"Byron", 
            age:24 
        },{ 
            id:1002, 
            name:"Frank", 
            age:30 
        },{ 
            id:1003, 
            name:"Aaron", 
            age:26 
        }];
// 添加
function addData(db,storeName){
            var transaction=db.transaction(storeName,'readwrite'); 
            var store=transaction.objectStore(storeName); 

            for(var i=0;i<students.length;i++){
                store.add(students[i]);
            }
        }
openDB(myDB.name,myDB.version);
        setTimeout(function(){
            addData(myDB.db,'students');
        },1000);

// keyGenerate
function openDB (name,version) {
            var version=version || 1;
            var request=window.indexedDB.open(name,version);
            request.onerror=function(e){
                console.log(e.currentTarget.error.message);
            };
            request.onsuccess=function(e){
                myDB.db=e.target.result;
            };
            request.onupgradeneeded=function(e){
                var db=e.target.result;
                if(!db.objectStoreNames.contains('students')){
                    db.createObjectStore('students',{autoIncrement: true});
                }
                console.log('DB version changed to '+version);
            };
        }

// 查找数据
function getDataByKey(db,storeName,value){
            var transaction=db.transaction(storeName,'readwrite'); 
            var store=transaction.objectStore(storeName); 
            var request=store.get(value); 
            request.onsuccess=function(e){ 
                var student=e.target.result; 
                console.log(student.name); 
            };
}

// 更新数据
function updateDataByKey(db,storeName,value){
            var transaction=db.transaction(storeName,'readwrite'); 
            var store=transaction.objectStore(storeName); 
            var request=store.get(value); 
            request.onsuccess=function(e){ 
                var student=e.target.result; 
                student.age=35;
                store.put(student); 
            };
}

//删除数据及object store 	调用object store的delete方法根据键值删除记录
function deleteDataByKey(db,storeName,value){
            var transaction=db.transaction(storeName,'readwrite'); 
            var store=transaction.objectStore(storeName); 
            store.delete(value); 
        }
// 调用object store的clear方法可以清空object store
function clearObjectStore(db,storeName){
            var transaction=db.transaction(storeName,'readwrite'); 
            var store=transaction.objectStore(storeName); 
            store.clear();
}
// 调用数据库实例的deleteObjectStore方法可以删除一个object store，这个就得在onupgradeneeded里面调用了
if(db.objectStoreNames.contains('students')){ 
                    db.deleteObjectStore('students'); 
}
```



## 总结

正是浏览器存储、缓存技术的出现和发展，为我们的前端应用带来了无限的转机。近年来基于存储、缓存技术的第三方库层出不绝，此外还衍生出了 PWA 这样优秀的 Web 应用模型。

总结下本文几个核心观点：

- Cookie 的本职工作并非本地存储，而是“维持状态”；
- Web Storage 是 HTML5 专门为浏览器存储而提供的数据存储机制，不与服务端发生通信；
- IndexedDB 用于客户端存储大量结构化数据。

参考文章:
[参考链接1](https://www.cnblogs.com/xuanbiyijue/p/8053970.html)
[参考链接2](https://mp.weixin.qq.com/s/st6oOlX4IZkJeeUZziilHg)


