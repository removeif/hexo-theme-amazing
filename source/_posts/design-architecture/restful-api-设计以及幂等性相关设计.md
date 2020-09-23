---
title: restful api 设计以及幂等性相关设计
categories: [架构,设计]
uniqueId: restful-api-设计以及幂等性相关设计.html
toc: true
keywords: java
date: 2019-04-18 17:26:33
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620160420.png
tags: [幂等性,restful-api]
---
> 摘要
针对项目中部分使用restful-api接口，总结文档如下，没有规矩不成方圆。写代码亦是，设计restful-api接口亦是。
<!-- more -->

> RESTful 的核心思想就是，客户端发出的数据操作指令都是"动词 + 宾语"的结构。比如，`GET /articles`这个命令，`GET`是动词，`/articles`是宾语。
>
> 动词通常就是五种 HTTP 方法，对应 CRUD 操作。
>
> > - GET：读取（Read）
> > - POST：新建（Create）
> > - PUT：更新（Update）
> > - PATCH：更新（Update），通常是部分更新
> > - DELETE：删除（Delete）
>
> 根据 HTTP 规范，动词一律大写



话不多说，先上代码，一份完整的restful-api示例

```java

@RestController
@RequestMapping("admin/biz-name/v1/user") //@RequestMapping("api/biz-name/v1/city")
public class AdminUserController {
    @Autowired
    private UserService service;
   

    @GetMapping("{id}/county/list") 
    public List<UserView> getUsersByCategoryId(@PathVariable("id") Integer id) {
        return service.getUsersByCategoryId(id);
    }

    @GetMapping("{id}")
    public UserView userInfoById(@PathVariable("id") Integer id) {
        return service.getUserInfoById(id);
    }

    @PostMapping
    public Object create(@RequestBody UserEntityForm form) {
      	// 相关验证valid  设置默认值
      	service.valid(form);
        if (StringUtil.isEmpty(form.getCsEmail())) {
            form.setCsEmail("980099577@qq.com");
        }
        Integer id = service.ceate(form);
        return Collections.singletonMap("id", id);
    }

    @PutMapping
    public Result update(@RequestBody UserEntityForm form) {
        // 相关验证 valid
        service.valid(form);
        service.update(form);
        return Result.SUCCEED;
    }

    @DeleteMapping("{id}")
    public Result delete(@PathVariable("id") Integer id) {
				// 相关验证 valid
        service.valid(form);
        service.delete(id);
        return Result.SUCCEED;
    }
}

```

## 针对以上restful-api 代码需要注意一下几点：

### @RestController 注解

此注解加在类的上面，返回的结果以json格式，标注此为RestController。不同于Controller注解。Controller非json格式返回。

###  @RequestMapping

此注解标识api请求的路劲，可指定相应的请求方法，例如@RequestMapping("admin/biz-name/v1/user")：http://localhost:8080/admin/biz-name/v1/user

有如下定义参数：

```java
@Target({ElementType.METHOD, ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Mapping
public @interface RequestMapping {

	/**
	 * Assign a name to this mapping.
	 * <p><b>Supported at the type level as well as at the method level!</b>
	 * When used on both levels, a combined name is derived by concatenation
	 * with "#" as separator.
	 * @see org.springframework.web.servlet.mvc.method.annotation.MvcUriComponentsBuilder
	 * @see org.springframework.web.servlet.handler.HandlerMethodMappingNamingStrategy
	 */
	String name() default "";

	/**
	 * The primary mapping expressed by this annotation.
	 * <p>In a Servlet environment this is an alias for {@link #path}.
	 * For example {@code @RequestMapping("/foo")} is equivalent to
	 * {@code @RequestMapping(path="/foo")}.
	 * <p>In a Portlet environment this is the mapped portlet modes
	 * (i.e. "EDIT", "VIEW", "HELP" or any custom modes).
	 * <p><b>Supported at the type level as well as at the method level!</b>
	 * When used at the type level, all method-level mappings inherit
	 * this primary mapping, narrowing it for a specific handler method.
	 */
	@AliasFor("path")
	String[] value() default {};

	/**
	 * In a Servlet environment only: the path mapping URIs (e.g. "/myPath.do").
	 * Ant-style path patterns are also supported (e.g. "/myPath/*.do").
	 * At the method level, relative paths (e.g. "edit.do") are supported within
	 * the primary mapping expressed at the type level. Path mapping URIs may
	 * contain placeholders (e.g. "/${connect}")
	 * <p><b>Supported at the type level as well as at the method level!</b>
	 * When used at the type level, all method-level mappings inherit
	 * this primary mapping, narrowing it for a specific handler method.
	 * @see org.springframework.web.bind.annotation.ValueConstants#DEFAULT_NONE
	 * @since 4.2
	 */
	@AliasFor("value")
	String[] path() default {};

	/**
	 * The HTTP request methods to map to, narrowing the primary mapping:
	 * GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE, TRACE.
	 * <p><b>Supported at the type level as well as at the method level!</b>
	 * When used at the type level, all method-level mappings inherit
	 * this HTTP method restriction (i.e. the type-level restriction
	 * gets checked before the handler method is even resolved).
	 * <p>Supported for Servlet environments as well as Portlet 2.0 environments.
	 */
	RequestMethod[] method() default {};

	/**
	 * The parameters of the mapped request, narrowing the primary mapping.
	 * <p>Same format for any environment: a sequence of "myParam=myValue" style
	 * expressions, with a request only mapped if each such parameter is found
	 * to have the given value. Expressions can be negated by using the "!=" operator,
	 * as in "myParam!=myValue". "myParam" style expressions are also supported,
	 * with such parameters having to be present in the request (allowed to have
	 * any value). Finally, "!myParam" style expressions indicate that the
	 * specified parameter is <i>not</i> supposed to be present in the request.
	 * <p><b>Supported at the type level as well as at the method level!</b>
	 * When used at the type level, all method-level mappings inherit
	 * this parameter restriction (i.e. the type-level restriction
	 * gets checked before the handler method is even resolved).
	 * <p>In a Servlet environment, parameter mappings are considered as restrictions
	 * that are enforced at the type level. The primary path mapping (i.e. the
	 * specified URI value) still has to uniquely identify the target handler, with
	 * parameter mappings simply expressing preconditions for invoking the handler.
	 * <p>In a Portlet environment, parameters are taken into account as mapping
	 * differentiators, i.e. the primary portlet mode mapping plus the parameter
	 * conditions uniquely identify the target handler. Different handlers may be
	 * mapped onto the same portlet mode, as long as their parameter mappings differ.
	 */
	String[] params() default {};

	/**
	 * The headers of the mapped request, narrowing the primary mapping.
	 * <p>Same format for any environment: a sequence of "My-Header=myValue" style
	 * expressions, with a request only mapped if each such header is found
	 * to have the given value. Expressions can be negated by using the "!=" operator,
	 * as in "My-Header!=myValue". "My-Header" style expressions are also supported,
	 * with such headers having to be present in the request (allowed to have
	 * any value). Finally, "!My-Header" style expressions indicate that the
	 * specified header is <i>not</i> supposed to be present in the request.
	 * <p>Also supports media type wildcards (*), for headers such as Accept
	 * and Content-Type. For instance,
	 * <pre class="code">
	 * &#064;RequestMapping(value = "/something", headers = "content-type=text/*")
	 * </pre>
	 * will match requests with a Content-Type of "text/html", "text/plain", etc.
	 * <p><b>Supported at the type level as well as at the method level!</b>
	 * When used at the type level, all method-level mappings inherit
	 * this header restriction (i.e. the type-level restriction
	 * gets checked before the handler method is even resolved).
	 * <p>Maps against HttpServletRequest headers in a Servlet environment,
	 * and against PortletRequest properties in a Portlet 2.0 environment.
	 * @see org.springframework.http.MediaType
	 */
	String[] headers() default {};

	/**
	 * The consumable media types of the mapped request, narrowing the primary mapping.
	 * <p>The format is a single media type or a sequence of media types,
	 * with a request only mapped if the {@code Content-Type} matches one of these media types.
	 * Examples:
	 * <pre class="code">
	 * consumes = "text/plain"
	 * consumes = {"text/plain", "application/*"}
	 * </pre>
	 * Expressions can be negated by using the "!" operator, as in "!text/plain", which matches
	 * all requests with a {@code Content-Type} other than "text/plain".
	 * <p><b>Supported at the type level as well as at the method level!</b>
	 * When used at the type level, all method-level mappings override
	 * this consumes restriction.
	 * @see org.springframework.http.MediaType
	 * @see javax.servlet.http.HttpServletRequest#getContentType()
	 */
	String[] consumes() default {};

	/**
	 * The producible media types of the mapped request, narrowing the primary mapping.
	 * <p>The format is a single media type or a sequence of media types,
	 * with a request only mapped if the {@code Accept} matches one of these media types.
	 * Examples:
	 * <pre class="code">
	 * produces = "text/plain"
	 * produces = {"text/plain", "application/*"}
	 * produces = "application/json; charset=UTF-8"
	 * </pre>
	 * <p>It affects the actual content type written, for example to produce a JSON response
	 * with UTF-8 encoding, {@code "application/json; charset=UTF-8"} should be used.
	 * <p>Expressions can be negated by using the "!" operator, as in "!text/plain", which matches
	 * all requests with a {@code Accept} other than "text/plain".
	 * <p><b>Supported at the type level as well as at the method level!</b>
	 * When used at the type level, all method-level mappings override
	 * this produces restriction.
	 * @see org.springframework.http.MediaType
	 */
	String[] produces() default {};

}
```



###  @GetMapping

此注解，接收前端为get请求的相关方法,接口返回天生具有**幂等性**，每次请求参数一致返回的结果也一致

此注解请求一般为获取相关信息的方法

有如下参数，

```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@RequestMapping(method = RequestMethod.GET)
public @interface GetMapping {

	/**
	 * Alias for {@link RequestMapping#name}.
	 */
	@AliasFor(annotation = RequestMapping.class)
	String name() default "";

	/**
	 * Alias for {@link RequestMapping#value}.
	 */
	@AliasFor(annotation = RequestMapping.class)
	String[] value() default {};

	/**
	 * Alias for {@link RequestMapping#path}.
	 */
	@AliasFor(annotation = RequestMapping.class)
	String[] path() default {};

	/**
	 * Alias for {@link RequestMapping#params}.
	 */
	@AliasFor(annotation = RequestMapping.class)
	String[] params() default {};

	/**
	 * Alias for {@link RequestMapping#headers}.
	 */
	@AliasFor(annotation = RequestMapping.class)
	String[] headers() default {};

	/**
	 * Alias for {@link RequestMapping#produces}.
	 */
	@AliasFor(annotation = RequestMapping.class)
	String[] produces() default {};

}
```

### @PostMapping

此注解，接收前端为post请求的相关方法

一般为保存，创建信息的方法，save…,create...

### @putMapping

此注解，接收前端为put请求的相关方法

一般为更新数据的接口方法，update...

### @deleteMapping

此注解，接收前端为delete请求的相关方法

一般为删除数据的方法

### @RequestBody

此注解放入接口方法的参数前面，对应请求中的body里的内容，要求body内容为json格式

例如： 

```java
public Object create(@RequestBody UserEntityForm form) {};
```

### @PathVariable

此注解放入接口方法的参数前面，要求里面的值出现在Mapping中，以{}包裹，如下

接受参数required，设置判断此字段是否必须

```java
@GetMapping("{id}")
public UserView userInfoById(@PathVariable("id",required = true) Integer id) {}
```

###  @RequestParam

此注解放入接口方法的参数前面，前端放入请求参数中，非body里面

接受参数required，设置判断此字段是否必须

defaultValue 设置此字段的默认值

```java
public UserView userInfoById(@RequestParam(value = "id", required = false, defaultValue = "1") Integer id）{}
```



**所有的接口方法都应该设计为幂等性，即接口请求多次或一次都应该达到同样的效果。此特性在高并发下面非常适用。**

## 高并发的核心技术 - 幂等的实现方案

### 一、背景

我们实际系统中有很多操作，是不管做多少次，都应该产生一样的效果或返回一样的结果。  例如： 

1. 前端重复提交选中的数据，应该后台只产生对应这个数据的一个反应结果。  2. 我们发起一笔付款请求，应该只扣用户账户一次钱，当遇到网络重发或系统bug重发，也应该只扣一次钱；  3. 发送消息，也应该只发一次，同样的短信发给用户，用户会哭的；  4. 创建业务订单，一次业务请求只能创建一个，创建多个就会出大问题。 

等等很多重要的情况，这些逻辑都需要幂等的特性来支持。 

### 二、幂等性概念 

幂等（idempotent、idempotence）是一个数学与计算机学概念，常见于抽象代数中。 

在编程中.一个幂等操作的特点是其任意多次执行所产生的影响均与一次执行的影响相同。幂等函数，或幂等方法，是指可以使用相同参数重复执行，并能获得相同结果的函数。这些函数不会影响系统状态，也不用担心重复执行会对系统造成改变。例如，“getUsername()和setTrue()”函数就是一个幂等函数. 

更复杂的操作幂等保证是利用唯一交易号(流水号)实现. 

我的理解：幂等就是一个操作，不论执行多少次，产生的效果和返回的结果都是一样的 

### 三、技术方案 

1. 查询操作  查询一次和查询多次，在数据不变的情况下，查询结果是一样的。select是天然的幂等操作 

2. 删除操作  删除操作也是幂等的，删除一次和多次删除都是把数据删除。(注意可能返回结果不一样，删除的数据不存在，返回0，删除的数据多条，返回结果多个) 

3.唯一索引，防止新增脏数据  比如：支付宝的资金账户，支付宝也有用户账户，每个用户只能有一个资金账户，怎么防止给用户创建资金账户多个，那么给资金账户表中的用户ID加唯一索引，所以一个用户新增成功一个资金账户记录 

要点：  唯一索引或唯一组合索引来防止新增数据存在脏数据  （当表存在唯一索引，并发时新增报错时，再查询一次就可以了，数据应该已经存在了，返回结果即可） 

4. token机制，防止页面重复提交  业务要求：  页面的数据只能被点击提交一次  发生原因：  由于重复点击或者网络重发，或者nginx重发等情况会导致数据被重复提交  解决办法：  集群环境：采用token加redis（redis单线程的，处理需要排队）  单JVM环境：采用token加redis或token加jvm内存  处理流程：  1. 数据提交前要向服务的申请token，token放到redis或jvm内存，token有效时间  2. 提交后后台校验token，同时删除token，生成新的token返回  token特点：  要申请，一次有效性，可以限流 

注意：redis要用删除操作来判断token，删除成功代表token校验通过，如果用select+delete来校验token，存在并发问题，不建议使用 

5. 悲观锁  获取数据的时候加锁获取  select * from table_xxx where id='xxx' for update;  注意：id字段一定是主键或者唯一索引，不然是锁表，会死人的  悲观锁使用时一般伴随事务一起使用，数据锁定时间可能会很长，根据实际情况选用 

6. 乐观锁  乐观锁只是在更新数据那一刻锁表，其他时间不锁表，所以相对于悲观锁，效率更高。 

乐观锁的实现方式多种多样可以通过version或者其他状态条件：  1. 通过版本号实现  update table_xxx set name=#name#,version=version+1 where version=#version#  如下图(来自网上)： 

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620160456.png)

2. 通过条件限制  update tablexxx set avaiamount=avaiamount-#subAmount# where avaiamount-#subAmount# >= 0  要求：quality-#subQuality# >= ，这个情景适合不用版本号，只更新是做数据安全校验，适合库存模型，扣份额和回滚份额，性能更高 

注意：乐观锁的更新操作，最好用主键或者唯一索引来更新,这样是行锁，否则更新时会锁表，上面两个sql改成下面的两个更好  update tablexxx set name=#name#,version=version+1 where id=#id# and version=#version#  update tablexxx set avaiamount=avaiamount-#subAmount# where id=#id# and avai_amount-#subAmount# >= 0 

7. 分布式锁  还是拿插入数据的例子，如果是分布是系统，构建全局唯一索引比较困难，例如唯一性的字段没法确定，这时候可以引入分布式锁，通过第三方的系统(redis或zookeeper)，在业务系统插入数据或者更新数据，获取分布式锁，然后做操作，之后释放锁，这样其实是把多线程并发的锁的思路，引入多多个系统，也就是分布式系统中得解决思路。 

要点：某个长流程处理过程要求不能并发执行，可以在流程执行之前根据某个标志(用户ID+后缀等)获取分布式锁，其他流程执行时获取锁就会失败，也就是同一时间该流程只能有一个能执行成功，执行完成后，释放分布式锁(分布式锁要第三方系统提供) 

8. select + insert  并发不高的后台系统，或者一些任务JOB，为了支持幂等，支持重复执行，简单的处理方法是，先查询下一些关键数据，判断是否已经执行过，在进行业务处理，就可以了  注意：核心高并发流程不要用这种方法 

9. 状态机幂等  在设计单据相关的业务，或者是任务相关的业务，肯定会涉及到状态机(状态变更图)，就是业务单据上面有个状态，状态在不同的情况下会发生变更，一般情况下存在有限状态机，这时候，如果状态机已经处于下一个状态，这时候来了一个上一个状态的变更，理论上是不能够变更的，这样的话，保证了有限状态机的幂等。 

注意：订单等单据类业务，存在很长的状态流转，一定要深刻理解状态机，对业务系统设计能力提高有很大帮助 

10. 对外提供接口的api如何保证幂等  如银联提供的付款接口：需要接入商户提交付款请求时附带：source来源，seq序列号  source+seq在数据库里面做唯一索引，防止多次付款，(并发时，只能处理一个请求) 

**重点**对外提供接口为了支持幂等调用，接口有两个字段必须传，一个是来源source，一个是来源方序列号seq，这个两个字段在提供方系统里面做联合唯一索引，这样当第三方调用时，先在本方系统里面查询一下，是否已经处理过，返回相应处理结果；没有处理过，进行相应处理，返回结果。注意，为了幂等友好，一定要先查询一下，是否处理过该笔业务，不查询直接插入业务系统，会报错，但实际已经处理了。 

### 总结

幂等性应该是合格程序员的一个基因，在设计系统时，是首要考虑的问题，尤其是在像支付宝，银行，互联网金融公司等涉及的都是钱的系统，既要高效，数据也要准确，所以不能出现多扣款，多打款等问题，这样会很难处理，用户体验也不好

[参考自](https://mp.weixin.qq.com/s/xy4Jg3LrK0dpYy5q4rAAaw)