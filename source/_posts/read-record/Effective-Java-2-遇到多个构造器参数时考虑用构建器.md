---
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620152744.png
title: Effective-Java-2-遇到多个构造器参数时考虑用构建器
categories: [java,读书笔记]

toc: true
keywords: java
date: 2018-11-17 22:14:45
tags: [Effective-Java,读书笔记]
---
# 遇到多个构造器参数时考虑用构建器

静态工厂和构造器有个共同的局限性：它们都不能很好地扩展到大量的可选参数。当有超过20个可选域是必须的时候，对于此种情况，程序员一般考虑采用**重叠构造器模式**。这种模式下，提供第一个只有必要参数的构造器，第二个构造器有一个可选参数，第三个有两个可选参数，以此类推，最后一个构造器包含所有的参数。
<!-- more -->
## 重叠构造器模式

> 含有四个可选域的情况

```java
public class NutritionFacts{
    private final int servingSize; // required
    private final int servings;   // required
    private final int calories;  // optional
    private final int fat;      // optional
    private final int sodium;   // optional
    private final int carbohydrate; // optional
    
    public NutritionFacts(int servingSize, int servings){
        this(servingSize, servings, 0);
    }
    
    public NutritionFacts(int servingSize, int servings, int calories){
        this(servingSize, servings, calories, 0);
    }
    
    public NutritionFacts(int servingSize, int servings, int calories, int fat){
        this(servingSize, servings, calories, fat, 0);
    }
    
    public NutritionFacts(int servingSize, int servings, int calories, int fat, int sodium){
        this(servingSize, servings, calories, fat, sodium, 0);
    }
    
    public NutritionFacts(int servingSize, int servings, int calories, int fat, int sodium, int carbohydrate){
        this(servingSize, servings, calories, fat, sodium, carbohydrate);
    }
    
}
```

当你想创建实例的时候，就利用参数列表最短的构造器。

**重叠构造器模式可行，但是当有许多参数的时候，客户端代码会很难编写，并且较难阅读，使用的时候容易混淆部分参数容易出错**

## JavaBeans模式

这种模式调用一个无参构造器来创建对象，然后用``setter``方法来设置必要的参数以及相关参数的值。

```java
public class NutritionFacts {
    private int servingSize = -1; // required
    private int servings = -1;   // required
    private int calories = 0;  // optional
    private int fat = 0;      // optional
    private int sodium = 0;   // optional
    private int carbohydrate = 0; // optional
    
    public NutritionFacts(){
        
    }
    
    public void setServingSize(int val) { servingSize = val; }
    public void setServings(int val) { servings = val; }
    public void setCalories(int val) { calories = val; }
    public void setFat(int val) { fat = val; }
    public void setSodium(int val) { sodium = val; }
    public void setCarbohydrate(int val) { carbohydrate = val; }
}
    
```

这种方式弥补了重叠构造器模式的不足，创建实例容易，阅读代码也容易。

```java
NutritionFacts cocaCola = new  NutritionFacts();
cocaCola.setServingSize(10);
cocaCola.setServings(10);
cocaCola.setCalories(10);
cocaCola.setFat(10);
```

**遗憾的是自身有严重的缺陷。构造过程被分到了几个调用中，构造过程中JavaBean可能处于不一致状态的对象，将会导致失败。类无法仅仅通难过校验构造器参数的有效性来保证一致性，Javabeans模式阻止了把类做成不可变的可能，需要付出额外的努力来确保它的线程安全。**

## Builder模式

既能保证像重叠构造器模式那样的安全性，也能保证像JavaBeans模式那样的可读性。

不直接生成想要的对象，而是让客户端利用所有必要的参数调用构造器（或静态工厂），得到一个builder对象。然后客户端在builder对象上调用类似于setter的方法，来设置每个相关的可选参数。最后，客户端调用无参的build方法来生成不可变的对象，这个builder是它构建的类的静态成员类。

```java
public class NutritionFacts{
    private final int servingSize; // required
    private final int servings;   // required
    private final int calories;  // optional
    private final int fat;      // optional
    private final int sodium;   // optional
    private final int carbohydrate; // optional
    
    public static class Builder{
        private final int servingSize; // required
        private final int servings;   // required
        private final int calories = 0;  // optional
        private final int fat = 0;      // optional
        private final int sodium = 0;   // optional
        private final int carbohydrate = 0; // optional
        
        public Builder(int servingSize, int servings){
            this.servingSize = servingSize;
            this.servings =servings;
        }
        
        public Builder calories(int val){
            calories = val;
            return this;
        }
        
        public Builder fat(int val){
            fat = val;
            return this;
        }
        
        public Builder sodium(int val){
            sodium = val;
            return this;
        }
        
        public Builder carbohydrate(int val){
            carbohydrate = val;
            return this;
        }
        
        public NutritionFacts build(){
            return new NutritionFacts(this);
        }
    }
    
    private NutritionFacts(Builder builder){
        servingSize = builder.servingSize; 
        servings = builder.servingSize;   
        calories = builder.servingSize;  
        fat = builder.servingSize;      
        sodium = builder.servingSize;   
        carbohydrate = builder.servingSize; 
    }
}
```

注意``NutritionFacts``是不可变的，所有的默认参数值都单独放一个地方。builder的setter方法返回builder本身，以便可以把调用用调用链连接起来。

```java
NutritionFacts cocaCola = new NutritionFacts.Builder(200,20).calories(10).fat(15).sodium(10).build();
```

builder像个构造器一样，可以对其参数强加约束条件。build方法可以检验这些约束条件，将参数从builder拷贝到对象中之后，并在对象域而不是builder域中对他们进行校验，这一点很重要。如果违反了任何约束条件，build方法就应该抛出**IllegalStateException**,显示违背了哪个约束条件。

对多个参数强加约束条件的另一个方法，用多个setter方法对某个约束条件必须持有的所有参数进行检查。如果该约束条件没有得到满足，setter方法就抛出**IllegalStateException**，不用等到在build的时候。

设置了参数的builder生成了一个很好的抽象工厂，客户端可以将这样一个builder传给方法，使该方法能够为客户端创建一个或者多个对象。要使用这种用法，需要有个类型来表示builder，只要一个泛型就能满足所有的builder，无论他们在构建哪种类型的对象：

```java
public interface Builder<T>{
    public T build();
}
```

可以声明NutritionFacts.Builder类来实现``Builder<NutritionFacts> `` 。

带有Builder实例的方法通常利用有限制的通配符类型来约束构建器的类型参数。eg.下面就是构建每个节点的方法，它利用一个客户端提供的Builder实例来构建树：

```java
Tree buildTree(Builder<? extends Node> nodeBuilder){ ... }
```

**Builder模式还比重叠构造器模式更加冗长，因此它只有在很难参数的时候才使用，比如4个或者更多。但是你要记住，将来可能添加参数。简而言之，如果类的构造器或者静态工厂中具有多个参数，设计这种类时，Builder模式就是种不错的选择，特别是大多参数都是可选的时候。代码易于阅读编写，构建器也比JavaBeans更加安全。