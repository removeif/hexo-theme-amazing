---
title: mysql-like模糊查询优化
toc: true
recommend: 1
keywords: categories-java mysql-like模糊查询优化
uniqueId: '2020-03-17 14:25:24/"mysql-like模糊查询优化".html'
date: 2020-03-17 22:25:24
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200317222901.png
tags: [mysql,like,模糊查询,like优化]
categories: [数据库,mysql]
---

### sql语句写法
一张表大概40万左右的数据，用**like模糊查询title**字段，很慢，title字段已经建立了索引，mysql 对 `someTitle%` 这样的模糊查询在有索引的前提下是很快的。
所以下面这两台sql语句差别就很大了 
$sql1 = "... title like someTitle%" (0.001秒)

$sql2 = "...... title like %someTitle%" (0.8秒) <!-- more -->

这两句的效率相差了800倍，这很可观啊。
所以我有个想法：在不用分词的方法的前提下，把存储的title字段，加一个特别的前缀，比如"im_prefix"，比如一条记录的title="我是标题党"，那么存储的时候就存储为"im_prefix我是标题党"。
这样一来，我们要模糊查找"标题党"这个关键词的时候，就把sql写成这样：
$sql1 = "...... title like im_prefix%标题党%" (花费0.001秒)，前台显示数据的时候，自然把取到的title过滤掉"im_prefix"这个前缀了。

在使用msyql进行模糊查询的时候，很自然的会用到like语句，通常情况下，在数据量小的时候，不容易看出查询的效率，但在数据量达到百万级，千万级的时候，查询的效率就很容易显现出来。这个时候查询的效率就显得很重要！ 

一般情况下like模糊查询的写法为（field已建立索引）： 

SELECT`column`FROM`table`WHERE`field`like'%keyword%';

上面的语句用explain解释来看，SQL语句并未用到索引，而且是全表搜索，如果在数据量超大的时候，可想而知最后的效率会是这样

对比下面的写法：

SELECT`column`FROM`table`WHERE`field`like'keyword%';

这样的写法用explain解释看到，SQL语句使用了索引，搜索的效率大大的提高了！

但是有的时候，我们在做模糊查询的时候，并非要想查询的关键词都在开头，所以如果不是特别的要求，"keywork%"并不合适所有的模糊查询

我在网上搜索时发现很多mysql函数用来解决这个问题，我测试出来的结果是跟like相比并没有任何优势。

1.LOCATE（'substr',str,pos）方法

SELECT`column`FROM`table`WHERELOCATE('keyword', `field`)>0

2.POSITION('substr' IN `field`)方法

SELECT`column`FROM`table`WHEREPOSITION('keyword'IN`filed`)

3.INSTR(`str`,'substr')方法

SELECT`column`FROM`table`WHEREINSTR(`field`,'keyword')>0

这几种方法都试过后，发现百万级别数据以上，时间是跟like差不多，并没有解决问题，因为都没走到索引。

这种情况下想要实现后几位模糊查询并且速度要快，在此我想了两个办法，一个是不需要mysql版本支持，一个需要mysql5.7版本以上

### 第一种方法：新增一列字段

新增一列字段，那个字段是你需要实现模糊查询的倒序，也就是原本是ABCD，那列字段就是DCBA

然后在那个字段添上索引

UPDATE tbl_ser_apply a set order_no_desc = REVERSE (SUBSTRING(a.order_no, -6))

ALTER TABLE `tbl_ser_apply` ADD INDEX order_no_desc ( `order_no_desc` )

我这边设的是后六位 也就是我把之前字段的后6位倒序后存入新的字段，也可以整个字段倒序后存入新的字段

```sql
select a.*,a1.id as id2,a1.order_no as orderNo2,a1.tran_amt as tranAmt2,a1.fee_amt as feeAmt2,a1.repayment_date_req as repaymentDateReq2

 ,a1.status as status2,a1.create_time as createTime2,a1.update_time as updateTime2

 from (

 select tsa.id,tsa.order_no as orderNo,tsa.repayment_date_req as repaymentDateReq,tsa.status,tsa.fee_state as feeState,tsa.repayment_flag as repaymentFlag,

 tsa.capital_return_flag as capitalReturnFlag,tsa.tran_amt as tranAmt,tsa.fee_amt as feeAmt,tsa.capital_returned_amont as capitalReturnedAmont,

 tsa.wait_amt as waitAmt,tsa.back_charge_amt as backChargeAmt,tsa.create_time as createTime,tui.real_name as realName,tui.mobile_no as mobileNo,

 tc.bank_card_no as bankCardNo,tmi.merchant_name as merchantName,tui.mer_no as merNo,tsa.reserved1 as reserved1,tsa.parent_id as parentId,tc.bank_name as bankName,tc.holder_name as holderName,

 tc.certificate_no as certificateNo

 from tbl_ser_apply as tsa LEFT JOIN tbl_user_info as tui on tsa.userid=tui.id LEFT JOIN tbl_merchant_inf as tmi on

 tmi.merchant_no=tui.mer_no LEFT JOIN tbl_cusinfo tc on tc.id=tsa.cusInf_id where tsa.order_no_desc like REVERSE('%372191')

 ORDER BY tsa.create_time desc ) a LEFT JOIN tbl_ser_apply a1 on a.parentId=a1.id

```

我的整个sql是这样的

实际上最后查询的时候是这样

where tsa.order_no_desc like REVERSE('%372191') 

需要修改sql和java代码，查询的是新增反向字段，而不是原来的字段

这样就能实现走索引

原来的sql不走索引的情况下查询出来需要20S，优化后只需要0.049S

**这种方法适合mysql5.7以下版本，这样能大大加快模糊查询速度，而且能到1000W以上应该都是没问题的**

### 第二种方法：虚拟列

需要mysql5.7以上版本支持，用到虚拟列的方法，原理跟上述方法一样

alter table tbl_ser_apply add column virtual_col varchar(20) as (REVERSE (SUBSTRING(tbl_ser_apply.order_no, -6)));

ALTER TABLE `tbl_ser_apply` ADD INDEX  virtual_col ( ` virtual_col` )

在MySQL 5.7中，支持两种Generated Column，即Virtual Generated Column和Stored Generated Column，前者只将Generated Column保存在数据字典中（表的元数据），并不会将这一列数据持久化到磁盘上；后者会将Generated Column持久化到磁盘上，而不是每次读取的时候计算所得。很明显，后者存放了可以通过已有数据计算而得的数据，需要更多的磁盘空间，与Virtual Column相比并没有优势，因此，MySQL 5.7中，不指定Generated Column的类型，默认是Virtual Column。 

如果需要Stored Generated Golumn的话，可能在Virtual Generated Column上建立索引更加合适

综上，一般情况下，都使用Virtual Generated Column，这也是MySQL默认的方式

语法：

 [ GENERATED ALWAYS ] AS (  ) [ VIRTUAL|STORED ]

[ UNIQUE [KEY] ] [ [PRIMARY] KEY ] [ NOT NULL ] [ COMMENT  ]

这样做比上一个方法好的地方是，不需要修改java代码，只需要修改很小一部分的sql语句即可，上一个方法其实实现后要修改的java代码要不少，而且每次新增修改删除时，都要加上这个字段的代码，而新增虚拟列的话，那一列的字段是自动添加修改，通过计算得出的，所以代码完全不需要修改，只需要修改操作原来字段的sql即可。

```sql
select a.*,a1.id as id2,a1.order_no as orderNo2,a1.tran_amt as tranAmt2,a1.fee_amt as feeAmt2,a1.repayment_date_req as repaymentDateReq2

 ,a1.status as status2,a1.create_time as createTime2,a1.update_time as updateTime2

 from (

 select tsa.id,tsa.order_no as orderNo,tsa.repayment_date_req as repaymentDateReq,tsa.status,tsa.fee_state as feeState,tsa.repayment_flag as repaymentFlag,

 tsa.capital_return_flag as capitalReturnFlag,tsa.tran_amt as tranAmt,tsa.fee_amt as feeAmt,tsa.capital_returned_amont as capitalReturnedAmont,

 tsa.wait_amt as waitAmt,tsa.back_charge_amt as backChargeAmt,tsa.create_time as createTime,tui.real_name as realName,tui.mobile_no as mobileNo,

 tc.bank_card_no as bankCardNo,tmi.merchant_name as merchantName,tui.mer_no as merNo,tsa.reserved1 as reserved1,tsa.parent_id as parentId,tc.bank_name as bankName,tc.holder_name as holderName,

 tc.certificate_no as certificateNo

 from tbl_ser_apply as tsa LEFT JOIN tbl_user_info as tui on tsa.userid=tui.id LEFT JOIN tbl_merchant_inf as tmi on

 tmi.merchant_no=tui.mer_no LEFT JOIN tbl_cusinfo tc on tc.id=tsa.cusInf_id where tsa.virtual_col like '372191%'

 ORDER BY tsa.create_time desc ) a LEFT JOIN tbl_ser_apply a1 on a.parentId=a1.id

```

经过我的测试后，原来不走索引是20S 用上一个方法是0.049s 用第二个方法的话是0.1S 虽然慢了0.05S 那是计算数据的时间，但这样的方案已经大大缩短了模糊查询时间，而且不需要修改java代码，个人推荐使用第二种！

参考文章:
[参考链接1](https://www.jianshu.com/p/9f83eebc8606)
[参考链接2](https://www.cnblogs.com/whyat/p/10512797.html)


