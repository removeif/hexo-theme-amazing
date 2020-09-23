---
title: mysql索引优化方案
categories: [数据库,mysql]

toc: true
keywords: mysql
date: 2019-07-03 17:02:13
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/20190703170329.png
tags: mysql
---
> 摘要
mysql自带优化：先执行explain sql，在执行explain extended sql，得到优化结果，show warnings显示优化后的结果sql.
<!-- more -->
## 索引基数

**基数**是**数据列所包含的不同值的数量**，例如，某个数据列包含值 1、3、7、4、7、3，那么它的基数就是 4。索引的基数相对于数据表行数较高（也就是说，列中包含很多不同的值，重复的值很少）的时候，它的工作效果最好。如果某数据列含有很多不同的年龄，索引会很快地分辨数据行；如果某个数据列用于记录性别（只有“M”和“F”两种值），那么索引的用处就不大；如果值出现的几率几乎相等，那么无论搜索哪个值都可能得到一半的数据行。在这些情况下，最好根本不要使用索引，因为查询优化器发现某个值出现在表的数据行中的百分比很高的时候，它一般会忽略索引，进行全表扫描。惯用的百分比界线是“30%”。

## 索引失效原因

索引失效的原因有如下几点：

- 对索引列运算，运算包括（+、-、*、/、！、<>、%、like'%_'（% 放在前面）。
- 类型错误，如字段类型为 varchar，where 条件用 number。
- 对索引应用内部函数，这种情况下应该要建立基于函数的索引。例如 select * from template t where ROUND (t.logicdb_id) = 1，此时应该建 ROUND (t.logicdb_id) 为索引。

MySQL 8.0 开始支持函数索引，5.7 可以通过虚拟列的方式来支持，之前只能新建一个 ROUND (t.logicdb_id) 列然后去维护。

- 如果条件有 or，即使其中有条件带索引也不会使用（这也是为什么建议少使用 or 的原因），如果想使用 or，又想索引有效，只能将 or 条件中的每个列加上索引。
- 如果列类型是字符串，那一定要在条件中数据使用引号，否则不使用索引。
- **B-tree 索引 is null 不会走，is not null 会走，位图索引 is null，is not null 都会走**。
- **组合索引**遵循**最左原则**。

## 索引的建立

索引的建立需要注意以下几点：

- 最重要的肯定是根据业务经常查询的语句。

- 尽量选择区分度高的列作为索引，区分度的公式是 
  $$
  COUNT(DISTINCT空格col) / COUNT(*):表示字段不重复的比率，比率越大我们扫描的记录数就越少。
  $$

- 如果业务中唯一特性最好建立唯一键，一方面可以保证数据的正确性，另一方面索引的效率能大大提高。

## EXPLIAN 中有用的信息

EXPLIAN 基本用法如下：

- desc 或者 explain 加上你的 SQL。
- explain extended 加上你的 SQL，然后通过 show warnings 可以查看实际执行的语句，这一点也是非常有用的，很多时候不同的写法经 SQL 分析后，实际执行的代码是一样的。

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190703164516.png)

## 提高性能的特性

EXPLIAN 提高性能的特性如下：

- 索引覆盖(covering index)：需要查询的数据在索引上都可以查到**不需要回表 EXTRA** 列显示 using index。
- ICP特性(Index Condition Pushdown)：本来 index 仅仅是 data access 的一种访问模式，存数引擎通过索引回表获取的数据会传递到 MySQL Server 层进行 where 条件过滤。

5.6 版本开始当 ICP 打开时，如果部分 where 条件能使用索引的字段，MySQL Server 会把这部分下推到引擎层，可以利用 index 过滤的 where 条件在存储引擎层进行数据过滤。

EXTRA 显示 using index condition。需要了解 MySQL 的架构图分为 Server 和存储引擎层。

- 索引合并(index merge)：对多个索引分别进行条件扫描，然后将它们各自的结果进行合并(intersect/union)。

一般用 or 会用到，如果是 AND 条件，考虑建立复合索引。EXPLAIN 显示的索引类型会显示 index_merge，EXTRA 会显示具体的合并算法和用到的索引。

## Extra字段

Extra 字段使用：

- using filesort：说明 MySQL 会对数据使用一个外部的索引排序，而不是按照表内的索引顺序进行读取。

MySQL 中无法利用索引完成的排序操作称为“文件排序”，其实不一定是文件排序，内部使用的是快排。

- using temporary：使用了临时表保存中间结果，MySQL 在对查询结果排序时使用临时表。常见于排序 order by 和分组查询 group by。
- using index：表示相应的 SELECT 操作中使用了覆盖索引（Covering Index），避免访问了表的数据行，效率不错。
- impossible where：where 子句的值总是 false，不能用来获取任何元组。
- select tables optimized away：在没有 group by 子句的情况下基于索引优化 MIN/MAX 操作或者对于 MyISAM 存储引擎优化 COUNT(*) 操作，不必等到执行阶段再进行计算，查询执行计划生成的阶段即完成优化。
- distinct：优化 distinct 操作，在找到第一匹配的元组后即停止找同样值的操作。

**using filesort、using temporary** 这两项出现时需要注意下，这两项是十分耗费性能的

在使用 group by 的时候，虽然没有使用 order by，如果没有索引，是可能同时出现 using filesort，using temporary 的。因为 group by 就是先排序在分组，如果没有排序的需要，可以加上一个 **order by NULL** 来避免排序，这样 using filesort 就会去除，能提升一点性能。

## type字段

- system：表只有一行记录（等于系统表），这是 const 类型的特例，平时不会出现。
- const：如果通过索引依次就找到了，const 用于比较主键索引或者 unique 索引。因为只能匹配一行数据，所以很快。如果将主键置于 where 列表中，MySQL 就能将该查询转换为一个常量。
- eq_ref：唯一性索引扫描，对于每个索引键，表中只有一条记录与之匹配。常见于主键或唯一索引扫描。
- ref：非唯一性索引扫描，返回匹配某个单独值的所有行。本质上也是一种索引访问，它返回所有匹配某个单独值的行，然而它可能会找到多个符合条件的行，所以它应该属于查找和扫描的混合体。
- range：只检索给定范围的行，使用一个索引来选择行。key 列显示使用了哪个索引，一般就是在你的 where 语句中出现 between、<、>、in 等的查询。

这种范围扫描索引比全表扫描要好，因为只需要开始于缩印的某一点，而结束于另一点，不用扫描全部索引。

- index：Full Index Scan ，index 与 ALL 的区别为 index 类型只遍历索引树，这通常比 ALL 快，因为索引文件通常比数据文件小。

也就是说虽然 ALL 和 index 都是读全表，但 index 是从索引中读取的，而 ALL 是从硬盘读取的。

- all：Full Table Scan，遍历全表获得匹配的行。

## 字段类型和编码

- MySQL 返回字符串长度

  CHARACTER_LENGTH(同CHAR_LENGTH)方法返回的是字符数，LENGTH 函数返回的是字节数，一个汉字三个字节。

- varchar 等字段建立索引长度计算语句

  select count(distinct left(test,5))/count(*) from table；越趋近 1 越好。

- MySQL 的 utf8

  MySQL 的 utf8 最大是 3 个字节不支持 emoji 表情符号，必须只用 utf8mb4。需要在 MySQL 配置文件中配置客户端字符集为 utf8mb4。

JDBC 的连接串不支持配置 characterEncoding=utf8mb4，最好的办法是在连接池中指定初始化 SQL。例如：hikari 连接池，其他连接池类似 spring . datasource . hikari . connection - init - sql =set names utf8mb4。否则需要每次执行 SQL 前都先执行 set names utf8mb4。

## MySQL 排序规则

一般使用 _bin 和 _genera_ci：

- utf8_genera_ci 不区分大小写，ci 为 case insensitive 的缩写，即大小写不敏感。
- utf8_general_cs 区分大小写，cs 为 case sensitive 的缩写，即大小写敏感，但是目前 MySQL 版本中已经不支持类似于 _genera_cs 的排序规则，直接使用 utf8_bin 替代。
- utf8_bin 将字符串中的每一个字符用二进制数据存储，区分大小写。

那么，同样是区分大小写，utf8_general_cs 和 utf8_bin 有什么区别？

- cs 为 case sensitive 的缩写，即大小写敏感；bin 的意思是二进制，也就是二进制编码比较。
- utf8_general_cs 排序规则下，即便是区分了大小写，但是某些西欧的字符和拉丁字符是不区分的，比如 ä=a，但是有时并不需要 ä=a，所以才有 utf8_bin。
- utf8_bin 的特点在于使用字符的二进制的编码进行运算，任何不同的二进制编码都是不同的，因此在 utf8_bin 排序规则下：ä<>a。

## SQL语句总结

### 常用但容易忘的

- 如果有主键或者唯一键冲突则不插入：insert ignore into。
- 如果有主键或者唯一键冲突则更新，注意这个会影响自增的增量：INSERT INTO room_remarks(room_id,room_remarks)VALUE(1,"sdf") ON DUPLICATE KEY UPDATE room_remarks = "234"。
- 如果有就用新的替代，values 如果不包含自增列，自增列的值会变化：REPLACE INTO room_remarks(room_id,room_remarks) VALUE(1,"sdf")。
- 备份表：CREATE TABLE user_info SELECT * FROM user_info。
- 复制表结构：CREATE TABLE user_v2 LIKE user。
- 从查询语句中导入：INSERT INTO user_v2 SELECT * FROM user 或者 INSERT INTO user_v2(id,num) SELECT id,num FROM user。
- 连表更新：UPDATE user a, room b SET a.num=a.num+1 WHERE a.room_id=b.id。
- 连表删除：DELETE user FROM user,black WHERE user.id=black.id。

### 锁相关

锁相关(作为了解，很少用)：

- 共享锁：select id from tb_test where id = 1 lock in share mode。
- 排它锁：select id from tb_test where id = 1 for update。

### 优化时用到

- 强制使用某个索引：select * from table force index(idx_user) limit 2。
- 禁止使用某个索引：select * from table ignore index(idx_user) limit 2。
- 禁用缓存(在测试时去除缓存的影响)：select SQL_NO_CACHE from table limit 2。

### 查看状态

- 查看字符集：SHOW VARIABLES LIKE 'character_set%'。
- 查看排序规则：SHOW VARIABLES LIKE 'collation%'。

### SQL编写注意

- where 语句的解析顺序是从右到左，条件尽量放 where 不要放 having。
- 采用延迟关联(deferred join)技术优化超多分页场景，比如 limit 10000,10,延迟关联可以避免回表。
- distinct 语句非常损耗性能，可以通过 group by 来优化。
- 连表尽量不要超过三个表。

## 踩坑

- 如果有自增列，truncate 语句会把自增列的基数重置为 0，有些场景用自增列作为业务上的 ID 需要十分重视。
- 聚合函数会自动滤空，比如 a 列的类型是 int 且全部是 NULL，则 SUM(a) 返回的是 NULL 而不是 0。
- MySQL 判断 null 相等不能用 “a=null”，这个结果永远为 UnKnown，where 和 having 中，UnKnown 永远被视为 false，check 约束中，UnKnown 就会视为 true 来处理。所以要用“a is null”处理。

千万大表在线修改MySQL 在表数据量很大的时候，如果修改表结构会导致锁表，业务请求被阻塞。MySQL 在 5.6 之后引入了在线更新，但是在某些情况下还是会锁表，所以一般都采用 PT 工具( Percona Toolkit)。如对表添加索引：

```sql
pt-online-schema-change --user='root' --host='localhost' --ask-pass --alter "add index idx_user_id(room_id,create_time)" 

D=fission_show_room_v2,t=room_favorite_info --execute

```

- 慢查询日志

有时候如果线上请求超时，应该去关注下慢查询日志，慢查询的分析很简单，先找到慢查询日志文件的位置，然后利用 mysqldumpslow 去分析。

查询慢查询日志信息可以直接通过执行 SQL 命令查看相关变量，常用的 SQL 如下：

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190703165642.png)

mysqldumpslow 的工具十分简单，我主要用到的参数如下：

- **-t：**限制输出的行数，我一般取前十条就够了。
- **-s：**根据什么来排序默认是平均查询时间 at，我还经常用到 c 查询次数，因为查询次数很频繁但是时间不高也是有必要优化的，还有 t 查询时间，查看那个语句特别卡。
- **-v：**输出详细信息。

例子：mysqldumpslow -v -s t -t 10 mysql_slow.log.2018-11-20-0500。

- 一些数据库性能的思考

  在对公司慢查询日志做优化的时候，很多时候可能是忘了建索引，像这种问题很容易解决，加个索引就行了。但是有几种情况就不是简单加索引能解决了 

  **业务代码循环读数据库**

  ​	考虑这样一个场景，获取用户粉丝列表信息，加入分页是十个，其实像这样的 SQL 是十分简单的，通过连表查询性能也很高。

  ​	但是有时候，很多开发采用了取出一串 ID，然后循环读每个 ID 的信息，这样如果 ID 很多对数据库的压力是很大的，而且性能也很低。

  **统计 SQL**

  ​	很多时候，业务上都会有排行榜这种，发现公司有很多地方直接采用数据库做计算，在对一些大表做聚合运算的时候，经常超过五秒，这些 SQL 一般很长而且很难优化。像这种场景，如果业务允许（比如一致性要求不高或者是隔一段时间才统计的），可以专门在从库里面做统计。另外我建议还是采用 Redis 缓存来处理这种业务。

  **超大分页**

  ​	在慢查询日志中发现了一些超大分页的慢查询如 Limit 40000，1000，因为 MySQL 的分页是在 Server 层做的，可以采用延迟关联在减少回表。但是看了相关的业务代码正常的业务逻辑是不会出现这样的请求的，所以很有可能是有恶意用户在刷接口，最好在开发的时候也对接口加上校验拦截这些恶意请求。