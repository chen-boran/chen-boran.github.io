---
title: Redis对象
date: 2021-11-14 18:09:11
tags:
- [Redis]
- ["学习笔记"]
categories:
 
keywords:
description:
top_img:
comments:
cover:
toc:
toc_number:
copyright:
copyright_author:
copyright_author_href:
copyright_url:
copyright_info:
mathjax:
katex:
aplayer:
highlight_shrink:
aside: 
---

# Redis对象

## 1. 对象的类型和编码

redis没使用之前提到的数据结构来构建键值对数据库

而是基于基本数据结构构建了包括字符串对象，列表对象，哈希对象，集合对象，有序集合对象五种类型对象的对象系统

使用对象的好处：根据类型判断给定命令是否能够执行；针对不同场景，设置对象的数据结构实现，优化使用效率；可以实现基于引用计数计数的内存回收，对象共享（节约内存）；

Redis使用两个对象分别表示数据库中的键和值

Redis中的每个对象都由一个redisObject结构表示，

该结构中和保存数据有关的三个属性分别是type、encoding、ptr

**一、类型**

对象的类型由type记录

![image-20211114185656361](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111141856669.png)

数据库中，键总是一个字符串对象，值则可以是五种对象中的一种。

称呼数据库键时一般都指的是键的值的类型：例如：列表键，指的是数据库键对应的值是列表对象

​	使用TYPE 返回 数据库键对应的值对象的类型

![image-20211114190455258](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111141904420.png)

**二，编码与底层实现**

 ptr指针指向对象的底层实现数据结构  

encoding属性记录了对象所使用的编码 

基本数据结构对应的编码

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111141908765.png" alt="image-20211114190813600" style="zoom:80%;" />

每种对象至少使用两种不同编码：

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111141909934.png" alt="image-20211114190904728" style="zoom:80%;" />

使用 **OBJECT Encoding**可以查看数据库键的值对象编码



下面逐个进行分析各个对象

## 2. 字符串对象

字符串对象的编码可以是int、raw或者embstr。

（int 编码是用来保存整数值，而embstr是用来保存短字符串，raw编码是用来保存长字符串）

最基本的数据结构；字符串的长度不能超过512M。

 **一，编码方式**

![image-20211114192207607](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111141922759.png)

**二、编码的转换**

当 int 编码保存的值不再是整数，或大小超过了long的范围时，自动转化为raw。

对于 embstr 编码，由于 Redis 没有对其编写任何的修改程序（embstr 是只读的），在对embstr对象进行修改时，都会先转化为raw再进行修改，因此，只要是修改embstr对象，修改后的对象一定是raw的，无论是否达到了44个字节

**三、命令的实现**

![image-20211114192013105](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111141920440.png)



## 3.列表对象

列表对象的编码可以是ziplist或者linkedlist。

列表对象的编码可以是ziplist或者linkedlist。

linkedlist编码的列表对象使用双端链表作为底层实现

**一、内存结构**：

![img](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111141923098.png)

**二、编码转换**

当列表对象同时满足以下两个条件，则使用ziplist编码（否则使用linkedlist）：

- 列表对象保存的所有字符串元素的长度都小于64字节；
- 列表对象保存的元素数量小于512个； 

**三、列表命令的实现**

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111141926743.png" alt="image-20211114192617413" style="zoom: 80%;" />



## 4.哈希对象

哈希对象的编码可以是ziplist或者hashtable。

ziplist编码的哈希对象使用压缩列表作为底层实现

hashtable编码的哈希对象使用字典作为底层实现

**一、内存结构**

![img](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111141929955.png)

**二、编码转换**

当哈希对象可以同时满足以下两个条件时，哈希对象使用ziplist编码（否则使用hashtable）：

- 哈希对象保存的所有键值对的键和值的字符串长度都小于64字节；
- 哈希对象保存的键值对数量小于512个 

注：第一个条件可以通过配置文件中的 `set-max-intset-entries` 进行修改。

**三、哈希命令的实现**

![image-20211114192848168](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111141928521.png)





## 5. 集合对象

集合对象的编码可以是intset或者hashtable。

intset编码的集合对象使用整数集合作为底层实现

intset编码的集合对象使用整数集合作为底层实现

**一、存储结构**

![img](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111141932020.png)

**二、编码转换**

编码的转换当集合对象可以同时满足以下两个条件时，对象使用intset编码：

- 集合对象保存的所有元素都是整数值

- 集合对象保存的元素数量不超过512个。

  注：第二个条件可以通过配置文件的 `set-max-intset-entries` 进行配置

**三、集合命令的实现**

![image-20211114193515168](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111141935439.png)

## 6. 有序集合对象

有序集合的编码可以是ziplist或者skiplist

ziplist编码的压缩列表对象使用压缩列表作为底层实现

**一、存储结构**

首先是编码为ZIPLIST时, 有序集合的内存布局如下

![img](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111141940209.png)



 编码为SKIPLIST时, 有序集合的内存布局如下

![img](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111141940445.png)

 **二、编码转换**

当有序集合对象同时满足以下两个条件时，对象使用 ziplist 编码：

1、保存的元素数量小于128；

2、保存的所有元素长度都小于64字节。

 以上两个条件也可以通过Redis配置文件`zset-max-ziplist-entries` 选项和 `zset-max-ziplist-value` 进行修改

**三、有序集合命令的实现**

![image-20211114193924211](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111141939509.png)

## 7. 类型检查和命令多态

Redis中用于操作键的命令可以分为两种类型。

其中一种命令可以对任何类型的键执行，

​	例如：DEL命令、EXPIRE命令、RENAME命令、TYPE命令、OBJECT命令等

另一种命令只能对特定类型的键执行 

- SET、GET、APPEND、STRLEN等命令只能对字符串键执行；

- HDEL、HSET、HGET、HLEN等命令只能对哈希键执行；

- RPUSH、LPOP、LINSERT、LLEN等命令只能对列表键执行；

- SADD、SPOP、SINTER、SCARD等命令只能对集合键执行；

- ZADD、ZCARD、ZRANK、ZSCORE等命令只能对有序集合键执行；

  相应的键只能执行适合自身类型的键命令

一、类型检查

执行命令之前需要检查目标键的类型是否符合要求，类型不符合要求则会拒绝命令。

通过RedisObject中的Type来实现

二、命令多态

由于数据库中键的值对象可以有多种类型的实现，相同的命令在确保类型正确的前提下，可以有多种键值对象的实现

 ![image-20211114195334038](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111141953246.png)

## 8. 内存回收

C语言并不具备自动内存回收功能

 Redis 构建了基于引用计数技术实现的内存回收机制

每个对象的引用计数信息由redisObject结构的refcount属性记录

 

相关的基本规则：

- 当新创建一个对象时，它的refcount属性被设置为1；

- 当对一个对象进行共享时，redis将这个对象的refcount加一；

- 当使用完一个对象后，或者消除对一个对象的引用之后，程序将对象的refcount减一

## 9. 对象共享

对象的引用计数属性还带有对象共享的作用

Redis中，多个键共享同一个值对象需要执行以下两个步骤：

​	1）将数据库键的**值指针**指向一个现有的值对象；

​	2）将被共享的值对象的引用计数增一。

共享对象是用来节约内存的。（数据库中保存的值对象越多，节省内存越显著）

注：创建共享字符串对象的数量可以通过修改redis.h/REDIS_SHARED_INTEGERS常量来修改

​		共享对象只能被字典和双向链表这类能带有指针的数据结构使用

通过上面介绍我们知道，对象共享可以共享字符串对象。 

**那么为什么Redis不共享包含字符串的对象**？

- 列表对象、哈希对象、集合对象、有序集合对象，本身可以包含字符串对象，复杂度较高。
- 如果共享对象是保存字符串对象，那么验证操作的复杂度为O(1)
- 如果共享对象是保存字符串值的字符串对象，那么验证操作的复杂度为O(N)
- 如果共享对象是包含多个值的对象，其中值本身又是字符串对象，即其它对象中嵌套了字符串对象，比如列表对象、哈希对象，那么验证操作的复杂度将会是O(N的平方)

如果对复杂度较高的对象创建共享对象，需要消耗很大的CPU，用这种消耗去换取内存空间，是不合适的



****

## 10. 空转时长

RedisObject结构包含的另一个属性:lru

​	记录了对象最后一次被命令程序访问的时间

通常使用OBJECT IDLETIME命令打印出给定键的空转时长

即：空转时长=当前时间 - 键的值对象的lru时间

 这个命令在访问键的值对象时，不会修改值对象的lru属性。

## 11.总结

❑Redis数据库中的每个键值对的键和值都是一个对象。

❑Redis共有字符串、列表、哈希、集合、有序集合五种类型的对象，每种类型的对象至少都有两种或以上的编码方式，不同的编码可以在不同的使用场景上优化对象的使用效率。

❑服务器在执行某些命令之前，会先检查给定键的类型能否执行指定的命令，而检查一个键的类型就是检查键的值对象的类型。

❑Redis的对象系统带有引用计数实现的内存回收机制，当一个对象不再被使用时，该对象所占用的内存就会被自动释放。

❑Redis会共享值为0到9999的字符串对象。

❑对象会记录自己的最后一次被访问的时间，这个时间可以用于计算对象的空转时间。



参考：

《Redis 设计与实现》 黄健宏

​	https://www.pdai.tech/md/db/nosql-redis/db-redis-overview.html
