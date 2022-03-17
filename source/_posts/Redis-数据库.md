---
title: Redis 数据库
date: 2021-11-14 20:12:56
tags:
- Redis
categories:
- Notes
keywords:
description:
top_img:
comments:
cover:	https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203151833185.jpg
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

# Redis数据库

重点掌握：服务器保存数据库方法

​					客户端切换数据库的方法

​					数据库保存键值对方法

​					数据库增删改查更新等操作的实现

## 1. 服务器中的数据库

Redis服务器将所有数据库都保存在服务器状态redis.h/redisServer结构的db数组中，

数组的每个项都是一个redis.h/redisDb结构

每个redisDb结构代表一个数据库

要构建多少个数据库由服务器状态的dbnum决定，默认是16个（db0~db15）

## 2.切换数据库

默认情况适用0号数据库即：db0

可以使用SELECT命令切换 目标数据库

服务器中，客户端状态redisClient结构的db属性记录了客户端当前的目标数据库

是一个指向redisDb的指针，通过更改指针实现数据库的切换。

图示：客户端使用一号数据库

![image-20211114202527753](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111142025992.png)

## 3. 数据库键空间

Redis是一个键值对（key-value pair）数据库服务器

 数据库都对应一个redis.h/redisDb结构

redisDb结构的dict字典保存了数据库中的所有键值对，我们将这个字典称为键空间（key space）

说明：

- 键空间的键也就是数据库的键，每个键都是一个字符串对象。

- 键空间的值也就是数据库的值，每个值可以是 Redis五种基本对象类型任意一种。

键空间举例：

![image-20211114203011821](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111142030044.png)

**添加键**

即：添加新建到dict中

使用  SET

**删除键**

使用 DEL 

**更新键**

使用 SET加想要更改的 键名 加更改的值

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111142033634.png" alt="image-20211114203359483" style="zoom:80%;" />

**取值** 

GET 键名

**清空数据库**

FLUSHDB命令（清空键空间所有键值对）

## 4.键的生存和过期时间

**设置生存时间**（Time To Live，TTL）

使用EXPIRE命令或者PEXPIRE（毫秒）命令，客户端可以以秒或者毫秒精度为数据库中的某个键 

**设置过期时间**

 客户端可以通过EXPIREAT命令或PEXPIREAT命令，以秒或者毫秒精度给数据库中的某个键设置过期时间（expire time）

 实际上EXPIRE、PEXPIRE、EXPIREAT三个命令都是使用PEXPIREAT命令来实现的

![image-20211114204048256](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111142040344.png)

**保存过期时间**

redisDb的expires字典保存了数据库中所有键的过期时间 ，称为过期字典

❑过期字典的键是一个指针，这个指针指向键空间中的某个键对象（也即是某个数据库键）。

❑过期字典的值是一个long long类型的整数，这个整数保存了键所指向的数据库键的过期时间——一个毫秒精度的UNIX时间戳。

增加过期字典之后，RedisDb结构如下：

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111142042813.png" alt="image-20211114204250575" style="zoom:80%;" />

**移除过期时间** 

PERSIST命令可以移除一个键的过期时间



对应的过期字典中的键值对被删除

**计算返回剩余生存时间**

通过以下两个命令实现：

TTL命令以秒为单位返回键的剩余生存时间，

PTTL命令则以毫秒为单位返回键的剩余生存时间：

他们都是通过计算键的过期时间和当前时间之间的差来实现的

## 5.过期键的删除

键过期之后的删除策略分为三种：定时删除、惰性删除、定期删除

在这三种策略中，第一种和第三种为主动删除策略，而第二种则为被动删除策略。

| 策略     | 特点                             | 说明                                                         | 缺点                                                         | 常用   |
| -------- | -------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------ |
| 定时删除 | 对内存友好，对CPU时间最不友好    | 在设置键的过期时间的同时，创建一个定时器（timer），让定时器在键的过期时间来临时，立即执行对键的删除操作。 | 占用太多内存，影响服务器性能                                 | 不常用 |
| 惰性删除 | 对内存最不友好，对CPU 时间最友好 | 放任键过期不管，但是每次从键空间中获取键时，都检查取得的键是否过期，如果过期的话，就删除该键；如果没有过期，就返回该键 | 浪费太多内存，有内存泄漏的危险。                             | 常用   |
| 定期删除 | 介于前两者之间                   | 每隔一段时间，对数据库进行检查，删除过期键。具体有算法决定。 | 两者折中的方案。避免了两者的缺点，但是具体的删除的间隔时间是实现的难点。服务器必须合理安排删除时间和频率。 | 常用   |

*注：内存泄漏：大量无用的垃圾数据占用内存，没有被服务器释放。

Redis服务器实际使用的是惰性删除和定期删除两种策略：配合使用这两种删除策略

- 过期键的惰性删除策略由db.c/expireIfNeeded函数实现

- 过期键的定期删除策略由redis.c/activeExpireCycle函数实现

## 6. 不同功能对过期键的处理

**RDB持久化**

在载入RDB文件时：

- 主服务器运行：数据库只载入未过期的键值
- 从服务器模式运行：数据库载入所有的键值，无论是否过期，通过主从服务器的数据同步进行数据一致化

**AOF持久化**

1. 在创建AOF 文件时，过期键如果还没有被删除，则不会有影响

   当过期键被惰性删除或者定期删除之后，程序会向AOF文件追加（append）一条DEL命令，来显式地记录该键已被删除。

2. 在载入AOF 文件时过期键不会被保存

