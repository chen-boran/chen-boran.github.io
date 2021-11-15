---
title: Computer Network summery  应用层
date: 2021-06-20 20:01:24
tags: thinks
categories: thinks
keywords:
description: some of my thinks
top_img: 
comments: 
cover: https://ae01.alicdn.com/kf/Ue5889eaf11594a4aabca090c5d5060798.jpg
toc:  
toc_number:
copyright:
mathjax:
katex:
---

# Computer Network summery  应用层



 ## 一、 概述

### 1.协议原理

- 常见的网络应用程序： Web 、电子邮件、 DNS 、对等文件分发
- 主要概念：应用程序的网络服务、客户和服务器、进程、运输层接口

- 应用软件在端系统上运行 

### 2.应用程序体系结构

- 网络应用程序体系结构：

  - 客户-服务器体系结构：（配备大量数据中心，创建虚拟服务器）

    ​                常见应用程序Telnet 、电子邮件、Web/FTP

  - 对等P2P体系结构

    - 当前流行的、流量密集型应用  包括文件共享(例如 BitTorrenl) 、对等方协助下载加速器(例如迅雷)、因特网电话(例如 Skype) IPTV
    - P2P 的自扩展性 self- scalab i1 ity)

### 3.进程

- 进行通信的实际上是进程，而不是程序

- 客户和服务器进程

  - 客户进程/服务器进程   例：web服务中，浏览器：客户进程；web服务器：服务进程

    

- API

  - 进程通过一个称为**套接字** (socket)的软件接口向网络发送报文和从网络接收报文 

  - 套接字是建立网络应用程序的可编程接口，也称为应用程序和网络之间的**应用程序编程接口** (Application Programming Interface , API)

  - 可以控制套接字在**应用层端**，对套接字的**运输层端**几乎没有控制权 

    应用程序开发者对于运输层的控制仅限于：

    ①选择运输层协议;

    ②几个运输层参数

- 进程寻址

  - 标识进程：目的地端口号(port number)：用来标识 运行在主机上的进程

### 4.运输服务

#### 4.1应用程序



- 可靠数据传输：一端发送的应用数据正确、完全地交付给该应用程序的另一端

  - 容忍丢失的应用：能够接受不可靠传输的应用进程

    例如 多媒体应用

- 吞吐量：运输层协议能够以某种特定的速率提供确保的可用吞吐量

  - 具有吞吐量要求的应用程序被称为**带宽敏感的应用** (bandwidth- sensitive applicaLi on)

  - **弹性应用**( el皑白 applicaLi on) 能够根据情况或多或少地利用可供使用的吞吐量

    例如：电子邮件、文件传输以及 Web 传送 

- 定时 

  - 某些服务为了有效性 ，要求数据交付有严格的时间限制

    例如 :交互式实时应用程序

- 安全性

#### 4.2因特网

- 因特网(更一般的是 TCP/IP 网络)为应用程序提供两个运输层协议，即 UDP和 TCP

- ![image-20210527112725518](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210527112725518.png)

- **TCP**

- **UDP**

- 互联网运输协议不能提供任何**定时**或**带宽保证**

- 流行的因特网应用及其应用层协议和支撑的运输协议

  ![image-20210527113131403](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210527113131403.png)

#### 5.应用层协议

- 作用：定义了运行在不同端系统上的应用程序进程如何相互传递报文：

  - 交换的报文类型，
  - 各种报文类型的语法，
  - 字段的语义
  - 一个进程何时以及如何发送报文，对报文进行响应的规则

- 应用层协议只是网络应用的一部分

- 讨论几种重要的应用: Web 、文件传输、电子邮件、目录服务和P2P

  以及他们的相关协议。







## 二、Web与HTTP

### 1.http

#### 1.1概述



- Web 的应用层协议是超文本传输协议 (HyperText Transfer Protocol , HTTP) 

- 由两个程序实现：客户端程序和服务器程序
- 使用TCP 作为支撑运输协议
- 无状态协议：不保存关于客户的任何信息
- HTTP 既能够使用非持续连接，也能够使用持续连接，默认状态是持续性连接
  - 持续性连接
  - 非持续性连接

#### 1.2报文格式

​	分类:请求报文和响应报文

- 请求报文

  ![image-20210527201409324](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210527201409324.png)

HTTP 请求报文的第一行 **请求行** (request line) ，

后继的行叫做**首部行**( header line) 

请求行有3个字段:方法字段、 URL 字段和 HTTP 版本字段 

方法宇段可以取几种不同的值，包括 GET OST HEAD PUT DELETE

Connec Li on: close 首部行

User- agent: 首部行

Accept -language 首部行

首部行 Host: www. someschool. edu

- 请求报文通用首部格式

![image-20210527202001957](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210527202001957.png)



- 响应报文

![image-20210527202207984](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210527202207984.png)

​				组成：一个初始状态行 (sLatus line) 、首部行 (header 1ine) 、实体体 				(enLity body)-----报文的主要部分

​				Connection: close 首部行

​				Date: 首部行

​				Server: 首部行

​				Last- Moclified: 首部行

​				Conlenl- Length: 首部行

​				Conlent- Type: 首部行





- 响应报文通用格式：

​	![image-20210527202521768](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210527202521768.png)



- 响应报文常见的状态码和相关的短语:

 200 OK: 请求成功信息在返回的响应报文中

• 301 Movecl Pennanenùy: 请求的对象已经被永久转移了，新的 URL 定义在响应报文的LocaLi oD: 首部行中 客户软件将自动获取新的 URL

• 400 Bad Request: 一个通用差错代码，指示该请求不能被服务器理解72 

• 404 Not FO lll1 d: 被请求的文档不在服务器上

• 505 HTTP Version Not Supported: 服务器不支持请求报文使用的 HTTP 协议版本

#### 1.3Cookie

- cookie 技术的4个组件:

  - ①在 HTTP 响应报文中的 cookie 首部行;
  - ②在 HTTP 请求报文中的一个 cookie 首部行;
  - ③在用户端系统中保留有 cookie件，并由用户的浏览器进行管理;
  - ④位于 Web 站点的一个后端数据库

- 流程：

  ![image-20210527203342657](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210527203342657.png)



- *****************************************************************************

  



1. 用户首次访问 个站点时，可能需要提供 个用户标识(可能是名字)

2. 在后继会话中，浏览器向服务器传递cookie 首部，从而向该服务器标识了用户

3. 因此 cookie 可以在无状态的 HTTP 之上建立个用户会话层 



- 注:它的使用仍具有争议，因为它们被认为是对用户隐私的一种侵害



#### 1.4Web缓存

- **Web 缓存器**也叫**代理服务器**

- 拥有自己的存储空间；

- Web 缓存器是服务器同时又是客户（可以发送和接收响应）

- 部署 Web 缓存器有两个原因：

  - 大大减少对客户请求的响应时间

    - 是当客户与初始服务器之间的瓶颈带宽远低于客户与 Web 缓存器之

      间的瓶颈带宽时更是如此

  - 大大减少一个机构的接入链路到闲特网的通信量

    - 减少通信量， 不必急于增加带宽，降低了费用。



具体详见 图解http



## 三、文件传输协议：FTP

#### 1. 协议运行

，用户通过一个阿?用户代理与阿?交五 该用

户首先提供远程主机的主机名，使本地主机的归?客户进程建立一个到远程主机凹?服务

器进程的 TCP 连接。该用户接着提供用户标识和口令，作为 FTP 命令的一部分在该 TCP

连接上传送。一旦该服务器向该用户授权，用户可以将存放在本地文件系统中的一个或者

多个文件复制到远程文件系统(反之亦然)。



#### 2. FTP 和HTTP 的区别

##### 2.1 连接

- FTP 使用了两个并行的 TCP 连接来传输文件
  - 控制连接 (control connection)：在两主机之间传输控制信息
  - 数据连接( data connection)：实际发送一个文件
  - ![image-20210527205305119](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210527205305119.png)
- HTTP 协议是在传输文件的同一个 TCP 连接中发送请求和响应首部行

##### 2.2 状态

- FTP 服务器必须在整个会话期间保留用户的状态( state)；
- HTTP 是无状态的，即它不必对任何用户状态进行追踪

#### 3.常见命令和回答

- 命令和回答都是7比特 ASCII格式在控制连接上传送

##### 3.1 命令



- 每个命令由 个大写字母 ASCII 字符组成，有些还具有可选参数

- 为常见的命令如下:

  - USER usemame: 用于向服务器传送用户标识

  - P ASS password: 用于向服务器发送用户口令

  - UST: 用于请求服务器回送当前远程目录中的所有文件列表 该文件列表是经一个(新建且非持续连接)数据连接传送的，而不是在控制 TCP 连接上传送。

  - RETR filename: 用于从远程主机当前目录检索(自 gel) 文件 该命令引起远程主机发起一个数据连接，并经该数据连接发送所请求的文件

  - STOR filename: 用于在远程主机的当前目录上存放(即 put) 文件

- 每个命令都对应着一个从服务器发向客户的回答。

##### 3.2 回答 

- 回答是一个三位数字，加上可选信息。

- 一些典型的回答连同它们可能的报文：
  - 331 Usemame OK , Password requüed (用户名 OK ，需要口令)
  - 125 Dala connection already open; transfer starting (数据连接已经打开，开始传送)
  - 425 Can' L open daLa connection (无法打开数据连接)
  - 452 Error writing (写文件差错)

## 四、电子邮件







## 五、DNS

因特网的目录服务







## 六、P2P











