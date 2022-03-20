---
title: Redis-慢查询日志
date: 2022-03-17 15:16:19
tags: 
- Redis
categories: 
- Notes
keywords:
description: some of my thinks
top_img: 
comments: 
cover: https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203151833187.jpg
toc:  
toc_number:
copyright:
mathjax:
katex:
---



## 慢查询日志

Redis的慢查询日志功能用于记录执行时间超过给定时长的命令请求，通过这个功能产生的日志来监视和优化查询速度。



### 一、配置选项

有两个和慢查询日志相关的选项：

- slowlog-log-slower-than选项指定执行时间超过多少微秒（1秒等于1 000 000微秒）的命令请求会被记录到日志上。
- slowlog-max-len选项指定服务器最多保存多少条慢查询日志。

服务器使用先进先出的方式保存多条慢查询日志，当 存储的慢查询日志数量等于slowlog-max-len选项的值时，服务器在添加一条新的慢查询日志之前，会先将最旧的一条慢查询日志删除。

### 二、慢查询记录的保存

服务器状态中包含了几个和慢查询日志功能有关的属性

![image-20220317152127766](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203171521925.png)

说明：

- slowlog_entry_id属性的初始值为0，随着新的日志的创建不断更新。

- slowlog**链表**保存了服务器中的所有慢查询日志，链表中的每个节点都保存了一个slowlogEntry结构，每个slowlogEntry结构代表一条慢查询日志。

  ![image-20220317152318278](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203171523416.png)

### 三、浏览和删除

查看日志的SLOWLOG GET

查看日志数量的SLOWLOG LEN

清除所有慢查询日志的SLOWLOG RESET

打印和删除慢查询日志可以通过遍历slowlog链表实现。

### 四、添加新日志

在每次执行命令的之前和之后，程序都会记录微秒格式的当前UNIX时间戳，这两个时间戳之间的差就是服务器执行命令所耗费的时长。

这个时长传递给**slowlogPushEntryIfNeeded函数**，最终决定是否创建慢查询日志。

并且新创建的日志放到slowlog的链表头，并且将slowlog_entry_id的值增加1。

