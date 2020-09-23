---
title: mysql允许最大sql语句长度配置
toc: true
recommend: 1
keywords: categories-java max_allow_packet net_buffer_length mysql允许最大sql语句长度配置 慢sql优化
uniqueId: '2020-03-25 09:46:12/"mysql允许最大sql语句长度配置".html'
date: 2020-03-25 17:46:12
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200325175024.png
tags: [mysql,慢sql]
categories: [数据库,mysql]
---
MySQL对于每个客户端连接都会分配连接buffer和结果集发送的buffer，连接buffer主要就是来接受客户端发送过来的sql语句，并且初始分配大小都是 `net_buffer_length`，可以动态增长，最多可以达到 `max_allow_packet`大小。这个参数是会话只读的，言外之意就是只能全局修改，新建连接才生效。`max_allow_packet`是MySQL控制网络包大小的参数，默认是4M。有次可控制一条mysql查询语句大大小，实现mysql慢sql相关优化。<!-- more -->

## 一、前言

前几天在生产环境抓到一条慢SQL，内容大致如下：

```mysql
select xxx from table where conditions and id in (in_list);
```

这个SQL看起来貌似没有什么问题，但是 `in_list`的元素个数多达3000多个，然后我尝试统计了这个表的总数据量，刚好跟这个 `in_list`吻合，用大腿猜了下，应该是用了框架，先查出表里所有的数据放入list，再进行拼接生成的SQL，这尼玛不是蠢么。

## 二、问题

抛开这个蠢不蠢的问题，我比较关心的是在MySQL里面，这个 `in_list`的元素个数能不能控制。咨询了下叶师傅，加上自己搜索了一圈文档，很遗憾，MySQL没法限制这个 `in_list`的元素个数。那么既然没法控制 `in_list`，那我们是不是可以控制sql语句的长度呢？

**net_buffer_length**

MySQL有一个参数叫做 `net_buffer_length`，它是做什么用的呢？

```text
Each client thread is associated with a connection buffer and result buffer. Both begin with a size given by net_buffer_length but are dynamically enlarged up to max_allowed_packet bytes as needed. The result buffer shrinks to net_buffer_length after each SQL statement.This variable should not normally be changed, but if you have very little memory, you can set it to the expected length of statements sent by clients. If statements exceed this length, the connection buffer is automatically enlarged. The maximum value to which net_buffer_length can be set is 1MB.The session value of this variable is read only.
```

简单翻译一下的意思就是，MySQL对于每个客户端连接都会分配连接buffer和结果集发送的buffer，连接buffer主要就是来接受客户端发送过来的sql语句，并且初始分配大小都是 `net_buffer_length`，可以动态增长，最多可以达到 `max_allow_packet`大小。这个参数是会话只读的，言外之意就是只能全局修改，新建连接才生效。`max_allow_packet`是MySQL控制网络包大小的参数，默认是4M。

## 三、测试

既然是这样的话，我们就来测试一把，下面是我的测试过程。

**参数设置**

```bash
root@mysqldb 16:58:  [(none)]> show global variables like 'net_buffer_length';
+-------------------+-------+
| Variable_name     | Value |
+-------------------+-------+
| net_buffer_length | 16384 |
+-------------------+-------+
1 row in set (0.00 sec)

root@mysqldb 17:00:  [(none)]> show global variables like 'max_allowed_packet';
+--------------------+--------+
| Variable_name      | Value  |
+--------------------+--------+
| max_allowed_packet | 131072 |
+--------------------+--------+
```

这里我设置 `net_buffer_length`为16K， `max_allowed_packet`为128K

**测试脚本**

```python
#!/bin/env python
#coding:utf-8

import pymysql

def get_in_list(i):
    in_list = ''
    for i in range(1,i):
        in_list = str(i) + ',' + in_list

    in_list = in_list + str(i+1)
    return in_list

def exec_mysql(sql):
    conn = pymysql.connect(host='127.0.0.1', user='xucl',
                           password='xuclxucl123', database='sbtest', charset='utf8')
    cursor = conn.cursor()
    cursor.execute(sql)
    results = cursor.fetchall()
    if results:
        print("get results")
    conn.close()

if __name__ == "__main__":
    in_list = get_in_list(100)
    sql = "select * from sbtest1 where id in ({})".format(in_list)
    # 打印出sql占用的字节数
    print(len(in_list.encode()))
    exec_mysql(sql)
```



**测试结果**

当i为4200时，sql大小为19892字节（大于 `net_buffer_length`），MySQL能正常返回数据，结果如下

```
[root@izbp13wpxafsmeraypddyvz python_scripts]# python test.py 19892get results
```

当i为23690时，sql大小为131033字节（小于 `max_allowed_packet`），也能正常输出，结果如下，此时sql的字节数为131033

```
[root@izbp13wpxafsmeraypddyvz python_scripts]# python test.py 131033get results
```

当i为23691时，sql大小为131039字节（仍然小于 `max_allowed_packet`），抛出异常

```bash
[root@izbp13wpxafsmeraypddyvz python_scripts]# python test.py 
131039
Traceback (most recent call last):
  File "test.py", line 29, in <module>
    exec_mysql(sql)
  File "test.py", line 19, in exec_mysql
    cursor.execute(sql)
  File "/usr/lib64/python2.7/site-packages/pymysql/cursors.py", line 170, in execute
    result = self._query(query)
  File "/usr/lib64/python2.7/site-packages/pymysql/cursors.py", line 328, in _query
    conn.query(q)
  File "/usr/lib64/python2.7/site-packages/pymysql/connections.py", line 517, in query
    self._affected_rows = self._read_query_result(unbuffered=unbuffered)
  File "/usr/lib64/python2.7/site-packages/pymysql/connections.py", line 732, in _read_query_result
    result.read()
  File "/usr/lib64/python2.7/site-packages/pymysql/connections.py", line 1075, in read
    first_packet = self.connection._read_packet()
  File "/usr/lib64/python2.7/site-packages/pymysql/connections.py", line 684, in _read_packet
    packet.check_error()
  File "/usr/lib64/python2.7/site-packages/pymysql/protocol.py", line 220, in check_error
    err.raise_mysql_exception(self._data)
  File "/usr/lib64/python2.7/site-packages/pymysql/err.py", line 109, in raise_mysql_exception
    raise errorclass(errno, errval)
pymysql.err.InternalError: (1153, u"Got a packet bigger than 'max_allowed_packet' bytes")
```

MySQL错误日志如下：

```text
2020-03-10T09:07:46.992043Z 32 [Note] Aborted connection 32 to db: 'sbtest' user: 'xucl' host: '127.0.0.1' (Got a packet bigger than 'max_allowed_packet' bytes)
```

**释惑**

为什么sql字节数为131039<131072（ `max_allowed_packet`大小），MySQL还是报错了呢？因为这里还需要加上MySQL的包头大小，这个包头的大小是多少呢？还是用i=23690的例子，在MySQL服务器上抓包

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200325174658.png)

看到MySQL接收到的包大小是131070字节，那么这个包头大小就为37字节了（未深入研究，留到以后研究），而上述实验中i=23691的例子中，sql大小为131039字节，加上包头的大小37字节，总大小为131076字节，大于 `max_allowed_packet`的131072，所以MySQL报错，符合逻辑。

## 四、结论

经过这次测试，得出了以下节点结论

- 虽然MySQL没有限制子查询内元素个数，但是还是不建议元素太多，会影响执行计划同时也会影响SQL解析的效率和内存占用
- 适当调大 `net_buffer_length`，最好能够一次性缓存sql，无需再分配内存，并且这是一个全局性参数
- 适当调大 `max_allowed_packet`大小，但是也不要分配过大，这是一个会话级变量，生产建议调为32M为佳
- 学会利用抓包解决"网络"相关的问题

参考文章:  
[参考链接](https://mp.weixin.qq.com/s/amzI5bhbkqiYt4BeVdQl0A)

