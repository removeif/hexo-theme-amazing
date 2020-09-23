---
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620152744.png
title: Immutable Object(不可变对象)模式
uniqueId: Immutable-Object-不可变对象-模式.html
toc: true
date: 2018-11-13 23:18:47
tags: [java]
categories: [java,java基础]
---
> 多线程下，一个对象会被多个线程共享，存在多线程并发地修改对象的属性，需要做些同步访问控制，
如显示锁，CAS操作，会带来额外的开销和问题，如上下文切换、等待时间、ABA问题。Immutable Object
模式意图通过使用对外可见的状态不可变的对象，使得天生具有线程安全性。
<!-- more -->
# 车辆管理系统
## 状态可变的位置信息模型
```java
public class Location {
    private double x;
    private double y;

    public Location(double x, double y) {
        this.x = x;
        this.y = y;
    }

    public double getX() {
        return x;
    }
    public double getY() {
        return y;
    }

    public void setXY(double x, double y) {
        this.x = x;
        this.y = y;
    }
}
```
管理系统中会调用Location的setXY方法来更新位置，因为是非线程安全，并非原子操作，导致调用时
会出现数据不一致的情况
## 改进：状态不可变的位置信息模型
```java
public final class Location{
    public final double x;
    public final double y;
    
    public Location(double x,double y){
        this.x = x;
        this.y = y;
    }
}
```
使用状态不可变的对象时，更新信息模型时，如果车辆的位置发生变动，更新的是整个位置信息的对象
## 更新不可变对象的位置信息
```java
   public class VehicleTracker{
        private Map<String,Location> locMap = new ConcurrentHashMap<String, Location>();
        public void updateLocation(String vehicleId,Location newLocation){
            locMap.put(vehicleId,newLocation);
        }
    }
```
**一个严格意义上的不可变对象应该满足以下所有条件**

1. 类本身用**final**修饰
2. 所有字段都是用**final**修饰，这个语意在多线程环境下由**JVM**保证了被修饰字段所引用对象的初始化安全，即**final**修饰的字段在其他线程是可见的，必定是初始化完成的。
3. 在对象的创建过程中，**this**关键字没有泄露给其他类，防止其他类在对象创建过程中修改其状态
4. 任何字段如果引用其他状态可变的对象，如集合数组，这些字段必须是**private**修饰的，不能暴露给外部，所有相关方法要返回这些字段值，应该防止防御性复制

## 实例：

> **某彩信网关系统** 在处理由增值业务提供商**VASP**下发给手机终端用户的彩信信息时，需要根据彩信接收方号码的前缀选择对应的彩信中心**MMSC**，然后转发消息给选中的彩信中心。由其他系统将彩信信息下发给手机终端用户。选择彩信中心的过程称为 **路由** ，手机前缀和彩信中心对应的关系叫路由表，在系统中多线程共享，很少改变此数据，不希望访问这些数据时进行加锁并发访问控制，避免产生不必要的开销，所以选择**immutable object**模型。

### 彩信中心路由规则管理器

```java
/**
*彩信中心路由规则管理器
**/
public final class MMSCRouter{
    // 保证多线程环境下该变量的可见性
    private static volatile MMSCRouter instance = new MMSCRouter();
    // 维护手机号码前缀到彩信中心之间的映射关系
    private final Map<String,MMSCInfo> routerMap;
    
    public MMSCRouter(){
        // 将数据库表中的数据加载到内存，存为Map
        this.routerMap = MMSCRouter.retrieveRouterMapFromDB();
    }
    
    private static Map<String,MMSCInfo> retrieveRouterMapFromDB(){
        Map<String,MMSCInfo> map = new HashMap<>();
        // 省略其余代码
        return map;
    }
    
    public static MMSCRouter getInstance(){
        return instance;
    }
    /**
    *根据手机号前缀获取彩信中心信息
    **/
    public MMSCInfo getMMSC(String msisdPrefix){
        return routerMap.get(msisdPrefix);
    }
    
    /**
    *更新为指定的新实例
    **/
    public static void setInstance(MMSCRouter newInstance){
        instance = newInstance;
    }
    
    /**
    *防御性复制
    **/
    private static Map<String,MMSCInfo> deepCopy(Map<String,MMSCInfo> m){
        Map<String,MMSCInfo> result = new HashMap<String,MMSCInfo>();
        for(String key : m.keySet()){
            result.put(key, new MMSCInfo(m.get(key)));
        }
        return result;
    }
    
    // 防止外部代码修改可变数据routerMap的值
    public Map<String,MMSCInfo> getRouterMap(){
        return Collections.unmodifiableMap(deepCopy(routerMap));
    }
}
```

### 彩信中心信息

```java
public final class MMSCInfo{
    private final String deviceId;
    private final String url;
    private final int maxAttachmentSizeInBytes;
    
    public MMSCInfo(String deviceId, String url, int maxAttachmentSizeInBytes){
        this.deviceId = deviceId;
        this.url = url;
        this.maxAttachmentSizeInBytes = maxAttachmentSizeInBytes;
    }
    
    public MMSCInfo(MMSCInfo protoType){
        this.deviceId = protoType.deviceId;
        this.url = protoType.url;
        this.maxAttachmentSizeInBytes = protoType.maxAttachmentSizeInBytes;
    }
    
    public String getDeviceId(){
        return deviceId;
    }
    
    public String getUrl(){
        return url;
    }
    
    public int getMaxAttachmentSizeInBytes(){
        return maxAttachmentSizeInBytes;
    }
    
}
```

彩信中心信息变更的频率也同样不高。因此，当彩信网关系统通过网络被通知到这种彩信中心信息本身或者路由变更时，网关系统会重新生成新的**MMSInfo**和**MMSRouter**来反应变更。

### 彩信中心、路由表的变更

```java
public class OMCAgent extends Thread{
    @Override
    public void run(){
        boolean isTableModificationMsg = false;
        String updatedTableName = null;
        while(true){
            // 省略代码 从与OMC 连接中读取信息进行解析
            // 解析到数据表更新信息后，重置MMSCRouter实例
            if(isTableModificationMsg){
                if("MMSCInfo".equals(updatedTableName)){
                    // new MMSCRouter() 从数据库中加载变更的信息存入
                    MMSCRouter.setInstance(new MMSCRouter()); 
                }
            }
            // 省略其他代码
        }
    }
} 
```

本列中MMSCInfo 是一个严格意义上的不可变对象，虽然MMSCRouter对象对外提供了setInstance方法用于改变静态字段instance的值，但它仍然可被视作一个等效的不可变对象。因为setInstance仅仅改变**instance**变量指向的对象，而instance变量采用volatile修饰保证了其余线程的可见性，所以无需加锁其他线程也能获取到最新的**instance**

### 总结

**Immutable Object 模型使用场景**

- 被建模对象的状态变化不频繁
- 同时对一组相关的数据进行写操作，因此需要保证原子性
- 使用某个对象作为安全的HashMap的可以**key**。由于final不可变对象不变所有**hashcode**不变，所以适合作为HashMap 的**key**。


### 参考文献
**java多线程编程实战指南（设计模式篇）黄文海/著**

