---
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620152744.png
title: Java设计模式之单例模式
categories: [java,设计模式]

toc: true
keywords: java
date: 2018-11-17 22:10:13
tags: [java,设计模式]
---
# 单例模式

> 确保一个类只有一个实例，并提供一个全局访问点！

## 饿汉式：线程安全，但效率比较低
<!-- more -->
```java
/** 
 * 单例模式的实现：饿汉式,线程安全 但效率比较低 
 */  
public class SingletonTest {  

    // 定义一个私有的构造方法
    private SingletonTest() {  
    }  

    // 将自身的实例对象设置为一个属性,并加上Static和final修饰符
    private static final SingletonTest instance = new SingletonTest();  

    // 静态方法返回该类的实例
    public static SingletonTest getInstancei() {  
        return instance;  
    }  
  
}
```



## 单例模式的实现：饱汉式，非线程安全

```java
/**  
 * 单例模式的实现：饱汉式,非线程安全   
 *   
 */  
public class SingletonTest {

    // 定义私有构造方法（防止通过 new SingletonTest()去实例化）
    private SingletonTest() {   
    }   
    // 定义一个SingletonTest类型的变量（不初始化，注意这里没有使用final关键字）
    private static SingletonTest instance;   

    // 定义一个静态的方法（调用时再初始化SingletonTest，但是多线程访问时，可能造成重复初始化问题）
    public static SingletonTest getInstance() {   
        if (instance == null)   
            instance = new SingletonTest();   
        return instance;   
    }   
} 
```

## 饱汉式，线程安全简单实现  

```java
/**  
 * 单例模式的实现：饱汉式,线程安全简单实现   
 *   
 */  
public class SingletonTest {

    // 定义私有构造方法（防止通过 new SingletonTest()去实例化）
    private SingletonTest() {   
    }   

    // 定义一个SingletonTest类型的变量（不初始化，注意这里没有使用final关键字）
    private static SingletonTest instance;   

    // 定义一个静态的方法（调用时再初始化SingletonTest，使用synchronized 避免多线程访问时，可能造成重的复初始化问题）
    public static synchronized  SingletonTest getInstance() {   
        if (instance == null)   
            instance = new SingletonTest();   
        return instance;   
    }   
} 
```

## 双重锁机制：线程安全，效率高，单例模式最优方案

```java
/**  
 * 单例模式最优方案
 * 线程安全  并且效率高  
 *  
 */  
public class SingletonTest { 

    // 定义一个私有构造方法
    private SingletonTest() { 
    }   
    //定义一个静态私有变量(不初始化，不使用final关键字，使用volatile保证了多线程访问时instance变量的可见性，避免了instance初始化时其他变量属性还没赋值完时，被另外线程调用)
    private static volatile SingletonTest instance;  

    //定义一个共有的静态方法，返回该类型实例
    public static SingletonTest getIstance() { 
        // 对象实例化时与否判断（不使用同步代码块，instance不等于null时，直接返回对象，提高运行效率）
        if (instance == null) {
        //同步代码块（对象未初始化时，使用同步代码块，保证多线程访问时对象在第一次创建后，不再重复被创建）
            synchronized (SingletonTest.class) {
                //未初始化，则初始instance变量
                if (instance == null) {
                    instance = new SingletonTest();   
                }   
            }   
        }   
        return instance;   
    }   
}
```

## 静态内部类方式

```java
/**
   * 静态内部类方式
   *
   */
 public class Singleton {  
     private static class SingletonHolder {  
     private static final Singleton INSTANCE = new Singleton();  
     }  
     private Singleton (){}
     public static final Singleton getInstance() {  
         return SingletonHolder.INSTANCE;  
     }  
 }  
```

**这种方式同样利用了classloder的机制来保证初始化instance时只有一个线程，它跟第三种和第四种方式不同的是（很细微的差别）：第三种和第四种方式是只要Singleton类被装载了，那么instance就会被实例化（没有达到lazy loading效果），而这种方式是Singleton类被装载了，instance不一定被初始化。因为SingletonHolder类没有被主动使用，只有显示通过调用getInstance方法时，才会显示装载SingletonHolder类，从而实例化instance。想象一下，如果实例化instance很消耗资源，我想让他延迟加载，另外一方面，我不希望在Singleton类加载时就实例化，因为我不能确保Singleton类还可能在其他的地方被主动使用从而被加载，那么这个时候实例化instance显然是不合适的。这个时候，这种方式相比第三和第四种方式就显得很合理。**

## 总结

【以上单例模式】传统的两私有一公开（私有构造方法、私有静态实例(懒实例化/直接实例化)、公开的静态获取方法）涉及线程安全问题（即使有多重检查锁也可以通过反射破坏单例）目前最为安全的实现单例的方法是通过内部静态enum的方法来实现，因为JVM会保证enum不能被反射并且构造器方法只执行一次。

### 利用反射模式获取

```java
// 饿汉试单例模式
public class HelloWorld {
    private HelloWorld(){};
    private static HelloWorld hell = new HelloWorld();
    public static HelloWorld getHello(){
        return hell;
    }
    public void getWorld(){
        System.out.println("hahahahah");
    }
}

// java反射机制  调用getWorld()方法
public class HelloJava{
    public static void main(String[] args){
     /* HelloWorld hell = HelloWorld.getHello();
        hell.getWorld(); */
        try  
        {  
            Class class1 = Class.forName("cn.jr.text.HelloWorld");  
            Constructor[] constructors = class1.getDeclaredConstructors();  
            AccessibleObject.setAccessible(constructors, true);  
            for (Constructor con : constructors)  
            {  
                if (con.isAccessible())  
                {  
                    Object classObject = con.newInstance();  
                    Method method = class1.getMethod("getWorld");  
                    method.invoke(classObject);  
                }  
            }  
        }  
        catch (Exception e)  
        {  
            e.printStackTrace();  
        } 
    }
}
```

## 使用枚举的单例模式

```java
public class EnumSingleton{
    private EnumSingleton(){}
    public static EnumSingleton getInstance(){
        return Singleton.INSTANCE.getInstance();
    }
   
    private static enum Singleton{
        INSTANCE;
        private EnumSingleton singleton;
        //JVM会保证此方法绝对只调用一次
        private Singleton(){
            singleton = new EnumSingleton();
        }
        public EnumSingleton getInstance(){
            return singleton;
        }
    }
}
```

## 使用枚举，static处调用，初始化一次

```java
public class StaticInitTest {
    private static List<Integer> dataList = null;
    static{
        dataList = Singleton.INSTANCE.init();
    }
        private static enum Singleton {
            INSTANCE;
            private List<Integer> list;

            private Singleton(){
                fillData();
            }
            private void fillData(){
                list = new ArrayList<Integer>(5);
                for(int i =1; i<6; i++){
                    list.add(i);
                }
            }
            public List<Integer> init(){
            return list;
        }
    }
}

```

## 借助CAS（AtomicReference）实现单例模式：
```java
public class Singleton {
    private static final AtomicReference<Singleton> INSTANCE = new AtomicReference<Singleton>(); 

    private Singleton() {}

    public static Singleton getInstance() {
        for (;;) {
            Singleton singleton = INSTANCE.get();
            if (null != singleton) {
                return singleton;
            }

            singleton = new Singleton();
            if (INSTANCE.compareAndSet(null, singleton)) {
                return singleton;
            }
        }
    }
}
```
用CAS的好处在于不需要使用传统的锁机制来保证线程安全,CAS是一种基于忙等待的算法,依赖底层硬件的实现,相对于锁它没有线程切换和阻塞的额外消耗,可以支持较大的并行度。
使用CAS实现单例只是个思路而已，只是拓展一下帮助读者熟练掌握CAS以及单例等知识、千万不要在代码中使用！！！这个代码其实有很大的优化空间。聪明的你，知道以上代码存在哪些隐患吗？
## 最终总结

有两个问题需要注意：

1. 如果单例由不同的类装载器装入，那便有可能存在多个单例类的实例。假定不是远端存取，例如一些servlet容器对每个servlet使用完全不同的类  装载器，这样的话如果有两个servlet访问一个单例类，它们就都会有各自的实例。
2. 如果Singleton实现了java.io.Serializable接口，那么这个类的实例就可能被序列化和复原。不管怎样，如果你序列化一个单例类的对象，接下来复原多个那个对象，那你就会有多个单例类的实例。

对第一个问题修复的办法是：

```java
private static Class getClass(String classname) throws ClassNotFoundException {     
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();     
        
        if(classLoader == null)     
          classLoader = Singleton.class.getClassLoader();     
        
      return (classLoader.loadClass(classname));     
    }     
 }  
```

 对第二个问题修复的办法是：

```java
public class Singleton implements java.io.Serializable {     
     public static Singleton INSTANCE = new Singleton();     
        
     protected Singleton() {     
          
     }     
     private Object readResolve() {     
              return INSTANCE;     
       }    
 }   
```

对我来说，我比较喜欢第a和e种方式，简单易懂，而且在JVM层实现了线程安全（如果不是多个类加载器环境），一般的情况下，我会使用第a种方式，只有在要明确实现lazy loading效果时才会使用第e种方式，另外，如果涉及到反序列化创建对象时我会试着使用枚举的方式来实现单例，不过，我一直会保证我的程序是线程安全的，如果有其他特殊的需求，我可能会使用第七种方式，毕竟，JDK1.5已经没有双重检查锁定的问题了。

参考资料：[java单例之enum实现方式](http://www.cnblogs.com/yangzhilong/p/6148639.html)  
 　　　　 [设计模式](http://www.blogjava.net/kenzhh/archive/2013/03/15/357824.html)  
　　　　  [java设计模式--单例模式](http://www.cnblogs.com/yinxiaoqiexuxing/p/5605338.html)

