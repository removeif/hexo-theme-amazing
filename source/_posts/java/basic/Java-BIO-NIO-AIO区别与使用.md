---
title: Java BIO NIO AIO区别与使用
categories: [java,java基础]
uniqueId: Java-BIO-NIO-AIO区别与使用.html
toc: true
keywords: java
date: 2019-07-19 16:19:21
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2019/20190719163035.png
tags: java

---
> 摘要
BIO 全称Block-IO 是一种**同步且阻塞**的通信模式。是一个比较传统的通信方式，模式简单，使用方便。但并发处理能力低，通信耗时，依赖网速。
<!-- more -->
## Java BIO

使用BIO实现文件的读取和写入。

```java
//Initializes The Object
User1 user = new User1();
user.setName("hollis");
user.setAge(23);
System.out.println(user);

//Write Obj to File
ObjectOutputStream oos = null;
try {
    oos = new ObjectOutputStream(new FileOutputStream("tempFile"));
    oos.writeObject(user);
} catch (IOException e) {
    e.printStackTrace();
} finally {
    IOUtils.closeQuietly(oos);
}

//Read Obj from File
File file = new File("tempFile");
ObjectInputStream ois = null;
try {
    ois = new ObjectInputStream(new FileInputStream(file));
    User1 newUser = (User1) ois.readObject();
    System.out.println(newUser);
} catch (IOException e) {
    e.printStackTrace();
} catch (ClassNotFoundException e) {
    e.printStackTrace();
} finally {
    IOUtils.closeQuietly(ois);
    try {
        FileUtils.forceDelete(file);
    } catch (IOException e) {
        e.printStackTrace();
    }
}
```

## Java NIO

Java NIO，全程 Non-Block IO ，是Java SE 1.4版以后，针对网络传输效能优化的新功能。是一种**非阻塞同步**的通信模式。NIO 与原来的 I/O 有同样的作用和目的, 他们之间最重要的区别是数据打包和传输的方式。原来的 I/O 以流的方式处理数据，而 NIO 以块的方式处理数据。面向流的 I/O 系统一次一个字节地处理数据。一个输入流产生一个字节的数据，一个输出流消费一个字节的数据。面向块的 I/O 系统以块的形式处理数据。每一个操作都在一步中产生或者消费一个数据块。按块处理数据比按(流式的)字节处理数据要快得多。但是面向块的 I/O 缺少一些面向流的 I/O 所具有的优雅性和简单性。

```java
static void readNIO() {
        String pathname = "C:\\Users\\adew\\Desktop\\jd-gui.cfg";
        FileInputStream fin = null;
        try {
            fin = new FileInputStream(new File(pathname));
            FileChannel channel = fin.getChannel();

            int capacity = 100;// 字节
            ByteBuffer bf = ByteBuffer.allocate(capacity);
            int length = -1;

            while ((length = channel.read(bf)) != -1) {

                bf.clear();
                byte[] bytes = bf.array();
                System.out.write(bytes, 0, length);
                System.out.println();
            }

            channel.close();

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (fin != null) {
                try {
                    fin.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    static void writeNIO() {
        String filename = "out.txt";
        FileOutputStream fos = null;
        try {

            fos = new FileOutputStream(new File(filename));
            FileChannel channel = fos.getChannel();
            ByteBuffer src = Charset.forName("utf8").encode("你好你好你好你好你好");
            int length = 0;

            while ((length = channel.write(src)) != 0) {
                System.out.println("写入长度:" + length);
            }

        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (fos != null) {
                try {
                    fos.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }
    }
```

## Java AIO

Java AIO，全程 Asynchronous IO，是**异步非阻塞**的IO。是一种非阻塞异步的通信模式。在NIO的基础上引入了新的异步通道的概念，并提供了异步文件通道和异步套接字通道的实现。

```java
public class ReadFromFile {
  public static void main(String[] args) throws Exception {
    Path file = Paths.get("/usr/a.txt");
    AsynchronousFileChannel channel = AsynchronousFileChannel.open(file);

    ByteBuffer buffer = ByteBuffer.allocate(100_000);
    Future<Integer> result = channel.read(buffer, 0);

    while (!result.isDone()) {
      ProfitCalculator.calculateTax();
    }
    Integer bytesRead = result.get();
    System.out.println("Bytes read [" + bytesRead + "]");
  }
}
class ProfitCalculator {
  public ProfitCalculator() {
  }
  public static void calculateTax() {
  }
}

public class WriteToFile {

  public static void main(String[] args) throws Exception {
    AsynchronousFileChannel fileChannel = AsynchronousFileChannel.open(
        Paths.get("/asynchronous.txt"), StandardOpenOption.READ,
        StandardOpenOption.WRITE, StandardOpenOption.CREATE);
    CompletionHandler<Integer, Object> handler = new CompletionHandler<Integer, Object>() {

      @Override
      public void completed(Integer result, Object attachment) {
        System.out.println("Attachment: " + attachment + " " + result
            + " bytes written");
        System.out.println("CompletionHandler Thread ID: "
            + Thread.currentThread().getId());
      }

      @Override
      public void failed(Throwable e, Object attachment) {
        System.err.println("Attachment: " + attachment + " failed with:");
        e.printStackTrace();
      }
    };

    System.out.println("Main Thread ID: " + Thread.currentThread().getId());
    fileChannel.write(ByteBuffer.wrap("Sample".getBytes()), 0, "First Write",
        handler);
    fileChannel.write(ByteBuffer.wrap("Box".getBytes()), 0, "Second Write",
        handler);

  }
}
```

## 三种IO的区别

首先，我们站在宏观的角度，重新画一下重点：

**BIO （Blocking I/O）：同步阻塞I/O模式。**

**NIO （New I/O）：同步非阻塞模式。**

**AIO （Asynchronous I/O）：异步非阻塞I/O模型。**

**同步请求**，A调用B，B的处理是同步的，在处理完之前他不会通知A，只有处理完之后才会明确的通知A。

**异步请求**，A调用B，B的处理是异步的，B在接到请求后先告诉A我已经接到请求了，然后异步去处理，处理完之后通过回调等方式再通知A。

所以说，同步和异步最大的区别就是被调用方的执行方式和返回时机。同步指的是被调用方做完事情之后再返回，异步指的是被调用方先返回，然后再做事情，做完之后再想办法通知调用方。

**阻塞请求**，A调用B，A一直等着B的返回，别的事情什么也不干。

**非阻塞请求**，A调用B，A不用一直等着B的返回，先去忙别的事情了。

所以说，阻塞非阻塞最大的区别就是在被调用方返回结果之前的这段时间内，调用方是否一直等待。阻塞指的是调用方一直等待别的事情什么都不做。非阻塞指的是调用方先去忙别的事情。

**同步阻塞模式**：这种模式下，我们的工作模式是先来到厨房，开始烧水，并坐在水壶面前一直等着水烧开。

**同步非阻塞模式**：这种模式下，我们的工作模式是先来到厨房，开始烧水，但是我们不一直坐在水壶前面等，而是回到客厅看电视，然后每隔几分钟到厨房看一下水有没有烧开。

**异步非阻塞I/O模型**：这种模式下，我们的工作模式是先来到厨房，开始烧水，我们不一一直坐在水壶前面等，也不隔一段时间去看一下，而是在客厅看电视，水壶上面有个开关，水烧开之后他会通知我。

**阻塞VS非阻塞**：人是否坐在水壶前面一直等。

**同步VS异步**：水壶是不是在水烧开之后主动通知人。

## 适用场景

BIO方式适用于连接数目比较小且固定的架构，这种方式对服务器资源要求比较高，并发局限于应用中，JDK1.4以前的唯一选择，但程序直观简单易理解。

NIO方式适用于连接数目多且连接比较短（轻操作）的架构，比如聊天服务器，并发局限于应用中，编程比较复杂，JDK1.4开始支持。

AIO方式适用于连接数目多且连接比较长（重操作）的架构，比如相册服务器，充分调用OS参与并发操作，编程比较复杂，JDK7开始支持。

[参考自](https://mp.weixin.qq.com/s?__biz=Mzg3MjA4MTExMw==&mid=2247485960&idx=1&sn=83d418c498c2d6df102bd227c9e5c7ff&chksm=cef5f9bef98270a8e5cbd23280fb211362c7ff17dcf8894df71ba42692348c8f99e101a3c35d&scene=21#wechat_redirect)

.