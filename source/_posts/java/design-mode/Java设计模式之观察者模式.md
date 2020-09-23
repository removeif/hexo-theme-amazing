---
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620152744.png
title: Java设计模式之观察者模式

toc: true
date: 2018-11-15 15:03:42
tags: [java,设计模式]
categories: [java,设计模式]
---
# 定义

> 在阎宏博士的《JAVA与模式》一书中开头是这样描述观察者（Observer）模式的：
**观察者模式是对象的行为模式，又叫发布-订阅(Publish/Subscribe)模式、模型-视图(Model/View)模式、源-监听器(Source/Listener)模式或从属者(Dependents)模式。**
**观察者模式定义了一种一对多的依赖关系，让多个观察者对象同时监听某一个主题对象。这个主题对象在状态上发生变化时，会通知所有观察者对象，使它们能够自动更新自己。**
<!-- more -->
# 推结构模式

## 推模式相关结构说明

一个软件系统里面包含了各种对象，就像一片欣欣向荣的森林充满了各种生物一样。在一片森林中，各种生物彼此依赖和约束，形成一个个生物链。一种生物的状态变化会造成其他一些生物的相应行动，每一个生物都处于别的生物的互动之中。

同样，一个软件系统常常要求在某一个对象的状态发生变化的时候，某些其他的对象做出相应的改变。做到这一点的设计方案有很多，但是为了使系统能够易于复用，应该选择低耦合度的设计方案。减少对象之间的耦合有利于系统的复用，但是同时设计师需要使这些低耦合度的对象之间能够维持行动的协调一致，保证高度的协作。观察者模式是满足这一要求的各种设计方案中最重要的一种。

下面以一个简单的示意性实现为例，讨论观察者模式的结构。

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620162654.png)

## 观察者模式所涉及的角色有：

　　●　　**抽象主题(Subject)角色：**抽象主题角色把所有对观察者对象的引用保存在一个聚集（比如ArrayList对象）里，每个主题都可以有任何数量的观察者。抽象主题提供一个接口，可以增加和删除观察者对象，抽象主题角色又叫做抽象被观察者(Observable)角色。

　　●　　**具体主题(ConcreteSubject)角色：**将有关状态存入具体观察者对象；在具体主题的内部状态改变时，给所有登记过的观察者发出通知。具体主题角色又叫做具体被观察者(Concrete Observable)角色。

　　●　　**抽象观察者(Observer)角色：**为所有的具体观察者定义一个接口，在得到主题的通知时更新自己，这个接口叫做更新接口。

　　●　　**具体观察者(ConcreteObserver)角色：**存储与主题的状态自恰的状态。具体观察者角色实现抽象观察者角色所要求的更新接口，以便使本身的状态与主题的状态 像协调。如果需要，具体观察者角色可以保持一个指向具体主题对象的引用。

 **主题对象向观察者推送主题的详细信息，不管观察者是否需要，推送的信息通常是主题对象的全部或部分数据。**

### 抽象观察者角色

```java
public interface Observer {
    void update(String state);
    String getName();
}
```

### 具体观察者

```java
public class ConcreteObserver implements Observer {

    private String name;
    private String state;

    public ConcreteObserver(String name) {
        this.name = name;
    }
    public String getState() {
        return state;
    }
    public void setState(String state) {
        this.state = state;
    }
    @Override
    public void update(String state) {
        // 更新观察 着状态
        this.state = state;
        System.out.println(getName() + "观察者状态更新为：" + state);
    }
    @Override
    public String getName() {
        return name;
    }

}
```

### 抽象主题角色

```java
public abstract class Subject {
    /**
     * 保存观察者的容器
     */
    private List<Observer> list = new ArrayList<Observer>();
    /**
     * 注册观察者
     */
    public void register(Observer o) {
        list.add(o);
        System.out.println("增加了一个观察者:" + o.getName());
    }
    /**
     * 移除观察者
     * 
     * @param o
     */
    public void remove(Observer o) {
        System.out.println("移除了一个观察者:" + o.getName());
        list.remove(o);
    }
    /**
     * 通知观察者
     * 
     * @param newState
     */
    public void nodifyObservers(String newState) {
        for (Observer observer : list) {
            observer.update(newState);
        }
    }
}
```

### 具体主题角色

```java
public class ConcreteSubject extends Subject {
    /**
     * 状态
     */
    private String state;
    public String getState() {
        return state;
    }
    public void change(String newState) {
        state = newState;
        System.out.println("状态变为：" + newState);
        System.out.println("开始通知观察者...");
        this.nodifyObservers(state);
    }

}
```

### 测试类

```java
public class MainTest {
    public static void main(String[] args) {
        Observer o1 = new ConcreteObserver("o1");
        Observer o2 = new ConcreteObserver("o2");
        Observer o3 = new ConcreteObserver("o3");
        ConcreteSubject csj = new ConcreteSubject();
        csj.register(o1);
        csj.register(o2);
        csj.register(o3);
        csj.remove(o2);
        csj.change("new State！");
    }
}
```

### 输出结果

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620162711.png)

在运行时，这个客户端首先创建了具体主题类的实例，以及一个观察者对象。然后，它调用主题对象的register()方法，将这个观察者对象向主题对象登记，也就是将它加入到主题对象的聚集中去。 

这时，客户端调用主题的change()方法，改变了主题对象的内部状态。主题对象在状态发生变化时，调用超类的notifyObservers()方法，通知所有登记过的观察者对象

# 拉模式结构

## 说明

   主题对象在通知观察者的时候，只传递少量信息。如果观察者需要更具体的信息，由观察者主动到主题对象中获取，相当于是观察者从主题对象中拉数据。一般这种模型的实现中，会把主题对象自身通过update()方法传递给观察者，这样在观察者需要获取数据的时候，就可以通过这个引用来获取了。

### 抽象观察者角色

```java
public interface Observer {
    /**
     * 传入主题，获取中的对象
     * @param subject
     */
    void update(Subject subject);
    String getName();
}
```

### 具体观察者

```java
public class ConcreteObserver implements Observer {

    private String name;
    private String state;

    public ConcreteObserver(String name) {
        this.name = name;
    }
    public String getState() {
        return state;
    }
    public void setState(String state) {
        this.state = state;
    }
    @Override
    public String getName() {
        return name;
    }

    @Override
    public void update(Subject subject) {
        // 主动去主题里拿数据
        state = ((ConcreteSubject) subject).getState();
        System.out.println(getName() + "观察者状态更新为：" + state);
    }

}
```

### 抽象主题角色

```java
public abstract class Subject {
    /**
     * 保存观察者的容器
     */
    private List<Observer> list = new ArrayList<Observer>();

    /**
     * 注册观察者
     */
    public void register(Observer o) {
        list.add(o);
        System.out.println("增加了一个观察者:" + o.getName());
    }

    /**
     * 移除观察者
     * 
     * @param o
     */
    public void remove(Observer o) {
        System.out.println("移除了一个观察者:" + o.getName());
        list.remove(o);
    }

    /**
     * 通知观察者
     * 
     * @param newState
     */
    public void nodifyObservers() {
        for (Observer observer : list) {
            observer.update(this);
        }
    }
}
```

### 具体主题角色

```java
public class ConcreteSubject extends Subject {
    /**
     * 状态
     */
    private String state;

    public String getState() {
        return state;
    }

    public void change(String newState) {
        state = newState;
        System.out.println("状态变为：" + newState);
        System.out.println("开始通知观察者...");
        this.nodifyObservers();
    }

}
```

### 测试

```java
public class MainTest {
    public static void main(String[] args) {
        Observer o1 = new ConcreteObserver("o1");
        Observer o2 = new ConcreteObserver("o2");
        Observer o3 = new ConcreteObserver("o3");
        ConcreteSubject csj = new ConcreteSubject();
        csj.register(o1);
        csj.register(o2);
        csj.register(o3);
        csj.remove(o2);
        csj.change("new State！");
    }
}
```

### 测试结果

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620162744.png)

# 两种模式的比较

1. 推模型是假定主题对象知道观察者需要的数据；而拉模型是主题对象不知道观察者具体需要什么数据，没有办法的情况下，干脆把自身传递给观察者，让观察者自己去按需要取值。

2. 推模型可能会使得观察者对象难以复用，因为观察者的update()方法是按需要定义的参数，可能无法兼顾没有考虑到的使用情况。这就意味着出现新情况的时候，就可能提供新的update()方法，或者是干脆重新实现观察者；而拉模型就不会造成这样的情况，因为拉模型下，update()方法的参数是主题对象本身，这基本上是主题对象能传递的最大数据集合了，基本上可以适应各种情况的需要。

[参考链接](http://www.cnblogs.com/java-my-life/archive/2012/05/16/2502279.html)

