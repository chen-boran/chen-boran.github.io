---
title: 初步理解JAVA 虚拟机（黑马）
date: 2021-06-20 20:12:56
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

 

 定义：java Virtural Machine  （java二进制代码**运行环境**）

优点：

- 一次编写，到处运行

- 自动内存管理，垃圾回收机制
- 数组下标越界检查

- 多态机制

JVM屏蔽java和底层操作系统的差异：

![image-20210618122158873](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210618122158873.png)

常见JVM：

学习路线：![image-20210618122633191](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210618122633191.png)



# 一.内存结构	

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps1.png)

\1. 程序计数器

\2. 虚拟机栈

\3. 本地方法栈

\4. 堆

\5. 方法区

## 1. 程序计数器	[ ](af://n31/)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps2.png)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps3.png) 

 

### 1.1 定义 

- 特点：

  Program Counter Register 程序计数器（寄存器

  - 作用：记住下一条jvm指令的执行地址

  - 是线程私有的
  - **不会存在内存溢出** 

### 1.2 作用

 线程私有的，每个线程都有自身计数器

![image-20210618131139123](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210618131139123.png)  

 

 ## 2.虚拟机栈



### 2.1 定义	

Java Virtual Machine Stacks （Java 虚拟机栈）

- （虚拟机）栈：每个线程运行时所需要的内存   

- 每个栈由多个栈帧（Frame）组成
- 栈帧（Frame）：一个方法运行时需要的内存

- 每个线程只能有一个活动栈帧（正在执行的方法）

 

**问题辨析**

1. 垃圾回收是否涉及栈内存？

   -栈内存自动清除，垃圾是对堆得数据进行回收 

2. 栈内存分配越大越好吗？

   栈内存越大，可同时运行的线程会减少，一般不建议增大内存

3. 方法内的局部变量是否线程安全？

   取决于使用的局部变量是否共享

- 如果方法内局部变量没有逃离方法的作用访问，它是线程安全的

- 如果是局部变量引用了对象，并逃离方法的作用范围（return 返回），需要考虑线程安全 

### 2.2 栈内存溢出 

报错显示 **java.lang.StackOverflowError**

- 栈帧过多导致栈内存溢出

  例：方法递归调用

  <img src="C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210618133324333.png" alt="image-20210618133324333" style="zoom:25%;" />

- 栈帧过大导致栈内存溢出

   <img src="C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210618133359416.png" alt="image-20210618133359416" style="zoom:25%;" />

### 2.3 线程运行诊断	 

案例1： cpu 占用过多定位

用top定位哪个进程对cpu的占用过高

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps10.png)ps H -eo pid,tid,%cpu | grep 进程id （用ps命令进一步定位是哪个线程引起的cpu占用过高） jstack 进程id

可以根据线程id 找到有问题的线程，进一步定位到问题代码的源码行号

案例2：程序运行很长时间没有结果

 

 

 

 

 

 

 

 

 

 

 

 

 

 ## 3.本地方法栈



![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps11.png)

 

 ## 4.堆

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps12.png)

 

### 4.1 定义

Heap 堆

- 通过 new 关键字，创建对象都会使用堆内存特点

它是线程共享的，堆中对象都需要考虑线程安全的问题  

### 4.2 堆内存溢出	

### 4.3 堆内存诊断	 

1. jps 工具

-  查看当前系统中有哪些 java 进程

2. jmap 工具 ![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps16.png) 查看堆内存占用情况 jmap - heap 进程id

3. jconsole 工具

   图形界面的，多功能的监测工具，可以连续监测

 

案例 ： 垃圾回收后，内存占用仍然很高

 

## 5. 方法区	

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps19.png)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps20.png) 

 

 

### 5.1 定义	 

[J](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html)[VM](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html)[规范](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html)[-](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html)[方法区定义](https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-2.html)

### 5.2 组成	[ ](af://n248/)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps21.png)

### 5.3 方法区内存溢出	[ ](af://n265/)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps22.png)	1.8 以前会导致永久代内存溢出

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps23.png)

 场景

​	mybatis

​	spring 



### 5.4 运行时常量池	[ ](af://n325/)

- 常量池，就是一张表，虚拟机指令根据这张常量表找到要执行的类名、方法名、参数类型、字面量等信息

- 运行时常量池，常量池是 *.class 文件中的，当该类被加载，它的常量池信息就会放入运行时常量池，并把里面的符号地址变为真实地址

### 5.5 StringTable	[ ](af://n350/)先看几道面试题：

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps26.png)

### 5.5 StringTable 特性	[ ](af://n353/)

常量池中的字符串仅是符号，第一次用到时才变为对象利用串池的机制，来避免重复创建字符串对象

- 字符串变量拼接的原理是 StringBuilder （1.8)字符串常量拼接的原理是编译期优化

- 可以使用 **intern** 方法，主动将串池中还没有的字符串对象放入串池

1.8 将这个字符串对象尝试放入串池，如果有则并不会放入，如果没有则放入串池， 会把串池中的对象返回

1.6 将这个字符串对象尝试放入串池，如果有则并不会放入，如果没有会把此对象复制一份，放入串池， 会把串池中的对象返回

### 5.6 StringTable 位置	[ ](af://n375/)

 

 

  

### 5.7 StringTable 垃圾回收	[ ](af://n388/)

 

 

 

### 5.8 StringTable 性能调优	[ ](af://n401/)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps28.png) 调整 -XX:StringTableSize=桶个数

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps29.png) 考虑将字符串对象是否入池

 

 

 

 

 

 

 

## 6. 直接内存	

## 6.1 定义	[ ](af://n432/)

Direct Memory

- 常见于 NIO 操作时，用于数据缓冲区分配回收成本较高，但读写性能高不受 JVM 内存回收管理

### 6.2 分配和回收原理	[ ](af://n452/)

- 使用了 Unsafe 对象完成直接内存的分配回收，并且回收需要主动调用 freeMemory 方法 ByteBuffer 的实现类内部，
- 使用了 Cleaner （虚引用)来监测 ByteBuffer 对象，一旦ByteBuffer 对象被垃圾回收，那么就会由 ReferenceHandler 线程通过 Cleaner 的 clean 方法调用 freeMemory 来释放直接内存

 



 # 二.垃圾回收	

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps33.png)

1.  如何判断对象可以回收

2.  垃圾回收算法

3.  分代垃圾回收

4.  垃圾回收器

5.  垃圾回收调优

## 1.如何判断对象可以回收	

 



![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps34.png) 

### 1.2 可达性分析算法	



1. Java 虚拟机中的垃圾回收器采用可达性分析来探索所有存活的对象

2. 扫描堆中的对象，看是否能够沿着 GC Root对象 为起点的引用链找到该对象，找不到，表示可以回收

3. 哪些对象可以作为 GC Root ?

  

### 1.3 四种引用	

1.  强引用

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps38.png) 只有所有 GC Roots 对象都不通过【强引用】引用该对象，该对象才能被垃圾回收

2. 软引用（SoftReference）

   仅有软引用引用该对象时，在垃圾回收后，内存仍不足时会再次出发垃圾回收，回收软引用对象

可以配合引用队列来释放软引用自身

3. 弱引用（WeakReference）

   仅有弱引用引用该对象时，在垃圾回收时，无论内存是否充足，都会回收弱引用对象可以配合引用队列来释放弱引用自身

4. 虚引用（PhantomReference）

   必须配合引用队列使用，主要配合 ByteBuffer 使用，被引用对象回收时，会将虚引用入队，由 Reference Handler 线程调用虚引用相关方法释放直接内存

5. 终结器引用（FinalReference）

   无需手动编码，但其内部配合引用队列使用，在垃圾回收时，终结器引用入队（被引用对象暂时没有被回收），再由 Finalizer 线程通过终结器引用找到被引用对象并调用它的 finalize 方法，第二次 GC 时才能回收被引用对象

 

## 2. 垃圾回收算法

### 2.1标记回收	 

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps43.png)

1. 标记可回收垃圾
2. 回收垃圾

- 优点：速度快效率高
- 缺点：造成内存碎片（内存空间不连续）

 



## 2.2 标记整理	[ ](af://n170/)

定义：Mark Compact ![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps44.png) 速度慢

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps45.png)

 

1. 标记可回收垃圾（存活多）
2. 回收垃圾（内存空间向前移动）

- 优点：速度较慢（设计地址的变化等操作）
- 缺点：不会造成内存碎片 

### 2.3 复制	[ ](af://n188/)

定义：Copy

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps46.png)

把可以保存的对象复制到另一份内存空间，并交换from和to

- 优点：没有内存碎片

- 占用双倍的内存空间 

## 3. 分代垃圾回收	[ ](af://n207/)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps47.png)

 

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps48.png) 

 

1. 对象首先分配在伊甸园区域

2. 新生代空间不足时，触发 minor gc，伊甸园和 from 存活的对象使用 copy 复制到 to 中（其他对象空间 被回收），存活的对象年龄加 1并且交换 from to

   ![image-20210619215049838](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210619215049838.png)

3. minor gc 会引发 stop the world（避免线程混乱，涉及地质改变），暂停其它用户的线程，等垃圾回收结束，用户线程才恢复运行当对象寿命超过阈值时，会晋升至老年代，最大寿命是15（4bit）

   ![image-20210619215117828](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210619215117828.png)

4. 当老年代空间不足，会先尝试触发 minor gc（初级垃圾清除），如果之后空间仍不足，那么触发 full gc，STW的时间更长

   ![image-20210619215139218](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210619215139218.png)

 

### 3.1 相关 VM 参数	[ ](af://n224/)

| 含义               | 参数                                                         |
| ------------------ | ------------------------------------------------------------ |
| 堆初始大小         | -Xms                                                         |
| 堆最大大小         | -Xmx 或 -XX:MaxHeapSize=size                                 |
| 新生代大小         | -Xmn 或 (-XX:NewSize=size + -XX:MaxNewSize=size )            |
| 幸存区比例（动态） | -XX:InitialSurvivorRatio=ratio 和 -XX:+UseAdaptiveSizePolicy |
| 幸存区比例         | -XX:SurvivorRatio=ratio                                      |
| 晋升阈值           | -XX:MaxTenuringThreshold=threshold                           |
| 晋升详情           | -XX:+PrintTenuringDistribution                               |
| GC详情             | -XX:+PrintGCDetails -verbose:gc                              |
| FullGC 前 MinorGC  | -XX:+ScavengeBeforeFullGC                                    |

 **大对象直接送到老年代机制**

## 4. 垃圾回收器	@@@@@

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps50.png)

1. 串行
   - 底层是单线程，- 
   - 适用于堆内存较小，适合个人电脑
2. 吞吐量优先
   - 多线程
   - 适用于堆内存较大，多核 cpu 
   - 让**单位时间**内，STW 的时间最短 0.2 0.2 = 4，垃圾回收时间占比最低，这样就称吞吐量高

3. 响应时间优先

   - 多线程

   - 适用于堆内存较大，
   - 多核 cpu
   - 尽可能让单次 STW 的单次时间最短     0.1 0.1 0.1 0.1 0.1 = 0.5

### 4.1 串行	[ ](af://n311/)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps54.png)

1. 空间不足
2. 在安全点暂停（阻塞）-------》开启单个垃圾回收线程
3. 垃圾回收完成————》线程继续



### 4.2 吞吐量优先	

-XX:+UseParallelGC ~ -XX:+UseParallelOldGC

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps56.png)

  

1.  内存空间不足
2.  在安全点暂停（阻塞）-------》开启多个垃圾回收线程（）
3.  垃圾回收完成————》线程继续





### 4.3 响应时间优先	[ ](af://n341/)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps57.png)

 

### 4.4 G1	[ ](af://n363/)

定义：Garbage First

- 2004 论文发布

- 2009 JDK 6u14 体验

- 2012 JDK 7u4 官方支持 
- 2017 JDK 9 默认成为垃圾回收器

适用场景

- 同时注重吞吐量（Throughput）和低延迟（Low latency)，默认的暂停目标是 200 ms

- 超大堆内存，会将堆划分为多个大小相等的 Region 

- 整体上是**标记+整理算法**，两个区域之间是**复制算法**

- 相关 JVM 参数

  -XX:+UseG1GC

  -XX:G1HeapRegionSize=size

  -XX:MaxGCPauseMillis=time

 

#### 1) G1 垃圾回收阶段

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps63.png) 

 

 



#### 2) Young Collection	[ ](af://n406/)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps64.png) 会 STW

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps65.png) 

 

 

 

 

 

 S:幸存区

O:老年代

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps66.png) 

 

 

 

 

 

 

 

 

 

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps67.png) 

 

 

#### 3) Young Collection + CM	[ ](af://n436/)

- 在 Young GC 时会进行 GC Root 的初始标记

- 老年代占用堆空间比例达到阈值时，进行**并发标记**（不会 STW），由下面的 JVM 参数决定 

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps69.png)

 

 

 

 

 

#### 4) Mixed Collection

混合收集阶段

- 会对 E、S、O 进行全面垃圾回收最终标记（Remark）会 STW 
- 拷贝存活（Evacuation）会 STW 
- 不是所有老年代都被回收，优先回收垃圾最多的标记，

-XX:MaxGCPauseMillis=ms

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps71.png) 

 

#### 5) Full GC	[ ](af://n459/)

- SerialGC

  新生代内存不足发生的垃圾收集 - minor gc

  老年代内存不足发生的垃圾收集 - full gc

- ParallelGC 

  新生代内存不足发生的垃圾收集 - minor gc 

  老年代内存不足发生的垃圾收集- 

- full gc

  新生代内存不足发生的垃圾收集 - minor gc 老年代内存不足

  新生代内存不足发生的垃圾收集 - minor gc 老年代内存不足

 

 

 



 #### 6）Young Collection跨代引用 



![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps73.png)

 老年代引用了新生代被标记成脏卡区

 垃圾回收时，对脏卡去进行查找，加快垃圾回收速度

 

- 卡表与 Remembered Set

- 在引用变更时通过 **post-write barrier** （标记脏卡）+ dirty card queue 
- concurrent refinement threads 更新 Remembered Set

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps75.png) 



#### 7) Remark	[ ](af://n530/)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps76.png)

 注：黑色处理完；	灰色正在处理；	白色尚未处理



并发标记阶段，如果回收期间引用关系发生了改变：

1. C被A 引用（A是根引用）

2. C就会被添加**写屏障**，进入队列中，被**重新标记**成灰色

3. 并发标记结束，进入重新标记阶段（remark），其他线程结束

   

![image-20210620100531126](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210620100531126.png)

 

 



#### 8) JDK 8u20 字符串去重	

优点：节省大量内存

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps77.png)优点：节省大量内存

 

 

#### 9) JDK 8u40 并发标记类卸载	

所有对象都经过并发标记后，就能知道哪些类不再被使用，当一个类加载器的所有类都不再使用，则卸载它所加载的所有类XX:+ClassUnloadingWithConcurrentMark 默认启用



#### 10) JDK 8u60 回收巨型对象	[ ](af://n587/)

- 一个对象大于 region 的一半时，称之为巨型对象 

- G1 不会对巨型对象进行拷贝

- 回收时被优先考虑

- G1 会跟踪老年代所有 incoming 引用，这样老年代 incoming 引用为0 的巨型对象就可以在新生代垃圾回收时处理掉(回收得越早越好)

   

#### 11) JDK 9 并发标记起始时间的调整	[ ](af://n614/)

并发标记必须在堆空间占满前完成，否则退化为 FullGC

- JDK 9 之前需要使用 -XX:InitiatingHeapOccupancyPercent（默认45%)

- JDK 9 可以动态调整

- -XX:InitiatingHeapOccupancyPercent 用来设置初始值
- 进行数据采样并动态调整
- 总会添加一个安全的空档空间
- 

#### 12) JDK 9 更高效的回收	[ ](af://n645/)

250+增强

180+bug修复

[https://docs.oracle.com/en/](https://docs.oracle.com/en/java/javase/12/gctuning)[j](https://docs.oracle.com/en/java/javase/12/gctuning)[ava/](https://docs.oracle.com/en/java/javase/12/gctuning)[j](https://docs.oracle.com/en/java/javase/12/gctuning)[avase/12/](https://docs.oracle.com/en/java/javase/12/gctuning)[g](https://docs.oracle.com/en/java/javase/12/gctuning)[ctunin](https://docs.oracle.com/en/java/javase/12/gctuning)[g](https://docs.oracle.com/en/java/javase/12/gctuning)

 

## 5. 垃圾回收调优	[ ](af://n670/)



预备知识

- 掌握 GC 相关的 VM 参数，会基本的空间调整掌握相关工具

- 知识点：调优跟应用、环境有关，没有放之四海而皆准的法则

 

### 5.1 调优领域	

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps85.png)内存锁竞争

cpu 占用 io

### 5.2 确定目标	

【低延迟】还是【高吞吐量】，选择合适的回收器

CMS，G1，ZGC

ParallelGC

### 5.3 最快的 GC	[ ](af://n742/)

答案是不发生 GC 查看 FullGC 前后的内存占用，考虑下面几个问题

数据是不是太多？

resultSet = statement.executeQuery("select * from 大表 limit n") 数据表示是否太臃肿？

对象图

对象大小 16 Integer 24 int 4 是否存在内存泄漏？

static Map map =

软弱第三方缓存实现

 

 

### 5.4 新生代调优	[ ](af://n798/)

新生代的特点所有的 new 操作的内存分配非常廉价

TLAB thread-local allocation buffer 死亡对象的回收代价是零大部分对象用过即死

Minor GC 的时间远远低于 Full GC

 

 

 

 

 

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps89.png) 越大越好吗？

-Xmn Sets the initial and maximum size (in bytes) of the heap for the young generation (nursery). GC is performed in this region more often than in other regions. If the size for the young generation is too small, then a lot of minor garbage collections are performed. If the size is too large, then only full garbage collections are performed, which can take a long time to complete. Oracle recommends that you keep the size for the young generation greater than 25% and less than 50% of the overall heap size.

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps90.png)新生代能容纳所有【并发量 * (请求-响应)】的数据幸存区大到能保留【当前活跃对象+需要晋升对象】

### 5.5 老年代调优	[ ](af://n860/)

以 CMS 为例

CMS 的老年代内存越大越好

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps91.png)先尝试不做调优，如果没有 Full GC 那么已经...，否则先尝试调优新生代观察发生 Full GC 时老年代内存占用，将老年代内存预设调大 1/4 ~ 1/3

-XX:CMSInitiatingOccupancyFraction=percent

  

### 5.6 案例	[ ](af://n882/)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps92.png)案例1 Full GC 和 Minor GC频繁

案例2 请求高峰期发生 Full GC，单次暂停时间特别长 （CMS）案例3 老年代充裕情况下，发生 Full GC （CMS jdk1.7）

 # 三. 类加载与字节码技术	 

 类加载与字节码技术	 

1. 类文件结构 
2. 字节码指令 
3. 编译期处理
4. 类加载阶
5. 类加载器
6. 运行期优化

 

## 1.类文件结构	 

一个简单的 HelloWorld.java

![image-20210620123640244](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210620123640244.png)

编译为 HelloWorld.class 后是这个样子的：

```
[root@localhost ~]# od -t xC HelloWorld.class 
0000000 ca fe ba be 00 00 00 34 00 23 0a 00 06 00 15 09
0000020 00 16 00 17 08 00 18 0a 00 19 00 1a 07 00 1b 07
0000040 00 1c 01 00 06 3c 69 6e 69 74 3e 01 00 03 28 29
0000060 56 01 00 04 43 6f 64 65 01 00 0f 4c 69 6e 65 4e
0000100 75 6d 62 65 72 54 61 62 6c 65 01 00 12 4c 6f 63
0000120 61 6c 56 61 72 69 61 62 6c 65 54 61 62 6c 65 01
0000140 00 04 74 68 69 73 01 00 1d 4c 63 6e 2f 69 74 63
0000160 61 73 74 2f 6a 76 6d 2f 74 35 2f 48 65 6c 6c 6f
0000200 57 6f 72 6c 64 3b 01 00 04 6d 61 69 6e 01 00 16
0000220 28 5b 4c 6a 61 76 61 2f 6c 61 6e 67 2f 53 74 72
0000240 69 6e 67 3b 29 56 01 00 04 61 72 67 73 01 00 13
0000260 5b 4c 6a 61 76 61 2f 6c 61 6e 67 2f 53 74 72 69
0000300 6e 67 3b 01 00 10 4d 65 74 68 6f 64 50 61 72 61
0000320 6d 65 74 65 72 73 01 00 0a 53 6f 75 72 63 65 46
0000340 69 6c 65 01 00 0f 48 65 6c 6c 6f 57 6f 72 6c 64
0000360 2e 6a 61 76 61 0c 00 07 00 08 07 00 1d 0c 00 1e
0000400 00 1f 01 00 0b 68 65 6c 6c 6f 20 77 6f 72 6c 64
0000420 07 00 20 0c 00 21 00 22 01 00 1b 63 6e 2f 69 74
0000440 63 61 73 74 2f 6a 76 6d 2f 74 35 2f 48 65 6c 6c
0000460 6f 57 6f 72 6c 64 01 00 10 6a 61 76 61 2f 6c 61
0000500 6e 67 2f 4f 62 6a 65 63 74 01 00 10 6a 61 76 61
0000520 2f 6c 61 6e 67 2f 53 79 73 74 65 6d 01 00 03 6f
0000540 75 74 01 00 15 4c 6a 61 76 61 2f 69 6f 2f 50 72
0000560 69 6e 74 53 74 72 65 61 6d 3b 01 00 13 6a 61 76
0000600 61 2f 69 6f 2f 50 72 69 6e 74 53 74 72 65 61 6d
0000620 01 00 07 70 72 69 6e 74 6c 6e 01 00 15 28 4c 6a
0000640 61 76 61 2f 6c 61 6e 67 2f 53 74 72 69 6e 67 3b
0000660 29 56 00 21 00 05 00 06 00 00 00 00 00 02 00 01
0000700 00 07 00 08 00 01 00 09 00 00 00 2f 00 01 00 01
0000720 00 00 00 05 2a b7 00 01 b1 00 00 00 02 00 0a 00
0000740 00 00 06 00 01 00 00 00 04 00 0b 00 00 00 0c 00
0000760 01 00 00 00 05 00 0c 00 0d 00 00 00 09 00 0e 00
0001000 0f 00 02 00 09 00 00 00 37 00 02 00 01 00 00 00
0001020 09 b2 00 02 12 03 b6 00 04 b1 00 00 00 02 00 0a
0001040 00 00 00 0a 00 02 00 00 00 06 00 08 00 07 00 0b
0001060 00 00 00 0c 00 01 00 00 00 09 00 10 00 11 00 00
0001100 00 12 00 00 00 05 01 00 10 00 00 00 01 00 13 00
0001120 00 00 02 00 14
```

 

根据 JVM 规范，类文件结构如下：
 ![image-20210620123750334](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210620123750334.png)

下面分别进行解释：

### 1.1 魔数	 

表示文件类型

0~3 字节，表示它是否是【class】类型的文件
0000000 **ca fe ba be** 00 00 00 34 00 23 0a 00 06 00 15 09

 

###  1.2 版本	 

4~7 字节，表示类的版本 00 34（52） 表示是 Java 8
0000000 ca fe ba be **00 00 00 34** 00 23 0a 00 06 00 15 09



### 1.3 常量池	 @@@@

| Constant Type               | Value |
| --------------------------- | ----- |
| CONSTANT_Class              | 7     |
| CONSTANT_Fieldref           | 9     |
| CONSTANT_Methodref          | 10    |
| CONSTANT_InterfaceMethodref | 11    |
| CONSTANT_String             | 8     |
| CONSTANT_Integer            | 3     |
| CONSTANT_Float              | 4     |
| CONSTANT_Long               | 5     |
| CONSTANT_Double             | 6     |
| CONSTANT_NameAndType        | 12    |
| CONSTANT_Utf8               | 1     |
| CONSTANT_MethodHandle       | 15    |
| CONSTANT_MethodType         | 16    |
| CONSTANT_InvokeDynamic      | 18    |
|                             |       |



- 8~9 字节，表示常量池长度，00 23 （35） 表示常量池有 #1~#34项，注意 #0 项不计入，也没有值
  0000000 ca fe ba be 00 00 00 34 **00 23** 0a 00 06 00 15 09##

第#1项 0a 表示一个 Method 信息，00 06 和 00 15（21） 表示它引用了常量池中 #6 和 #21 项来获得这个方法的【所属类】和【方法名】
0000000 ca fe ba be 00 00 00 34 00 23 0a 00 06 00 15 09

第#2项 09 表示一个 Field 信息，00 16（22）和 00 17（23） 表示它引用了常量池中 #22 和 # 23 项来获得这个成员变量的【所属类】和【成员变量名】
0000000 ca fe ba be 00 00 00 34 00 23 0a 00 06 00 15 09
0000020 00 16 00 17 08 00 18 0a 00 19 00 1a 07 00 1b 07

第#3项 08 表示一个字符串常量名称，00 18（24）表示它引用了常量池中 #24 项
0000020 00 16 00 17 08 00 18 0a 00 19 00 1a 07 00 1b 07

第#4项 0a 表示一个 Method 信息，00 19（25） 和 00 1a（26） 表示它引用了常量池中 #25 和 #26 项来获得这个方法的【所属类】和【方法名】
0000020 00 16 00 17 08 00 18 0a 00 19 00 1a 07 00 1b 07
第#5项 07 表示一个 Class 信息，00 1b（27） 表示它引用了常量池中 #27 项
0000020 00 16 00 17 08 00 18 0a 00 19 00 1a 07 00 1b 07

第#6项 07 表示一个 Class 信息，00 1c（28） 表示它引用了常量池中 #28 项
0000020 00 16 00 17 08 00 18 0a 00 19 00 1a 07 00 1b 07
0000040 00 1c 01 00 06 3c 69 6e 69 74 3e 01 00 03 28 29

第#7项 01 表示一个 utf8 串，00 06 表示长度，3c 69 6e 69 74 3e 是【<init>】
0000040 00 1c 01 00 06 3c 69 6e 69 74 3e 01 00 03 28 29

第#8项 01 表示一个 utf8 串，00 03 表示长度，28 29 56 是【()V】其实就是表示无参、无返回值
0000040 00 1c 01 00 06 3c 69 6e 69 74 3e 01 00 03 28 29
0000060 56 01 00 04 43 6f 64 65 01 00 0f 4c 69 6e 65 4e

第#9项 01 表示一个 utf8 串，00 04 表示长度，43 6f 64 65 是【Code】
0000060 56 01 00 04 43 6f 64 65 01 00 0f 4c 69 6e 65 4e

第#10项 01 表示一个 utf8 串，00 0f（15） 表示长度，4c 69 6e 65 4e 75 6d 62 65 72 54 61 62 6c 65 是【LineNumberTable】
0000060 56 01 00 04 43 6f 64 65 01 00 0f 4c 69 6e 65 4e
0000100 75 6d 62 65 72 54 61 62 6c 65 01 00 12 4c 6f 63

第#11项 01 表示一个 utf8 串，00 12（18） 表示长度，4c 6f 63 61 6c 56 61 72 69 61 62 6c 65 54 61 62 6c 65是【LocalVariableTable】
0000100 75 6d 62 65 72 54 61 62 6c 65 01 00 12 4c 6f 63
0000120 61 6c 56 61 72 69 61 62 6c 65 54 61 62 6c 65 01

第#12项 01 表示一个 utf8 串，00 04 表示长度，74 68 69 73 是【this】
0000120 61 6c 56 61 72 69 61 62 6c 65 54 61 62 6c 65 01
0000140 00 04 74 68 69 73 01 00 1d 4c 63 6e 2f 69 74 63

第#13项 01 表示一个 utf8 串，00 1d（29） 表示长度，是【Lcn/itcast/jvm/t5/HelloWorld;】
0000140 00 04 74 68 69 73 01 00 1d 4c 63 6e 2f 69 74 63
0000160 61 73 74 2f 6a 76 6d 2f 74 35 2f 48 65 6c 6c 6f
0000200 57 6f 72 6c 64 3b 01 00 04 6d 61 69 6e 01 00 16

第#14项 01 表示一个 utf8 串，00 04 表示长度，74 68 69 73 是【main】
0000200 57 6f 72 6c 64 3b 01 00 04 6d 61 69 6e 01 00 16

第#15项 01 表示一个 utf8 串，00 16（22） 表示长度，是【([Ljava/lang/String;)V】其实就是参数为字符串数组，无返回值
0000200 57 6f 72 6c 64 3b 01 00 04 6d 61 69 6e 01 00 16
0000220 28 5b 4c 6a 61 76 61 2f 6c 61 6e 67 2f 53 74 72
0000240 69 6e 67 3b 29 56 01 00 04 61 72 67 73 01 00 13

第#16项 01 表示一个 utf8 串，00 04 表示长度，是【args】
0000240 69 6e 67 3b 29 56 01 00 04 61 72 67 73 01 00 13

第#17项 01 表示一个 utf8 串，00 13（19） 表示长度，是【[Ljava/lang/String;】
0000240 69 6e 67 3b 29 56 01 00 04 61 72 67 73 01 00 13 0000260 5b 4c 6a 61 76 61 2f 6c 61 6e
67 2f 53 74 72 69 0000300 6e 67 3b 01 00 10 4d 65 74 68 6f 64 50 61 72 61

第#18项 01 表示一个 utf8 串，00 10（16） 表示长度，是【MethodParameters】
0000300 6e 67 3b 01 00 10 4d 65 74 68 6f 64 50 61 72 61
0000320 6d 65 74 65 72 73 01 00 0a 53 6f 75 72 63 65 46

第#19项 01 表示一个 utf8 串，00 0a（10） 表示长度，是【SourceFile】
0000320 6d 65 74 65 72 73 01 00 0a 53 6f 75 72 63 65 46
0000340 69 6c 65 01 00 0f 48 65 6c 6c 6f 57 6f 72 6c 64

第#20项 01 表示一个 utf8 串，00 0f（15） 表示长度，是【HelloWorld.java】
0000340 69 6c 65 01 00 0f 48 65 6c 6c 6f 57 6f 72 6c 64 0000360 2e 6a 61 76 61 0c 00 07 00 08 07 00 1d 0c 00 1e

第#21项 0c 表示一个 【名+类型】，00 07 00 08 引用了常量池中 #7 #8 两项
0000360 2e 6a 61 76 61 0c 00 07 00 08 07 00 1d 0c 00 1e

第#22项 07 表示一个 Class 信息，00 1d（29） 引用了常量池中 #29 项
0000360 2e 6a 61 76 61 0c 00 07 00 08 07 00 1d 0c 00 1e
第#23项 0c 表示一个 【名+类型】，00 1e（30） 00 1f （31）引用了常量池中 #30 #31 两项
0000360 2e 6a 61 76 61 0c 00 07 00 08 07 00 1d 0c 00 1e
0000400 00 1f 01 00 0b 68 65 6c 6c 6f 20 77 6f 72 6c 64

第#24项 01 表示一个 utf8 串，00 0f（15） 表示长度，是【hello world】
0000400 00 1f 01 00 0b 68 65 6c 6c 6f 20 77 6f 72 6c 64

第#25项 07 表示一个 Class 信息，00 20（32） 引用了常量池中 #32 项
0000420 07 00 20 0c 00 21 00 22 01 00 1b 63 6e 2f 69 74

第#26项 0c 表示一个 【名+类型】，00 21（33） 00 22（34）引用了常量池中 #33 #34 两项
0000420 07 00 20 0c 00 21 00 22 01 00 1b 63 6e 2f 69 74

第#27项 01 表示一个 utf8 串，00 1b（27） 表示长度，是【cn/itcast/jvm/t5/HelloWorld】
0000420 07 00 20 0c 00 21 00 22 01 00 1b 63 6e 2f 69 74
0000440 63 61 73 74 2f 6a 76 6d 2f 74 35 2f 48 65 6c 6c
0000460 6f 57 6f 72 6c 64 01 00 10 6a 61 76 61 2f 6c 61

第#28项 01 表示一个 utf8 串，00 10（16） 表示长度，是【java/lang/Object】
0000460 6f 57 6f 72 6c 64 01 00 10 6a 61 76 61 2f 6c 61
0000500 6e 67 2f 4f 62 6a 65 63 74 01 00 10 6a 61 76 61

第#29项 01 表示一个 utf8 串，00 10（16） 表示长度，是【java/lang/System】
0000500 6e 67 2f 4f 62 6a 65 63 74 01 00 10 6a 61 76 61
0000520 2f 6c 61 6e 67 2f 53 79 73 74 65 6d 01 00 03 6f

第#30项 01 表示一个 utf8 串，00 03 表示长度，是【out】
0000520 2f 6c 61 6e 67 2f 53 79 73 74 65 6d 01 00 03 6f
0000540 75 74 01 00 15 4c 6a 61 76 61 2f 69 6f 2f 50 72

第#31项 01 表示一个 utf8 串，00 15（21） 表示长度，是【Ljava/io/PrintStream;】
0000540 75 74 01 00 15 4c 6a 61 76 61 2f 69 6f 2f 50 72
0000560 69 6e 74 53 74 72 65 61 6d 3b 01 00 13 6a 61 76
第#32项 01 表示一个 utf8 串，00 13（19） 表示长度，是【java/io/PrintStream】
0000560 69 6e 74 53 74 72 65 61 6d 3b 01 00 13 6a 61 76
0000600 61 2f 69 6f 2f 50 72 69 6e 74 53 74 72 65 61 6d

第#33项 01 表示一个 utf8 串，00 07 表示长度，是【println】
0000620 01 00 07 70 72 69 6e 74 6c 6e 01 00 15 28 4c 6a

第#34项 01 表示一个 utf8 串，00 15（21） 表示长度，是【(Ljava/lang/String;)V】
0000620 01 00 07 70 72 69 6e 74 6c 6e 01 00 15 28 4c 6a
0000640 61 76 61 2f 6c 61 6e 67 2f 53 74 72 69 6e 67 3b
0000660 29 56 00 21 00 05 00 06 00 00 00 00 00 02 00 01

### 1.4 访问标识与继承信息	 

21 表示该 class 是一个类，公共的
0000660 29 56 00 21 00 05 00 06 00 00 00 00 00 02 00 01
05表示根据常量池中 #5 找到本类全限定名
0000660 29 56 00 21 00 05 00 06 00 00 00 00 00 02 00 01
06表示根据常量池中 #6 找到父类全限定名
0000660 29 56 00 21 00 05 00 06 00 00 00 00 00 02 00 01
表示接口的数量，本类为 0
0000660 29 56 00 21 00 05 00 06 00 00 00 00 00 02 00 01
Flag Name	Value	Interpretation
ACC_PUBLIC	0x0001	Declared public ; may be accessed from outside its package.
ACC_FINAL	0x0010	Declared final ; no subclasses allowed.
ACC_SUPER	0x0020	Treat superclass methods specially when invoked by the invokespecial instruction.
ACC_INTERFACE	0x0200	Is an interface, not a class.
ACC_ABSTRACT	0x0400	Declared abstract ; must not be instantiated.
ACC_SYNTHETIC	0x1000	Declared synthetic; not present in the source code.
ACC_ANNOTATION	0x2000	Declared as an annotation type.
ACC_ENUM	0x4000	Declared as an enum type.

 

 

 

 

 

### 1.5 Field 信息	 

表示成员变量数量，本类为 0
0000660 29 56 00 21 00 05 00 06 00 00 00 00 00 02 00 01

| FieldType   | Type      | Interpretation                                               |
| ----------- | --------- | ------------------------------------------------------------ |
| B           | byte      | signed byte                                                  |
| C           | char      | Unicode character code point in the Basic Multilingual Plane, encoded with UTF-16 |
| D           | double    | double-precision floating-point value                        |
| F           | float     | single-precision floating-point value                        |
| I           | int       | integer                                                      |
| J           | long      | long integer                                                 |
| L ClassName | reference | an instance of class ClassName                               |
| S           | short     | signed short                                                 |
| Z           | boolean   | true or false                                                |
| [           | reference | one array dimension                                          |



  

### 1.6 Method 信息	 

表示方法数量，本类为 2
0000660 29 56 00 21 00 05 00 06 00 00 00 00 00 02 00 01

- 一个方法由 访问修饰符，名称，参数描述，方法属性数量，方法属性组成
  红色代表访问修饰符（本类中是 public）
  蓝色代表引用了常量池 #07 项作为方法名称
  绿色代表引用了常量池 #08 项作为方法参数描述黄色代表方法属性数量，本方法是 1 红色代表方法属性
  00 09 表示引用了常量池 #09 项，发现是【Code】属性
  00 00 00 2f 表示此属性的长度是 47
  00 01 表示【操作数栈】 大深度
  00 01 表示【局部变量表】 大槽（slot）数
  00 00 00 05 表示字节码长度，本例是 5

- 2a b7 00 01 b1 是字节码指令

- 00 00 00 02 表示方法细节属性数量，本例是 2

- 00 0a 表示引用了常量池 #10 项，发现是【LineNumberTable】属性
  00 00 00 06 表示此属性的总长度，本例是 6
  00 01 表示【LineNumberTable】长度
  00 00 表示【字节码】行号 00 04 表示【java 源码】行号

- 00 0b 表示引用了常量池 #11 项，发现是【LocalVariableTable】属性
  00 00 00 0c 表示此属性的总长度，本例是 12
  00 01 表示【LocalVariableTable】长度
  00 00 表示局部变量生命周期开始，相对于字节码的偏移量
  00 05 表示局部变量覆盖的范围长度
  00 0c 表示局部变量名称，本例引用了常量池 #12 项，是【this】
  00 0d 表示局部变量的类型，本例引用了常量池 #13 项，是
  【Lcn/itcast/jvm/t5/HelloWorld;】
  00 00 表示局部变量占有的槽位（slot）编号，本例是 0

 ```
0000660 29 56 00 21 00 05 00 06 00 00 00 00 00 02 00 01
0000700 00 07 00 08 00 01 00 09 00 00 00 2f 00 01 00 01
0000720 00 00 00 05 2a b7 00 01 b1 00 00 00 02 00 0a 00
0000740 00 00 06 00 01 00 00 00 04 00 0b 00 00 00 0c 00 

0000760 01 00 00 00 05 00 0c 00 0d 00 00 00 09 00 0e 00
 ```



红色代表访问修饰符（本类中是 public static）蓝色代表引用了常量池 #14 项作为方法名称绿色代表引用了常量池 #15 项作为方法参数描述黄色代表方法属性数量，本方法是 2 红色代表方法属性（属性1）
00 09 表示引用了常量池 #09 项，发现是【Code】属性
00 00 00 37 表示此属性的长度是 55
00 02 表示【操作数栈】 大深度
00 01 表示【局部变量表】 大槽（slot）数 00 00 00 05 表示字节码长度，本例是 9
b2 00 02 12 03 b6 00 04 b1 是字节码指令
00 00 00 02 表示方法细节属性数量，本例是 2
00 0a 表示引用了常量池 #10 项，发现是【LineNumberTable】属性
00 00 00 0a 表示此属性的总长度，本例是 10
00 02 表示【LineNumberTable】长度
00 00 表示【字节码】行号 00 06 表示【java 源码】行号
00 08 表示【字节码】行号 00 07 表示【java 源码】行号
00 0b 表示引用了常量池 #11 项，发现是【LocalVariableTable】属性
00 00 00 0c 表示此属性的总长度，本例是 12
00 01 表示【LocalVariableTable】长度
00 00 表示局部变量生命周期开始，相对于字节码的偏移量
00 09 表示局部变量覆盖的范围长度
00 10 表示局部变量名称，本例引用了常量池 #16 项，是【args】
00 11 表示局部变量的类型，本例引用了常量池 #17 项，是【[Ljava/lang/String;】
00 00 表示局部变量占有的槽位（slot）编号，本例是 0

0000760 01 00 00 00 05 00 0c 00 0d 00 00 00 09 00 0e 00
0001000 0f 00 02 00 09 00 00 00 37 00 02 00 01 00 00 00
0001020 09 b2 00 02 12 03 b6 00 04 b1 00 00 00 02 00 0a
0001040 00 00 00 0a 00 02 00 00 00 06 00 08 00 07 00 0b
0001060 00 00 00 0c 00 01 00 00 00 09 00 10 00 11 00 00

红色代表方法属性（属性2）
00 12 表示引用了常量池 #18 项，发现是【MethodParameters】属性
0000 00 05 表示此属性的总长度，本例是 5
01参数数量
00 10 表示引用了常量池 #16 项，是【args】
00 00 访问修饰符
0001100 00 12 00 00 00 05 01 00 10 00 00 00 01 00 13 00
0001120 00 00 02 00 14
1.7 附加属性	 
00 01 表示附加属性数量
00 13 表示引用了常量池 #19 项，即【SourceFile】
00 00 00 02 表示此属性的长度
00 14 表示引用了常量池 #20 项，即【HelloWorld.java】
0001100 00 12 00 00 00 05 01 00 10 00 00 00 01 00 13 00
0001120 00 00 02 00 14

参考文献
https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-4.html

## 2.字节码指令	 

###  2.1 入门	 

接着上一节，研究一下两组字节码指令，一个是
public cn.itcast.jvm.t5.HelloWorld(); 构造方法的字节码指令

1.2a => aload_0 加载 slot 0 的局部变量，即 this，做为下面的 invokespecial 构造方法调用的参数
2.b7 => invokespecial 预备调用构造方法，哪个方法呢？

3. 00 01 引用常量池中 #1 项，即【Method java/lang/Object."<init>":()V】
4. b1 表示返回


1.b2 => getstatic 用来加载静态变量，哪个静态变量呢？
2.00 02 引用常量池中 #2 项，即【Field java/lang/System.out:Ljava/io/PrintStream;】
3.12 => ldc 加载参数，哪个参数呢？
4.03 引用常量池中 #3 项，即 【String hello world】
5.b6 => invokevirtual 预备调用成员方法，哪个方法呢？
6.00 04 引用常量池中 #4 项，即【Method java/io/PrintStream.println:(Ljava/lang/String;)V】
7.b1 表示返回

请参考
https://docs.oracle.com/javase/specs/jvms/se8/html/jvms-6.html#jvms-6.5

### 2.2 javap 工具	 

自己分析类文件结构太麻烦了，Oracle 提供了 javap 工具来反编译 class 文件
[root@localhost ~]# javap -v HelloWorld.class 
Classfile /root/HelloWorld.class
  Last modified Jul 7, 2019; size 597 bytes
  MD5 checksum 361dca1c3f4ae38644a9cd5060ac6dbc   Compiled from "HelloWorld.java" public class cn.itcast.jvm.t5.HelloWorld   minor version: 0   major version: 52   flags: ACC_PUBLIC, ACC_SUPER Constant pool:
   #1 = Methodref          #6.#21         // java/lang/Object."<init>":()V
   #2 = Fieldref           #22.#23        // java/lang/System.out:Ljava/io/PrintStream;    #3 = String             #24            // hello world    #4 = Methodref          #25.#26        // java/io/PrintStream.println:
(Ljava/lang/String;)V
   #5 = Class              #27            // cn/itcast/jvm/t5/HelloWorld
   #6 = Class              #28            // java/lang/Object
   #7 = Utf8               <init>
   #8 = Utf8               ()V
   #9 = Utf8               Code
  #10 = Utf8               LineNumberTable
  #11 = Utf8               LocalVariableTable
  #12 = Utf8               this
  #13 = Utf8               Lcn/itcast/jvm/t5/HelloWorld;


  #14 = Utf8               main   #15 = Utf8               ([Ljava/lang/String;)V
  #16 = Utf8               args
  #17 = Utf8               [Ljava/lang/String;
  #18 = Utf8               MethodParameters
  #19 = Utf8               SourceFile
  #20 = Utf8               HelloWorld.java
  #21 = NameAndType        #7:#8          // "<init>":()V
  #22 = Class              #29            // java/lang/System
  #23 = NameAndType        #30:#31        // out:Ljava/io/PrintStream;
  #24 = Utf8               hello world
  #25 = Class              #32            // java/io/PrintStream
  #26 = NameAndType        #33:#34        // println:(Ljava/lang/String;)V
  #27 = Utf8               cn/itcast/jvm/t5/HelloWorld
  #28 = Utf8               java/lang/Object
  #29 = Utf8               java/lang/System
  #30 = Utf8               out
  #31 = Utf8               Ljava/io/PrintStream;
  #32 = Utf8               java/io/PrintStream
  #33 = Utf8               println   #34 = Utf8               (Ljava/lang/String;)V
{   public cn.itcast.jvm.t5.HelloWorld();     descriptor: ()V
    flags: ACC_PUBLIC     Code:
      stack=1, locals=1, args_size=1
         0: aload_0          1: invokespecial #1                  // Method java/lang/Object."
<init>":()V
         4: return
      LineNumberTable:
        line 4: 0       LocalVariableTable:
        Start  Length  Slot  Name   Signature             0       5     0  this   Lcn/itcast/jvm/t5/HelloWorld;
  public static void main(java.lang.String[]);     descriptor: ([Ljava/lang/String;)V     flags: ACC_PUBLIC, ACC_STATIC     Code:
      stack=2, locals=1, args_size=1
         0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;          3: ldc           #3                  // String hello world
         5: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V          8: return
      LineNumberTable:
        line 6: 0
        line 7: 8       LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0       9     0  args   [Ljava/lang/String;     MethodParameters:       Name                           Flags
      args
}
北京市昌平区建材城西路金燕龙办公楼一层   电话：400-618-9090

### 2.3 图解方法执行流程	

 1）原始 java 代码	 

2）编译后的字节码文件	 
[root@localhost ~]# javap -v Demo3_1.class Classfile /root/Demo3_1.class
  Last modified Jul 7, 2019; size 665 bytes
  MD5 checksum a2c29a22421e218d4924d31e6990cfc5   Compiled from "Demo3_1.java" public class cn.itcast.jvm.t3.bytecode.Demo3_1   minor version: 0   major version: 52   flags: ACC_PUBLIC, ACC_SUPER Constant pool:
   #1 = Methodref          #7.#26         // java/lang/Object."<init>":()V    #2 = Class              #27            // java/lang/Short
   #3 = Integer            32768
   #4 = Fieldref           #28.#29        // java/lang/System.out:Ljava/io/PrintStream;    #5 = Methodref          #30.#31        // java/io/PrintStream.println:(I)V
   #6 = Class              #32            // cn/itcast/jvm/t3/bytecode/Demo3_1
   #7 = Class              #33            // java/lang/Object
   #8 = Utf8               <init>
   #9 = Utf8               ()V
  #10 = Utf8               Code
  #11 = Utf8               LineNumberTable
  #12 = Utf8               LocalVariableTable
  #13 = Utf8               this   #14 = Utf8               Lcn/itcast/jvm/t3/bytecode/Demo3_1;
  #15 = Utf8               main   #16 = Utf8               ([Ljava/lang/String;)V
  #17 = Utf8               args   #18 = Utf8               [Ljava/lang/String;
  #19 = Utf8               a

  #20 = Utf8               I
  #21 = Utf8               b
  #22 = Utf8               c
  #23 = Utf8               MethodParameters
  #24 = Utf8               SourceFile
  #25 = Utf8               Demo3_1.java
  #26 = NameAndType        #8:#9          // "<init>":()V
  #27 = Utf8               java/lang/Short
  #28 = Class              #34            // java/lang/System
  #29 = NameAndType        #35:#36        // out:Ljava/io/PrintStream;
  #30 = Class              #37            // java/io/PrintStream
  #31 = NameAndType        #38:#39        // println:(I)V   #32 = Utf8               cn/itcast/jvm/t3/bytecode/Demo3_1
  #33 = Utf8               java/lang/Object
  #34 = Utf8               java/lang/System
  #35 = Utf8               out
  #36 = Utf8               Ljava/io/PrintStream;
  #37 = Utf8               java/io/PrintStream
  #38 = Utf8               println
  #39 = Utf8               (I)V {   public cn.itcast.jvm.t3.bytecode.Demo3_1();     descriptor: ()V
    flags: ACC_PUBLIC     Code:
      stack=1, locals=1, args_size=1
         0: aload_0          1: invokespecial #1                  // Method java/lang/Object."
<init>":()V
         4: return
      LineNumberTable:
        line 6: 0       LocalVariableTable:
        Start  Length  Slot  Name   Signature             0       5     0  this   Lcn/itcast/jvm/t3/bytecode/Demo3_1;
  public static void main(java.lang.String[]);     descriptor: ([Ljava/lang/String;)V     flags: ACC_PUBLIC, ACC_STATIC     Code:
      stack=2, locals=4, args_size=1
         0: bipush        10
         2: istore_1
         3: ldc           #3                  // int 32768
         5: istore_2
         6: iload_1
         7: iload_2
         8: iadd
         9: istore_3
        10: getstatic     #4                  // Field java/lang/System.out:Ljava/io/PrintStream;         13: iload_3
        14: invokevirtual #5                  // Method java/io/PrintStream.println:(I)V
        17: return
      LineNumberTable:
        line 8: 0
        line 9: 3

3）常量池载入运行时常量池	 

4）方法字节码载入方法区	 


5）main 线程开始运行，分配栈帧内存	 
（stack=2，locals=4）



6）执行引擎开始执行字节码	 

bipush 10	 
将一个 byte 压入操作数栈（其长度会补齐 4 个字节），类似的指令还有 sipush 将一个 short 压入操作数栈（其长度会补齐 4 个字节） ldc 将一个 int 压入操作数栈 ldc2_w 将一个 long 压入操作数栈（分两次压入，因为 long 是 8 个字节）
这里小的数字都是和字节码指令存在一起，超过 short 范围的数字存入了常量池



istore_1	  将操作数栈顶数据弹出，存入局部变量表的 slot 1

 


istore_2	 

 

iload_1	 

iload_2	 

iadd	 

istore_3	 

 


getstatic #4	 

 

iload_3	 

 


invokevirtual #5	 
va/io/PrintStream.println:(I)V 方法
生成新的栈帧（分配 locals、stack等）
传递参数，执行新栈帧中的字节码

 

完成 main 方法调用，弹出 main 栈帧程序结束

 

 

 

 

 

  

 

 

 

 

### 2.4 练习 - 分析 i++	 

目的：从字节码角度分析 a++ 相关题目源码：

字节码：


分析：





### 2.5 条件判断指令	 

指令	助记符	含义
0x99	ifeq	判断是否 == 0
0x9a	ifne	判断是否 != 0
0x9b	iflt	判断是否 < 0
0x9c	ifge	判断是否 >= 0
0x9d	ifgt	判断是否 > 0
0x9e	ifle	判断是否 <= 0
0x9f	if_icmpeq	两个int是否 ==
0xa0	if_icmpne	两个int是否 !=
0xa1	if_icmplt	两个int是否 <
0xa2	if_icmpge	两个int是否 >=
0xa3	if_icmpgt	两个int是否 >
0xa4	if_icmple	两个int是否 <=
0xa5	if_acmpeq	两个引用是否 ==
0xa6	if_acmpne	两个引用是否 !=
0xc6	ifnull	判断是否 == null
0xc7	ifnonnull	判断是否 != null
几点说明：
byte，short，char 都会按 int 比较，因为操作数栈都是 4 字节 goto 用来进行跳转到指定行号的字节码源码：

字节码：

 

### 2.6 循环控制指令	 其实循环控制还是前面介绍的那些指令，例如 while 循环：

字节码是：

再比如 do while 循环：

字节码是：
0: iconst_0 1: istore_1 2: iinc 1, 1 5: iload_1 6: bipush 10 8: if_icmplt 2 11: return
后再看看 for 循环：

字节码是：

### 2.7 练习 - 判断结果	 

请从字节码角度分析，下列代码运行的结果：

  

###  2.8 构造方法	 

1）<cinit>()V	 


编译器会按从上至下的顺序，收集所有 static 静态代码块和静态成员赋值的代码，合并为一个特殊的方

 


编译器会按从上至下的顺序，收集所有 {} 代码块和成员变量赋值的代码，形成新的构造方法，但原始构造方法内的代码总是在 后
public cn.itcast.jvm.t3.bytecode.Demo3_8_2(java.lang.String, int);
    descriptor: (Ljava/lang/String;I)V
    flags: ACC_PUBLIC     Code:
      stack=2, locals=3, args_size=3
         0: aload_0
         1: invokespecial #1    // super.<init>()V
         4: aload_0
         5: ldc           #2    // <- "s1"   
         7: putfield      #3    // -> this.a
        10: aload_0
        11: bipush        20    // <- 20
        13: putfield      #4    // -> this.b
        16: aload_0
        17: bipush        10    // <- 10
        19: putfield      #4    // -> this.b
        22: aload_0
        23: ldc           #5    // <- "s2"
        25: putfield      #3    // -> this.a
        28: aload_0             // ------------------------------
        29: aload_1             // <- slot 1(a) "s3"            |         30: putfield      #3    // -> this.a                    |         33: aload_0                                             |         34: iload_2             // <- slot 2(b) 30              |         35: putfield      #4    // -> this.b --------------------
        38: return
      LineNumberTable: ...
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
            0      39     0  this   Lcn/itcast/jvm/t3/bytecode/Demo3_8_2;
            0      39     1     a   Ljava/lang/String;
            0      39     2     b   I     MethodParameters: ...

### 2.9 方法调用	 

看一下几种不同的方法调用对应的字节码指令


字节码：
new 是创建【对象】，给对象分配堆内存，执行成功会将【对象引用】压入操作数栈
dup 是赋值操作数栈栈顶的内容，本例即为【对象引用】，为什么需要两份引用呢，一个是要配合 invokespecial 调用该对象的构造方法 "<init>":()V （会消耗掉栈顶一个引用），另一个要配合 astore_1 赋值给局部变量
终方法（final），私有方法（private），构造方法都是由 invokespecial 指令来调用，属于静态绑定
普通成员方法是由 invokevirtual 调用，属于动态绑定，即支持多态
成员方法与静态方法调用的另一个区别是，执行方法前是否需要【对象引用】比较有意思的是 d.test4(); 是通过【对象引用】调用一个静态方法，可以看到在调用 invokestatic 之前执行了 pop 指令，把【对象引用】从操作数栈弹掉了还有一个执行 invokespecial 的情况是通过 super 调用父类方法

### 2.10 多态的原理	 



1）运行代码	 
停在 System.in.read() 方法上，这时运行 jps 获取进程 id
2）运行 HSDB 工具	 
进入 JDK 安装目录，执行

进入图形界面 attach 进程 id
3）查找某个对象	 


4）查看对象内存结构	 
点击超链接可以看到对象的内存结构，此对象没有任何属性，因此只有对象头的 16 字节，前 8 字节是
MarkWord，后 8 字节就是对象的 Class 指针但目前看不到它的实际地址


5）查看对象 Class 的内存地址	 
可以通过 Windows -> Console 进入命令行模式，执行

mem 有两个参数，参数 1 是对象地址，参数 2 是查看 2 行（即 16 字节）结果中第二行 0x000000001b7d4028 即为 Class 的内存地址

6）查看类的 vtable	 
 方法1：Alt+R 进入 Inspector 工具，输入刚才的 Class 内存地址，看到如下界面





无论通过哪种方法，都可以找到 Dog Class 的 vtable 长度为 6，意思就是 Dog 类有 6 个虚方法（多态相关的，final，static 不会列入）
那么这 6 个方法都是谁呢？从 Class 的起始地址开始算，偏移 0x1b8 就是 vtable 的起始地址，进行计算得到：

通过 Windows -> Console 进入命令行模式，执行

就得到了 6 个虚方法的入口地址
7）验证方法地址	 
通过 Tools -> Class Browser 查看每个类的方法定义，比较可知
Dog - public void eat() @0x000000001b7d3fa8
Animal - public java.lang.String toString() @0x000000001b7d35e8;
Object - protected void finalize() @0x000000001b3d1b10;
Object - public boolean equals(java.lang.Object) @0x000000001b3d15e8;
Object - public native int hashCode() @0x000000001b3d1540; Object - protected native java.lang.Object clone() @0x000000001b3d1678;
对号入座，发现
	eat() 方法是 Dog 类自己的
toString() 方法是继承 String 类的
finalize() ，equals()，hashCode()，clone() 都是继承 Object 类的
8）小结	 
当执行 invokevirtual 指令时，
1.先通过栈帧中的对象引用找到对象
2.分析对象头，找到对象的实际 Class
3.Class 结构中有 vtable，它在类加载的链接阶段就已经根据方法的重写规则生成好了
4.查表得到方法的具体地址
5.执行方法的字节码

 

 

 

### 2.11 异常处理	 try-catch	 


        11: istore_1
        12: return
      Exception table:
         from    to  target type
             2     5     8   Class java/lang/Exception
      LineNumberTable: ...              LocalVariableTable:
        Start  Length  Slot  Name   Signature
            9       3     2     e   Ljava/lang/Exception;
            0      13     0  args   [Ljava/lang/String;
            2      11     1     i   I       StackMapTable: ...
    MethodParameters: ...

}
可以看到多出来一个 Exception table 的结构，[from, to) 是前闭后开的检测范围，一旦这个范围内的字节码执行出现异常，则通过 type 匹配异常类型，如果一致，进入 target 所指示行号
8 行的字节码指令 astore_2 是将异常对象引用存入局部变量表的 slot 2 位置

多个 single-catch 块的情况	 

 


multi-catch 的情况	 


finally	 


public static void main(java.lang.String[]);
    descriptor: ([Ljava/lang/String;)V
    flags: ACC_PUBLIC, ACC_STATIC     Code:
      stack=1, locals=4, args_size=1
         0: iconst_0
1istore_1            // 0 -> i
2bipush        10    // try -------------------------------------         4 istore_1            // 10 -> i                                  |          5 bipush        30    // finally                                  |          7 istore_1            // 30 -> i                                  |
         8 goto          27    // return ----------------------------------11 astore_2            // catch Exceptin -> e ----------------------

        12: bipush        20    //                                          |         14: istore_1            // 20 -> i                                  |         15: bipush        30    // finally                                  |         17: istore_1            // 30 -> i                                  |         18: goto          27    // return ----------------------------------        21: astore_3            // catch any -> slot 3 ---------------------        22: bipush        30    // finally                                  |         24: istore_1            // 30 -> i                                  |
        25: aload_3             // <- slot 3                                |
        26: athrow              // throw ------------------------------------
        27: return
      Exception table:
         from    to  target type
             2     5    11   Class java/lang/Exception
             2     5    21   any    // 剩余的异常类型，比如 Error

1115    21   any    // 剩余的异常类型，比如 Error       LineNumberTable: ...
      LocalVariableTable:
        Start  Length  Slot  Name   Signature
123     2     e   Ljava/lang/Exception;
            0      28     0  args   [Ljava/lang/String;
            2      26     1     i   I       StackMapTable: ...
    MethodParameters: ...
可以看到 finally 中的代码被复制了 3 份，分别放入 try 流程，catch 流程以及 catch 剩余的异常类型流程

### 2.12 练习 - finally 面试题	 

finally 出现了 return	 
先问问自己，下面的题目输出什么？

         2: istore_0            // 10 -> slot 0 (从栈顶移除了)
         3: bipush        20    // <- 20 放入栈顶
         5: ireturn             // 返回栈顶 int(20)
         6: astore_1            // catch any -> slot 1
         7: bipush        20    // <- 20 放入栈顶          9: ireturn             // 返回栈顶 int(20)       Exception table:
         from    to  target type              0     3     6   any       LineNumberTable: ...
      StackMapTable: ...

由于 finally 中的 ireturn 被插入了所有可能的流程，因此返回结果肯定以 finally 的为准至于字节码中第 2 行，似乎没啥用，且留个伏笔，看下个例子
跟上例中的 finally 相比，发现没有 athrow 了，这告诉我们：如果在 finally 中出现了 return，会吞掉异常 ，可以试一下下面的代码


finally 对返回值影响	 
同样问问自己，下面的题目输出什么？



### 2.13 synchronized	 



 

 

 

 

 

 

 

 

 

 

 

## 3. 编译期处理	 

所谓的 语法糖，其实就是指 java 编译器把 *.java 源码编译为 *.class 字节码的过程中，自动生成和转换的一些代码，主要是为了减轻程序员的负担，算是 java 编译器给我们的一个额外福利（给糖吃嘛）
注意，以下代码的分析，借助了 javap 工具，idea 的反编译功能，idea 插件 jclasslib 等工具。另外，编译器转换的结果直接就是 class 字节码，只是为了便于阅读，给出了 几乎等价 的 java 源码方式，并不是编译器还会转换出中间的 java 源码，切记。

### 3.1 默认构造器	 

编译成class后的代码：

### 3.2 自动拆装箱	 

显然之前版本的代码太麻烦了，需要在基本类型和包装类型之间来回转换（尤其是集合类中操作的都是包装类型），因此这些转换的事情在 JDK 5 以后都由编译器在编译阶段完成。即 代码片段1 都会在编译阶段被转换为 代码片段2

### 3.3 泛型集合取值	 

泛型也是在 JDK 5 开始加入的特性，但 java 在编译泛型代码后会执行 泛型擦除 的动作，即泛型信息在编译为字节码之后就丢失了，实际的类型都当做了 Object 类型来处理：
public class Candy3 {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(10); // 实际调用的是 List.add(Object e)
        Integer x = list.get(0); // 实际调用的是 Object obj = List.get(int index);
    }
}
所以在取值时，编译器真正生成的字节码中，还要额外做一个类型转换的操作：

如果前面的 x 变量类型修改为 int 基本类型那么 终生成的字节码是：

还好这些麻烦事都不用自己做。

擦除的是字节码上的泛型信息，可以看到 LocalVariableTypeTable 仍然保留了方法参数泛型的信息


使用反射，仍然能够获得这些信息：

输出

### 3.4 可变参数	 

 

### 3.5 foreach 循环	 

会被编译器转换为：

而集合的循环：

实际被编译器转换为对迭代器的调用：

 

### 3.6 switch 字符串	 



可以看到，执行了两遍 switch，第一遍是根据字符串的 hashCode 和 equals 将字符串的转换为相应 byte 类型，第二遍才是利用 byte 执行进行比较。


会被编译器转换为：

### 3.7 switch 枚举	 switch 枚举的例子，原始代码：

转换后代码：

### 3.8 枚举类	 



### 3.9 try-with-resources	 



息的丢失（想想 try-with-resources 生成的 fianlly 中如果抛出了异常）：

输出：

如以上代码所示，两个异常信息都不会丢。

### 3.10 方法重写时的桥接方法	 

我们都知道，方法重写时对返回值分两种情况：父子类的返回值完全一致

其中桥接方法比较特殊，仅对 java 虚拟机可见，并且与原来的 public Integer m() 没有命名冲突，可以用下面反射代码来验证：

会输出：

### 3.11 匿名内部类	 源代码：

转换后代码：

引用局部变量的匿名内部类，源代码：

转换后代码：



 

## 4 . 类加载阶段	 

### 4.1 加载	 

将类的字节码载入方法区中，内部采用 C++ 的 instanceKlass 描述 java 类，它的重要 field 有：
_java_mirror 即 java 的类镜像，例如对 String 来说，就是 String.class，作用是把 klass 暴露给 java 使用 _super 即父类
_fields 即成员变量
_methods 即方法
_constants 即常量池
_class_loader 即类加载器
_vtable 虚方法表
_itable 接口方法表
如果这个类还有父类没有加载，先加载父类加载和链接可能是交替运行的
instanceKlass 这样的【元数据】是存储在方法区（1.8 后的元空间内），但 _java_mirror 是存储在堆中可以通过前面介绍的 HSDB 工具查看

### 4.2 链接	 

验证	 
验证类是否符合 JVM规范，安全性检查
用 UE 等支持二进制的编辑器修改 HelloWorld.class 的魔数，在控制台运行
E:\git\jvm\out\production\jvm>java cn.itcast.jvm.t5.HelloWorld
Error: A JNI error has occurred, please check your installation and try again
Exception in thread "main" java.lang.ClassFormatError: Incompatible magic value 
3405691578 in class file cn/itcast/jvm/t5/HelloWorld
        at java.lang.ClassLoader.defineClass1(Native Method)
        at java.lang.ClassLoader.defineClass(ClassLoader.java:763)
        at java.security.SecureClassLoader.defineClass(SecureClassLoader.java:142)         at java.net.URLClassLoader.defineClass(URLClassLoader.java:467)
        at java.net.URLClassLoader.access$100(URLClassLoader.java:73)
        at java.net.URLClassLoader$1.run(URLClassLoader.java:368)
        at java.net.URLClassLoader$1.run(URLClassLoader.java:362)
        at java.security.AccessController.doPrivileged(Native Method)
        at java.net.URLClassLoader.findClass(URLClassLoader.java:361)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:424)
        at sun.misc.Launcher$AppClassLoader.loadClass(Launcher.java:331)
        at java.lang.ClassLoader.loadClass(ClassLoader.java:357)         at sun.launcher.LauncherHelper.checkAndLoadMain(LauncherHelper.java:495)
准备	 
为 static 变量分配空间，设置默认值
static 变量在 JDK 7 之前存储于 instanceKlass 末尾，从 JDK 7 开始，存储于 _java_mirror 末尾 static 变量分配空间和赋值是两个步骤，分配空间在准备阶段完成，赋值在初始化阶段完成如果 static 变量是 final 的基本类型，以及字符串常量，那么编译阶段值就确定了，赋值在准备阶段完成
如果 static 变量是 final 的，但属于引用类型，那么赋值也会在初始化阶段完成

解析	 将常量池中的符号引用解析为直接引用

 

### 4.3 初始化	 

<cinit>()V 方法	 
初始化即调用 <cinit>()V ，虚拟机会保证这个类的『构造方法』的线程安全
发生的时机	 
概括得说，类初始化是【懒惰的】
main 方法所在的类，总会被首先初始化首次访问这个类的静态变量或静态方法时子类初始化，如果父类还没初始化，会引发子类访问父类的静态变量，只会触发父类的初始化
Class.forName
new 会导致初始化不会导致类初始化的情况
访问类的 static final 静态常量（基本类型和字符串）不会触发初始化
类对象.class 不会触发初始化
创建该类的数组不会触发初始化
类加载器的 loadClass 方法
Class.forName 的参数 2 为 false 时

实验

验证（实验时请先全部注释，每次只执行其中一个）

### 4.4 练习	 

从字节码分析，使用 a，b，c 这三个常量是否会导致 E 初始化

典型应用 - 完成懒惰初始化单例模式

以上的实现特点是：懒惰实例化
初始化时的线程安全是有保障的

 

 

 

 

## 5.类加载器	 

以 JDK 8 为例：
名称	加载哪的类	说明
Bootstrap ClassLoader	JAVA_HOME/jre/lib	无法直接访问
Extension ClassLoader	JAVA_HOME/jre/lib/ext	上级为 Bootstrap，显示为 null
Application ClassLoader	classpath	上级为 Extension
自定义类加载器	自定义	上级为 Application

### 5.1 启动类加载器	 用 Bootstrap 类加载器加载类：

执行

输出

### 5.2 扩展类加载器	 

执行

输出

写一个同名的类

打个 jar 包
E:\git\jvm\out\production\jvm>jar -cvf my.jar cn/itcast/jvm/t3/load/G.class 已添加清单
正在添加: cn/itcast/jvm/t3/load/G.class(输入 = 481) (输出 = 322)(压缩了 33%) 将 jar 包拷贝到 JAVA_HOME/jre/lib/ext 重新执行 Load5_2 输出

### 5.3 双亲委派模式	 

所谓的双亲委派，就是指调用类加载器的 loadClass 方法时，查找类的规则
 注意


执行流程为：

1. sun.misc.Launcher$AppClassLoader //1 处， 开始查看已加载的类，结果没有
   2.sun.misc.Launcher$AppClassLoader // 2 处，委派上级 sun.misc.Launcher$ExtClassLoader.loadClass()
   3.sun.misc.Launcher$ExtClassLoader // 1 处，查看已加载的类，结果没有
   4.sun.misc.Launcher$ExtClassLoader // 3 处，没有上级了，则委派 BootstrapClassLoader 查找
   5.BootstrapClassLoader 是在 JAVA_HOME/jre/lib 下找 H 这个类，显然没有
2. sun.misc.Launcher$ExtClassLoader // 4 处，调用自己的 findClass 方法，是在
   JAVA_HOME/jre/lib/ext 下找 H 这个类，显然没有，回到 sun.misc.Launcher$AppClassLoader
3. 到 sun.misc.Launcher$AppClassLoader // 4 处，调用它自己的 findClass 方法，在 classpath 下查找，找到了

### 5.4 线程上下文类加载器	 

我们在使用 JDBC 时，都需要加载 Driver 驱动，不知道你注意到没有，不写

让我们追踪一下源码：

先不看别的，看看 DriverManager 的类加载器：

打印 null，表示它的类加载器是 Bootstrap ClassLoader，会到 JAVA_HOME/jre/lib 下搜索类，但
JAVA_HOME/jre/lib 下显然没有 mysql-connector-java-5.1.47.jar 包，这样问题来了，在 DriverManager 的静态代码块中，怎么能正确加载 com.mysql.jdbc.Driver 呢？继续看 loadInitialDrivers() 方法：


先看 2）发现它 后是使用 Class.forName 完成类的加载和初始化，关联的是应用程序类加载器，因此可以顺利完成类加载
再看 1）它就是大名鼎鼎的 Service Provider Interface （SPI）
约定如下，在 jar 包的 META-INF/services 包下，以接口全限定名名为文件，文件内容是实现类名称

这样就可以使用

来得到实现类，体现的是【面向接口编程+解耦】的思想，在下面一些框架中都运用了此思想：
JDBC
Servlet 初始化器
Spring 容器
Dubbo（对 SPI 进行了扩展）接着看 ServiceLoader.load 方法：

线程上下文类加载器是当前线程使用的类加载器，默认就是应用程序类加载器，它内部又是由 Class.forName 调用了线程上下文类加载器完成类加载，具体代码在 ServiceLoader 的内部类
LazyIterator 中：



### 5.5 自定义类加载器	 

问问自己，什么时候需要自定义类加载器
1）想加载非 classpath 随意路径中的类文件
2）都是通过接口来使用实现，希望解耦时，常用在框架设计
3）这些类希望予以隔离，不同应用的同名类都可以加载，不冲突，常见于 tomcat 容器

步骤：
1.继承 ClassLoader 父类
2.要遵从双亲委派机制，重写 findClass 方法
 注意不是重写 loadClass 方法，否则不会走双亲委派机制
3.读取类文件的字节码
4.调用父类的 defineClass 方法来加载类
5.使用者调用该类加载器的 loadClass 方法示例：
准备好两个类文件放入 E:\myclasspath，它实现了 java.util.Map 接口，可以先反编译看一下：

 

 

 

 

## 6. 运行期优化	 

### 6.1 即时编译	 

分层编译	 
（TieredCompilation）
先来个例子


2357173
2450346
2552906
2650346
2747786
2849920
2964000
3049067
3163574
3263147
3356746
3449494
3564853
36107520
3746933
3851627
3945653
40103680
4151626
4260160
4349067
4445653
4549493
4651626
4749066
4847360
4950774
5070827
5164000
5272107
5349066
5446080
5544800
5646507
5773813
5861013
5957600
6083200
617024204
6249493
6320907
6420907
6520053
6620906
6720907
6821333
6922187
7020480
7121760
7219200
7315360
7418347
7519627
7617067
7734134
7819200
7918347
8017493

8115360
8218774
8317067
8421760
8523467
8617920
8717920
8818774
8918773
9019200
9120053
9218347
9322187
9417920
9518774
9619626
9733280
9820480
9920480
10018773
10147786
10217493
10322614
10464427
10518347
10619200
10726027
10821333
10920480
11024747
11132426
11221333
11317920
11417920
11519200
11618346
11715360
11824320
11919200
12020053
12117920
12218773
12320053
12418347
12518347
12622613
12718773
12819627
12920053
13020480
13119627
13220053
13315360
134136533
13543093
136853
137853
138853

139853
140854
141853
142853
143853
144853
145853
146853
147854
148853
149853
150854
151853
152853
153853
1541280
155853
156853
157854
158853
159853
160854
161854
162853
163854
164854
165854
166854
167853
168853
169854
170853
171853
172853
1731280 174 853
1751280
176853
177854
178854
179427
180853
181854
182854
183854
184853
185853
186854
187853
188853
189854
1901280
191853
192853
193853
194853
195854
196853

原因是什么呢？
JVM 将执行状态分成了 5 个层次：
0层，解释执行（Interpreter）
1层，使用 C1 即时编译器编译执行（不带 profiling）
2层，使用 C1 即时编译器编译执行（带基本的 profiling）
3层，使用 C1 即时编译器编译执行（带完全的 profiling）
4层，使用 C2 即时编译器编译执行
profiling 是指在运行过程中收集一些程序执行状态的数据，例如【方法的调用次数】，【循环的回边次数】等
即时编译器（JIT）与解释器的区别
解释器是将字节码解释为机器码，下次即使遇到相同的字节码，仍会执行重复的解释
JIT 是将一些字节码编译为机器码，并存入 Code Cache，下次遇到相同的代码，直接执行，无需再编译
解释器是将字节码解释为针对所有平台都通用的机器码
JIT 会根据平台类型，生成平台特定的机器码
对于占据大部分的不常用的代码，我们无需耗费时间将其编译成机器码，而是采取解释执行的方式运行；另一方面，对于仅占据小部分的热点代码，我们则可以将其编译成机器码，以达到理想的运行速度。 执行效率上简单比较一下 Interpreter < C1 < C2，总的目标是发现热点代码（hotspot名称的由来），优化之

刚才的一种优化手段称之为【逃逸分析】，发现新建的对象是否逃逸。可以使用 -XX:-
DoEscapeAnalysis 关闭逃逸分析，再运行刚才的示例观察结果

参考资料：https://docs.oracle.com/en/java/javase/12/vm/java-hotspot-virtual-machineperformance-enhancements.html#GUID-D2E3DC58-D18B-4A6C-8167-4A1DFB4888E4 方法内联	 
（Inlining）

如果发现 square 是热点方法，并且长度不太长时，会进行内联，所谓的内联就是把方法内代码拷贝、粘贴到调用者的位置：

还能够进行常量折叠（constant folding）的优化

实验：

字段优化	 
JMH 基准测试请参考：http://openjdk.java.net/projects/code-tools/jmh/ 创建 maven 工程，添加依赖如下

编写基准测试代码：



import org.openjdk.jmh.runner.options.Options; import org.openjdk.jmh.runner.options.OptionsBuilder;
import java.util.Random; import java.util.concurrent.ThreadLocalRandom;
@Warmup(iterations = 2, time = 1)
@Measurement(iterations = 5, time = 1)
@State(Scope.Benchmark) public class Benchmark1 {
    int[] elements = randomInts(1_000);
    private static int[] randomInts(int size) {
        Random random = ThreadLocalRandom.current();
        int[] values = new int[size];
        for (int i = 0; i < size; i++) {
            values[i] = random.nextInt();
        }
        return values;
    }
    @Benchmark
    public void test1() {
        for (int i = 0; i < elements.length; i++) {
            doSum(elements[i]);
        }
    }
    @Benchmark
    public void test2() {
        int[] local = this.elements;
        for (int i = 0; i < local.length; i++) {
            doSum(local[i]);
        }
    }
    @Benchmark
    public void test3() {
        for (int element : elements) {
            doSum(element);
        }
    }
    static int sum = 0;
    @CompilerControl(CompilerControl.Mode.INLINE)
    static void doSum(int x) {
        sum += x;
    }
    public static void main(String[] args) throws RunnerException {
        Options opt = new OptionsBuilder()
                .include(Benchmark1.class.getSimpleName())
                .forks(1)                 .build();
        new Runner(opt).run();
北京市昌平区建材城西路金燕龙办公楼一层   电话：400-618-9090


首先启用 doSum 的方法内联，测试结果如下（每秒吞吐量，分数越高的更好）：
Benchmark              Mode  Samples        Score  Score error  Units t.Benchmark1.test1    thrpt        5  2420286.539   390747.467  ops/s
t.Benchmark1.test2    thrpt        5  2544313.594    91304.136  ops/s
t.Benchmark1.test3    thrpt        5  2469176.697   450570.647  ops/s
接下来禁用 doSum 方法内联

测试结果如下：
Benchmark              Mode  Samples       Score  Score error  Units t.Benchmark1.test1    thrpt        5  296141.478    63649.220  ops/s
t.Benchmark1.test2    thrpt        5  371262.351    83890.984  ops/s
t.Benchmark1.test3    thrpt        5  368960.847    60163.391  ops/s
分析：
在刚才的示例中，doSum 方法是否内联会影响 elements 成员变量读取的优化：如果 doSum 方法内联了，刚才的 test1 方法会被优化成下面的样子（伪代码）：

可以节省 1999 次 Field 读取操作
但如果 doSum 方法没有内联，则不会进行上面的优化

练习：在内联情况下将 elements 添加 volatile 修饰符，观察测试结果

 

 

  

 

 

 

 

 

 

### 6.2 反射优化	

 

foo.invoke 前面 0 ~ 15 次调用使用的是 MethodAccessor 的 NativeMethodAccessorImpl 实现


当调用到第 16 次（从0开始算）时，会采用运行时生成的类代替掉 初的实现，可以通过 debug 得到类名为 sun.reflect.GeneratedMethodAccessor1 可以使用阿里的 arthas 工具：

选择 1 回车表示分析该进程

1 [INFO] arthas home: /root/.arthas/lib/3.1.1/arthas
[INFO] Try to attach process 13065 [INFO] Attach process 13065 success.
[INFO] arthas-client connect 127.0.0.1 3658
  ,---.  ,------. ,--------.,--.  ,--.  ,---.   ,---.                            /  O  \ |  .--. ''--.  .--'|  '--'  | /  O  \ '   .-'                          
|  .-.  ||  '--'.'   |  |   |  .--.  ||  .-.  |`.  `-.                          |  | |  ||  |\  \    |  |   |  |  |  ||  | |  |.-'    |                         `--' `--'`--' '--'   `--'   `--'  `--'`--' `--'`-----'                                                                                                          
wiki      https://alibaba.github.io/arthas                                      tutorials https://alibaba.github.io/arthas/arthas-tutorials                     version   3.1.1                                                                 pid       13065                                                                 time      2019-06-10 12:23:54  
再输入【jad + 类名】来进行反编译
$ jad sun.reflect.GeneratedMethodAccessor1
ClassLoader:                                                                                                                                        
+-sun.reflect.DelegatingClassLoader@15db9742                                     
                                                                   
  +-sun.misc.Launcher$AppClassLoader@4e0e2f2a                                                                                                       
    +-sun.misc.Launcher$ExtClassLoader@2fdb006e                                                                                                     
Location:                                                                       
                                                                    
                                                                                 
                                                                   
/*
*Decompiled with CFR 0_132.

 * *Could not load the following classes:
   *cn.itcast.jvm.t3.reflect.Reflect1
    */
   package sun.reflect;
   import cn.itcast.jvm.t3.reflect.Reflect1; import java.lang.reflect.InvocationTargetException; import sun.reflect.MethodAccessorImpl;
   public class GeneratedMethodAccessor1 extends MethodAccessorImpl {
    /*
   *Loose catch block
   *Enabled aggressive block sorting
   *Enabled unnecessary exception pruning
   *Enabled aggressive exception aggregation
   *Lifted jumps to return sites
     */

 

 

 

# 四.内存模型	 

## 1. java 内存模型	 



很多人将【java 内存结构】与【java 内存模型】傻傻分不清，【java 内存模型】是 Java Memory Model（JMM）的意思。

[关于它的权威解释，请参考](https://download.oracle.com/otn-pub/jcp/memory_model-1.0-pfd-spec-oth-JSpec/memory_model-1_0-pfd-spec.pdf?AuthParam=1562811549_4d4994cbd5b59d964cd2907ea22ca08b)

简单的说，JMM 定义了一套在**多线程读写**共享数据时（成员变量、数组）时，对数据的可见性、有序性、和原子性的规则和保障

### 1.1 原子性	[ ](af://n13/)

原子性在学习线程时讲过，下面来个例子简单回顾一下：

问题提出，两个线程对初始值为 0 的静态变量一个做自增，一个做自减，各做 5000 次，结果是 0 吗？

### 1.2 问题分析	

以上的结果可能是正数、负数、零。为什么呢？因为 Java 中对静态变量的自增，自减并不是原子操作。

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps95.png)

而 Java 的内存模型如下，完成静态变量的自增，自减需要在主存和线程内存中进行数据交换： 

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps96.png) 

如果是单线程以上 8 行代码是顺序执行（不会交错）没有问题：

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps97.png)

但多线程下这 8 行代码可能交错运行（为什么会交错？思考一下）： 出现负数的情况：

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps98.png)

出现正数的情况：

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps99.png)

### 1.3 解决方法	[ ](af://n29/)

synchronized（同步关键字)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps101.png)

如何理解呢：你可以把 obj 想象成一个房间，线程 t1，t2 想象成两个人。

1. 当线程 t1 执行到 synchronized(obj) 时就好比 t1 进入了这个房间，并反手锁住了门，在门内执行 count++ 代码。

2. 这时候如果 t2 也运行到了 synchronized(obj) 时，它发现门被锁住了，只能在门外等待。

3. 当 t1 执行完 synchronized{} 块内的代码，这时候才会解开门上的锁，从 obj 房间出来。t2 线程这时才可以进入 obj 房间，反锁住门，执行它的 count-- 代码。

注意：上例中 t1 和 t2 线程必须用 synchronized 锁住同一个 obj 对象，如果 t1 锁住的是 m1 对象，t2 锁住的是 m2 对象，就好比两个人分别进入了两个不同的房间，没法起到同步的效果。

 

## 2. 可见性



### 2.1 退不出的循环

先来看一个现象，main 线程对 run 变量的修改对于 t 线程不可见，导致了 t 线程无法停止

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps104.png)

 

为什么呢？ 

1. 初始状态， t 线程刚开始从主内存读取了 run 的值到工作内存。

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps105.png) 

2. 因为 t 线程要频繁从主内存中读取 run 的值，JIT 编译器会将 run 的值缓存至自己工作内存中的高速缓存中，减少对主存中 run 的访问，提高效率

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps106.png) 

3. 1 秒之后，main 线程修改了 run 的值，并同步至主存，而 t 是从自己工作内存中的高速缓存中读取这个变量的值，结果永远是旧值

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps107.png) 

### 2.2 解决方法	

volatile（易变关键字）

它可以用来修饰成员变量和静态成员变量，他可以*<!--避免线程从自己的工作缓存中查找变量的值-->*，必须到主存中获取它的值，线程操作 volatile 变量都是直接操作主存

<img src="C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210620131455851.png" alt="image-20210620131455851" style="zoom:80%;" />

 

### 2.3 可见性	**[ ](af://n71/)**

前面例子体现的实际就是可见性，它保证的是在多个线程之间，一个线程对 volatile 变量的修改对另一个线程可见， <u>*不能保证原子性*</u>，仅用在一个写线程，多个读线程的情况： 上例从字节码理解是这样的：

```
getstatic   run  // 线程 t 获取 run true 
getstatic   run  // 线程 t 获取 run true 
getstatic   run  // 线程 t 获取 run true 
getstatic   run  // 线程 t 获取 run true

putstatic   run  //  线程 main 修改 run 为 false， 仅此一次 getstatic   run  // 线程 t 获取 run false
```

 

比较一下之前我们将线程安全时举的例子：两个线程一个 i++ 一个 i-- ，只能保证看到 新值，不能解决指令交错

```
// 假设i的初始值为0 getstatic   i  
// 线程1-获取静态变量i的值 线程内i=0 getstatic   i  
// 线程2-获取静态变量i的值 线程内i=0 iconst_1     
// 线程1-准备常量1 iadd       
// 线程1-自增 线程内i=1 putstatic   i 
// 线程1-将修改后的值存入静态变量i 静态变量i=1 iconst_1     
// 线程2-准备常量1 isub       
// 线程2-自减 线程内i=-1

putstatic   i  // 线程2-将修改后的值存入静态变量i 静态变量i=-1
```

 

**注意**:

​	<u>synchronized 语句块既可以保证代码块的原子性，也同时保证代码块内变量的可见性</u>。但缺点是synchronized是属于重量级操作，性能相对更低

如果在前面示例的死循环中加入 System.out.println() 会发现即使不加 volatile 修饰符，线程 t 也能正确看到对 run 变量的修改了，想一想为什么？

 

## 3. 有序性	[ ](af://n81/)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps110.png)

### 3.1 诡异的结果	[ ](af://n82/)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps111.png)

I_Result 是一个对象，有一个属性 r1 用来保存结果，问，可能的结果有几种？有同学这么分析

情况1：线程1 先执行，这时 ready = false，所以进入 else 分支结果为 1

情况2：线程2 先执行 num = 2，但没来得及执行 ready = true，线程1 执行，还是进入 else 分支，结果为1

情况3：线程2 执行到 ready = true，线程1 执行，这回进入 if 分支，结果为 4（因为 num 已经执行过了）

 

但我告诉你，结果还有可能是 0 ，信不信吧！

这种情况下是：线程2 执行 ready = true，切换到线程1，进入 if 分支，相加为 0，再切回线程2 执行 num = 2

相信很多人已经晕了 

 

这种现象叫做指令重排，是 JIT 编译器在运行时的一些优化，这个现象需要通过大量测试才能复现：

借助 java 并发压测工具 jcstress [https://wiki.open](https://wiki.openjdk.java.net/display/CodeTools/jcstress)[j](https://wiki.openjdk.java.net/display/CodeTools/jcstress)[dk](https://wiki.openjdk.java.net/display/CodeTools/jcstress)[.j](https://wiki.openjdk.java.net/display/CodeTools/jcstress)[ava.net/displa](https://wiki.openjdk.java.net/display/CodeTools/jcstress)[y](https://wiki.openjdk.java.net/display/CodeTools/jcstress)[/CodeTools/](https://wiki.openjdk.java.net/display/CodeTools/jcstress)[j](https://wiki.openjdk.java.net/display/CodeTools/jcstress)[cstress](https://wiki.openjdk.java.net/display/CodeTools/jcstress)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps112.png)mvn archetype:generate  -DinteractiveMode=false DarchetypeGroupId=org.openjdk.jcstress -DarchetypeArtifactId=jcstress-java-testarchetype -DgroupId=org.sample -DartifactId=test -Dversion=1.0

创建 maven 项目，提供如下测试类

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps113.png)

执行

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps114.png)

会输出我们感兴趣的结果，摘录其中一次结果：

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps115.png)

 ```
0   1,729  ACCEPTABLE_INTERESTING  !!!!
1   42,617,915        ACCEPTABLE  ok
4   5,146,627        ACCEPTABLE  ok
[OK] test.ConcurrencyTest

(JVM args: [])
 Observed state  Occurrences        Expectation  Interpretation         0     1,652  ACCEPTABLE_INTERESTING  !!!!

​        1   46,460,657        ACCEPTABLE  ok

​        4   4,571,072        ACCEPTABLE  ok
 ```

可以看到，出现结果为 0 的情况有 638 次，虽然次数相对很少，但毕竟是出现了。

### 3.2 解决方法	[ ](af://n104/)

volatile 修饰的变量，可以禁用指令重排

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps117.png)

 

结果为：

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps118.png)

 

### 3.3 有序性理解	[ ](af://n111/)

JVM 会在不影响正确性的前提下，可以调整语句的执行顺序，思考下面一段代码

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps119.png)

可以看到，至于是先执行 i 还是 先执行 j ，对 终的结果不会产生影响。所以，上面代码真正执行时，既可以是

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps120.png)

也可以是

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps121.png)

这种特性称之为**『指令重排』**，

 单线程不会产生问题；多线程下『指令重排』会影响正确性。

例如著名的 double-checked locking 模式实现单例

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps122.png)

以上的实现特点是：

- 懒惰实例化

- 首次使用 getInstance() 才使用 synchronized 加锁，后续使用时无需加锁

  

  但在多线程环境下，上面的代码是有问题的，INSTANCE = new Singleton() 对应的字节码为：

0: new      #2          // class cn/itcast/jvm/t4/Singleton

3: dup

4: invokespecial #3          // Method "<init>":()V

7: putstatic   #4          // Field 

INSTANCE:Lcn/itcast/jvm/t4/Singleton;

其中 4 7 两步的顺序不是固定的，也许 jvm 会优化为：先将引用地址赋值给 INSTANCE 变量后，再执行构造方法，如果两个线程 t1，t2 按如下时间序列执行：

```
时间1  t1 线程执行到 INSTANCE = new Singleton(); 时间2  t1 线程分配空间，为Singleton对象生成了引用地址（0 处）时间3  t1 线程将引用地址赋值给 INSTANCE，这时 INSTANCE != null（7 处）时间4  t2 线程进入getInstance() 方法，发现 INSTANCE != null（synchronized块外），直接返回 INSTANCE时间5  t1 线程执行Singleton的构造方法（4 处）
```



这时 t1 还未完全将构造方法执行完毕，如果在构造方法中要执行很多初始化操作，那么 t2 拿到的是将是一个未初始化完毕的单例

对 INSTANCE 使用 volatile 修饰即可，可以禁用指令重排，但要注意在 **JDK 5 以上**的版本的 volatile 才会真正有效

 

### 3.4 happens-before	[ ](af://n133/)

happens-before 规定了哪些写操作对其它线程的读操作可见，它是可见性与有序性的一套规则总结，

抛开以下 happens-before 规则，JMM 并不能保证一个线程对共享变量的写，对于其它线程对该共享变量的读可见

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps126.png)

 

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps127.png)

 

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps128.png)

 

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps129.png) 线程结束前对变量的写，对其它线程得知它结束后的读可见（比如其它线程调用 t1.isAlive() 或 t1.join()等待它结束）

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps130.png)

 

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps131.png) 线程 t1 打断 t2（interrupt）前对变量的写，对于其他线程得知 t2 被打断后对变量的读可见（通过t2.interrupted 或 t2.isInterrupted）

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps132.png)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps133.png)

 

- 对变量默认值（0，false，null)的写，对其它线程对该变量的读可见

- 具有传递性，如果 x hb-> y 并且 y hb-> z 那么有 x hb-> z 变量都是指成员变量或静态成员变量参考： 第17页

 

 

 

## 4. CAS 与 原子类	[ ](af://n168/)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps135.png)

### 4.1 CAS	[ ](af://n169/)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps136.png)

获取共享变量时，为了保证该变量的可见性，需要使用 volatile 修饰。结合 CAS 和 volatile 可以实现无锁并发，适用于竞争不激烈、多核 CPU 的场景下。

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps137.png)因为没有使用 synchronized，所以线程不会陷入阻塞，这是效率提升的因素之一但如果竞争激烈，可以想到重试必然频繁发生，反而效率会受影响

CAS 底层依赖于一个 Unsafe 类来直接调用操作系统底层的 CAS 指令，下面是直接使用 Unsafe 对象进行线程安全保护的一个例子

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps138.png)

```
Thread t1 = new Thread(() -> {      	for (int i = 0; i < count; i++) {     		dc.increase();      }    });          t1.start();    t1.join();    							System.out.println(dc.getData());  } }class DataContainer {  		private volatile int data;  		static final Unsafe unsafe; 		static final long DATA_OFFSET;  		static {   			try {      // Unsafe 对象不能直接调用，只能通过反射获得      		Field theUnsafe = 		Unsafe.class.getDeclaredField("theUnsafe");      theUnsafe.setAccessible(true);      unsafe = (Unsafe) theUnsafe.get(null);    } catch (NoSuchFieldException | IllegalAccessException e) {      throw new Error(e);    }    try {      // data 属性在 DataContainer 对象中的偏移量，用于 Unsafe 直接访问该属性      DATA_OFFSET = unsafe.objectFieldOffset(DataContainer.class.getDeclaredField("data"));    } catch (NoSuchFieldException e) {      throw new Error(e);    }  }  
```

![image-20210620141319373](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20210620141319373.png)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps139.png)



### 4.2 乐观锁与悲观锁	[ ](af://n180/)

CAS 是基于乐观锁的思想： 乐观的估计，不怕别的线程来修改共享变量，就算改了也没关系，我吃亏点再重试呗。

synchronized 是基于悲观锁的思想： 悲观的估计，得防着其它线程来修改共享变量，我上了锁你们都别想改，我改完了解开锁，你们才有机会。



### 4.3 原子操作类	[ ](af://n201/)

juc（java.util.concurrent）中提供了原子操作类，可以提供线程安全的操作，

例如：AtomicInteger、AtomicBoolean等，

它们底层就是采用 CAS 技术 + volatile 来实现的。

可以使用 AtomicInteger 改写之前的例子：

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps141.png)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps142.png)

## 5. synchronized 优化	[ ](af://n220/)

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps143.png)

- Java HotSpot 虚拟机中，每个对象都有对象头（包括 class 指针和 Mark Word)。Mark Word 平时存储这个对象的 哈希码、分代年龄，当加锁时，这些信息就根据情况被替换为 标记位、线程锁记录指针、重量级锁指针、线程ID 等内容

### 5.1 轻量级锁	[ ](af://n233/)



*<!--如果一个对象虽然有多线程访问，但多线程访问的时间是错开的（也就是没有竞争），那么可以使用轻量级锁来优化-->*。

这就好比：

 ```
学生（线程 A）用课本占座，上了半节课，出门了（CPU时间到），回来一看，发现课本没变，说明没有竞争，继续上他的课。 如果这期间有其它学生（线程 B）来了，会告知（线程A）有并发访问，线程 A 随即升级为重量级锁(锁膨胀)，进入重量级锁的流程。而重量级锁就不是那么用课本占座那么简单了，可以想象线程 A 走之前，把座位用一个铁栅栏围起来假设有两个方法同步块，利用同一个对象加锁
 ```



![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps146.png)

每个线程的栈帧都会包含一个锁记录的结构，内部可以存储锁定对象的 Mark Word

| 线程 1                                      | 对象 Mark Word                | 线程 2                                      |
| ------------------------------------------- | ----------------------------- | ------------------------------------------- |
| 访问同步块 A，把 Mark 复制到线程 1 的锁记录 | 01（无锁）                    | -                                           |
| CAS 修改 Mark 为线程 1 锁记录地址           | 01（无锁）                    | -                                           |
| 成功（加锁）                                | 00（轻量锁）线程 1 锁记录地址 | -                                           |
| 执行同步块 A                                | 00（轻量锁）线程 1 锁记录地址 | -                                           |
| 访问同步块 B，把 Mark 复制到线程 1 的锁记录 | 00（轻量锁）线程 1 锁记录地址 | -                                           |
| CAS 修改 Mark 为线程 1 锁记录地址           | 00（轻量锁）线程 1 锁记录地址 | -                                           |
| 失败（发现是自己的锁）                      | 00（轻量锁）线程 1 锁记录地址 | -                                           |
| 锁重入                                      | 00（轻量锁）线程 1 锁记录地址 | -                                           |
| 执行同步块 B                                | 00（轻量锁）线程 1 锁记录地址 | -                                           |
| 同步块 B 执行完毕                           | 00（轻量锁）线程 1 锁记录地址 | -                                           |
| 同步块 A 执行完毕                           | 00（轻量锁）线程 1 锁记录地址 | -                                           |
| 成功（解锁）                                | 01（无锁）                    | -                                           |
| -                                           | 01（无锁）                    | 访问同步块 A，把 Mark 复制到线程 2 的锁记录 |
| -                                           | 01（无锁）                    | CAS 修改 Mark 为线程 2 锁记录地址           |
| -                                           | 00（轻量锁）线程 2 锁记录地址 | 成功（加锁）                                |
| -                                           | ...                           | ...                                         |

 

### 5.2 锁膨胀	[ ](af://n310/)

如果在尝试加轻量级锁的过程中，CAS 操作无法成功，这时一种情况就是有其它线程为此对象加上了轻量级锁（有竞争），这时需要进行锁膨胀，将轻量级锁变为重量级锁。

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps147.png)

| 线程 1                                   | 对象 Mark                     | 线程 2                            |
| ---------------------------------------- | ----------------------------- | --------------------------------- |
| 访问同步块，把 Mark 复制到线程1 的锁记录 | 01（无锁）                    | -                                 |
| CAS 修改 Mark 为线程 1 锁记录地址        | 01（无锁）                    | -                                 |
| 成功（加锁）                             | 00（轻量锁）线程 1 锁记录地址 | -                                 |
| 执行同步块                               | 00（轻量锁）线程 1 锁记录地址 | -                                 |
| 执行同步块                               | 00（轻量锁）线程 1 锁记录地址 | 访问同步块，把 Mark 复制到线程 2  |
| 执行同步块                               | 00（轻量锁）线程 1 锁记录地址 | CAS 修改 Mark 为线程 2 锁记录地址 |
| 执行同步块                               | 00（轻量锁）线程 1 锁记录地址 | 失败（发现别人已经占了锁）        |
| 执行同步块                               | 00（轻量锁）线程 1 锁记录地址 | CAS 修改 Mark 为重量锁            |
| 执行同步块                               | 10（重量锁）重量锁指针        | 阻塞中                            |
| 执行完毕                                 | 10（重量锁）重量锁指针        | 阻塞中                            |
| 失败（解锁）                             | 10（重量锁）重量锁指针        | 阻塞中                            |
| 释放重量锁，唤起阻塞线程竞争             | 01（无锁）                    | 阻塞中                            |
| -                                        | 10（重量锁）                  | 竞争重量锁                        |
| -                                        | 10（重量锁）                  | 成功（加锁）                      |
| -                                        | ...                           | ...                               |

### 5.3 重量锁	[ ](af://n378/)

重量级锁竞争的时候，还可以使用自旋来进行优化，如果当前线程自旋成功（即这时候持锁线程已经退出了同步块，释放了锁），这时当前线程就可以避免阻塞。

- 在 Java 6 之后自旋锁是自适应的，比如对象刚刚的一次自旋操作成功过，那么认为这次自旋成功的可能性会高，就多自旋几次；反之，就少自旋甚至不自旋，总之，比较智能。

- **自旋会占用 CPU 时间**，单核 CPU 自旋就是浪费，多核 CPU 自旋才能发挥优势。

  好比等红灯时汽车是不是熄火，不熄火相当于自旋（等待时间短了划算），熄火了相当于阻塞（等待时间长了划算）

- Java 7 之后不能控制是否开启自旋功能 

自旋重试成功的情况

| 线程 1 （cpu 1 上）      | 对象 Mark              | 线程 2 （cpu 2 上）      |
| ------------------------ | ---------------------- | ------------------------ |
| -                        | 10（重量锁）           | -                        |
| 访问同步块，获取 monitor | 10（重量锁）重量锁指针 | -                        |
| 成功（加锁）             | 10（重量锁）重量锁指针 | -                        |
| 执行同步块               | 10（重量锁）重量锁指针 | -                        |
| 执行同步块               | 10（重量锁）重量锁指针 | 访问同步块，获取 monitor |
| 执行同步块               | 10（重量锁）重量锁指针 | 自旋重试                 |
| 执行完毕                 | 10（重量锁）重量锁指针 | 自旋重试                 |
| 成功（解锁）             | 01（无锁）             | 自旋重试                 |
| -                        | 10（重量锁）重量锁指针 | 成功（加锁）             |
| -                        | 10（重量锁）重量锁指针 | 执行同步块               |
| -                        | ...                    | ...                      |

自旋重试失败的情况

| 线程 1（cpu 1 上）       | 对象 Mark              | 线程 2（cpu 2 上）       |
| ------------------------ | ---------------------- | ------------------------ |
| -                        | 10（重量锁）           | -                        |
| 访问同步块，获取 monitor | 10（重量锁）重量锁指针 | -                        |
| 成功（加锁）             | 10（重量锁）重量锁指针 | -                        |
| 执行同步块               | 10（重量锁）重量锁指针 | -                        |
| 执行同步块               | 10（重量锁）重量锁指针 | 访问同步块，获取 monitor |
| 执行同步块               | 10（重量锁）重量锁指针 | 自旋重试                 |
| 执行同步块               | 10（重量锁）重量锁指针 | 自旋重试                 |
| 执行同步块               | 10（重量锁）重量锁指针 | 自旋重试                 |
| 执行同步块               | 10（重量锁）重量锁指针 | 阻塞                     |
| -                        | ...                    | ...                      |

### 5.4 偏向锁	

轻量级锁在没有竞争时（就自己这个线程），每次重入仍然需要执行 CAS 操作。Java 6 中引入了偏向锁来做进一步优化：只有第一次使用 CAS 将线程 ID 设置到对象的 Mark Word 头，之后发现这个线程 ID 是自己的就表示没有竞争，不用重新 CAS.

- 撤销偏向需要将持锁线程升级为轻量级锁，这个过程中所有线程需要暂停（STW)
- 访问对象的 hashCode 也会撤销偏向锁

- 如果对象虽然被多个线程访问，但没有竞争，这时偏向了线程 T1 的对象仍有机会重新偏向 T2，重偏向会重置对象的 Thread ID

- 撤销偏向和重偏向都是批量进行的，以类为单位

- 如果撤销偏向到达某个阈值，整个类的所有对象都会变为不可偏向的
- 可以主动使用 -XX:-UseBiasedLocking 禁用偏向锁

[可以参考这篇论文：](https://www.oracle.com/technetwork/java/biasedlocking-oopsla2006-wp-149958.pdf)

假设有两个方法同步块，利用同一个对象加锁

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps150.png)

| 线程 1                                      | 对象 Mark                      |
| ------------------------------------------- | ------------------------------ |
| 访问同步块 A，检查 Mark 中是否有线程 ID     | 101（无锁可偏向）              |
| 尝试加偏向锁                                | 101（无锁可偏向）对象 hashCode |
| 成功                                        | 101（无锁可偏向）线程ID        |
| 执行同步块 A                                | 101（无锁可偏向）线程ID        |
| 访问同步块 B，检查 Mark 中是否有线程 ID     | 101（无锁可偏向）线程ID        |
| 是自己的线程 ID，锁是自己的，无需做更多操作 | 101（无锁可偏向）线程ID        |
| 执行同步块 B                                | 101（无锁可偏向）线程ID        |
| 执行完毕                                    | 101（无锁可偏向）对象 hashCode |

### 5.5 其它优化	

1. 减少上锁时间	

同步代码块中尽量短

2. 减少锁的粒度	

   将一个锁拆分为多个锁提高并发度，例如：

- ConcurrentHashMap

- LongAdder 分为 base 和 cells 两部分。没有并发争用的时候或者是 cells 数组正在初始化的时候，会使用 CAS 来累加值到 base，有并发争用，会初始化 cells 数组，数组有多少个 cell，就允许有多少线程并行修改， 后将数组中每个 cell 累加，再加上 base 就是 终的值

- LinkedBlockingQueue 入队和出队使用不同的锁，相对于LinkedBlockingArray只有一个锁效率要高

3. 锁粗化	[ ](af://n542/)

多次循环进入同步块不如同步块内多次循环 另外 JVM 可能会做如下优化，把多次 append 的加锁操作粗化为一次（因为都是对同一个对象加锁，没必要重入多次）

![img](file:///C:\Users\ASUS\AppData\Local\Temp\ksohtml57648\wps153.png)

4. 锁消除	

JVM 会进行代码的逃逸分析，例如某个加锁对象是方法内局部变量，不会被其它线程所访问到，这时候就会被即时编译器忽略掉所有同步操作。

5. 读写分离	

CopyOnWriteArrayList ConyOnWriteSet

参考：

[https://wiki.open](https://wiki.openjdk.java.net/display/HotSpot/Synchronization)[j](https://wiki.openjdk.java.net/display/HotSpot/Synchronization)[dk](https://wiki.openjdk.java.net/display/HotSpot/Synchronization)[.j](https://wiki.openjdk.java.net/display/HotSpot/Synchronization)[ava.net/displa](https://wiki.openjdk.java.net/display/HotSpot/Synchronization)[y](https://wiki.openjdk.java.net/display/HotSpot/Synchronization)[/HotSpot/S](https://wiki.openjdk.java.net/display/HotSpot/Synchronization)[y](https://wiki.openjdk.java.net/display/HotSpot/Synchronization)[nchronization ](https://wiki.openjdk.java.net/display/HotSpot/Synchronization)[http://luo](http://luojinping.com/2015/07/09/java锁优化/)[j](http://luojinping.com/2015/07/09/java锁优化/)[inpin](http://luojinping.com/2015/07/09/java锁优化/)[g](http://luojinping.com/2015/07/09/java锁优化/)[.com/2015/07/09/](http://luojinping.com/2015/07/09/java锁优化/)[j](http://luojinping.com/2015/07/09/java锁优化/)[ava](http://luojinping.com/2015/07/09/java锁优化/)[锁优化](http://luojinping.com/2015/07/09/java锁优化/)[/ ](http://luojinping.com/2015/07/09/java锁优化/)[https://www.infoq.cn/article/](https://www.infoq.cn/article/java-se-16-synchronized)[j](https://www.infoq.cn/article/java-se-16-synchronized)[ava-se-16-s](https://www.infoq.cn/article/java-se-16-synchronized)[y](https://www.infoq.cn/article/java-se-16-synchronized)[nchronized ](https://www.infoq.cn/article/java-se-16-synchronized)[https://www](https://www.jianshu.com/p/9932047a89be)[.j](https://www.jianshu.com/p/9932047a89be)[ianshu.com/p/9932047a89be ](https://www.jianshu.com/p/9932047a89be)[https://www.cnblo](https://www.cnblogs.com/sheeva/p/6366782.html)[g](https://www.cnblogs.com/sheeva/p/6366782.html)[s.com/sheeva/p/6366782.html](https://www.cnblogs.com/sheeva/p/6366782.html)

[https://stackoverflow.com/questions/46312817/does-](https://stackoverflow.com/questions/46312817/does-java-ever-rebias-an-individual-lock)[j](https://stackoverflow.com/questions/46312817/does-java-ever-rebias-an-individual-lock)[ava-ever-rebias-an-individual-lock](https://stackoverflow.com/questions/46312817/does-java-ever-rebias-an-individual-lock)

 

 

 

 

 

 

 

 

 

  

 

 

 

 

 

 

 

 

 

 

 

 

 
