---
title: JVM-故障处理工具
date: 2022-03-28 11:07:06
tags:
- JVM
categories:
- Notes
keywords:
description:
top_img:
comments:
cover:https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203181133603.jpg
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

 下面我们将从实践的角度去认识虚拟机内存管理的世界。

工具是处理数据的手段。恰当地使用虚拟机故障处理、分析的工具可以提升我们分析数据、定位并解决问题的效率。



## 一、基本故障处理工具

我们都知道JDK的bin目录中有java.exe、javac.exe这两个命令行工具

与此同时java的bin目录下还有其他各种小工具。

 随着jdk版本的更迭，这些小工具的数量和功能也在不知不觉地增加与增强。除了编译和运行Java程序外，打包、部署、签名、调试、监控、运维等各种场景都可能会用到它们，

下面介绍常见的小工具，以便更好地使用它们。

这些工具主要分成三类：

- 商业授权工具：主要是JMC（Java Mission Control）及它要使用到的JFR（Java Flight Recorder），在商业环境中使用它则是要付费的
- 正式支持工具：这一类工具属于被长期支持的工具，不同平台、不同版本的JDK之间，这类工具可能会略有差异
- 实验性工具：“没有技术支持，并且是实验性质的”，即不是正式支持的实验性质工具。

下面介绍常见的工具，以jdk1.5版本为例。

### 1.1 jps

jps（JVM Process Status Tool）

它的功能也和ps命令类似：

- 可以列出正在运行的虚拟机进程，

- 显示虚拟机执行主类（MainClass，main()函数所在的类）名称

- 这些进程的本地虚拟机唯一ID（LVMID，Local Virtual Machine Identifier）。

是使用频率最高的JDK命令行工具。

因为对于本地虚拟机进程来说，他查询到的 LVMID与操作系统的进程ID（PID，Process Identifier）是一致的。

jps命令格式：

​			![image-20220328113322493](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220328113322493.png)

jps的其他参数:

​		![image-20220328113353009](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220328113353009.png)

### 1.2  jstat

jstat（JVM Statistics Monitoring Tool）是用于监视虚拟机各种运行状态信息的命令行工具

可以显示本地或者远程虚拟机进程中的类加载、内存、垃圾收集、即时编译等运行时数据

![image-20220328114027797](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220328114027797.png)

- VMID与LVMID：如果是本地虚拟机进程，VMID与LVMID是一致的；如果是远程虚拟机进程，那VMID的格式应当是
  - ![image-20220328114512070](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220328114512070.png)

- interval：查询间隔

- count：查询次数

常见参数：

![image-20220328114244733](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220328114244733.png)

### 1.3 jinfo

jinfo（Configuration Info for Java）的作用是实时查看和调整虚拟机各项参数。

使用jps命令的-v参数可以查看虚拟机启动时显式指定的参数列表，但如果想知道未被显式指定的参数的系统默认值， 就得使用jinfo的-flag选项进行查询了。

命令格式：

![image-20220328114813425](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220328114813425.png)

### 1.4 jmap

jmap（Memory Map for Java）命令用于生成堆转储快照（一般称为heapdump或dump文件）。

jmap的作用并不仅仅是为了获取堆转储快照，它还可以查询finalize执行队列、Java堆和方法区的详细信息。

和jinfo命令一样，jmap有部分功能在Windows平台下是受限的（除了-dump和-histo选项，剩下的只能在linux中使用）

命令格式：

​			![image-20220328115222432](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220328115222432.png)

主要选项：![image-20220328115236286](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220328115236286.png)

### 1.5 jhat

JDK提供jhat（JVM Heap Analysis Tool）命令与jmap搭配使用，来分析jmap生成的堆转储快照

内置了一个微型的HTTP/Web服务器，生成堆转储快照的分析结果后，可以在浏览器中查看。

在实际工作环境中，并不常用。



### 1.6 堆栈跟踪器

jstack（Stack Trace for Java）命令用于生成虚拟机当前时刻的线程快照（一般称为threaddump或者javacore文件）

目的通常是**定位线程出现长时间停顿的原因**，如线程间死锁、死循环、请求外部资源导致的长时间挂起等

命令格式：

​			![image-20220328115721080](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220328115721080.png)

主要选项：

​		![image-20220328115744490](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220328115744490.png)



上面只介绍了几种基础的工具，当然jdk中还有很多的工具同样十分有用。在此不进行过多介绍。



## 二、可视化故障处理工具

之前的都是命令行操作的工具。

同时jdk还集成了几个功能集成度更高的可视化工具。

有：JConsole、JHSDB、VisualVM和JMC四个



下面主要介绍VisualVM。

- VisualVM（All-in-One Java Troubleshooting Tool）是功能最强大的运行监视和故障处理程序之一。

**1.VisualVM兼容范围与插件安装**

VisualVM基于NetBeans平台开发工具，VisualVM基于NetBeans平台开发工具。

有了插件扩展支持，VisualVM可以做到：

·显示虚拟机进程以及进程的配置、环境信息（jps、jinfo）。

·监视应用程序的处理器、垃圾收集、堆、方法区以及线程的信息（jstat、jstack）。

·dump以及分析堆转储快照（jmap、jhat）。

·方法级的程序运行性能分析，找出被调用最多、运行时间最长的方法。

·离线程序快照：收集程序的运行时配置、线程dump、内存dump等信息建立一个快照，可以将快照发送开发者处进行Bug反馈。

 VisualVM主要功能兼容性列表：

![image-20220328121114595](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220328121114595.png)

首次启动VisualVM的时候没有继承任何插件。

VisualVM的插件可以手工进行安装。

**2.生成、浏览堆转储快照**

在VisualVM中生成堆转储快照文件有两种方式，可以执行下列任一操作：

·在“应用程序”窗口中右键单击应用程序节点，然后选择“堆Dump”。

·在“应用程序”窗口中双击应用程序节点以打开应用程序标签，然后在“监视”标签中单击“堆Dump”。

之后可以对生成的转储快照进行保存。通过文件菜单的装入功能进行导入快照文件。

**3.分析程序性能**

在Profiler页签中，VisualVM提供了程序运行期间方法级的处理器执行时间分析以及内存分析



更多使用方法：[[ IDEA集成VisualVM](https://www.cnblogs.com/avivaye/p/10515259.html)](https://www.cnblogs.com/avivaye/p/10515259.html)

