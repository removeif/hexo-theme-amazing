---
title: Java-策略模式
toc: true
recommend: 1
keywords: categories-java-mysql-"Java-策略模式"
uniqueId: '2020-07-02 09:42:48/"Java-策略模式".html'
date: 2020-07-02 17:42:48
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200702174616.png
tags: [java,设计模式,strategy]
categories: [java,设计模式]
---
策略模式遵循开闭原则，实现代码的解耦合。扩展新的方法时也比较方便，只需要继承策略接口就好了上面列出的这两点算是策略模式的优点了，但是不是说他就是完美的，有很多缺点仍然需要我们去掌握和理解。
策略模式把对象本身和运算规则区分开来，因此我们整个模式也分为三个部分。
+ 环境类(Context):用来操作策略的上下文环境，也就是我们游客。
+ 抽象策略类(Strategy):策略的抽象，出行方式的抽象
+ 具体策略类(ConcreteStrategy):具体的策略实现，每一种出行方式的具体实现。
<!-- more -->

### 一、策略模式定义

举个列子

我们出去旅游的时候可能有很多种出行方式，比如说我们可以坐火车、坐高铁、坐飞机等等。不管我们使用哪一种出行方式，最终的目的地都是一样的。也就是选择不同的方式产生的结果都是一样的。

**定义一系列的算法,把每一个算法封装起来, 并且使它们可相互替换**

### 二、实现策略模式

策略模式把对象本身和运算规则区分开来，因此我们整个模式也分为三个部分。

+ 环境类(Context):用来操作策略的上下文环境，也就是我们游客。
+ 抽象策略类(Strategy):策略的抽象，出行方式的抽象
+ 具体策略类(ConcreteStrategy):具体的策略实现，每一种出行方式的具体实现。

#### 第一步：定义抽象策略接口

```java
interface TravelStrategy{
  void travelStyle();
}
```

#### 第二步：具体策略类

```java
public class TrainStrategy implements TravelStrategy{
  @Override
  public void travelStyle(){
    System.out.println("火车");
  }
}

public class HighTrainStrategy implements TravelStrategy{
  @Override
  public void travelStyle(){
    System.out.println("高铁");
  }
}

public class AirplaneStrategy implements TravelStrategy{
  @Override
  public void travelStyle(){
    System.out.println("飞机");
  }
}
```

#### 第三步：环境类实现

```java
public class Traveler{
  private  TravelStrategy travelStrategy;
  public void setTravelStrategy(TravelStrategy travelStrategy){
    this.travelStrategy = travelStrategy;
  }
  public void travelStyle(){
    travelStrategy.travelStyle();
  }
  
  public static void main(String[] args){
    
    Traveler traveler = new Traveler();
    traveler.setTravelStrategy(new AirplaneStrategy())
    // 飞机出行
    traveler.travelStyle()
  }
}
```

### 三、分析策略模式

#### 策略模式的优点：

+ 我们之前在选择出行方式的时候，往往会使用if-else语句，也就是用户不选择A那么就选择B这样的一种情况。这种情况耦合性太高了，而且代码臃肿，有了策略模式我们就可以避免这种现象。
+ 策略模式遵循开闭原则，实现代码的解耦合。扩展新的方法时也比较方便，只需要继承策略接口就好了上面列出的这两点算是策略模式的优点了，但是不是说他就是完美的，有很多缺点仍然需要我们去掌握和理解。

#### 策略模式的优点：

+ 客户端必须知道所有的策略类，并自行决定使用哪一个策略类。

+ 策略模式会出现很多的策略类。

+ context在使用这些策略类的时候，这些策略类由于继承了策略接口，所以有些数据可能用不到，但是依然初始化了。

参考文章:  
[参考链接](https://baijiahao.baidu.com/s?id=1638224488060180625&wfr=spider&for=pc)


