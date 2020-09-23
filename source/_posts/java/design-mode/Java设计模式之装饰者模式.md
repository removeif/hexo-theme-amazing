---
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620152744.png
title: Java设计模式之装饰者模式
categories: [java,设计模式]

toc: true
keywords: java
date: 2018-11-29 21:33:46
tags: [设计模式,java]
---
# 问题引入

咖啡店的类设计：

1. 一个饮料基类，各种饮料类继承这个基类，并且计算各自的价钱。
2. 饮料中需要加入各种调料，考虑在基类中加入一些布尔值变量代表是否加入各种调料，基类的cost()中的计算各种调料的价钱，子类覆盖cost()，并且在其中调用超类的cost()，加上特定饮料的价钱，计算出子类特定饮料的价钱。

缺点：类数量爆炸、基类加入的新功能并不适用于所有的子类、调料价钱的改变、新调料的出现都会要求改变现有代码；有的子类并不适合某些调料等情况……
<!-- more -->
# 设计原则

　　**类应该对扩展开放，对修改关闭。**

> 我们的目标是允许类容易扩展，在不修改现有代码的情况下，就可搭配新的行为。
>
> 如能实现这样的目标，有什么好处呢？这样的设计具有弹性可以应对改变，可以接受新的功能来应对改变的需求。
>
> 要让OO设计同时具备开放性和关闭性，不是一件容易的事，通常来说，没有必要把设计的每个部分都这么设计。
>
> 遵循开放-关闭原则，通常会引入新的抽象层次，增加代码的复杂度。
>
> 我们需要把注意力集中在设计中最有可能改变的地方，然后应用开放-关闭原则。

# 用装饰者模式解决问题

解决咖啡店饮料问题的方法：

　　以饮料为主体，然后在运行时以调料来“装饰”饮料。

　　比如，顾客想要摩卡（Mocha）和奶泡（Whip）深焙咖啡（DarkRoast）：

　　DarkRoast继承自Beverage，有一个cost()方法。

　　第一步，以DarkRoast对象开始；

　　第二步，顾客想要摩卡，所以建立一个Mocha装饰者对象，并用它将DarkRoast对象包装（wrap）起来；

　　第三步，顾客想要奶泡，所以建立一个Whip装饰者对象，并用它将Mocha对象包起来；（Mocha和Whip也继承自Beverage，有一个cost()方法）；

　　最后，为顾客算钱，通过调用最外圈装饰者（Whip）的cost()就可以。Whip()的cost()会先委托它装饰的对象（Mocha）计算出价钱，然后在加上奶泡的价钱。Mocha的cost()也是类似。

# 装饰者模式的特点

　　装饰者和被装饰对象**有相同的超类型**。

　　可以用一个或多个装饰者包装一个对象。

　　因为装饰者和被装饰者具有相同的类型，所以任何需要原始对象的场合，可以用装饰过的对象代替。

　　**装饰者可以在所委托被装饰者的行为之前与/或之后，加上自己的行为，以达到特定的目的。**

　　对象可以在任何时候被装饰，所以可以在运行时动态地、不限量地用你喜欢的装饰者来装饰对象。

# 装饰者模式的定义

**装饰者模式动态地将责任附加到对象上。若要扩展功能，装饰者提供了比继承更有弹性的替代方案。**

# 装饰者模式的实现

## 实现类图

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620162408.png)

装饰者和被装饰者具有共同的超类，利用继承达到“**类型匹配**”，而不是利用继承获得“行为”；将装饰者和被装饰者组合时，加入新的行为。

## 实现Java代码

```java
// 抽象饮料类(抽象组件)
public abstract class Beverage {
    
    String description = "Unkown Beverage";
    public String getDescription() {
        return description;
    }
    /**
     * 抽象价格计算方法
     * @return
     */
    public abstract double cost();
}

// 浓缩饮料
public class Espresso extends Beverage {
    public Espresso() {
        description = "Espresso";
    }
    @Override
    public double cost() {
        return 1.99;
    }
}

// 又一饮料
public class HouseBlend extends Beverage {
    public HouseBlend() {
        description = "House Blend";
    }
    @Override
    public double cost() {
        return .20;
    }
}

// 抽象装饰者类
public abstract class CondimentDecorator extends Beverage {
    /**
     * 为了后面的调料都能够获取到自己调料的描述
     */
    public abstract String getDescription();
}

/**
 * @desc Mocha调料(具体装饰者)
 */
public class Mocha extends CondimentDecorator {
    Beverage beverage;

    public Mocha(Beverage beverage) {
        this.beverage = beverage;
    }

    @Override
    public String getDescription() {
        return beverage.getDescription() + ",Mocha";
    }

    @Override
    public double cost() {
        return .20 + beverage.cost();
    }
}

/**
 * @desc Soy调料(具体装饰者)
 */
public class Soy extends CondimentDecorator {
    Beverage beverage;

    public Soy(Beverage beverage) {
        this.beverage = beverage;
    }

    @Override
    public String getDescription() {
        return beverage.getDescription() + ",Soy";
    }

    @Override
    public double cost() {
        return .60 + beverage.cost();
    }
}


/**
 * @desc Whip调料(具体装饰者)
 */
public class Whip extends CondimentDecorator {
    Beverage beverage;

    public Whip(Beverage beverage) {
        this.beverage = beverage;
    }

    @Override
    public String getDescription() {
        return beverage.getDescription() + ",Whip";
    }

    @Override
    public double cost() {
        return .40 + beverage.cost();
    }
}

/**
 * @desc 测试装饰者模式
 */
public class MainTest {
    public static void main(String[] args) {
        // 创建一种调料
        Beverage beverage = new Espresso();
        // 描述和价格
        System.out.println(beverage.getDescription() + " $" + beverage.cost());
        Beverage beverage1 = new HouseBlend();

        beverage1 = new Mocha(beverage1);
        beverage1 = new Whip(beverage1);
        beverage1 = new Soy(beverage1);
        System.out.println(beverage1.getDescription() + " $" + beverage1.cost());
        Beverage beverage2 = new Espresso();

        beverage2 = new Mocha(beverage2);
        beverage2 = new Whip(beverage2);
        beverage2 = new Soy(beverage2);
        beverage2 = new Mocha(beverage2);
        System.out.println(beverage2.getDescription() + " $" + beverage2.cost());
    }

}
```

## 测试结果

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620162440.png)

装饰者和被装饰者具有共同的超类，利用继承达到“**类型匹配**”，而不是利用继承获得“行为”；将装饰者和被装饰者组合时，加入新的行为。

　　解决本文中饮料的具体问题时，图中Component即为Beverage（可以是抽象类或者接口），而ConcreteComponent为各种饮料，Decorator（抽象装饰者）为调料的抽象类或接口，ConcreteDecoratorX则为各种具体的调料。

　　因为使用对象组合，可以把饮料和调料更有弹性地加以混合与匹配。

　　代码外部细节：

　　代码中实现的时候，通过构造函数将被装饰者传入装饰者中即可，如最后的调用形式如下：

```java
Beverage beverage = new DarkRoast();
beverage = new Mocha(beverage);
beverage = new Whip(beverage);
```

即完成了两层包装，此时再调用beverage的cost()函数即可得到总价。

# java.io包内的装饰者模式

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620162458.png)

装饰者模式的缺点：在设计中加入大量的小类，如果过度使用，会让程序变得复杂。

参考：http://www.cnblogs.com/mengdd/archive/2013/01/03/2843439.html