---
title: redis分布式锁Redlock的实现

toc: true
keywords: categories-redis
date: 2019-08-22 18:41:23
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20190817211453.png
tags: redis
categories: [数据库,redis]
---

## 普通实现

>说道Redis分布式锁大部分人都会想到：`setnx+lua`，或者知道`set key value px milliseconds nx`。后一种方式的核心实现命令如下：

<!-- more -->

```ruby
- 获取锁（unique_value可以是UUID等）
SET resource_name unique_value NX PX 30000

- 释放锁（lua脚本中，一定要比较value，防止误解锁）
if redis.call("get",KEYS[1]) == ARGV[1] then
    return redis.call("del",KEYS[1])
else
    return 0
end
```

这种实现方式有3大要点（也是面试概率非常高的地方）：

1. set命令要用`set key value px milliseconds nx`；
2. value要具有唯一性；
3. 释放锁时要验证value值，不能误解锁；

事实上这类琐最大的缺点就是它加锁时只作用在一个Redis节点上，即使Redis通过sentinel保证高可用，如果这个master节点由于某些原因发生了主从切换，那么就会出现锁丢失的情况：

1. 在Redis的master节点上拿到了锁；
2. 但是这个加锁的key还没有同步到slave节点；
3. master故障，发生故障转移，slave节点升级为master节点；
4. 导致锁丢失。

正因为如此，Redis作者antirez基于分布式环境下提出了一种更高级的分布式锁的实现方式：**Redlock**。笔者认为，Redlock也是Redis所有分布式锁实现方式中唯一能让面试官高潮的方式。

## Redlock实现

antirez提出的redlock算法大概是这样的：

在Redis的分布式环境中，我们假设有N个Redis master。这些节点**完全互相独立，不存在主从复制或者其他集群协调机制**。我们确保将在N个实例上使用与在Redis单实例下相同方法获取和释放锁。现在我们假设有5个Redis master节点，同时我们需要在5台服务器上面运行这些Redis实例，这样保证他们不会同时都宕掉。

为了取到锁，客户端应该执行以下操作:

- 获取当前Unix时间，以毫秒为单位。
- 依次尝试从5个实例，使用相同的key和**具有唯一性的value**（例如UUID）获取锁。当向Redis请求获取锁时，客户端应该设置一个网络连接和响应超时时间，这个超时时间应该小于锁的失效时间。例如你的锁自动失效时间为10秒，则超时时间应该在5-50毫秒之间。这样可以避免服务器端Redis已经挂掉的情况下，客户端还在死死地等待响应结果。如果服务器端没有在规定时间内响应，客户端应该尽快尝试去另外一个Redis实例请求获取锁。
- 客户端使用当前时间减去开始获取锁时间（步骤1记录的时间）就得到获取锁使用的时间。**当且仅当从大多数**（N/2+1，这里是3个节点）**的Redis节点都取到锁，并且使用的时间小于锁失效时间时，锁才算获取成功**。
- 如果取到了锁，key的真正有效时间等于有效时间减去获取锁所使用的时间（步骤3计算的结果）。
- 如果因为某些原因，获取锁失败（没有在至少N/2+1个Redis实例取到锁或者取锁时间已经超过了有效时间），客户端应该在**所有的Redis实例上进行解锁**（即便某些Redis实例根本就没有加锁成功，防止某些节点获取到锁但是客户端没有得到响应而导致接下来的一段时间不能被重新获取锁）。

## Redlock源码

redisson已经有对redlock算法封装，接下来对其用法进行简单介绍，并对核心源码进行分析（假设5个redis实例）。

- POM依赖

```xml
<!-- https://mvnrepository.com/artifact/org.redisson/redisson -->
<dependency>
    <groupId>org.redisson</groupId>
    <artifactId>redisson</artifactId>
    <version>3.3.2</version>
</dependency>
```

#### 用法

首先，我们来看一下redission封装的redlock算法实现的分布式锁用法，非常简单，跟重入锁（ReentrantLock）有点类似：

```java
Config config = new Config();
config.useSentinelServers().addSentinelAddress("127.0.0.1:6369","127.0.0.1:6379", "127.0.0.1:6389")
        .setMasterName("masterName")
        .setPassword("password").setDatabase(0);
RedissonClient redissonClient = Redisson.create(config);
// 还可以getFairLock(), getReadWriteLock()
RLock redLock = redissonClient.getLock("REDLOCK_KEY");
boolean isLock;
try {
    isLock = redLock.tryLock();
    // 500ms拿不到锁, 就认为获取锁失败。10000ms即10s是锁失效时间。
    isLock = redLock.tryLock(500, 10000, TimeUnit.MILLISECONDS);
    if (isLock) {
        //TODO if get lock success, do something;
    }
} catch (Exception e) {
} finally {
    // 无论如何, 最后都要解锁
    redLock.unlock();
}
```

#### 唯一ID

实现分布式锁的一个非常重要的点就是set的value要具有唯一性，redisson的value是怎样保证value的唯一性呢？答案是**UUID+threadId**。**入口**在redissonClient.getLock("REDLOCK_KEY")，源码在Redisson.java和RedissonLock.java中：

```java
protected final UUID id = UUID.randomUUID();
String getLockName(long threadId) {
    return id + ":" + threadId;
}
```

#### 获取锁

获取锁的代码为redLock.tryLock()或者redLock.tryLock(500, 10000, TimeUnit.MILLISECONDS)，两者的最终核心源码都是下面这段代码，只不过前者获取锁的默认租约时间（leaseTime）是LOCK_EXPIRATION_INTERVAL_SECONDS，即30s：

```java
<T> RFuture<T> tryLockInnerAsync(long leaseTime, TimeUnit unit, long threadId, RedisStrictCommand<T> command) {
    internalLockLeaseTime = unit.toMillis(leaseTime);
    // 获取锁时向5个redis实例发送的命令
    return commandExecutor.evalWriteAsync(getName(), LongCodec.INSTANCE, command,
              // 首先分布式锁的KEY不能存在，如果确实不存在，那么执行hset命令（hset REDLOCK_KEY uuid+threadId 1），并通过pexpire设置失效时间（也是锁的租约时间）
              "if (redis.call('exists', KEYS[1]) == 0) then " +
                  "redis.call('hset', KEYS[1], ARGV[2], 1); " +
                  "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                  "return nil; " +
              "end; " +
              // 如果分布式锁的KEY已经存在，并且value也匹配，表示是当前线程持有的锁，那么重入次数加1，并且设置失效时间
              "if (redis.call('hexists', KEYS[1], ARGV[2]) == 1) then " +
                  "redis.call('hincrby', KEYS[1], ARGV[2], 1); " +
                  "redis.call('pexpire', KEYS[1], ARGV[1]); " +
                  "return nil; " +
              "end; " +
              // 获取分布式锁的KEY的失效时间毫秒数
              "return redis.call('pttl', KEYS[1]);",
              // 这三个参数分别对应KEYS[1]，ARGV[1]和ARGV[2]
                Collections.<Object>singletonList(getName()), internalLockLeaseTime, getLockName(threadId));
}
```

获取锁的命令中，

- **KEYS[1]**就是Collections.singletonList(getName())，表示分布式锁的key，即REDLOCK_KEY；
- **ARGV[1]**就是internalLockLeaseTime，即锁的租约时间，默认30s；
- **ARGV[2]**就是getLockName(threadId)，是获取锁时set的唯一值，即UUID+threadId：

------

#### 释放锁

释放锁的代码为redLock.unlock()，核心源码如下：

```java
protected RFuture<Boolean> unlockInnerAsync(long threadId) {
    // 向5个redis实例都执行如下命令
    return commandExecutor.evalWriteAsync(getName(), LongCodec.INSTANCE, RedisCommands.EVAL_BOOLEAN,
            // 如果分布式锁KEY不存在，那么向channel发布一条消息
            "if (redis.call('exists', KEYS[1]) == 0) then " +
                "redis.call('publish', KEYS[2], ARGV[1]); " +
                "return 1; " +
            "end;" +
            // 如果分布式锁存在，但是value不匹配，表示锁已经被占用，那么直接返回
            "if (redis.call('hexists', KEYS[1], ARGV[3]) == 0) then " +
                "return nil;" +
            "end; " +
            // 如果就是当前线程占有分布式锁，那么将重入次数减1
            "local counter = redis.call('hincrby', KEYS[1], ARGV[3], -1); " +
            // 重入次数减1后的值如果大于0，表示分布式锁有重入过，那么只设置失效时间，还不能删除
            "if (counter > 0) then " +
                "redis.call('pexpire', KEYS[1], ARGV[2]); " +
                "return 0; " +
            "else " +
                // 重入次数减1后的值如果为0，表示分布式锁只获取过1次，那么删除这个KEY，并发布解锁消息
                "redis.call('del', KEYS[1]); " +
                "redis.call('publish', KEYS[2], ARGV[1]); " +
                "return 1; "+
            "end; " +
            "return nil;",
            // 这5个参数分别对应KEYS[1]，KEYS[2]，ARGV[1]，ARGV[2]和ARGV[3]
            Arrays.<Object>asList(getName(), getChannelName()), LockPubSub.unlockMessage, internalLockLeaseTime, getLockName(threadId));

}
```

[文章来源](https://mp.weixin.qq.com/s?__biz=MzU0MzQ5MDA0Mw==&mid=2247485917&idx=1&sn=289fd9fcd1c8141111b8bc337e8c5353&chksm=fb0be349cc7c6a5f1c525c97f2d8a90d712475e58bcf79b3b1f8d83f4cd8a0fa617acf1de955&token=1885824046&lang=zh_CN&scene=21#wechat_redirect)

.