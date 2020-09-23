---
title: elasticsearch6.x倒排索引和分词
categories: [java,elasticsearch6]
uniqueId: elasticsearch6-x倒排索引和分词.html
toc: true
keywords: java,elasticsearch6,索引分词
date: 2019-05-06 15:36:55
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620155922.png
tags: 索引分词
---
> 摘要
倒排索引（Inverted Index）也叫反向索引，有反向索引必有正向索引。通俗地来讲，正向索引是通过key找value，反向索引则是通过value找key。
<!-- more -->




倒排索引（Inverted Index）也叫反向索引，有反向索引必有正向索引。通俗地来讲，正向索引是通过key找value，反向索引则是通过value找key。

### 倒排索引

- 正排索引：文档id到单词的关联关系
- 倒排索引：单词到文档id的关联关系

示例：
对以下三个文档去除停用词后构造倒排索引

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620155952.png)

#### 倒排索引-查询过程

查询包含“**搜索引擎**”的文档

1. 通过倒排索引获得“搜索引擎”对应的文档id列表，有1，3
2. 通过正排索引查询1和3的完整内容
3. 返回最终结果

#### 倒排索引-组成

- 单词词典（Term Dictionary）
- 倒排列表（Posting List）

#### 单词词典（Term Dictionary）

单词词典的实现一般用B+树，B+树构造的可视化过程网址: [B+ Tree Visualization](https://www.cs.usfca.edu/~galles/visualization/BPlusTree.html)

> 关于B树和B+树
>
> 1. [维基百科-B树](https://zh.wikipedia.org/wiki/B树)
> 2. [维基百科-B+树](https://zh.wikipedia.org/wiki/B%2B树)
> 3. [B树和B+树的插入、删除图文详解](https://www.cnblogs.com/nullzx/p/8729425.html)

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620160007.png)

#### 倒排列表（Posting List）

- 倒排列表记录了单词对应的文档集合，有倒排索引项（Posting）组成

- 倒排索引项主要包含如下信息：

  1. 文档id用于获取原始信息
  2. 单词频率（TF，Term Frequency），记录该单词在该文档中出现的次数，用于后续相关性算分
  3. 位置（Posting），记录单词在文档中的分词位置（多个），用于做词语搜索（Phrase Query）
  4. 偏移（Offset），记录单词在文档的开始和结束位置，用于高亮显示

  ![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620160026.png)

B+树**内部结点存索引，叶子结点存数据**，这里的 单词词典就是B+树索引，倒排列表就是数据，整合在一起后如下所示

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620160044.png)

ES存储的是一个JSON格式的文档，其中包含多个字段，每个字段会有自己的倒排索引

### 分词

分词是将文本转换成一系列单词（Term or Token）的过程，也可以叫文本分析，在ES里面称为Analysis

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620160102.png)

#### 分词器

分词器是ES中专门处理分词的组件，英文为Analyzer，它的组成如下：

- Character Filters：针对原始文本进行处理，比如去除html标签
- Tokenizer：将原始文本按照一定规则切分为单词
- Token Filters：针对Tokenizer处理的单词进行再加工，比如转小写、删除或增新等处理

分词器调用顺序

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620160121.png)

### [Analyze API](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis.html)

ES提供了一个可以测试分词的API接口，方便验证分词效果，endpoint是_analyze

- 可以直接指定analyzer进行测试

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620160140.png)

- 可以直接指定索引中的字段进行测试

```java
POST test_index/doc
{
  "username": "whirly",
  "age":22
}

POST test_index/_analyze
{
  "field": "username",
  "text": ["hello world"]
}
```

- 可以自定义分词器进行测试

```
POST _analyze
{
  "tokenizer": "standard",
  "filter": ["lowercase"],
  "text": ["Hello World"]
}
```

### [预定义的分词器](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-analyzers.html)

ES自带的分词器有如下：

- Standard Analyzer
  - 默认分词器
  - 按词切分，支持多语言
  - 小写处理
- Simple Analyzer
  - 按照非字母切分
  - 小写处理
- Whitespace Analyzer
  - 空白字符作为分隔符
- Stop Analyzer
  - 相比Simple Analyzer多了去除请用词处理
  - 停用词指语气助词等修饰性词语，如the, an, 的， 这等
- Keyword Analyzer
  - 不分词，直接将输入作为一个单词输出
- Pattern Analyzer
  - 通过正则表达式自定义分隔符
  - 默认是\W+，即非字词的符号作为分隔符
- Language Analyzer
  - 提供了30+种常见语言的分词器

示例：停用词分词器

```json
POST _analyze
{
  "analyzer": "stop",
  "text": ["The 2 QUICK Brown Foxes jumped over the lazy dog's bone."]
}
```

结果

```json
{
  "tokens": [
    {
      "token": "quick",
      "start_offset": 6,
      "end_offset": 11,
      "type": "word",
      "position": 1
    },
    {
      "token": "brown",
      "start_offset": 12,
      "end_offset": 17,
      "type": "word",
      "position": 2
    },
    {
      "token": "foxes",
      "start_offset": 18,
      "end_offset": 23,
      "type": "word",
      "position": 3
    },
    {
      "token": "jumped",
      "start_offset": 24,
      "end_offset": 30,
      "type": "word",
      "position": 4
    },
    {
      "token": "over",
      "start_offset": 31,
      "end_offset": 35,
      "type": "word",
      "position": 5
    },
    {
      "token": "lazy",
      "start_offset": 40,
      "end_offset": 44,
      "type": "word",
      "position": 7
    },
    {
      "token": "dog",
      "start_offset": 45,
      "end_offset": 48,
      "type": "word",
      "position": 8
    },
    {
      "token": "s",
      "start_offset": 49,
      "end_offset": 50,
      "type": "word",
      "position": 9
    },
    {
      "token": "bone",
      "start_offset": 51,
      "end_offset": 55,
      "type": "word",
      "position": 10
    }
  ]
}
```

### 中文分词

- 难点
  - 中文分词指的是将一个汉字序列切分为一个一个的单独的词。在英文中，单词之间以空格作为自然分界词，汉语中词没有一个形式上的分界符
  - 上下文不同，分词结果迥异，比如交叉歧义问题
- 常见分词系统
  - [IK](https://github.com/medcl/elasticsearch-analysis-ik)：实现中英文单词的切分，可自定义词库，支持热更新分词词典
  - [jieba](https://github.com/sing1ee/elasticsearch-jieba-plugin)：支持分词和词性标注，支持繁体分词，自定义词典，并行分词等
  - [Hanlp](https://github.com/hankcs/HanLP)：由一系列模型与算法组成的Java工具包，目标是普及自然语言处理在生产环境中的应用
  - [THUAC](https://github.com/microbun/elasticsearch-thulac-plugin)：中文分词和词性标注

#### 安装ik中文分词插件

```java
# 在Elasticsearch安装目录下执行命令，然后重启es
bin/elasticsearch-plugin install https://github.com/medcl/elasticsearch-analysis-ik/releases/download/v6.3.0/elasticsearch-analysis-ik-6.3.0.zip

# 如果由于网络慢，安装失败，可以先下载好zip压缩包，将下面命令改为实际的路径，执行，然后重启es
bin/elasticsearch-plugin install file:///path/to/elasticsearch-analysis-ik-6.3.0.zip
```

- ik测试 - ik_smart

```json
POST _analyze
{
  "analyzer": "ik_smart",
  "text": ["公安部：各地校车将享最高路权"]
}

# 结果
{
  "tokens": [
    {
      "token": "公安部",
      "start_offset": 0,
      "end_offset": 3,
      "type": "CN_WORD",
      "position": 0
    },
    {
      "token": "各地",
      "start_offset": 4,
      "end_offset": 6,
      "type": "CN_WORD",
      "position": 1
    },
    {
      "token": "校车",
      "start_offset": 6,
      "end_offset": 8,
      "type": "CN_WORD",
      "position": 2
    },
    {
      "token": "将",
      "start_offset": 8,
      "end_offset": 9,
      "type": "CN_CHAR",
      "position": 3
    },
    {
      "token": "享",
      "start_offset": 9,
      "end_offset": 10,
      "type": "CN_CHAR",
      "position": 4
    },
    {
      "token": "最高",
      "start_offset": 10,
      "end_offset": 12,
      "type": "CN_WORD",
      "position": 5
    },
    {
      "token": "路",
      "start_offset": 12,
      "end_offset": 13,
      "type": "CN_CHAR",
      "position": 6
    },
    {
      "token": "权",
      "start_offset": 13,
      "end_offset": 14,
      "type": "CN_CHAR",
      "position": 7
    }
  ]
}
```

- ik测试 - ik_max_word

```json
POST _analyze
{
  "analyzer": "ik_max_word",
  "text": ["公安部：各地校车将享最高路权"]
}

# 结果
{
  "tokens": [
    {
      "token": "公安部",
      "start_offset": 0,
      "end_offset": 3,
      "type": "CN_WORD",
      "position": 0
    },
    {
      "token": "公安",
      "start_offset": 0,
      "end_offset": 2,
      "type": "CN_WORD",
      "position": 1
    },
    {
      "token": "部",
      "start_offset": 2,
      "end_offset": 3,
      "type": "CN_CHAR",
      "position": 2
    },
    {
      "token": "各地",
      "start_offset": 4,
      "end_offset": 6,
      "type": "CN_WORD",
      "position": 3
    },
    {
      "token": "校车",
      "start_offset": 6,
      "end_offset": 8,
      "type": "CN_WORD",
      "position": 4
    },
    {
      "token": "将",
      "start_offset": 8,
      "end_offset": 9,
      "type": "CN_CHAR",
      "position": 5
    },
    {
      "token": "享",
      "start_offset": 9,
      "end_offset": 10,
      "type": "CN_CHAR",
      "position": 6
    },
    {
      "token": "最高",
      "start_offset": 10,
      "end_offset": 12,
      "type": "CN_WORD",
      "position": 7
    },
    {
      "token": "路",
      "start_offset": 12,
      "end_offset": 13,
      "type": "CN_CHAR",
      "position": 8
    },
    {
      "token": "权",
      "start_offset": 13,
      "end_offset": 14,
      "type": "CN_CHAR",
      "position": 9
    }
  ]
}
```

- ik两种分词模式ik_max_word 和 ik_smart 什么区别?
  - ik_max_word: 会将文本做最细粒度的拆分，比如会将“中华人民共和国国歌”拆分为“中华人民共和国,中华人民,中华,华人,人民共和国,人民,人,民,共和国,共和,和,国国,国歌”，会穷尽各种可能的组合；
  - ik_smart: 会做最粗粒度的拆分，比如会将“中华人民共和国国歌”拆分为“中华人民共和国,国歌”。

### 自定义分词

当自带的分词无法满足需求时，可以自定义分词，通过定义Character Filters、Tokenizer和Token Filters实现

#### [Character Filters](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-charfilters.html)

- 在Tokenizer之前对原始文本进行处理，比如增加、删除或替换字符等
- 自带的如下:
  - HTML Strip Character Filter：去除HTML标签和转换HTML实体
  - Mapping Character Filter：进行字符替换操作
  - Pattern Replace Character Filter：进行正则匹配替换
- 会影响后续tokenizer解析的position和offset信息

#### Character Filters测试

```json
POST _analyze
{
  "tokenizer": "keyword",
  "char_filter": ["html_strip"],
  "text": ["<p>I&apos;m so <b>happy</b>!</p>"]
}

# 结果
{
  "tokens": [
    {
      "token": """

I'm so happy!

""",
      "start_offset": 0,
      "end_offset": 32,
      "type": "word",
      "position": 0
    }
  ]
}
```

#### [Tokenizers](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-tokenizers.html)

- 将原始文本按照一定规则切分为单词（term or token）
- 自带的如下：
  - standard 按照单词进行分割
  - letter 按照非字符类进行分割
  - whitespace 按照空格进行分割
  - UAX URL Email 按照standard进行分割，但不会分割邮箱和URL
  - Ngram 和 Edge NGram 连词分割
  - Path Hierarchy 按照文件路径进行分割

#### Tokenizers 测试

```json
POST _analyze
{
  "tokenizer": "path_hierarchy",
  "text": ["/path/to/file"]
}

# 结果
{
  "tokens": [
    {
      "token": "/path",
      "start_offset": 0,
      "end_offset": 5,
      "type": "word",
      "position": 0
    },
    {
      "token": "/path/to",
      "start_offset": 0,
      "end_offset": 8,
      "type": "word",
      "position": 0
    },
    {
      "token": "/path/to/file",
      "start_offset": 0,
      "end_offset": 13,
      "type": "word",
      "position": 0
    }
  ]
}
```

#### [Token Filters](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis-tokenfilters.html)

- 对于tokenizer输出的单词（term）进行增加、删除、修改等操作
- 自带的如下：
  - lowercase 将所有term转为小写
  - stop 删除停用词
  - Ngram 和 Edge NGram 连词分割
  - Synonym 添加近义词的term

#### Token Filters测试

```json
POST _analyze
{
  "text": [
    "a Hello World!"
  ],
  "tokenizer": "standard",
  "filter": [
    "stop",
    "lowercase",
    {
      "type": "ngram",
      "min_gram": 4,
      "max_gram": 4
    }
  ]
}

# 结果
{
  "tokens": [
    {
      "token": "hell",
      "start_offset": 2,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "ello",
      "start_offset": 2,
      "end_offset": 7,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "worl",
      "start_offset": 8,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 2
    },
    {
      "token": "orld",
      "start_offset": 8,
      "end_offset": 13,
      "type": "<ALPHANUM>",
      "position": 2
    }
  ]
}
```

#### 自定义分词

自定义分词需要在索引配置中设定 char_filter、tokenizer、filter、analyzer等

自定义分词示例:

- 分词器名称：my_custom\
- 过滤器将token转为大写

```json
PUT test_index_1
{
  "settings": {
    "analysis": {
      "analyzer": {
        "my_custom_analyzer": {
          "type":      "custom",
          "tokenizer": "standard",
          "char_filter": [
            "html_strip"
          ],
          "filter": [
            "uppercase",
            "asciifolding"
          ]
        }
      }
    }
  }
}
```

```java
// java
XContentFactory.jsonBuilder()
                .startObject().startObject("analysis")
                .startObject("normalizer").startObject(Normalizers.CASE_INSENSITIVE)
                .field("type", "custom")
                .field("filter", "lowercase")
                .endObject().endObject()
   							
  							// 动态同义词
                .startObject("filter")
                .startObject("dynamic_synonym").field("type",    "dynamic_synonym").field("tokenizer", "ik_smart").endObject().endObject()


                .startObject("analyzer")
                // 自定义分词器
                .startObject("ik")
                .field("filter", "")
                .field("char_filter", Arrays.asList("char_mapper"))
                .field("type", "custom")
                .field("tokenizer", "ik_max_word")
                .endObject()
  
               // 搜索时处理同义词
                .startObject("ikt")
                .field("filter", Arrays.asList("dynamic_synonym"))
                .field("char_filter", Arrays.asList("char_mapper"))
                .field("type", "custom")
                .field("tokenizer", "ik_smart")
                .endObject()

                .endObject()
                // 自定义字符过滤
                .startObject("char_filter")
                .startObject("char_mapper")
                .field("type", "mapping")
                .field("mappings_path", "analysis/mapping.txt")
                .endObject()
                .endObject()

                .endObject().endObject();
```

#### 自定义分词器测试

```json
POST test_index_1/_analyze
{
  "analyzer": "my_custom_analyzer",
  "text": ["<p>I&apos;m so <b>happy</b>!</p>"]
}

# 结果
{
  "tokens": [
    {
      "token": "I'M",
      "start_offset": 3,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "SO",
      "start_offset": 12,
      "end_offset": 14,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "HAPPY",
      "start_offset": 18,
      "end_offset": 27,
      "type": "<ALPHANUM>",
      "position": 2
    }
  ]
}
```

#### 分词使用说明

分词会在如下两个时机使用：

- 创建或更新文档时(Index Time)，会对相应的文档进行分词处理
- 查询时（Search Time），会对查询语句进行分词
  - 查询时通过analyzer指定分词器
  - 通过index mapping设置search_analyzer实现
  - 一般不需要特别指定查询时分词器，直接使用索引分词器即可，否则会出现无法匹配的情况

#### 分词使用建议

- 明确字段是否需要分词，不需要分词的字段就将type设置为keyword，可以节省空间和提高写性能
- 善用_analyze API，查看文档的分词结果

[参考自](http://laijianfeng.org/2018/08/倒排索引与分词/)
