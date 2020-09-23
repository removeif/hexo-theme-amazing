---
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620152744.png
title: Java设计模式之工厂模式
categories: [java,设计模式]

toc: true
keywords: java
date: 2018-11-24 16:12:13
tags: [java,设计模式]
---
# 工厂模式

## 序言

工厂模式在《Java与模式》中分为三类：

1. 简单工厂模式（Simple Factory）：不利于产生系列产品；

2. 工厂方法模式（Factory Method）：又称为多形性工厂；

3. 抽象工厂模式（Abstract Factory）：又称为工具箱，产生产品族，但不利于产生新的产品；
<!-- more -->

这三种模式从上到下逐步抽象，并且更具一般性。GOF在《设计模式》一书中将工厂模式分为两类：工厂方法模式（Factory Method）与抽象工厂模式（Abstract Factory）。将简单工厂模式（Simple Factory）看为工厂方法模式的一种特例，两者归为一类。

## 简单工厂模式

> 简单工厂模式又称**静态工厂方法模式**。从命名上就可以看出这个模式一定很简单。它存在的目的很简单：定义一个用于创建对象的接口。在简单工厂模式中,一个工厂类处于对产品类实例化调用的中心位置上,它决定那一个产品类应当被实例化, 如同一个交通警察站在来往的车辆流中,决定放行那一个方向的车辆向那一个方向流动一样。

### 组成角色：

1. 工厂类角色：这是本模式的核心，含有一定的商业逻辑和判断逻辑。在java中它往往由一个具体类实现。
2.  抽象产品角色：它一般是具体产品继承的父类或者实现的接口。在java中由接口或者抽象类来实现。
3.  具体产品角色：工厂类所创建的对象就是此角色的实例。在java中由一个具体类实现。

### 简单工厂模式的UML图

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620162547.png)

### 简单工厂模式的Java代码

```java
// 抽象接口 人类
public interface Human {
    public void say();
}

// 男人
public class Man implements Human {
    @Override
    public void say() {
        System.out.println("男人");
    }
}

// 女人
public class Woman implements Human {
    @Override
    public void say() {
        System.out.println("女人");
    }
}

// 简单工厂
public class SampleFactory {
    public static Human makeHuman(String type){
        if(type.equals("man")){
            Human man = new Man();
            return man;
        }else if(type.equals("womman")){
            Human woman = new Woman();
            return woman;
        }else{
            System.out.println("生产不出来");
            return null;
        }            
    }
}

// 简单工厂模式反射实现
public class SampleFactory1 {
    public static Human makeHuman(Class c){
        Human human = null;
        try {
            human = (Human) Class.forName(c.getName()).newInstance();
        } catch (InstantiationException e) {
            // TODO Auto-generated catch block
            System.out.println("不支持抽象类或接口");
            e.printStackTrace();
        } catch (IllegalAccessException e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
            System.out.println("没有足够权限，即不能访问私有对象");
        } catch (ClassNotFoundException e) {
            // TODO Auto-generated catch block
            System.out.println("类不存在");
            e.printStackTrace();
        }    
        return human;
    }
}
// 简单工厂测试
public class Client {
    public static void main(String[] args) {
        Human man = SampleFactory.makeHuman("man");
        man.say();
        Human womman = SampleFactory.makeHuman("womman");
        womman.say();
        Human test = SampleFactory.makeHuman("tttt");
        
        Human man = SampleFactory1.makeHuman(Man.class);
        man.say();
        Human woman = SampleFactory1.makeHuman(Woman.class);
        woman.say();
    }
}
```

### 优缺点：

  优点：工厂类是整个模式的关键.包含了必要的逻辑判断,根据外界给定的信息,决定究竟应该创建哪个具体类的对象.通过使用工厂类,外界可以从直接创建具体产品对象的尴尬局面摆脱出来,仅仅需要负责“消费”对象就可以了。而不必管这些对象究竟如何创建及如何组织的．明确了各自的职责和权利，有利于整个[软件体系结构](http://baike.baidu.com/view/1317046.htm)的优化。

  缺点：由于工厂类集中了所有实例的创建逻辑，违反了[高内聚](http://baike.baidu.com/view/292136.htm)责任分配原则，将全部创建逻辑集中到了一个工厂类中；它所能创建的类只能是事先考虑到的，如果需要添加新的类，则就需要改变工厂类了。当系统中的具体产品类不断增多时候，可能会出现要求工厂类根据不同条件创建不同实例的需求．这种对条件的判断和对具体产品类型的判断交错在一起，很难避免模块功能的蔓延，对系统的维护和扩展非常不利；

## 工厂方法模式

> 工厂方法模式是简单工厂模式的进一步抽象化和推广，工厂方法模式里不再只由一个工厂类决定那一个产品类应当被实例化,这个决定被交给抽象工厂的子类去做。

### 组成角色：

1. 抽象工厂角色： 这是工厂方法模式的核心，它与应用程序无关。是具体工厂角色必须实现的接口或者必须继承的父类。在java中它由抽象类或者接口来实现。
2. 具体工厂角色：它含有和具体业务逻辑有关的代码。由应用程序调用以创建对应的具体产品的对象。
3. 抽象产品角色：它是具体产品继承的父类或者是实现的接口。在java中一般有抽象类或者接口来实现。
4. 具体产品角色：具体工厂角色所创建的对象就是此角色的实例。在java中由具体的类来实现。

工厂方法模式使用继承自抽象工厂角色的多个子类来代替简单工厂模式中的“上帝类”。正如上面所说，这样便分担了对象承受的压力；而且这样使得结构变得灵活 起来——当有新的产品（即暴发户的汽车）产生时，只要按照抽象产品角色、抽象工厂角色提供的合同来生成，那么就可以被客户使用，而不必去修改任何已有的代 码。可以看出工厂角色的结构也是符合开闭原则的！

### 工厂方法模式Java代码

```java
//抽象产品角色
public interface Moveable {
    void run();
}

//具体产品角色
public class Plane implements Moveable {
    @Override
    public void run() {
        System.out.println("plane....");
    }
}

public class Broom implements Moveable {
    @Override
    public void run() {
        System.out.println("broom.....");
    }
}

//抽象工厂
public abstract class VehicleFactory {
    abstract Moveable create();
}
//具体工厂
public class PlaneFactory extends VehicleFactory{
    public Moveable create() {
        return new Plane();
    }
}
public class BroomFactory extends VehicleFactory{
    public Moveable create() {
        return new Broom();
    }
}

//测试类
public class Test {
    public static void main(String[] args) {
        VehicleFactory factory = new BroomFactory();
        Moveable m = factory.create();
        m.run();
    }
}


```

  可以看出工厂方法的加入，使得对象的数量成倍增长。当产品种类非常多时，会出现大量的与之对应的工厂对象，这不是我们所希望的。因为如果不能避免这种情 况，可以考虑使用简单工厂模式与工厂方法模式相结合的方式来减少工厂类：即对于产品树上类似的种类（一般是树的叶子中互为兄弟的）使用简单工厂模式来实 现。

## 简单工厂和工厂方法模式的比较

  工厂方法模式和简单工厂模式在定义上的不同是很明显的。工厂方法模式的核心是一个抽象工厂类,而不像简单工厂模式, 把核心放在一个实类上。工厂方法模式可以允许很多实的工厂类从抽象工厂类继承下来, 从而可以在实际上成为多个简单工厂模式的综合,从而推广了简单工厂模式。 
  反过来讲,简单工厂模式是由工厂方法模式退化而来。设想如果我们非常确定一个系统只需要一个实的工厂类, 那么就不妨把抽象工厂类合并到实的工厂类中去。而这样一来,我们就退化到简单工厂模式了。

## 抽象工厂模式

```java
//抽象工厂类
public abstract class AbstractFactory {
    public abstract Vehicle createVehicle();
    public abstract Weapon createWeapon();
    public abstract Food createFood();
}

//具体工厂类，其中Food,Vehicle，Weapon是抽象类，
public class DefaultFactory extends AbstractFactory{
    @Override
    public Food createFood() {
        return new Apple();
    }
    @Override
    public Vehicle createVehicle() {
        return new Car();
    }
    @Override
    public Weapon createWeapon() {
        return new AK47();
    }
}

//测试类
public class Test {
    public static void main(String[] args) {
        AbstractFactory f = new DefaultFactory();
        Vehicle v = f.createVehicle();
        v.run();
        Weapon w = f.createWeapon();
        w.shoot();
        Food a = f.createFood();
        a.printName();
    }
}
```

在抽象工厂模式中，抽象产品 (AbstractProduct) 可能是一个或多个，从而构成一个或多个产品族(Product Family)。 在只有一个产品族的情况下，抽象工厂模式实际上退化到工厂方法模式。

## 总结

1. 简单工厂模式是由一个具体的类去创建其他类的实例，父类是相同的，父类是具体的。
2. 工厂方法模式是有一个抽象的父类定义公共接口，子类负责生成具体的对象，这样做的目的是将类的实例化操作延迟到子类中完成。 
3. 抽象工厂模式提供一个创建一系列相关或相互依赖对象的接口，而无须指定他们具体的类。它针对的是有多个产品的等级结构。而工厂方法模式针对的是一个产品的等级结构。

参考：http://www.cnblogs.com/liaoweipeng/p/5768197.html

　　　http://www.cnblogs.com/forlina/archive/2011/06/21/2086114.html

