---
title: Redis 事件驱动模型
date: 2021-11-11 21:05:50
tags:
- Redis
categories:
- ["技术转载"]
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

# Redis 事件驱动模型

 

本文参考于：[参考文章](https://www.xilidou.com/2018/03/22/redis-event/) 

Redis 是一个事件驱动的内存数据库，服务器需要处理两种类型的事件。

- 文件事件
- 时间事件

下面就会介绍这两种事件的实现原理。



# 文件事件

Redis 服务器通过 socket 实现与客户端（或其他redis服务器）的交互,文件事件就是服务器对 socket 操作的抽象。 Redis 服务器，通过监听这些 socket 产生的文件事件并处理这些事件，实现对客户端调用的响应。

## Reactor

Redis 基于 Reactor 模式开发了自己的事件处理器。

这里就先展开讲一讲 Reactor 模式。看下图：

  ![image-20211111210107719](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111112101800.png)

- “I/O 多路复用模块”会监听多个 FD ，当这些FD产生，accept，read，write 或 close 的文件事件。会向“文件事件分发器（dispatcher）”传送事件。

- 文件事件分发器（dispatcher）在收到事件之后，会根据事件的类型将事件分发给对应的 handler。

注：

​		文件事件会并发的产生，但是I/O多路复用程序会把所有的事件套接字放到一个队列中，有序、同步、每次一个的方式向文件事件分派器传送。

​		只有上一个事件套接字被处理完毕，I/O多路复用程序才继续传送下一个事件套接字。

下面从上到下的逐一讲解 Redis 是怎么实现这个 Reactor 模型的。



## 事件的类型

I/O多路复用程序可以监听多个套接字的ae.h/AE_READABLE和ae.h/AE_WRITABLE事件。

- 套接字变的可读的时候，或者有新的可应答套接字出现时，套接字产生AE_READABLE
- 套接字变得可写时，套接字产生AE_WRITABLE事件。

注：一个套接字又可读有可写的话，服务器将**先读后写**套接字。

## I/O 多路复用模块

Redis 的 I/O 多路复用模块的所有功能，其实是封装了操作系统提供的 select，epoll，avport 和 kqueue 这些基础II/O多路复用函数。每个I/O多路复用函数库都在Redis源码中都有一个单独的文件。REDIS 为每个多路复用函数库实现了相同的API ，因此I/O多路复用的底层实现是可以互换的。向上层提供了一个统一的接口，屏蔽了底层实现的细节。

一般而言 Redis 都是部署到 Linux 系统上，所以我们就看看使用 Redis 是怎么利用 linux 提供的 epoll 实现I/O 多路复用。

首先看看 epoll 提供的三个方法：

```
/*
 * 创建一个epoll的句柄，size用来告诉内核这个监听的数目一共有多大
 */
int epoll_create(int size)；

/*
 * 可以理解为，增删改 fd 需要监听的事件
 * epfd 是 epoll_create() 创建的句柄。
 * op 表示 增删改
 * epoll_event 表示需要监听的事件，Redis 只用到了可读，可写，错误，挂断 四个状态
 */
int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event)；

/*
 * 可以理解为查询符合条件的事件
 * epfd 是 epoll_create() 创建的句柄。
 * epoll_event 用来存放从内核得到事件的集合
 * maxevents 获取的最大事件数
 * timeout 等待超时时间
 */
int epoll_wait(int epfd, struct epoll_event * events, int maxevents, int timeout);
```

再看 Redis 对文件事件，封装epoll向上提供的接口：

```
/*
 * 事件状态
 */
typedef struct aeApiState {

    // epoll_event 实例描述符
    int epfd;

    // 事件槽
    struct epoll_event *events;

} aeApiState;

/*
 * 创建一个新的 epoll 
 */
static int  aeApiCreate(aeEventLoop *eventLoop)
/*
 * 调整事件槽的大小
 */
static int  aeApiResize(aeEventLoop *eventLoop, int setsize)
/*
 * 释放 epoll 实例和事件槽
 */
static void aeApiFree(aeEventLoop *eventLoop)
/*
 * 关联给定事件到 fd
 */
static int  aeApiAddEvent(aeEventLoop *eventLoop, int fd, int mask)
/*
 * 从 fd 中删除给定事件
 */
static void aeApiDelEvent(aeEventLoop *eventLoop, int fd, int mask)
/*
 * 获取可执行事件
 */
static int  aeApiPoll(aeEventLoop *eventLoop, struct timeval *tvp)
```

所以看看这个ae_peoll.c 如何对 epoll 进行封装的：

- `aeApiCreate()` 是对 `epoll.epoll_create()` 的封装。
- `aeApiAddEvent()`和`aeApiDelEvent()` 是对 `epoll.epoll_ctl()`的封装。
- `aeApiPoll()` 是对 `epoll_wait()`的封装。

这样 Redis 的利用 epoll 实现的 I/O 复用器就比较清晰了。

再往上一层次我们需要看看 ea.c 是怎么封装的？

首先需要关注的是事件处理器的数据结构：

```
typedef struct aeFileEvent {

    // 监听事件类型掩码，
    // 值可以是 AE_READABLE 或 AE_WRITABLE ，
    // 或者 AE_READABLE | AE_WRITABLE
    int mask; /* one of AE_(READABLE|WRITABLE) */

    // 读事件处理器
    aeFileProc *rfileProc;

    // 写事件处理器
    aeFileProc *wfileProc;

    // 多路复用库的私有数据
    void *clientData;

} aeFileEvent;
```

`mask` 就是可以理解为事件的类型。

除了使用 ae_peoll.c 提供的方法外,ae.c 还增加 “增删查” 的几个 API。

- 增:`aeCreateFileEvent`
- 删:`aeDeleteFileEvent`
- 查: 查包括两个维度 `aeGetFileEvents` 获取某个 fd 的监听类型和`aeWait`等待某个fd 直到超时或者达到某个状态。

## 事件分发器（dispatcher）

Redis 的事件分发器 `ae.c/aeProcessEvents` 不但处理文件事件还处理时间事件，所以这里只贴与文件分发相关的出部分代码，dispather 根据 mask 调用不同的事件处理器。

```
//从 epoll 中获关注的事件
numevents = aeApiPoll(eventLoop, tvp);
for (j = 0; j < numevents; j++) {
    // 从已就绪数组中获取事件
    aeFileEvent *fe = &eventLoop->events[eventLoop->fired[j].fd];

    int mask = eventLoop->fired[j].mask;
    int fd = eventLoop->fired[j].fd;
    int rfired = 0;

    // 读事件
    if (fe->mask & mask & AE_READABLE) {
        // rfired 确保读/写事件只能执行其中一个
        rfired = 1;
        fe->rfileProc(eventLoop,fd,fe->clientData,mask);
    }
    // 写事件
    if (fe->mask & mask & AE_WRITABLE) {
        if (!rfired || fe->wfileProc != fe->rfileProc)
            fe->wfileProc(eventLoop,fd,fe->clientData,mask);
    }

    processed++;
}
```

可以看到这个分发器，根据 mask 的不同将事件分别分发给了读事件和写事件。

## 文件事件处理器的类型

Redis 有大量的事件处理器类型，我们就讲解处理一个简单命令涉及到的三个处理器：

- acceptTcpHandler 连接应答处理器，负责处理连接相关的事件，当有client 连接到Redis的时候们就会产生 AE_READABLE 事件。引发它执行。
- readQueryFromClinet 命令请求处理器，（客户端向服务器发送命令请求时）负责读取通过 sokect 发送来的命令。
- sendReplyToClient 命令回复处理器，（向客户端返回命令的执行结果）当Redis处理完命令，就会产生 AE_WRITEABLE 事件，将数据回复给 client。



# 时间事件

Reids 有很多操作需要**在给定的时间点**进行处理，时间事件就是对这类定时任务的抽象。

所有时间事件都被存储在无序链表（无序是指不按照when的大小排序）中。

注：无序链表并不影响时间事件处理器的性能。

​		新的事件总是查到链表的表头。

先看时间事件的数据结构：

```
/* Time event structure
 *
 * 时间事件结构
 */
typedef struct aeTimeEvent {

    // 时间事件的唯一标识符
    long long id; /* time event identifier. */

    // 事件的到达时间
    long when_sec; /* seconds */
    long when_ms; /* milliseconds */

    // 事件处理函数
    aeTimeProc *timeProc;

    // 事件释放函数
    aeEventFinalizerProc *finalizerProc;

    // 多路复用库的私有数据
    void *clientData;

    // 指向下个时间事件结构，形成链表
    struct aeTimeEvent *next;

} aeTimeEvent;
```

看见 `next` 我们就知道这个 aeTimeEvent 是一个链表结构。看图：

 ![image-20211111210032286](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111112100348.png)

注意这是一个按照id倒序排列的链表，并没有按照事件顺序排序。

### 分类

时间时间可以分成两类：定时事件、周期时间

- 定时时间:一个程序指定时间之后执行.
- 周期时间:一段程序每隔指定时间执行一次.

具体是什么时间取决于:事件处理的返回值

- 返回ae.h/AE_NOMORE,那么就是定时事件,到达一次之后就会被删除,之后不再到达.
- 返回一个整数值，那么是周期时间。服务器根据返回值更新属性中的when，让事件一段时间之后再次到达。



### 属性

一个时间事件通常有三种属性：

- id：服务器为时间事件创建的全局唯一ID，从小到大递增
- when:毫秒精度的时间戳,记录时间到达的时间.
- timeProc:时间事件处理器,一个函数。

## processTimeEvent

Redis 使用这个函数处理所有的时间事件，我们整理一下执行思路：

1. 记录最新一次执行这个函数的时间，用于处理系统时间被修改产生的问题。
2. 遍历链表找出所有 when_sec 和 when_ms 小于现在时间的事件。
3. 执行事件对应的处理函数。
4. 检查事件类型，如果是周期事件则刷新该事件下一次的执行事件。
5. 否则从列表中删除事件。

# 综合调度器（aeProcessEvents）

因为Redis中存在两种时间类型，服务器必须对这两种时间进行调度，决定何时处理哪个事件。

综合调度器是 Redis 统一处理所有事件的地方。我们梳理一下这个函数的简单逻辑：

```
// 1. 获取离当前时间最近的时间事件
shortest = aeSearchNearestTimer(eventLoop);

// 2. 获取间隔时间
timeval = shortest - nowTime;

// 如果timeval 小于 0，说明已经有需要执行的时间事件了。
if(timeval < 0){
    timeval = 0
}

// 3. 在 timeval 时间内，取出文件事件。
numevents = aeApiPoll(eventLoop, timeval);

// 4.根据文件事件的类型指定不同的文件处理器
if (AE_READABLE) {
    // 读事件
    rfileProc(eventLoop,fd,fe->clientData,mask);
}
    // 写事件
if (AE_WRITABLE) {
    wfileProc(eventLoop,fd,fe->clientData,mask);
}
```

以上的伪代码就是整个 Redis 事件处理器的逻辑。

我们可以再看看谁执行了这个 `aeProcessEvents`:

```
void aeMain(aeEventLoop *eventLoop) {

    eventLoop->stop = 0;

    while (!eventLoop->stop) {

        // 如果有需要在事件处理前执行的函数，那么运行它
        if (eventLoop->beforesleep != NULL)
            eventLoop->beforesleep(eventLoop);

        // 开始处理事件
        aeProcessEvents(eventLoop, AE_ALL_EVENTS);
    }
}
```

然后我们再看看是谁调用了 `eaMain`:

```
int main(int argc, char **argv) {
    //一些配置和准备
    ...
    aeMain(server.el);
    
    //结束后的回收工作
    ...
}
```

我们在 Redis 的 main 方法中找个了它。

这个时候我们整理出的思路就是:

- Redis 的 main() 方法执行了一些配置和准备以后就调用 `eaMain()` 方法。
- `eaMain()` while(true) 的调用 `aeProcessEvents()`。

因此我们说 Redis 是一个事件驱动的程序，期间我们发现，Redis 没有 fork 过任何线程。所以也可以说 Redis 是一个基于事件驱动的单线程应用。

## 事件调度规则

- aeApiPoll函数最大阻塞时间由到达时间最接近当时时间的时间事件决定，避免了忙等待，也确保阻塞时间不会太长。
- 文件事件随机出现的，如果等待并处理一次文件事件之后仍然没有任何时间事件发生，服务器将再此等待处理文件事件。
- 文件和时间事件的处理都是同步、有序、原子的进行。服务器不会进行中断和抢占事件
- 时间事件在文件事件之后执行，因此执行时间会比预先时间晚一些。
