---
title: Redis-集群
date: 2022-03-17 15:33:57
tags:
- Redis
categories:
- Notes
keywords:
description:
top_img:
comments:
cover:	https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203181133737.jpg
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



# 集群

Redis集群是Redis提供的分布式数据库方案， 通过分片（sharding）来进行数据共享，并提供复制和故障转移功能。

下面重点介绍：集群的节点、槽指派、命令执行、重新分片、转向、故障转移、消息等各个方面

## 一、节点

一个Redis集群通常由多个节点（node）组成。

刚开始时节点相互独立，组建集群就要将节点连接起来。构成多节点的集群。

连接节点的命令：

​	![image-20220318114812146](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318114812146.png)

通过向节点发送命令，令其与指定的ip和端口的节点握手。从而将ip和port指向的节点加入当前所在集群。

下面详细介绍启动节点的方法、与集群有关的数据结构，以及CLUSTER MEET命令的实现原理

### 1、启动节点

一个结点就是一个Redis服务器，启动时根据cluster-enabled配置选项确定是否开启集群功能。

![image-20220318115229354](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318115229354.png)



节点会继续使用单机模式使用的所有组件

包括：

- 使用文件事件处理器来处理命令请求和返回命令回复。
- 使用时间事件处理器来执行serverCron函数
- 继续使用数据库来保存键值对数据
- 继续使用数据库来保存键值对数据
- 继续使用发布与订阅模块来执行PUBLISH、SUBSCRIBE等命令
- 继续使用复制模块来进行节点的复制工作
- 继续使用Lua脚本环境来执行客户端输入的Lua脚本。
- 继续使用redisServer结构来保存服务器的状态，使用redisClient结构来保存客户端的状态

 

### 2、集群数据结构

上面介绍集群使用的常规单机组建，下面介绍集群模式下特有的数据结构。

集群模式下才会用到的数据，节点将它们保存到了cluster.h/clusterNode结构、cluster.h/clusterLink结构，以及cluster.h/clusterState结构里面 

**clusterNode结构**

用来保存节点的状态（每个节点都有），

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318115843866.png" alt="image-20220318115843866" style="zoom:67%;" />

其中的link属性是一个**clusterLink结构**，该结构保存了连接节点所需的有关信息，比如套接字描述符，输入缓冲区和输出缓冲区：



注：redisClient结构和clusterLink结构的有什么异同呢？

同：都有自己的套接字描述符和输入、输出缓冲区

异：redisClient结构中的套接字和缓冲区是用于连接客户端的；

​		clusterLink结构中的套接字和缓冲区则是用于连接节点的。

**clusterState结构**

每个节点都保存着一个，这个结构记录了在当前节点的视角下，集群目前所处的状态

### 3、CLUSTER MEET命令的实现

假设向节点 A 发送命令，让节点 B加入集群。

那么要经过以下流程：

-  节点A会为节点B创建一个clusterNode结构，将该结构添加到自己的clusterState.nodes字典里面。
- 节点A将根据给定的IP地址和端口号，向节点B发送一条MEET消息（message）。
- 如果一切顺利，节点B将接收到节点A发送的MEET消息，节点B会为节点A创建一个clusterNode结构，并将该结构添加到自己的clusterState.nodes字典里面。
- 之后，节点B将向节点A返回一条PONG消息。
- 节点A将接收到节点B返回的PONG消息，通过这条PONG消息节点A可以知道节点B已经成功地接收到了自己发送的MEET消息。
- 节点A将向节点B返回一条PING消息。
- 如果一切顺利，节点B将接收到节点A返回的PING消息，通过这条PING消息节点B可以知道节点A已经成功地接收到了自己返回的PONG消息，握手完成。

类似三次握手协议，可以对比着进行记忆。

如图：

![image-20220318120552027](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318120552027.png)



## 二、槽指派

Redis集群通过分片的方式来保存数据库中的键值对

具体形式：

- Redis集群通过分片的方式来保存数据库中的键值对：集群的整个数据库被分为16384个槽。
- 每个键都属于这16384个槽的其中一个。
- 每个节点可以处理0个或最多16384个槽

集群中16384个槽只要有一个没有得到处理，那么集群就处于下线状态。（fail）。



**命令**

槽指派通过向节点发送CLUSTER ADDSLOTS命令，一个节点可以指多个槽。

举例：<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318121224118.png" alt="image-20220318121224118" style="zoom:80%;" />

全部的槽指派成功之后，集群进入上线状态。

### 1、记录节点的槽指派信息

clusterNode结构的**slots属性**和**numslot属性**记录了节点负责处理哪些槽。

​		![image-20220318121423532](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318121423532.png)

slots属性

Slot是一个数组

Redis以0为起始索引，16383为终止索引，对slots数组中的16384个二进制位进行编号

用数组元素的值是否为1确定是否被分配处理（1：表示处理）

示例如下：

​	![image-20220318121607634](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318121607634.png)



**numslots属性**

记录节点负责处理的槽的数量，也即是slots数组中值为1的二进制位的数量。

### 2、传播节点的槽指派信息

一个节点会将自己的slots数组通过消息发送给集群中的其他节点，以此来告知其他节点自己目前负责处理哪些槽。通过接受其他节点发送的节点slot数组，更新自身的clusterState.nodes字典中的clusterNode结构。

每个接收到slots数组的节点都会将数组保存到相应节点的clusterNode结构里面。

#### 3、记录集群所有槽的指派信息

clusterState结构中的slots数组记录了集群中所有16384个槽的指派信息：

![image-20220318131756379](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318131756379.png)

slots数组包含16384个项，每个数组项都是一个指向clusterNode结构的指针：

- 如果slots[i]指针指向NULL，那么表示槽i尚未指派给任何节点。
- 如果slots[i]指针指向一个clusterNode结构，那么表示槽i已经指派给了clusterNode结构所代表的节点。



通过将所有槽的指派信息保存在clusterState.slots数组里面，程序要检查槽i是否已经被指派， 只需要访问clusterState.slots[i]的值即可，这个操作的复杂度仅为O（1）。



需要说明的是：虽然clusterState.slots数组记录了集群中所有槽的指派信息，但使用clusterNode结构的slots数组来记录单个节点的槽指派信息仍然是有必要的。

#### 4、CLUSTER ADDSLOTS命令的实现

CLUSTER ADDSLOTS命令有一个或多个槽作为参数，并将所有输入的槽指派给接收该命令的节点负责。

![image-20220318132213728](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318132213728.png)

用一段伪代码定义命令的实现：

​				<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318132247998.png" alt="image-20220318132247998" style="zoom:67%;" />

## 三、在集群中执行命令

集群处于上线状态，那么客户端就可以向集群中的节点发送数据命令了。

执行流程图：

​		<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318133044005.png" alt="image-20220318133044005" style="zoom:67%;" />

下面介绍计算所属槽的方法

### 1、计算键属于哪个槽

计算算法：

​		![image-20220318133200870](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318133200870.png)

CRC16（key）语句用于计算键key的CRC-16校验和。



使用CLUSTER KEYSLOT＜key＞命令可以查看一个给定键属于哪个槽

### 2、判断槽是否由当前节点负责处理

上面计算出键所属的槽之后，节点就会检查自己的clusterState.slots数组中的项i，进行判断。

- 如果clusterState.slots[i]等于clusterState.myself，那么说明槽i由当前节点负责，节点可以执行客户端发送的命令。
- 如果clusterState.slots[i]不等于clusterState.myself，那么说明槽i并非由当前节点负责，节点会根据clusterState.slots[i]指向的clusterNode结构所记录的节点IP和端口号，向客户端返回**MOVED错误**，指引客户端转向至正在处理槽i的节点。

### 3、MOVED错误

当节点发现键所在的槽并非由自己负责处理时，向客户端发送的错误。

格式：

​		<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318133644636.png" alt="image-20220318133644636" style="zoom:67%;" />

客户端会根据MOVED错误中提供的IP地址和端口号，转向至负责处理槽slot的节点。

并且向其重新发送之前想要执行的命令。

### 4、节点数据库的实现

集群节点保存键值对以及键值对过期时间的方式和之前介绍的单机Redis的方式完全相同。

节点和单机服务器在数据库方面的一个区别是，**节点只能使用0号数据库**，而单机Redis服务器则没有这一限制。



另外，除了将键值对保存在数据库里面之外，节点还会用clusterState结构中的slots_to_keys跳跃表来保存槽和键之间的关系：

​		![image-20220318133958399](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318133958399.png)



## 四、重新分片

将任意数量已经指派给某个节点（源节点）的槽改为指派给另一个节点（目标节点），并且相关槽所属的键值对也会从源节点被移动到目标节点。



重新分片可以线上进行 ，集群不需要下线，可以继续处理命令请求。

### 1、实现原理

重新分片由集群管理软件redis-trib负责执行，通过向**源节点**和**目标节点**发送命令来进行重新分片操作。

首先是操作单个槽：

步骤如下：

- 目标节点发送CLUSTER SETSLOT＜slot＞IMPORTING＜source_id＞命令，令其准备好接收slot

键值对。

- 对源节点发送CLUSTER SETSLOT＜slot＞MIGRATING＜target_id＞命令，令其准备好slot槽的键值对迁移。

- 向源节点发送CLUSTER GETKEYSINSLOT＜slot＞＜count＞命令，获得最多count个属于槽slot的键值对的键名（key name）。

- 对于获取的每一个键名，redis-trib都向源节点发送一个MIGRATE＜target_ip＞＜target_port＞＜key_name＞0＜timeout＞命令， 原子地从源节点迁移至目标节点。

- 重复执行获取键名和迁移的过程

  如图所示：（迁移键的过程）

  ​				![image-20220318134854939](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318134854939.png)

- redis-trib向集群中的任意一个节点发送CLUSTERSETSLOT＜slot＞NODE＜target_id＞命令，通知槽slot已经指派给目标节点。



对于多个槽的重新分配。需要对每个槽分别执行上述步骤。

## 五、ASK错误

### 1、ASK错误

重新分片期间，可能会发生这样的错误：属于被迁移槽的一部分键值对保存在源节点里面，而另一部分键值对则保存在目标节点里面。

有趣的情况发生了:客户端向源节点请求命令含有的数据库建恰好属于被迁移的槽的时候。

- 源节点会先在自己的数据库里面查找指定的键，如果找到的话，就直接执行客户端发送的命令
-  如果源节点没能在自己的数据库里面找到指定的键，那么这个键有可能已经被迁移到了目标节点，则返回ASK错误，指引客户端转向正在导入槽的目标节点，并再次发送之前想要执行的命令。

**被隐藏的ASK错误**

和接到MOVED错误时的情况类似，集群模式的redis-cli在接到ASK错误时也不会打印错误，对用户来说是隐藏的。



接到ASK错误的客户端会根据错误提供的IP地址和端口号，转向至正在导入槽的目标节点，然后首先向目标节点发送一个ASKING命令，之后再重新发送原本想要执行的命令



### 2、ASKING命令

ASKING命令唯一要做的就是打开发送该命令的客户端的REDIS_ASKING标识

如果节点的clusterState.importing_slots_from[i]显示节点正在导入槽i，并且发送命令的客户端带有REDIS_ASKING标识，那么节点将破例执行这个关于槽i的命令一次。

如图所示：	

​				<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318135750323.png" alt="image-20220318135750323" style="zoom:67%;" />

### 3、ASK错误和MOVED错误的区别

同：两者都会导致客户端转向。

异：MOVED错误代表槽的负责权已经从一个节点转移到了另一个节点，**客户端每次遇到关于槽i的命令请求时，都可以直接将命令请求发送至MOVED错误所指向的节点**。

​		与此相反，ASK错误只是两个节点在迁移槽的过程中使用的一种临时措施，**这种转向不会对客户端今后发送关于槽i的命令请求产生任何影响**。



##  六、复制与故障转移

Redis集群中的节点分为主节点（master）和从节点

主节点：用于处理槽

从节点：复制某个主节点，并在被复制的主节点下线时，代替下线主节点继续处理命令请求。



下面将介绍节点的复制方法，检测节点是否下线的方法，以及对下线主节点进行故障转移的方法。

### 1、设置从节点

使用

​		<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318140329801.png" alt="image-20220318140329801" style="zoom:67%;" />

命令

可以让接收命令的节点成为node_id所指定节点的从节点，并开始对主节点进行复制

从节点复制主节点，

:one:首先要查找自己的clusterState.nodes字典。找到node_id所对应节点的clusterNode结构，将自己的clusterState.myself.slaveof指针指向这个结构。

:two:修改自己在clusterState.myself.flags中的属性，关闭原本的REDIS_NODE_MASTER标识，打开REDIS_NODE_SLAVE标识（自己已经变成了从节点）

:three: 节点调用复制代码，根据指向的那个clusterNode结构（主节点），进行赋值

从上面来看：从节点复制主节点相当于向从节点发送命令SLAVEOF。

### 2、故障检测

集群中的每个节点都会定期地向集群中的其他节点发送PING消息，以此来检测对方是否在线。

如果接收节点没能在规定时间内返回PONG消息，那么发送节点认定该节点**疑似下线**。

需要注意的是：集群中的各个节点会通过互相发送消息的方式来交换集群中各个节点的状态信息

（包括：某个节点是处于在线状态、疑似下线状态（PFAIL），还是已下线状态（FAIL））

举个例子：

​	当一个主节点A通过消息得知主节点B认为主节点C进入了疑似下线状态时，主节点A会在自己的

clusterState.nodes字典中找到主节点C所对应的clusterNode结构，并将主节点B的下线报告

（failure report）添加到clusterNode结构的fail_reports链表里面：

​	![image-20220318141033674](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220318141033674.png)

​		那么如果在一个集群里面，半数以上负责处理槽的主节点都将某个主节点x报告为疑似下线，那么这个主节点x将被标记为已下线（FAIL）。

​	之后主节点通过广播的形式，通知集群中的所有节点，该节点下线的消息。

### 3、 故障转移

发生条件：一个**从节点**发现自己正在复制的**主节点**进入了已下线状态时，从节点将开始对下线主节点进行故障转移

步骤如下：

​	1）复制下线主节点的所有从节点里面，会有一个从节点被选中。

​	2）被选中的从节点会执行SLAVEOF no one命令，成为新的主节点。

​	3）新的主节点会撤销所有对已下线主节点的槽指派，并将这些槽全部指派给自己。

​	4）新的主节点向集群广播一条PONG消息，这条PONG消息可以让集群中的其他节点立即知道这个节点已经由从节点变成了主节点，并且这个主节点已经接管了原本由已下线节点负责处理的槽。

​	5）新的主节点开始接收和自己负责处理的槽有关的命令请求，故障转移完成。

### 4、新的主节点的选取

选举方法：

```
1）集群的配置纪元是一个自增计数器，它的初始值为0。
2）当集群里的某个节点开始一次故障转移操作时，集群配置纪元的值会被增一。
3）对于每个配置纪元，集群里每个负责处理槽的主节点都有一次投票的机会，而第一个向主节点要求投票的从节点将获得主节点的投票。
4）当从节点发现自己正在复制的主节点进入已下线状态时，从节点会向集群广播一条CLUSTERMSG_TYPE_FAILOVER_AUTH_REQUEST消息，要求所有收到这条消息、并且具有投票权的主节点向这个从节点投票。
5）如果一个主节点具有投票权（它正在负责处理槽），并且这个主节点尚未投票给其他从节点，那么主节点将向要求投票的从节点返回一条CLUSTERMSG_TYPE_FAILOVER_AUTH_ACK消息，表示这个主节点支持从节点成为新的主节点。
6）每个参与选举的从节点都会接收CLUSTERMSG_TYPE_FAILOVER_AUTH_ACK消息，并根据自己收到了多少条这种消息来统计自己获得了多少主节点的支持。
7）如果集群里有N个具有投票权的主节点，那么当一个从节点收集到大于等于N/2+1张支持票时，这个从节点就会当选为新的主节点。
8）因为在每一个配置纪元里面，每个具有投票权的主节点只能投一次票，所以如果有N个主节点进行投票，那么具有大于等于N/2+1张支持票的从节点只会有一个，这确保了新的主节点只会有一个。
9）如果在一个配置纪元里面没有从节点能收集到足够多的支持票，那么集群进入一个新的配置纪元，并再次进行选举，直到选出新的主节点为止。
```

选举新主节点的方法和 选举领头Sentinel的方法非常相似， 都是基于Raft算法的领头选举（leader election）方法来实现的。

## 七、消息

集群中的各个节点通过发送和接收消息（message）来进行通信。

称发送消息的节点为发送者（sender），接收消息的节点为接收者（receiver）

节点之间发送的消息种类：

- MEET消息：当发送者接到客户端发送的CLUSTERMEET命令时，发送者会向接收者发送MEET消息
- PING消息：检测被选中的节点是否在线
- PONG消息：回复PING
- FAIL消息：当一个主节点A判断另一个主节点B已经进入FAIL状态时，节点A会向集群广播一条关于节点B的FAIL消息，所有收到这条消息的节点都会立即将节点B标记为已下线。
- PUBLISH消息：当节点接收到一个PUBLISH命令时，节点会执行这个命令，并向集群广播一条PUBLISH消息，所有接收到这条PUBLISH消息的节点都会执行相同的PUBLISH命令。
