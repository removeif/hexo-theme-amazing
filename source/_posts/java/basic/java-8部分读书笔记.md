---
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620152744.png
title: java 8部分读书笔记
categories: [java,java基础]
uniqueId: java-8部分读书笔记.html
toc: true
keywords: java
date: 2018-12-19 10:11:56
tags: [java]
---
# Lambda 表达式

1. Lambda 表达式引用的是值，不是变量。

2. Lambda 表达式中的变量只能是final类型，只能给变量赋值一次。

   ```java
   String name = getUserName();
   name = formatUesrName();
   button.addActionListener(event -> System.out.println("Hi" + name))
   ```

   如上代码将不会编译通过，name被赋值多次。
<!-- more -->
3. 函数接口：只有一个抽象方法的接口，用作Lambda表达式的类型。

   **Java中重要的几个函数接口**

   > 名称		   			 解释		返回值		eg						参数
   >
   > Predicate<T>			 断言  		boolean 		这张唱片已经发行了吗		T
   >
   > Consumer<T> 		消费			void  		输出一个值				T
   >
   > Function<T,R>			运行			R			获得Artist对象的名字		T
   >
   > Supplier<T>			供应			T			工厂方法					None
   >
   > UnaryOperator<T>   	一元运算		T			逻辑非(!)					T	
   >
   > BinaryOperator<T> 	二元运算		T			求两个数的乘积			(T,T)

   所有的都有泛型没有的话值代码编译不过

   ```java
   Predicate<Integer> atLeast5 = x -> x > 5;// 编译通过
   Predicate atLeast5 = x -> x > 5;// 编译不通过
   BinaryOperator<Long> addLongs = (x , y) -> x + y;// 编译通过
   ```

# 流 Stream(针对于集合)

1. 惰性求值 和及早求值

   ```java
   allArtists.stream().filter(artist -> artist.isFrom("London"));
   ```

   这行代码并没有做什么实质性工作,filter只是刻画出了Stream，没有产生新的集合。像filter这种只描述Stream，不产生新集合的方法叫做**惰性求值方法**,而像count这样最终会从Stream产生值的方法叫做**及早求值方法**。

   ```java
   allArtists.stream().filter(artist - >{
       System.out.println(artist.getName());
       return artist.isFrom("London");
   });// 此段代码并不会输出 艺术家名字
   
   allArtists.stream().filter(artist - >{
       System.out.println(artist.getName());
       return artist.isFrom("London");
   }).count();// 此段代码并会输出 艺术家名字
   ```

   判断一个操作是惰性求值还是及早求值，只需看它的返回值，返回值是Stream,那么就是惰性求值，返回值是另一个值或者是空，则是及早求值。最终达到的效果：通过这些方法形成一个惰性求值的链，最终调用一个及早求值方法得到我们需要的最终结果。

2. 常用的流操作

   **collect(toList())** :由Stream里的值生成一个列表

   Stream的of 方法使用一组初始值生成新的Stream

   ```java
   List<String> collected = Stream.of("a","b","c").collect(Collectors.toList());
   assertEquals(Arrays.asList("a","b","c"),collected);//判断结果和预期值是否一样
   ```

   **map**

   将一种类型转换为另一种类型，将一个流中的值转换为一个新的流。**mapToInt/mapToDouble/mapToLong**

   ```java
   List<String> collected = Stream.of("a","b","hello")
       .map(string -> string.toUpperCase())
       .collect(Collectors.toList());//将小写转换为大写
   ```

   **filter**

   filter模式，保留Stream中的一些元素，过滤掉其他的。返回true保留，返回false过滤。

   ```java
   List<String> beginWithNumbers = Stream.of("a","1adf","abc1")
       .filter(value -> isDigit(value.chartAt(0)))
       .collect(toList());//返回数据开头的字符串
   ```

   **flatMap** :可用Stream替换值，将多个Stream连接成一个Stream

   ```java
   List<Integer> together = Stream.of(asList(1,2), asList(3,4))
       .flatMap(numbers -> numbers.stream())
       .collect(toList());
   ```

   它会把原流中的每一个元素经过指定函数处理之后，返回一个Stream对象，并将之展开到原父流中。

   **max和min**

   ```java
   List<Track> tracks = asList(new Track("Bakai",524),
                              	new Track("Violets",378),
                               new Track("Time",451));
   Track shortestTrack = tracks.stream().min(Commparator.comparing(track -> track.getLength())).get();// 查找距离最短的
   ```

   **reduce** 聚合归纳：操作中可以实现从一组值生成一个值

   使用reduce求和

   ```java
   int count = Stream.of(1,2,3)
       .reduce(0, (acc, element) -> acc + element);
   ```

   展开reduce操作

   ```java
   BinaryOperator<Integer> accumulator = (acc, element) -> acc + element;
   int count = accumulator.apply(
       accumulator.apply(
           accumulator.apply(0, 1),
           2),
       3);
   ```

   ```java
   collections.stream().map(Entity::getNum).reduce(0, Integer::sum); // collections求和num
   ```

   ```java
   //根据typeId分组 entities[{typeId:1,name:"火锅"},{typeId:1,name:"烧烤"}，{typeId:2,name:"律师"}]
   Map<Integer, List<Entity>> groups = entities.stream()
       .collect(Collectors.groupingBy(Entity::getTypeId));
   List<Entity> list = groups.get(typeId); //拿到对应的分组数据
   ```

   找出长度大于一分钟的曲目

   ```java
   public Set<String> findLongTracks(List<Album> albums){
       return albums.stream()
           .flatMap(album -> album.getTracks())
           .filter(track -> track.getLength() > 60)
           .map(track -> track.getName)
           .collect(toSet());
   }
   ```

