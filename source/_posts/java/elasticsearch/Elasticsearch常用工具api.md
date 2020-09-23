---
title: Elasticsearch常用工具api
categories: [java,elasticsearch6]

toc: true
keywords: java
date: 2019-04-26 17:11:12
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/20190620160330.png
tags: elasticsearch6
---
> 摘要
**Elasticsearch** 是一个高度可扩展且开源的全文检索和分析引擎。它可以让您快速且近实时地存储，检索以及分析海量数据。它通常用作那些具有复杂搜索功能和需求的应用的底层引擎或者技术。

<!-- more -->

下面是 **Elasticsearch** 一些简单的使用案例 :

- 您运行一个可以让您顾客来搜索您所售产品的在线的网络商店。在这种情况下，您可以使用 **Elasticsearch** 来存储您的整个产品的目录和库存，并且为他们提供搜索和自动完成的建议。
- 您想要去收集日志或交易数据，并且您还想要去分析和挖掘这些数据以来找出趋势，统计，概述，或者异常现。在这种情况下，您可以使用 **Logstash**（**Elasticsearch**/**Logstash**/**Kibana** 技术栈中的一部分）来收集，聚合，以及解析数据，然后让 **Logstash** 发送这些数据到 **Elasticsearch**。如果这些数据存在于 **Elasticsearch** 中，那么您就可以执行搜索和聚合以挖掘出任何您感兴趣的信息。
- 您运行一个价格警告平台，它允许客户指定精确的价格，如“我感兴趣的是购买指定的电子产品，如果任何供应商该产品的价格在未来一个月内低于 **$X** 这个价钱的话我应该被通知到”。在这种情况下，您可以收集供应商的价格，推送它们到 **Elasticsearch** 中去，然后使用 **reverse-search**（**Percolator**）（反向搜索（过滤器））功能以匹配客户查询价格的变动，最后如果发现匹配成功就给客户发出通知。
- 您必须分析/商业智能的需求，并希望快速的研究，分析，可视化，并且需要 **ad-hoc**（即席查询）海量数据（像数百万或者数十亿条记录）上的质疑。在这种情况下，您可以使用 **Elasticsearch** 来存储数据，然后使用 **Kibana**（**Elasticsearch**/**Logstash**/**Kibana** 技术栈中的一部分）以建立一个能够可视化的对您很重要的数据方面的定制的 **dashboards**（面板）。此外，您还可以使用 **Elasticsearch** 的聚合功能对您的数据执行复杂的商业智能查询

对于本教程的其余部分，我将引导您完成 **Elasticsearch** 的启动和运行的过程，同时了解其原理，并执行像 **indexing**（索引），**searching**（查询）和 **modifing**（修改）数据的基础操作。在本教程的最后一部分，您应该可以清楚的了解到 **Elasticsearch** 是什么，它是如何工作的，并有希望获得启发。看您如何使用它来构建复杂的搜索应用程序或者从数据中挖掘出想要的信息。

常用实例

```json
# 常用kibana脚本(可以自动填充，比较好用)
PUT /test_business/data/1 #更改数据
{
  "name":"zhe"
}

}

POST _analyze #实时分词
{
  "text": "张月超",
  "analyzer": "ik_max_word"
}

DELETE /analyze_index #删除索引
GET analyze_index/_settings #查看索引_settings

GET analyze_index/_mapping #查看索引_mapping

POST /analyze_index/data/_mapping #设置mapping
{
  "dynamic": "false",
  "properties": {
    "name": {
      "type": "text",
      "analyzer": "ik"
    }
  }
}

POST /analyze_index #设置settings
{
  "settings": {
    "index": {
      "analysis": {
        "normalizer": {
          "case_insensitive_normalizer": {
            "type": "custom",
            "filter": "lowercase"
          }
        },
        "filter": {
          "my_synonym": {
            "type": "synonym",
            "synonyms_path": "analysis-ik/extra/synonyms.dic"
          }
        },
        "analyzer": {
          "ik": {
            "filter": [
              "my_synonym"
            ],
            "char_filter": [
              "my_char_mapper"
            ],
            "type": "custom",
            "tokenizer": "ik_max_word"
          }
        },
        "char_filter": {
          "my_char_mapper": {
            "type": "mapping",
            "mappings_path": "analysis-ik/extra/pre_filter_mapping.dic"
          }
        }
      }
    }
  },
  "mapping": {
    "data": {
      "properties": {
        "name": {
          "type": "text",
          "analyzer": "ik"
        }
      }
    }
  }
}


GET /es_test_analyzer/_settings

GET /es_test_analyzer/_mapping

GET /analyze_index/data/1

POST /es_test_analyzer/_analyze
{
  "text": "超越",
  "analyzer": "ik_max_word"
}

POST /es_test_analyzer/data/1
{
  "name": "张月超666哈哈张月超",
  "nick_name":"张月超666哈哈张月超"
}

POST /es_test_analyzer/data/2
{
  "name": "王月",
  "nick_name":"王月"
}


POST /es_test_analyzer/data/3
{
  "name": "超越",
  "nick_name":"超越"
}

GET /es_test_analyzer/data/1

GET /es_test_analyzer/data/3/_termvectors?fields=nick_name # 查看索引中分词情况

GET /es_test_analyzer/data/_search
{
  "query": {
    "multi_match": {
      "query": "超越",
      "fields": [
        "nick_name"
      ],
      "analyzer": "ik", 
      "operator": "or", 
      "type": "best_fields"
    }
  },
  "highlight": {
    "fields": {
      "name": {
      }
    }
  }
}



DELETE /es_test_analyzer/

GET /analyze_index/data/_mapping

GET /test/data/_search
{
  "query": {
    "bool": {
      "should": [
        {
          "multi_match": {
            "query": "餐饮",
            "fields": ["title^2","tags"]
          }
        },{
          "wildcard": {
            "name": {
              "value": "*中国*"
            }
          }
        }
      ]
    }
  }
}

GET /user/data/9969/_explain # 查看详细id：9969 得分情况
{
  "query": {
        "bool": {
          "must": [
            {
              "multi_match": {
                "query": "tacos n frankies",
                "fields": [
                  "name^1.0",
                  "info^1.0"
                ],
                "type": "best_fields",
                "operator": "or",
                "analyzer": "ik_max_word",
                "slop": 0,
                "prefix_length": 0,
                "max_expansions": 50,
                "zero_terms_query": "NONE",
                "auto_generate_synonyms_phrase_query": true,
                "fuzzy_transpositions": true,
                "boost": 1
              }
            }
          "adjust_pure_negative": true,
          "boost": 1
        }
      }
      ,
  "highlight": {
    "fields": {
      "name": {},
      "info": {}
    }
  }
}

GET /user/data/_search
{
  "query": {
        "bool": {
          "must": [
            {
              "multi_match": {
                "query": "tacos n frankies",
                "fields": [
                  "name^1.0",
                  "info^1.0"
                ],
                "type": "best_fields",
                "operator": "or",
                "analyzer": "ik_max_word",
                "slop": 0,
                "prefix_length": 0,
                "max_expansions": 50,
                "zero_terms_query": "NONE",
                "auto_generate_synonyms_phrase_query": true,
                "fuzzy_transpositions": true,
                "boost": 1
              }
            }
          "adjust_pure_negative": true,
          "boost": 1
        }
      }
      ,
  "highlight": {
    "fields": {
      "name": {},
      "info": {}
    }
  }
}
```



1. 查看健康信息

> curl -XGET 'localhost:9200/_cat/health?v&pretty'

我们可以获得 **green**，**yellow**，或者 **red** 的 **status**。**Green** 表示一切正常（集群功能齐全）， **yellow** 表示所有数据可用，但是有些副本尚未分配（集群功能齐全），**red** 意味着由于某些原因有些数据不可用。注意，集群是 **red**，它仍然具有部分功能（例如，它将继续从可用的分片中服务搜索请求），但是您可能需要尽快去修复它，因为您已经丢失数据了。

2. 查看所有的索引

> curl -XGET 'localhost:9200/_cat/indices?v&pretty'



## Document APIS

### index api

1. 索引 **API** 在特定索引中 **add** ( 添加 ) 或 **update \*( 更新 ) \*a typed JSON document** ( 类型化的 **JSON** 文档 )，使其可搜索。以下示例将 **JSON** 文档插入到 **“twitter”** 索引中，**ID** 为**1** ：

```java
curl -XPUT 'localhost:9200/twitter/tweet/1?pretty' -H 'Content-Type: application/json' -d'
{
    "user" : "kimchy",
    "post_date" : "2009-11-15T14:12:12",
    "message" : "trying out Elasticsearch"
}
'
结果：
{
    "_shards" : {
        "total" : 2,
        "failed" : 0,
        "successful" : 2
    },
    "_index" : "twitter",
    "_type" : "tweet",
    "_id" : "1",
    "_version" : 1,
    "created" : true,
    "result" : created
}
```

- **total** - 指示应对多少 **shard copies \( 分片副本 )（ \primary** ( 主 )分片和 **replica** ( 副本 ) 分片）执行索引操作。
- **successful** - 表示索引操作成功的分片副本的数量。
- **failed** - 在索引操作在副本碎片上失败的情况下包含与复制相关的错误的数组。

当索引操作 **successful** 返回时，可能不会全部启动副本碎片（默认情况下，只需要主索引，但可以更改此行为）。在这种情况下， **total** 将等于基于 **number_of_replicas** 设置的总分片，并且 **successful** 将等于已启动的分片数（主副本和副本）。如果没有失败， **failed** 将是 0 。

### get api

**get api** 允许从一个基于其id的 **index** 中获取一个 JSON格式的 **document**，下面的示例是从一个在名称为tweet的 **type \下的id为1，名称为twitter的 \index \中获取一个JSON格式的 \document**。

```java
curl -XGET 'http://localhost:9200/twitter/tweet/1'
```

### update api

```java
# 更新api 
PUT test/type1/1
{
    "counter" : 1,
    "tags" : ["red"]
}
# 脚本更新
POST test/type1/1/_update
{
    "script" : {
        "inline": "ctx._source.counter += params.count",
        "lang": "painless",
        "params" : {
            "count" : 4
        }
    }
}

# 将新字段添加到文档：
POST test/type1/1/_update
{
    "script" : "ctx._source.new_field = \"value_of_new_field\""
}

# 删除字段
POST test/type1/1/_update
{
    "script" : "ctx._source.remove(\"new_field\")"
}
# 甚至可以改变已执行的操作。这个例子就是删除文档，如果 tags包含 green，否则就什么也不做（noop）：
POST test/type1/1/_update
{
    "script" : {
        "inline": "if (ctx._source.tags.contains(params.tag)) { ctx.op = \"delete\" } else { ctx.op = \"none\" }",
        "lang": "painless",
        "params" : {
            "tag" : "green"
        }
    }
}

```

### 通过查询api更新

```java
POST twitter/_update_by_query
{
  "script": {
    "inline": "ctx._source.likes++",
    "lang": "painless"
  },
  "query": {
    "term": {
      "user": "kimchy"
    }
  }
}
```

### bulk api

Bulk API，能够在一个单一的API调用执行多项索引/删除操作。这可以大大提高索引速度。

该 REST API 端点`/_bulk`，它遵循JSON结构：

```java
action_and_meta_data\n
optional_source\n
action_and_meta_data\n
optional_source\n
....
action_and_meta_data\n
optional_source\n
```

注意：数据的最终行必须以换行符结束`\n`。

可能的操作有 `index`，`create`，`delete`和 `update`， `index 和 ``create`期望在下一行的作为源，并与索引 API 有相同的语义。（如果文件具有相同的索引和类型的文件已经存在，就会创建失败，必要时候而索引回添加或替换文件）。`delete`不会作为下一行的源，并与 delete API 中具有相同的语义。`update 是希望`部分文档，upsert 和脚本及其选项能够在下一行指定。

### delete api

delete API允许基于指定的ID来从索引库中删除一个JSON文件。下面演示了从一个叫`twitter`的索引库的`tweet`type下删除文档，`id`是`1`:

```java
$ curl -XDELETE 'http://localhost:9200/twitter/tweet/1' 
```

索引的每个文档都被标记了版本。当删除文档时， 可以通过指定`version`来确保我们试图删除一个实际上已被删除的文档时，它在此期间并没有改变。在文档中执行的每个写入操作，包括删除，都会使其版本递增。

### delete by query api

最简单的用法是使用`_delete_by_query`对每个查询匹配的文档执行删除。这是API:

```java
POST twitter/_delete_by_query
{
  "query": { //①
    "match": {
      "message": "some message"
    }
  }
} 
```

### term vectors

返回有关特定文档字段中的词条的信息和统计信息。文档可以存储在索引中或由用户人工提供。词条向量默认为[实时](https://aqlu.gitbooks.io/elasticsearch-reference/content/Document_APIS/Get_API.html#realtime)，不是近实时。这可以通过将`realtime`参数设置为`false`来更改。

```java
GET /twitter/tweet/1/_termvectors 
```

可选的，您可以使用`url`中的参数指定检索信息的字段：

```java
GET /twitter/tweet/1/_termvectors?fields=message 
```



## search

### query api

结果的分页可以通过使用 from 和 size 参数来完成。 from 参数定义了您要提取的第一个结果的偏移量。 size 参数允许您配置要返回的最大匹配数。

虽然 from 和 size 可以设置为请求参数，但它们也可以在搜索正文中设置。from 默认值为 0，size 默认为 10。

```
GET /_search
{
    "from" : 0, "size" : 10,
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}
```

注意 from + size 不能超过 index.max_result_window 索引设置，默认为 10,000。 有关深入滚动的更有效方法，请参阅 Scroll 或 Search After API。

### sort

排序选项可以有以下值：

| `asc` | 按升序排序 | | `desc` | 按倒序排序 |

在对 _score 进行排序时，该顺序默认为 desc，在对其他事物进行排序时默认为 asc。

Sort mode Option

Elasticsearch支持按数组或多值字段排序。 mode 选项控制选择用于对其所属文档进行排序的数组值。 mode 选项可以具有以下值：

| `min` | 选择最低值。 | | `max` | 选择最高值。 | | `sum` | 使用所有值的和作为排序值。 仅适用于基于数字的数组字段。 | | `avg` | 使用所有值的平均值作为排序值。 仅适用于基于数字的数组字段。 | | `median` | 使用所有值的中值作为排序值。 仅适用于基于数字的数组字段。 |

Elasticsearch 还支持根据一个或多个嵌套对象内的字段进行排序。 通过嵌套字段支持进行的排序在已经存在的排序选项之上具有以下参数：

nested_path 定义要排序的嵌套对象。 实际排序字段必须是此嵌套对象内的直接字段。 当通过嵌套字段排序时，此字段是必需的。

nested_filter

嵌套路径中的内部对象应与其匹配的过滤器，以便通过排序考虑其字段值。 常见的情况是在嵌套的过滤器或查询中重复查询/过滤。 默认情况下，没有 nested_filter 是激活的。

Nested sorting example

在下面的示例中，offer是一个类型为嵌套的字段。 需要指定nested_path; 否则，elasticsearch不知道需要捕获哪个嵌套级排序值。

```java
POST /_search
{
   "query" : {
      "term" : { "product" : "chocolate" }
   },
   "sort" : [
       {
          "offer.price" : {
             "mode" :  "avg",
             "order" : "asc",
             "nested_path" : "offer",
             "nested_filter" : {
                "term" : { "offer.color" : "blue" }
             }
          }
       }
    ]
}
```

当通过脚本排序和按地理距离排序时，也支持嵌套排序。

**Missing Values**

缺少的参数指定应如何处理缺少字段的文档：缺少的值可以设置为 *last，*first 或自定义值（将用于缺少文档作为排序值）。

```
GET /_search
{
    "sort" : [
        { "price" : {"missing" : "_last"} }
    ],
    "query" : {
        "term" : { "product" : "chocolate" }
    }
}
```

Note：如果嵌套的内部对象与 nested_filter 不匹配，则使用缺少的值。

**Geo Distance Sorting**

允许按 *geo*distance 排序。 下面是一个例子，假设 pin.location 是一个类型为 geo_point 的字段：

```
GET /_search
{
    "sort" : [
        {
            "_geo_distance" : {
                "pin.location" : [-70, 40],
                "order" : "asc",
                "unit" : "km",
                "mode" : "min",
                "distance_type" : "sloppy_arc"
            }
        }
    ],
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}
```

**distance_type**

如何计算距离。 可以是 sloppy_arc（默认），弧（稍微更精确但显着更慢）或平面（更快，但不准确在长距离和接近极点）。 **mode** 如果字段有多个地理点，该怎么办。 默认情况下，按升序排序时考虑最短距离，按降序排序时最长距离。 支持的值为 min，max，median 和 avg。 **unit** 计算排序值时使用的单位。 默认值为 m（米）。

geo distance sorting 不支持可配置的缺失值：当文档没有用于距离计算的字段的值时，距离将始终被视为等于 Infinity。

在提供坐标时支持以下格式：

### highlighting

允许突出显示一个或多个字段的搜索结果。 实现使用 lucene 普通荧光笔，快速向量荧光笔（fvh）或 postings 荧光笔。 以下是一个搜索请求正文的示例：

```
GET /_search
{
    "query" : {
        "match": { "user": "kimchy" }
    },
    "highlight" : {
        "fields" : {
            "content" : {}
        }
    }
}
```

在上述情况下，内容字段将为每个搜索命中突出显示（每个搜索命中内将有另一个元素，称为突出显示，其中包括突出显示的字段和突出显示的片段）。

Note：

为了执行突出显示，需要字段的实际内容。 如果有问题的字段被存储（在映射中存储设置为 true），它将被使用，否则，实际的 _source 将被加载，并且相关字段将从中提取。

_all 字段不能从 _source 中提取，因此它只能用于突出显示，如果它映射到将 store 设置为 true。

字段名称支持通配符符号。 例如，使用 comment_ * 将导致所有与表达式匹配的文本和关键字字段（以及 5.0 之前的字符串）被突出显示。 请注意，所有其他字段将不会突出显示。 如果您使用自定义映射器并要在字段上突出显示，则必须显式提供字段名称。

**Plain highlighte**(有多种类型选择、根据实际情况使用)

荧光笔的默认选择是普通类型，并使用Lucene荧光笔。 它试图在理解词重要性和短语查询中的任何词定位标准方面反映查询匹配逻辑。

warning：

如果你想突出很多文档中的大量字段与复杂的查询，这个荧光笔不会快。 在努力准确地反映查询逻辑，它创建一个微小的内存索引，并通过 Lucene 的查询执行计划程序重新运行原始查询条件，以获取当前文档的低级别匹配信息。 这对于每个字段和需要突出显示的每个文档重复。 如果这在您的系统中出现性能问题，请考虑使用替代荧光笔。

### search type

**Query Then Fetch**

参数值： query_then_fetch。

请求分两个阶段处理。 在第一阶段，查询被转发到所有涉及的分片。 每个分片执行搜索并生成对该分片本地的结果的排序列表。 每个分片只向协调节点返回足够的信息，以允许其合并并将分片级结果重新排序为全局排序的最大长度大小的结果集。

在第二阶段期间，协调节点仅从相关分片请求文档内容（以及高亮显示的片段，如果有的话）。

Note：

如果您未在请求中指定 search_type，那么这是默认设置。

**Dfs, Query Then Fetch**

参数值：dfs_query_then_fetch

与 “Query Then Fetch” 相同，除了初始分散阶段，其计算分布项频率用于更准确的计分。

### scroll 游标(多数据深度分页问题解决)

从滚动请求返回的结果反映了进行初始搜索请求时索引的状态，如时间快照。 对文档（索引，更新或删除）的后续更改只会影响以后的搜索请求。

为了使用滚动，初始搜索请求应该在查询字符串中指定滚动参数，它告诉 Elasticsearch 应保持“搜索上下文”活动的时间（见保持搜索上下文），例如 ?scroll=1m。

```java
POST /twitter/tweet/_search?scroll=1m
{
    "size": 100,
    "query": {
        "match" : {
            "title" : "elasticsearch"
        }
    }
}
```

上述请求的结果包括一个 *scroll*id，它应该被传递给滚动 API，以便检索下一批结果。

```java
POST ①/_search/scroll ②
{
    "scroll" : "1m", ③
    "scroll_id" : "DXF1ZXJ5QW5kRmV0Y2gBAAAAAAAAAD4WYm9laVYtZndUQlNsdDcwakFMNjU1QQ==" ④
}
```

| ① | 可以使用GET或POST。 | | ② | 网址不应包含索引或类型名称 - 而是在原始搜索请求中指定的。 | | ③ | scroll 参数告诉 Elasticsearch 将搜索上下文打开另一个1m。 | | ④ | scroll_id参数 |

size 参数允许您配置每批结果返回的最大命中数。 每次调用 scroll API 都会返回下一批结果，直到没有更多结果要返回，即 hits 数组为空。

### explan

启用每次匹配对其评分计算方式的说明。

```java
GET /_search
{
    "explain": true,
    "query" : {
        "term" : { "user" : "kimchy" }
    }
}
```

## suggesters (共有四种方式)

- [Completion Suggester](https://elasticsearch.apachecn.org/#/docs/123)
- [Context Suggester](https://elasticsearch.apachecn.org/#/docs/124)
- [Phrase Suggester](https://elasticsearch.apachecn.org/#/docs/125)
- [Term suggester](https://elasticsearch.apachecn.org/#/docs/126)

###  completion suggester

完全（**completion**）**suggester** 提供自动完成/按需搜索功能。 这是一种导航功能，可在用户输入时引导用户查看相关结果，从而提高搜索精度。 它不是用于拼写校正或平均值功能，如术语或短语 **suggesters **。

理想地，自动完成功能应当与用户键入的速度一样快，以提供与用户已经键入的内容相关的即时反馈。因此，完成 **suggester** 针对速度进行优化。 **suggester** 使用允许快速查找的数据结构，但是构建成本高并且存储在存储器中。

要使用此功能，请为此字段指定一个特殊映射，为快速完成的字段值编制索引。

```java
PUT music
{
    "mappings": {
        "song" : {
            "properties" : {
                "suggest" : {
                    "type" : "completion"
                },
                "title" : {
                    "type": "keyword"
                }
            }
        }
    }
}
```

映射支持以下参数：

**analyzer**

使用索引分析器，默认为简单。 如果你想知道为什么我们没有选择标准分析器：我们尝试在这里很容易理解的行为，如果你索引字段内容在Drive-in，你不会得到任何建议， （第一个非停用词）

**search_analyzer**

要使用的搜索分析器，默认为分析器的值。

**preserve_separators**

保留分隔符，默认为true。 如果禁用，你可以找到一个以Foo Fighters开头的字段，如果你推荐foof。

**preserve_position_increments**

启用位置增量，默认为true。 如果禁用和使用停用分析器，您可以得到一个字段从披头士开始，如果你 suggest b。 注意：你也可以通过索引两个输入，Beatles和披头士，不需要改变一个简单的分析器，如果你能够丰富你的数据。

**max_input_length**

限制单个输入的长度，默认为50个UTF-16代码点。 此限制仅在索引时使用，以减少每个输入字符串的字符总数，以防止大量输入膨胀底层数据结构。 大多数用例不会受默认值的影响，因为前缀完成很少超过前缀长度超过少数几个字符。

**索引**

您像任何其他字段一样索引 **suggestion** 。 **suggestion** 由输入和可选的权重属性组成。 输入是要由 **suggestion** 查询匹配的期望文本，并且权重确定如何对 **suggestion** 进行评分。 索引 **suggestion** 如下：

```
PUT music/song/1?refresh
{
    "suggest" : {
        "input": [ "Nevermind", "Nirvana" ],
        "weight" : 34
    }
}
```

以下参数被支持：

**input**

输入存储，这可以是字符串数组或只是一个字符串。 此字段是必填字段。

**weight**

正整数或包含正整数的字符串，用于定义权重并允许对 **suggestions** 进行排名。 此字段是可选的。

**查询**

**suggest** 像往常一样工作，除了您必须指定 **suggest** 类型为完成。 **suggestions** 接近实时，这意味着可以通过刷新显示新 **suggestions** ，并且一旦删除就不会显示文档。 此请求：

```
POST music/_suggest?pretty
{
    "song-suggest" : {
        "prefix" : "nir",
        "completion" : {
            "field" : "suggest"
        }
    }
}
```

返回这个响应：

```
{
  "_shards" : {
    "total" : 5,
    "successful" : 5,
    "failed" : 0
  },
  "song-suggest" : [ {
    "text" : "nir",
    "offset" : 0,
    "length" : 3,
    "options" : [ {
      "text" : "Nirvana",
      "_index": "music",
      "_type": "song",
      "_id": "1",
      "_score": 1.0,
      "_source": {
        "suggest": ["Nevermind", "Nirvana"]
      }
    } ]
  } ]
}
```

**模糊查询**

完成 **suggester** 还支持模糊查询 - 这意味着，您可以在搜索中输入错误，并仍然返回结果。

```
POST music/_suggest?pretty
{
    "song-suggest" : {
        "prefix" : "nor",
        "completion" : {
            "field" : "suggest",
            "fuzzy" : {
                "fuzziness" : 2
            }
        }
    }
}
```

与查询前缀共享最长前缀的 **suggestion** 将得分更高。

模糊查询可以采用特定的模糊参数。 支持以下参数：

| **fuzziness** | 模糊系数，默认为AUTO。 有关允许的设置，请参阅 [“Fuzzinessedit”一节](http://www.apache.wiki/pages/viewpage.action?pageId=4882851)。 | | **transpositions** | 如果设置为true，则换位计数为一个更改而不是两个，默认为true | | **min_length** | 返回模糊 **suggestions** 前的输入的最小长度，默认值3 | | **prefix_length** | 输入的最小长度（未针对模糊替代项进行检查）默认为1 | | **unicode_aware** | 如果为true，则所有度量（如模糊编辑距离，置换和长度）都以Unicode代码点而不是字节为单位。 这比原始字节稍慢，因此默认情况下设置为false。 |

如果你想坚持使用默认值，但仍然使用模糊，你可以使用 fuzzy：{}或fuzzy：true。

## Explan api

**Explain API** 计算查询和特定文档的分数说明。 这可以提供有用的反馈，无论文档是否匹配特定查询。

index 和 type 参数分别期望单个索引和单个类型。

### [用法](https://elasticsearch.apachecn.org/#/docs/130?id=%e7%94%a8%e6%b3%95)

完整查询示例：

```
GET /twitter/tweet/0/_explain
{
      "query" : {
        "match" : { "message" : "elasticsearch" }
      }
}
```

这将产生以下结果：

```
{
  "_index" : "twitter",
  "_type" : "tweet",
  "_id" : "0",
  "matched" : true,
  "explanation" : {
    "value" : 1.55077,
    "description" : "sum of:",
    "details" : [ {
      "value" : 1.55077,
      "description" : "weight(message:elasticsearch in 0) [PerFieldSimilarity], result of:",
      "details" : [ {
        "value" : 1.55077,
        "description" : "score(doc=0,freq=1.0 = termFreq=1.0\n), product of:",
        "details" : [ {
          "value" : 1.3862944,
          "description" : "idf(docFreq=1, docCount=5)",
          "details" : [ ]
        }, {
          "value" : 1.1186441,
          "description" : "tfNorm, computed from:",
          "details" : [
            { "value" : 1.0, "description" : "termFreq=1.0", "details" : [ ] },
            { "value" : 1.2, "description" : "parameter k1", "details" : [ ] },
            { "value" : 0.75, "description" : "parameter b", "details" : [ ] },
            { "value" : 5.4, "description" : "avgFieldLength", "details" : [ ] },
            { "value" : 4.0, "description" : "fieldLength", "details" : [ ] }
          ]
        } ]
      } ]
    }, {
      "value" : 0.0,
      "description" : "match on required clause, product of:",
      "details" : [ {
        "value" : 0.0,
        "description" : "# clause",
        "details" : [ ]
      }, {
        "value" : 1.0,
        "description" : "_type:tweet, product of:",
        "details" : [
          { "value" : 1.0, "description" : "boost", "details" : [ ] },
          { "value" : 1.0, "description" : "queryNorm", "details" : [ ] }
        ]
      } ]
    } ]
  }
}
```

还有一种更简单的通过 q 参数指定查询的方法。 然后解析指定的 q 参数值，就像使用 query_string 查询一样。 在api中的 q 参数的用法示例：

```
GET /twitter/tweet/0/_explain?q=message:search
```

这将产生与先前请求相同的结果。

[参考资料](https://elasticsearch.apachecn.org/)