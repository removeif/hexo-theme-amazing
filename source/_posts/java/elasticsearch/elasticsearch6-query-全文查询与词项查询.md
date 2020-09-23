---
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620152744.png
title: elasticsearch6 query 全文查询与词项查询
uniqueId: elasticsearch6-query-全文查询与词项查询.html
toc: true
date: 2018-11-13 09:02:07
tags: [elasticsearch6,query]
categories: [java,elasticsearch6]
---

# query  
## 全文查询
1. QueryBuilders.matchQuery("filed","value").operator(Operator.AND); // 对查询的语句进行分词，分词后的词任意一个匹配doc都能查出来 `term query` 查询的是词项<分词后的>  `（eg：Java编程思想） Java编程   term query 不能查到 分词后变成（Java 编程 思想） matchQuery能查到`
2. QueryBuilders.matchPhraseQuery("field","value");  
对value进行分词，可以自定义`分词器`,满足两个条件才能被搜到：
    - 分词后的所有词项都要匹配原字段
    - 顺序还需要一致
<!-- more -->
3. QueryBuilders.matchPhrasePrefixQuery("field","value");
与`matchPhraseQuery`类似,最后一个term支持前缀匹配  
eg.`matchPhraseQuery` 查 **"hello word"** `matchPhrasePrefixQuery`只需要查 **"hello w"**即可
4. QueryBuilders.multiMatchQuery("value","field1","field2");  多字段支持查询，字段可以使用通配符`eg,{"中国","tit*","wor?"}`
5. QueryBuilders.commonTermsQuery("哇","hehe");
通用查询，会自动分词为低频和高频项，先查低频，可以控制低频、高频出现概率 `eg.the word` `the`就是高频 ，可以先查 `word`
6. QueryBuilders.queryStringQuery("");
支持lucene查询语法
7. QueryBuilders.simpleQueryStringQuery("");
支持lucene查询语法，具有非常完善的语法查询，解析过程中出现异常不会抛错
8. QueryBuilders.matchAllQuery();
查所有和不写同样效果

## 词项查询
1. term query 词项检索
2. terms query 词项检索，可以多个词项，查到一个都能匹配结果
3. range query 查询范围内的
    * gt 大于
    * gte 大于等于
    * lt 小于
    * lte 小于等于
4. exist query 查询会返回字段中至少有一个非空`空字符串也返回`的doc 
5. prefix query 查询字段中给定前缀的文档 `eg.{"title":"hel"}`
6. wildcard query 查询字段通配符`eg."{"title":"hell?/ *ell*"}`
7. regexp query 正则匹配查询`eg.{"title":"W[0-9].+"}`
8. fuzzy query 模糊查询，最接近的查询，单词拼错一个字母的时候，`消耗资源多`
9. type query 指定类型的文档
10. ids query 查询具有指定id的文档