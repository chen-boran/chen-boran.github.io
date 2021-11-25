---
title: Redis Sentinel
date: 2021-11-17 21:19:49
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

Sentinel（哨岗、哨兵）是Redis的高可用性（highavailability）解决方案

 首先哨兵主要实现了以下功能： 

- **监控（Monitoring）**：哨兵会不断地检查主节点和从节点是否运作正常。
- **自动故障转移（Automatic failover）**：当主节点不能正常工作时，哨兵会开始自动故障转移操作，它会将失效主节点的其中一个从节点升级为新的主节点，并让其他从节点改为复制新的主节点。
- **配置提供者（Configuration provider）**：客户端在初始化时，通过连接哨兵来获得当前Redis服务的主节点地址。
- **通知（Notification）**：哨兵可以将故障转移的结果发送给客户端。

Sentinel系统监视任意多的主服务器和从服务器，自动升级下线主服务器的从属服务器为主服务器，代理执行原主机的相关工作

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111182216003.png" alt="image-20211118221623916" style="zoom:67%;" />

故障转移：解决主服务器下线时长超过设定限度，进行故障的解决的过程

步骤（以上图为例）：

- 首先，Sentinel系统会挑选server1属下的其中一个从服务器，并将这个被选中的从服务器升级为新的主服务器。
-   向server1属下的所有从服务器发送新的复制指令，让它们成为新的主服务器的从服务器，当所有从服务器都开始复制新的主服务器时，故障转移操作执行完毕。
-  Sentinel 继续监视 server1，在它重新上线时，将它设置为新的主服务器的从服务器。

**重点知识脉络**： Sentinel初始化过程；Sentinel和一般Redis服务器的区别；Sentinel监视服务器的方法和原理；Sentinel判断服务器是否在线方法；故障转移详细过程。

## 1. 启动并初始化Sentinel

启动Sentinel可以使用：

![image-20211118234503273](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111182345373.png)

或者：

![image-20211118234559449](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111182345559.png)

Sentinel启动大致要经过以下**步骤**：

​		1）初始化服务器。

​		2）将普通Redis服务器使用的代码替换成Sentinel专用代码。

​		3）初始化Sentinel状态。

​		4）根据给定的配置文件，初始化Sentinel的监视主服务器列表。

​		5）创建连向主服务器的网络连接。

**说明**：

**Sentinel和一般Redis服务器的区别**

```
Sentinel本质上是运行在特殊环境上的Redis服务器

​	普通Redis服务器使用redis.h/REDIS_SERVERPORT常量的值作为服务器端口 ；

​	Sentinel则使用sentinel.c/REDIS_SENTINEL_PORT常量的值作为服务器端口 ；

​	在服务器的命令表上存在差别，普通Redis服务器使用redis.c/redisCommandTable 	S    entinel则使用sentinel.c/sentinelcmds

​	在Sentinel模式下，Redis服务器不能执行诸如SET、DBSIZE、EVAL等等这些命令(未载入)

​	Sentinel可以执行的命令： (PING、SENTINEL、INFO、SUBSCRIBE、UNSUBSCRIBE、PSUBSCRIBE和PUNSUBSCRIBE)
```

**创建连向主服务器的网络连接**

 每个被 监视的主服务器，都会与Sentinel创建两个异步网络连接：

❑ 命令连接： 专门用于向主服务器发送命令，并接收命令回复。

❑ 订阅连接：专门用于订阅主服务器的__sentinel__:hello频道。

为什么是异步网络连接？：Sentinel需要与多个实例创建多个网络连接

链接示例图：

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111190000569.png" alt="image-20211119000053403" style="zoom:67%;" />

## 2.获取主服务器信息

Sentinel已经创建成功，连接建立完毕，接着就是哨兵如何对主服务器进行监听。

Sentinel默认以每十秒一次的频率，向被监视的主服务器发送INFO命令（命令连接），分析INFO命令的回复来获取主服务器的当前信息。

获取信息通常有以下两方面：

- 关于主服务器本身的信息，run_id域记录的服务器运行ID，role域记录的服务器角色；

- 关于主服务器属下所有从服务器的信息（根据从服务器Slave字段）

  ip=域记录了从服务器的IP地址，

  port=域则记录了从服务器的端口号。根据IP地址和端口号，Sentinel自动发现从服务器。

主服务器回复信息示例图：

![image-20211119000657543](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111190006659.png)

根据返回信息，Sentinel对主服务器实例结构进行更新，并由主服务器更新其实例结构字典（记录slave的从服务器信息）

## 3.获取从服务器信息

Sentinel发现主服务器有新的从服务器出现时，Sentinel会为这个新的从服务器创建相应的实例结构之外， 还会创建连接到从服务器的命令连接和订阅连接

![image-20211119001225887](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111190012033.png)

和主服务器相同Sentinel每十秒一次发送INFO命令，获取信息

举例如下：

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111190013205.png" alt="image-20211119001352120" style="zoom:67%;" />

注：图中包含以下信息

​		❑从服务器的运行ID run_id。

​		❑从服务器的角色role。

​		❑主服务器的IP地址master_host，以及主服务器的端口号master_port。

​		❑主从服务器的连接状态master_link_status。

​		❑从服务器的优先级slave_priority。

​		❑从服务器的复制偏移量slave_repl_offset。

根据这些信息，Sentinel 对从服务器的实例结构进行更新

## 4 向主服务器和从服务器发送信息

Sentinel系统，通过命令连接向主从服务器发送消息，来进行信息交换，控制等效果

命令中通常包含以下内容：

- 和Sentinel相关的参数

  ![image-20211119203756108](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111192040224.png)

- 和主服务器有关的参数

  ![image-20211119203820574](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111192040631.png)

## 5.接收来自主服务器和从服务器的频道信息

Sentinel与一个主服务器或者从服务器建立起订阅连接之后，就会通过订阅连接发送以下命令

Sentinel对 频道的订阅会一直持续到Sentinel与服务器的连接断开为止

-  对每个与Sentinel连接的服务器，Sentinel既通过命令连接向服务器的__sentinel__:hello频道发送信息，又通过订阅连接从服务器的__sentinel__:hello频道接收信息
- 监视一个服务器的多个Sentinel之间信息都是共享的，用来更新各自对于服务器和其他Sentinel的认知



**更新sentinels字典**

Sentinel为主服务器创建的实例结构中的sentinels字典保存了除Sentinel本身之外，所有同样监视这个主服务器的其他Sentinel的资料

举个例子：一个Sentinel接受来自来自其他Sentinel的信息之后，会提取其主要信息（与Sentinel和服务器有关的参数），根据主服务器参数在自己的master字典中找到相应服务器的实例结构并更新

（如果发送信息的Sentinel之前不存在，就新创建）


**连向其他Sentinel的命令连接**

Sentinel发现新的Sentinel时，会在sentinel字典中创建相关实例，并且创建与其连接的命令连接

因此，监视同一服务器的Sentinel之间会形成互通的网络，可以互相发送命令请求来进行信息交换。

注：Sentinel之间不会创建订阅连接

## 6.检测主观下线状态

Sentinel与服务器之间连接创建成功，Sentinel会连续不断的监视服务器的状态

默认情况下，Sentinel会以每秒一次的频率向所有与它创建了命令连接的实例（包括主服务器、从

服务器、其他Sentinel在内）发送PING命令，通过返回的回复判断实例是否在线

**回复的种类**

​	❑有效回复：实例返回+PONG、-LOADING、-MASTERDOWN三种回复的其中一种。

​	❑无效回复：实例返回除+PONG、-LOADING、-MASTERDOWN三种回复之外的其他回复，或者

在指定时限内没有返回任何回复。

如果一个实例在down-after-milliseconds设定的时间（毫秒）内，都向Sentinel返回无效回复，Sentinel就会确定该主机处于下线状态修改这个实例所对应的实例结构，在结构的flags属性中打开SRI_S_DOWN标识。

注：多个Sentinel设置的主观下线时长可能不同

## 7 检查客观下线状态

判断主观下线之后，需要进一步进行确定，排除其他不必要的原因，进行客观下线状态检查

 通过向同样监视这一主服务器的其他Sentinel进行询问， 看是否有满足一定数量的其他Sentinel也认为该主服务器进入下线状态。满足条件 Sentinel就会将从服务器判定为客观下线，并对主服务器执行故障转移操作。

- 一般通过  is-master-down-by-addr命令在各个Sentinel之间确定主观下线状态

- 不同Sentinel判断客观下线的条件可能不同（满足一定数量的Sentinel都认为主服务器已经处于下线状态）

## 8 选举领头Sentinel

当主服务器最终被确定已经客观下线，监视他的Sentinel们就要选举出一个新的领头Sentinel，由领头Sentinel对其他从服务器进行故障转移

**规则**

规则较多，举例说明：

```
❑所有在线的Sentinel都有被选为领头Sentinel的资格， 

❑每次进行领头Sentinel选举之后，不论选举是否成功，所有Sentinel的配置纪元（configurationepoch）的值都会自增一次。配置纪元实际上就是一个计数器，并没有什么特别的。

 ❑每个发现主服务器进入客观下线的Sentinel都会要求其他Sentinel将自己设置为局部领头Sentinel。

❑当一个Sentinel（源Sentinel）向另一个Sentinel（目标Sentinel）发送SENTINEL is-master-down-by-addr命令，并且命令中的runid参数不是*符号而是源Sentinel的运行ID时，这表示源Sentinel要求目标Sentinel将前者设置为后者的局部领头Sentinel。

❑Sentinel设置局部领头Sentinel的规则是先到先得： 

❑领头Sentinel的产生需要半数以上Sentinel的支持，并且每个Sentinel在每个配置纪元里面只能设置一次局部领头Sentine 

在一个配置纪元里面，只会出现一个领头Sentinel。 

 
```

 

## 9.故障的转移



> 新的主库选择出来后，就可以开始进行故障的转移了。

（我们假设：判断主库客观下线了，同时选出`sentinel 3`是哨兵leader）

 

**故障转移流程如下**：

![img](https://www.pdai.tech/_images/db/redis/db-redis-sen-4.png)

- 将slave-1脱离原从节点（PS: 5.0 中应该是`replicaof no one`)，升级主节点，
- 将从节点slave-2指向新的主节点
- 通知客户端主节点已更换
- 将原主节点（oldMaster）变成从节点，指向新的主节点

**转移之后**

![img](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111192131841.png)

## 

总的来说就是进行了以下步骤：

1）在已下线主服务器属下的所有从服务器里面，挑选出一个从服务器，并将其转换为主服务器。

2）让已下线主服务器属下的所有从服务器改为复制新的主服务器。

3）将已下线主服务器设置为新的主服务器的从服务器，当 旧的主服务器重新上线时，它就会成为新的主服务器的从服务器。

**新主服务器选举**

在所有的从服务器中，挑选出一个状态良好、数据完整的从服务器，然后向这个从服务器发送SLAVEOF no one命令，将其变成主服务器。

发送SLAVEOF no one命令之后，领头Sentinel会以每秒一次的频率（平时是每十秒一次），向被升

级的从服务器发送INFO命令，并观察命令回复中的角色（role）信息，直到其状态变成master

**修改从服务器的复制目标**

所有从服务器去复制新的主服务器，通过领头Sentinel向剩下的所有从服务器发送Slaveof命令来实现。

**旧的主服务器变为从服务器**

已下线的主服务器设置为新的主服务器的从服务器，这种设置保存在旧主服务器对应的实例结构中。并且由Sentine控制执行
