---
title: Spring cloud feign重试问题排查
uniqueId: Spring-cloud-feign重试问题排查.html
toc: true
keywords: categories-java
date: 2019-09-27 18:28:26
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20190927180510.png
tags: [feign,spring cloud]
categories: [java,框架]
---
### Feign设置超时时间

使用`Feign调用`接口分两层，`ribbon的调用`和`hystrix的调用`，所以ribbon的超时时间和Hystrix的超时时间的结合就是Feign的超时时间。

Spring Cloud应用在启动时，Feign会扫描标有@FeignClient注解的接口，生成代理，并注册到Spring容器中。生成代理时Feign会为每个接口方法创建一个RequetTemplate对象，该对象封装了HTTP请求需要的全部信息，请求参数名、请求方法等信息都是在这个过程中确定的，Feign的模板化就体现在这里。
<!-- more -->

配置超时时间：

```yaml
#hystrix的超时时间
hystrix:
    command:
        default:
            execution:
              timeout:
                enabled: true
              isolation:
                    thread:
                        timeoutInMilliseconds: 9000
#ribbon的超时时间
ribbon:
  ReadTimeout: 3000
  ConnectTimeout: 3000
```

要开启Feign的重试机制如下：（Feign默认重试五次 源码中有）

```java
@Bean
Retryer feignRetryer() {
        return  new Retryer.Default();
}
```

### ribbon的重试机制

设置重试次数：

```yaml
ribbon:
  ReadTimeout: 3000
  ConnectTimeout: 3000
  MaxAutoRetries: 1 #同一台实例最大重试次数,不包括首次调用
  MaxAutoRetriesNextServer: 1 #重试负载均衡其他的实例最大重试次数,不包括首次调用
  OkToRetryOnAllOperations: false  #是否所有操作都重试 
```

#### 说明：

- 根据上面的参数计算重试的次数：`MaxAutoRetries+MaxAutoRetriesNextServer+(MaxAutoRetries *MaxAutoRetriesNextServer)` 即重试3次 则一共产生4次调用。
  如果在重试期间，时间超过了hystrix的超时时间，便会立即执行熔断，调用fallback。所以要根据上面配置的参数计算hystrix的超时时间，使得在重试期间不能达到hystrix的超时时间，不然重试机制就会没有意义。
  hystrix超时时间的计算： `(1 + MaxAutoRetries + MaxAutoRetriesNextServer) * ReadTimeout` 即按照以上的配置 hystrix的超时时间应该配置为 （1+1+1）*3=9秒。

- 当ribbon超时后且hystrix没有超时，便会采取重试机制。当`OkToRetryOnAllOperations`设置为false时，只会对get请求进行重试。如果设置为true，便会对所有的请求进行重试，如果是put或post等写操作，如果服务器接口没做幂等性，会产生不好的结果，所以OkToRetryOnAllOperations慎用。
```java
    public RequestSpecificRetryHandler getRequestSpecificRetryHandler(FeignLoadBalancer.RibbonRequest request, IClientConfig requestConfig) {
        if ((Boolean)this.clientConfig.get(CommonClientConfigKey.OkToRetryOnAllOperations, false)) {
            return new RequestSpecificRetryHandler(true, true, this.getRetryHandler(), requestConfig);
        } else {
            return !request.toRequest().method().equals("GET") ? new RequestSpecificRetryHandler(true, false, this.getRetryHandler(), requestConfig) : new RequestSpecificRetryHandler(true, true, this.getRetryHandler(), requestConfig);
        }
    }
```
- 如果不配置ribbon的重试次数，默认会重试一次。
  默认情况下,GET方式请求无论是连接异常还是读取异常,都会进行重试
  非GET方式请求,只有连接异常时,才会进行重试

### 总结：

- 在使用重试机制的时候，对于接口尽量保证做到`幂等性`，对于多次的请求达同样的效果。
- 对于接口耗时比较久的，做好重复提交的验证，如redis锁住第一次提交，没处理完时，让后面的提交失败。避免重复提交。
- 计算好Hystrix的超时时间，以及Feign的超时以及重试时间，避免产生fallback。
- 当线上出现比较奇怪的问题时，排查半天都找不问题时，去查下框架的相关设置，如超时、重试的等机制。

参考文章:
[参考链接1](https://blog.csdn.net/east123321/article/details/82385816)


