---
title: Redis 持久化
date: 2021-11-14 20:14:13
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

持久化：将Redis在内存中的数据库状态保存到磁盘里面，避免数据意外丢失。

 Redis是一个键值对数据库服务器，服务器中通常包含着任意个非空数据库

## 一、RDB 持久化 

 RDB 持久化可以选择手动执行和 定期执行（根据服务器选项），意图将数据库某一时间的状态保存到一个二进制的RDB 文件中。

RDB文件保存在硬盘中，不受服务器开关机状态的影响

### 1.RDB文件 载入与创建

**创建：**通常使用 SAVE 和BGSAVE两个命令创建

- SAVE ：由服务器主进程创建文件，阻塞服务器其他进程
- BGSAVE ：由服务器派生子进程创建RDB文件，父进程急需处理其他请求

实际工作由rdb.c/rdbSave函数

**注：**

AOF文件的更新频率通常比RDB文件的更新频率高，所以：

- 服务器开启了AOF持久化功能，则会优先使用AOF文件来还原数据库状态。
- AOF持久化功能处于关闭状态时，服务器才会使用RDB文件来还原数据库状态。

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111152042711.png" alt="image-20211115204243601" style="zoom:80%;" />

**载入：**

载入RDB文件的实际工作由rdb.c/rdbLoad函数完成

**服务器状态**

- 执行SAVE时：客户端所有命令被阻塞
- BGSAVE：服务器拒绝SAVE，BGSAVE命令，BGREWRITEAOF和BGSAVE两个命令不能同时执行（性能原因）
- RDB 文件载入时:服务器一直被阻塞

## 2.自动间隔性保存

 BGSAVE命令可以在不阻塞服务器进程的情况下执行， 用户通过设置服务器配置的save选项来设置多个保存条件，只要其中任意一个条件被满足，服务器就会执行BGSAVE命令。

例如：save 900 1

​	表示服务器在九百秒内至少进行了一次修改，则执行BGSAVE命令

**设置保存条件**

若用户没有主动设置save选项，服务器会为save选项设置默认条件：

 服务器程序根据save选项所设置的保存条件，设置服务器状态redisServer结构的saveparams属性：（每个saveparam结构都保存了一个save选项设置的保存条件）

![image-20211115210704732](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111152107791.png)

**dirty计数器和lastsave属性**

- dirty计数器：从上一次成功生成磁盘文件之后进行修改的次数（每次加一）

- lastsave：UNIX时间戳，记录上一次生成RDB文件的时间点

**检查保存条件**

Redis的服务器周期性操作函数serverCron默认每隔100毫秒就会执行一次，通过它检查save选项所设置的保存条件是否已经满足 

流程如下：

![image-20211115211222220](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111152112273.png)

### 3.RDB文件结构

完整结构图：

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111152113546.png" alt="image-20211115211307502" style="zoom:80%;" />

 简要说明：

| 名称       |        |                                                              |
| ---------- | ------ | ------------------------------------------------------------ |
| REDIS      | 五字节 | 'R'、'E'、'D'、'I'、'S'五个字符                              |
| db_version | 四字节 | 这个整数记录了RDB文件的版本号                                |
| databace   | ··     | 包含着零个或任意多个数据库，以及各个数据库中的键值对数据     |
| EOF        | 一字节 | RDB文件正文内容结束的标志                                    |
| check_sum  |        | 这个校验和是程序通过对REDIS、db_version、databases、EOF四个部分的内容进行计算得出的校验和 |

**databace**

每个非空数据库在RDB文件中都可以保存为SELECTDB、db_number、key_value_pairs三个部分

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111152118809.png" alt="image-20211115211857775" style="zoom:80%;" />

- SELECTDB常量 ，1字节 预示接下来读入的将是一个数据库号码。

- db_number保存着一个数据库号码， 这个部分的长度可以是1字节、2字节或者5字节。 

- key_value_pairs部分保存了数据库中的所有键值对数据，如果键值对带有过期时间，那么过期时间也会和键值对保存在一起。 

   key_value_pairs分成带过期时间和不带过期时间两种键值对：

  - 不带过期时间的键值对由TYPE、key、value三部分组成

    - TYPE：记录VALUE的类型决定如何读入和解释value的数据
    - key：键值对键对象
    - value：键值对值对象

  - 带过期时间的额外有EXPIRETIME_MS和ms两个部分：

    <img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111152127767.png" alt="image-20211115212704720" style="zoom:50%;" />

    - EXPIRETIME_MS常量的长度为1字节，它告知读入程序，接下来要读入的将是一个以毫秒为单位的过期时间。
    - ms是一个8字节长的带符号整数，记录着一个以毫秒为单位的UNIX时间戳，这个时间戳就是键值对的过期时间。

**VALUE编码**

 每个value部分都保存了一个值对象，每个值对象的类型都由与之对应的TYPE记录，根据类型的不同，value部分的结构、长度也会有所不同。

value可以使五种基本对象中的任意一种。

### 4. 分析RDB

通常使用od命令分析Redis服务器产生的RDB文件 

例如：

 ![image-20211115213211057](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111152132106.png)

下面举例说明RDB文件中各个标识含义：

  包含带有过期时间的字符串键的RDB文件

打印RDB文件：

![image-20211115213450589](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111152134622.png)

❑一个一字节长的EXPIRETIME_MS特殊值。

❑一个八字节长的过期时间（ms）。

❑一个一字节长的类型（TYPE）。

❑一个键（key）和一个值（value）。根据这些特征，可以得出RDB文件各个部分的意义：❑REDIS0006：RDB文件标志和版本号。

❑376\0：切换到0号数据库。

❑374：代表特殊值EXPIRETIME_MS。

❑\2 365 336@001\0\0：代表八字节长的过期时间。

❑\0 003 M S G：\0表示这是一个字符串键，003是键的长度，MSG是键。

❑005 H E L L O：005是值的长度，HELLO是值。

❑377：代表EOF常量。

❑212 231 x 247 252 } 021 306：代表八字节长的校验和。

## 二、AOF持久化

与RDB 持久化不同AOF 持久化通过保存数据库写命令来记录状态

写入AOF 文件的命令都会以redis命令请求协议格式保存

### 1.实现原理

AOF 持久化的实现可以分成命令追加、文件写入、文件同步三个步骤。

**命令追加**

当AOF处于打开时，每次完成一个写命令，都会在服务器状态的aof_buf缓冲区追加相应的写命令

**写入与同步**

 服务器每次结束一个事件循环之前， 都会调用flushAppendOnlyFile函数，考虑是否需要将aof_buf缓冲区中的内容写入和保存到AOF文件中

最后调用flushAppendOnlyFile函数，其行为由服务器配置的appendfsync选项的值决定

![image-20211115214826867](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111152148921.png)

默认是everysec

注：为了提高文件写效率，通常将写数据加入内存缓冲区，到达一定条件之后再写入磁盘，这样提高了效率，但是会带来安全隐患。

​		因此：系统提供了fsync和fdatasync两个同步函数， 可以强制让操作系统立即将缓冲区中的数据	写入到硬盘 确保写入数据的安全性。

**AOF持久化的效率和安全性**

appendfsync选项的值直接决定AOF持久化功能的效率和安全性。

- always：每一个事件都会将aof_buf缓冲区所有内容写入AOF 文件，并且进行同步。效率最慢
- everysec：每一个事件都会将所有内容写入AOF 文件， 每隔一秒 在子线程中对AOF文件进行一次同步
- no：每一个事件都会将所有内容写入AOF 文件，何时对AOF文件进行同步，则由操作系统控制

### 2.载入与还原

**载入还原**

 读取AOF文件并还原数据库状态 ,步骤如下:

1）创建一个不带网络连接的伪客户端（fake client）（ 服务器使用一个没有网络连接的伪客户端来执行AOF文件保存的写命令， 效果与实际使用客户端完全没有影响。）

2）从AOF文件中分析并读取出一条写命令。

3）使用伪客户端执行被读出的写命令。

4）一直执行步骤2和步骤3，直到AOF文件中的所有写命令都被处理完毕为止。

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111152157784.png" alt="image-20211115215741707" style="zoom:80%;" />

### 3.AOF 重写

重写：解决AOF文件体积膨胀的问题

创建一个新的AOF文件替代现有文件，新旧两个文件保存的数据库状态相同。新文件不会保存浪费空间的冗余命令。

通过读取服务器当前状态实现，解决了之前对于同一个键的大量操作引起臃肿的问题。

使用 aof_rewrite函数生成的新AOF文件，只包含还原当前数据库状态所必须的命令， 浪费任何硬盘空间。

**后台重写**

重写函数会占用大量的线程时间（Redis服务器使用单个线程来处理命令请求），无法处理客户端请求。

因此将AOF重写程序放到子进程里执行

好处：

❑子进程进行AOF重写期间，服务器进程（父进程）可以继续处理命令请求。

❑子进程带有服务器进程的数据副本，使用子进程而不是线程，可以在避免使用锁的情况下，保证数据的安全性。

**重写缓冲区**

同样，重写时主进程进行操作会影响数据库状态，避免这种情况，服务器设置了重写缓冲区，与重写子进程一同开启。

——>Redis服务器执行完一个写命令之后，它会同时将这个写命令发送给AOF缓冲区和AOF重写缓冲区

——>当子进程完成AOF重写后，向父进程发送信号，父进程把重写缓冲区内容写入到新的AOF文件中
