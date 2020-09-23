---
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620152744.png
title: Java设计模式之命令模式
categories: [java,设计模式]

toc: true
keywords: java
date: 2019-01-04 15:34:00
tags: [java,设计模式]
---
# 目的

> 将一个请求封装为一个对象，从而可用不同的请求对客户进行参数化；对请求排队或记录日志，以及支持可撤销的操作。
>
> 将”发出请求的对象”和”接收与执行这些请求的对象”分隔开来。
<!-- more -->
# 效果

1. command模式将调用操作的对象和实现该操作的对象解耦
2. 可以将多个命令装配成一个复合命令，复合命令是Composite模式的一个实例
3. 增加新的command很容易，无需改变已有的类

# 适用性

1. 抽象出待执行的动作以参数化某对象
2. 在不同的时刻指定、排列和执行请求。如请求队列
3. 支持取消操作
4. 支持修改日志
5. 用构建在原语操作上的高层操作构造一个系统。支持事物

# 参与者

1. Command
   声明执行操作的接口
2. ConcreteCommand
   将一个接收者对象绑定于一个动作
      　　调用接收者相应的操作，以实现execute
3. Client
   创建一个具体命令对象并设定它的接收者
4. Invoker
   要求该命令执行这个请求
5. Receiver
   知道如何实施与执行一个请求相关的操作。任何类都可能作为一个接收者

# 结构图

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620161524.png)

协作：
　　1)、client创建一个ConcreteCommand对象并指定它的Receiver对象
　　2)、某Invoker对象存储该ConcreteCommand对象
　　3)、该Invoker通过调用Command对象的execute操作来提交一个请求。若该命令是可撤销的，ConcreteCommand在执行execute操作前存储当前状态以用于取消该命令
　　4)、ConcreteCommand对象调用它的Receiver的操作以执行该请求

命令对象将动作和接受者包进对象中，这个对象只暴露出一个execute()方法，当此方法被调用的时候，接收者就会进行这些动作。从外面来看，其他对象不知道究竟哪个接收者进行了哪些动作，只知道如果调用execute()方法，请求的目的就能达到。 

# java 实现源码

```java
/**
 * @desc 命令接口
 */
public interface Command {
    /**
     * 执行命令
     */
    void excute();

    /**
     * 撤销命令
     */
    void undo();
}

/**
 * @desc 真正命令执行者，接收者
 */
public class Receiver {
    public void action() {
        System.out.println("正在执行命令...");
    }

    public void unAction() {
        System.out.println("正在撤销命令...");
    }

}

/**
 * @desc 创建命令（可实现多条命令以及多个命令执行人）
 */
public class CreateCommand implements Command {
    private Receiver receiver;

    /**
     * 初始化命令接收人
     * 
     * @param receiver
     */
    public CreateCommand(Receiver receiver) {
        this.receiver = receiver;
    }

    @Override
    public void excute() {
        receiver.action();
    }
    
    @Override
    public void undo() {
        receiver.unAction();
    }
}


/**
 * @desc 命令调用者
 */
public class Invoker {
    private Command command;

    /**
     * 命令调用者持有该命令
     * 
     * @param command
     */
    public Invoker(Command command) {
        this.command = command;
    }

    /**
     * 执行命令
     */
    public void runCommand() {
        command.excute();
    }

    /**
     * 撤销命令
     */
    public void unRunCommand() {
        command.undo();
    }
}

/**
 * @desc 命令模式测试
 */
public class TestMain {
    public static void main(String[] args) {
        // new 一个命令执行人
        Receiver receiver = new Receiver();
        // new 一条命令
        Command command = new CreateCommand(receiver);
        // 开始调用命令
        Invoker invoker = new Invoker(command);

        invoker.runCommand();
        invoker.unRunCommand();
    }
}
```

# 执行结果

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620161618.png)

常见应用：
 1、工作队列，线程池，日程安排
 2、日志请求(系统恢复)
要点：
 1、命令模式将发出请求的对象和执行请求的对象解耦
 2、在被解耦的两者之间是通过命令对象进行沟通的。命令对象封装了接收者和一个或一组动作
 3、调用者通过调用命令对象的execute()发出请求，这会使得接收者的动作被调用
 4、调用者可以接受命令当作参数，甚至在运行时动态的进行
 5、命令可以支持撤销，做法是实现一个undo()方法来回到execute()被执行前的状态
 6、宏命令是命令的一种简单的延伸，允许调用多个命令。宏方法也可以支持撤销
 7、实际操作时，很常见使用"聪明"命令对象，也就是直接实现了请求，而不是将工作委托给接受者(弊端？)
 8、命令也可以用来实现日志和事物系统

 参考：http://www.cnblogs.com/ikuman/archive/2013/08/06/3233092.html
