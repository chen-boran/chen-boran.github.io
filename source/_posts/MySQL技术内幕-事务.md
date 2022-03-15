---
title: MySQL技术内幕-事务
date: 2022-02-12 13:56:18
tags: 
- MySQL
categories: 
- Notes
keywords:
description: some of my notes
top_img: 
comments: 
cover: https://ae01.alicdn.com/kf/Ue5889eaf11594a4aabca090c5d5060798.jpg
toc:  
toc_number:
copyright:
mathjax:
katex:
---

事务是数据库区别与文件系统的重要特征之一。



InnoDB存储引擎的事务完全符合ACID特性：

即：原子性（atomicity）

一致性（consistency）

持久性（isolation）

隔离性（durability）

### 一、事务

**一、事务特性**

原子性（atomicity）

一致性（consistency）

持久性（isolation）

隔离性（durability）



**二、分类**

:1234:扁平事务

:1234:带保存点的扁平事务

:1234:链事务

:1234:嵌套事务

:1234:分布式事务



### 二、事务的实现

事务的ACID 特性通过 redo log和undo log来完成。

redo log用于恢复事务提交的页修改操作（物理日志），undo log用于回滚行记录到某一特定版本（逻辑日志）。

**一、redo**

**二、undo**

**三、purge**

delete和update可能不会直接改变原有的数据。

purge用于最终完成delete和update操作。这是因为InnoDB支持MVCC，记录不能在事务提交时立即进行处理。





### 三、事务控制语句

默认设置下，事务都是自动提交的，执行SQL之后马上提交。

下面来看一些事务控制语句

​	<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203100957218.png" alt="image-20220310095712117" style="zoom:80%;" />

​	START TRANSACTION、BEGIN 语句都可以显示得开启一个事务（存储过程中只能使用STAET TRANSACTION）

​	COMMIT 和COMMIT WORK 语句基本是一致的，都用来提交事务的。COMMIT WORK 是用来控制事务结束后的行为是CHAIN 还是RELEASE 。

​	InnoDB的事务都是原子的。这种原子性能延伸到每一条SQL 语句，因此一条语句执行失败抛出异常时，之前执行成功的语句并不会自动回滚，而是由用户自己决定。

​	此外，需要注意的是：**ROLLBACK TO SAVEPOINT** 之后也需要显示的运行COMMIT / ROLLBACK命令。因为**并没有真正结束一个事务**。必须手动提交。



### 四、隐式提交的SQL 

以下SQL语句会形成一个隐式的提交，即隐式的COMMIT 

如图所示：

​	![image-20220310101247989](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203101012073.png)

 需要注意的是DDL语句在InnoDB中是不能回滚的。这点和SQL server不同。

TRUNCATE TABLE 是DDL语句，虽然执行结果和整个表的DELETE 相同，但是是不能回滚的。



### 五、事务统计操作

InnoDB存储引擎是支持事务的，在考虑每秒请求数的同时还要考虑每秒事务处理能力TPS。

TPS 计算方法：（com_commit+com_rollback）/time

​		注：所有事物都要是显示提交的。否则不计入其中 。

### 六、事务的隔离级别

说到隔离级别，相信肯定不会陌生了。

SQL 标准定义的四个隔离级别：

-  READ UNCOMMITED 
- READ COMMITED

- REPEATABLE READ
- SERIALIZABLE

**说明：**

​	InnoDB在可重复读隔离级别下，使用Next-Key Lock算法，避免幻读产生。

​	事物的隔离级别越低，事务请求的锁越少，保持锁的时间越短。

常见的一些操作：

​		<img src="C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20220310102415620.png" alt="image-20220310102415620" style="zoom:80%;" />



### 七、分布式事务

​	分布式事务是指允许多个独立的事务单元参与到一个全局事务中 。

​	需要注意的是：**使用分布式事务时，InnoDB的隔离级别，要设置成SERIALIZABLE**

InnoDB存储引擎提供了对XA 事务的支持，来支持分布式事务的实现。

XA 事务允许不同数据之间的分布式事务。只要参与全局事务的每一个节点都支持XA事务。

​	XA 事务由一个或者多个资源管理器、一个事务管理器、一个应用程序组成。

- 资源管理器：提供访问食物资源的方法，通常一一对应一个数据库。
- 事务管理器：协调参与全局事务的各个事务，需要和所有的资源管理器进行通信。
- 应用程序：定义事物的边界，指定全局事务中的操作。

![image-20220310104055813](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203101040913.png)

分布式事务使用两段提交的方式。第一阶段所有参与事务的节点开始准备，通知事务管理器准备好提交了。第二阶段事务管理器告诉资源管理器执行提交或者回滚。

​	由此可见，如果任何一个节点不能够成功的提交，那么所有节点都要被通知回滚。

**内部XA事务**

​	MySQL还存在另外一种 XA事务。在存储引擎和插件之间，或者在存储引擎和存储引擎之间，成为内部XA 事务。

​	绝大多数内部XA 事务都存在于，binlog和InnoDB存储引擎之间，由于复制需要，绝大多数数据库都开启了binlog功能。在事务提交时，先写入二进制日志文件 ，再写入InnoDB的重做日志，上述两个操作应该是原子的操作。
