---
title: JUC常见问题
date: 2021-11-25 11:04:56
tags:
- JUC
categories:
- Notes
keywords:
description:
top_img:	https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203151833189.jpg
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

以下是学习多线程遗留的一些问题和相关简要的解答，参考了许多博客和网站（文末）。

### 1.什么是JUC

是 java.util .concurrent 工具包的简称，用来处理线程，从jdk.5引入

![202111242325350](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111251109513.png)

### 2.线程和进程的区别

进程(Process) 是计算机中的程序关于某数据集合上的一次运行活动,是系
统进行资源分配和调度的基本单位,是操作系统结构的基础。  

- 计算机中的程序关于某数据集合上的一次运行活动
- 系统进行资源分配和调度的基本单位,是操作系统结构的基础。
- 进程是程序的实体（程序是指令、数据及其组织形式的描述,）
- 看作在系统中运行的一个应用程序

线程(thread) 是操作系统能够进行运算调度的最小单位。

- 包含在进程之中
- 系统分配处理器时间的最小单元

- 进程中的实际运作单位。一条线程指的是进程中一个单一顺序的控制流。
- 每条线程并行执行不同的任务。

两者之间的关系：

进程是线程的容器，一个进程可以并发多个线程，进程是线程的容器



### 3.sleep和wait的区别

- sleep 是 Thread 的静态方法, 是线程用来 控制自身流程的。sleep 不会释放锁,它也不需要占用锁（不涉及线程通信）。
- wait 是 Object 的方法,任何对象实例都能调用，wait 会释放锁,但调用它的前提是当前线程占有锁(即代码要在 synchronized 中)，主要用来不同线程之间的调度的。
- 它们都可以被 interrupted 方法中断。

注：两个方法都需要抛出异常

### 4.并发和并行的区别

首先了解串行模式和并行模式：

- 串行：所有任务都按照先后顺序执行（一次取得一个任务，并执行）
- 并行：和串行不同，并行一次取得多个任务。（依赖于多线程，以及硬件的多核Cpu）

并发：并发(concurrent)指的是多个程序可以同时运行的现象,更细化的是多进程可以同时运行或者多指令可以同时运行，描述的是多线程同时运行的现象



并发和并行的区别：

首先：“并发”指的是程序的结构，“并行”指的是程序运行时的状态

### 为什么要使用多线程?以及可能带来的问题？

**线程花销更小，切换更快：**

创建进程的时候系统都要分配大量资源（建立数据表，分派地址空间等），线程之间共享大部分资源，使用相同地址空间，开销很小。

**线程之间通信更方便**：线程通信十分方便 (通过在线程之间共享对象)，线程的数据可以直接为其它线程所共享（同时也会带来隐患）

**提高应用程序响应**：这对图形界面的程序尤其有意义，当一个操作耗时很长时，整个系统都会等待这个操作，避免了程序进行长时间等待。

**使多CPU系统更加有效**：操作系统会保证当线程数不大于CPU数目时，不同的线程运行于不同的CPU上。



——>多线程同时也有缺点

​			可能带来：内存泄漏、死锁、线程安全等问题

<!--内存泄漏（Memory Leak）是指程序中已动态分配的堆内存由于某种原因程序未释放或无法释放，造成系统内存的浪费，导致程序运行速度减慢甚至系统崩溃等严重后果-->

### 线程的生命周期和状态?

![232002051747387](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111251108669.jpg)

线程整个生命周期，要经过以下几种状态：

- NEW,(新建)；
- RUNNABLE,(准备就绪)；
- BLOCKED,(阻塞)；
- WAITING,(不见不散)

- TIMED_WAITING,(过时不候)；
- TERMINATED;(终结)；

一个不可能一直"霸占"着CPU独自 运行，CPU会在多条线程之间切换，因此线程状态也会多次在运行、阻塞之间切换 。

### 用户线程和守护线程

首先需要了解：线程的执行首先要持有管程对象,然后才能执行方法,当方法完成之后会释放管程,方
法在执行时候会持有管程,其他线程无法再获取同一个管程；JVM 中同步是基于进入和退出管程(monitor)对象实现的,每个对象都会有一个管程(monitor)对象,管程(monitor)会随着 java 对象一同创建和销毁



用户线程:平时用到的普通线程,自定义线程

守护线程:**运行在后台**,是一种特殊的线程,比如垃圾回收GC

说明：只有当最后一个非守护线程结束时，守护线程随着JVM一同结束工作。

主线程结束后,用户线程还在运行,JVM 存活
如果没有用户线程,都是守护线程,JVM 结束

### 创建多线程的多种方法

创建线程主要有四种方法：

创建Thread类

实现Runnable接口

实现Callable接口

使用线程池

### 多线程的实现步骤

![202111250024218](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111251107446.png)

### Lock和Synchonized的区别





1️⃣  **lock 是一个接口，而 synchronized 是 Java 的一个关键字，synchronized 是内置的语言实现。**

2️⃣  **异常是否释放锁：synchronized 在发生异常时候会自动释放占有的锁，因此不会出现死锁；而 lock 发生异常时候，不会主动释放占有的锁，必须手动 unlock 来释放锁，可能引起死锁的发生。(所以最好将同步代码块用 [try catch](https://www.jianshu.com/p/384d2ec90c41) 包起来，finally 中写入 unlock，避免死锁的发生。)**

3️⃣   **是否响应中断**

**lock 等待锁过程中可以用 interrupt 来中断等待，而 synchronized 只能等待锁的释放，不能响应中断。**

**4️⃣   是否知道获取锁：Lock 可以通过 trylock 来知道有没有获取锁，而 synchronized 不能。**

**5️⃣   Lock 可以提高多个线程进行读操作的效率。(可以通过 [ReadWriteLock ](https://www.jianshu.com/p/377ac92ac10c)实现读写分离)**

6️⃣   在性能上来说，如果竞争资源不激烈，两者的性能是差不多的，而当竞争资源非常激烈时(即有大量线程同时竞争)，此时 Lock 的性能要远远优于 synchronized。所以说，在具体使用时要根据适当情况选择。

7️⃣   synchronized 使用 [Object](https://www.jianshu.com/p/aeb8430fe799) 对象本身的 wait 、notify、notifyAll 调度机制，而 Lock 可以使用 Condition 进行线程之间的调度。



注：

**new Thread创建的线程是否立即创建？**

不一定，底层调用了native  即：交给操作系统实现。具体由操作系统决定何时创建



 

### 集合的线程安全？解决方法？

多个线程同时对集合进行修改，会发并发修改异常

异常内容java.util.ConcurrentModificationException

那么如何解决？

Vector： 矢量队列,  JDK1.0 版本添加的类。继承于 AbstractList,实现
了 List, RandomAccess, Cloneable 这些接口。  它是一个队列,支持相关的添加、删除、修改、遍历等功
能。  
  ——>  ArrayList 不同,Vector 中的操作是线程安全的。

Vector 因此可以被用来解决arrylist线程不安全的情况

```
public class NotSafeDemo {
/**

多个线程同时对集合进行修改

@param args
*/
public static void main(String[] args) {
List list = new Vector();
for (int i = 0; i < 100; i++) {
new Thread(() ->{
list.add(UUID.randomUUID().toString());
}
}
}
System.out.println(list);
}, "线程" + i).start();
此时不会出现并发异常
```

 

Java 中常见的集合类型都是不安全的, 比如说ArrayList, LinkedList, HashSet, TreeSet, HashMap, TreeMap 

Java5 之后, 在java.util.concurrent新增了大量的支持高并发的集合接口和实现类

线程安全的集合类： 

-  ConcurrentHashMap, ConcurrentLinkedQueue, ConcurrentSkipListSet 
-  CopyOnWriteArrayList, CopyOnWriteArraySet

解决线程安全问题，使用相关的类替代线程不安全的集合类即可 

 

 

### 锁的几种情况，常见的锁？

![image-20211125003853921](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202111251108698.png)

**公平锁与非公平锁**：线程获取锁资源是否是公平的

**乐观锁和悲观锁**：

- 乐观锁： 对于并发间操作产生的线程安全问题持乐观状态，乐观锁**认为竞争不总是会发生**，因此它不需要持有锁，将比较-设置这两个动作作为一个原子操作尝试去修改内存中的变量，如果失败则表示发生冲突，那么就应该有相应的重试逻辑。
- 悲观锁： 对于并发间操作产生的线程安全问题持悲观状态，悲观锁**认为竞争总是会发生**，因此每次对某资源进行操作时，都会持有一个独占的锁，和synchronized类似。

![image-20211125002555353]()

**死锁**

**可重入锁**：ReentrantLockk 是唯一实现了 Lock 接口的类，提供了很多方法



**读锁和写锁**

- 读锁，进行‘‘读操作’’时添加的锁。共享锁，会发生死锁。
- 写锁，进行‘‘写操作’’时添加的锁。独占锁，会发生死锁。

注： 如果有一个线程已经占用了读锁,则此时其他线程如果要申请写锁,则申请写
		锁的线程会一直等待释放读锁。
		如果有一个线程已经占用了写锁,则此时其他线程如果申请写锁或者读锁,则
		申请的线程会一直等待释放写锁。

明确一点，不是说ReentrantLock不好，只是ReentrantLock某些时候有局限。如果使用ReentrantLock，可能本身是为了防止线程A在写数据、线程B在读数据造成的数据不一致，但这样，如果线程C在读数据、线程D也在读数据，读数据是不会改变数据的，没有必要加锁，但是还是加锁了，降低了程序的性能。
因此，诞生了读写锁ReadWriteLock。ReadWriteLock是一个读写锁接口，ReentrantReadWriteLock是ReadWriteLock接口的一个具体实现，实现了读写的分离，读锁是共享的，写锁是独占的，读和读之间不会互斥，读和写、写和读、写和写之间才会互斥，提升了读写的性能。

### Runnable接口和Callable接口的区别

返回值不同：使用Runnable时，缺少了一种功能，当线程结束时，无法使线程返回结果，callable支持返回结果





 ### ThreadLocal？内存泄露问题？



为什么要用线程池？`ThreadPoolExecutor` 类的重要参数了解吗？`ThreadPoolExecutor` 饱和策略了解吗？线程池原理了解吗？几种常见的线程池了解吗？为什么不推荐使用`FixedThreadPool`？如何设置线程池的大小？















1. `synchronized` 关键字、volatile 关键字

一个非常重要的问题，是每个学习、应用多线程的Java程序员都必须掌握的。理解volatile关键字的作用的前提是要理解Java内存模型，这里就不讲Java内存模型了，可以参见第31点，volatile关键字的作用主要有两个：
（1）多线程主要围绕可见性和原子性两个特性而展开，使用volatile关键字修饰的变量，保证了其在多线程之间的可见性，即每次读取到volatile变量，一定是最新的数据
（2）代码底层执行不像我们看到的高级语言—-Java程序这么简单，它的执行是Java代码–>字节码–>根据字节码执行对应的C/C++代码–>C/C++代码被编译成汇编语言–>和硬件电路交互，现实中，为了获取更好的性能JVM可能会对指令进行重排序，多线程下可能会出现一些意想不到的问题。使用volatile则会对禁止语义重排序，当然这也一定程度上降低了代码执行效率
从实践角度而言，volatile的一个重要作用就是和CAS结合，保证了原子性，详细的可以参见java.util.concurrent.atomic包下的类，比如AtomicInteger。







1. AQS 了解么？原理？AQS 常用组件：`Semaphore` (信号量)、`CountDownLatch` （倒计时器） `CyclicBarrier`(循环栅栏)

2. `ReentrantLock` 、 `ReentrantReadWriteLock` 、`StampedLock`（JDK8）

3. CAS 了解么？原理？

4. Atomic 原子类

5. 并发容器：`ConcurrentHashMap` 、 `CopyOnWriteArrayList` 、 `ConcurrentLinkedQueue` `BlockingQueue` 、`ConcurrentSkipListMap`

6. `Future` 和 `CompletableFuture`

   12.1 CompletableFuture 简介
   CompletableFuture 在 Java 里面被用于异步编程,异步通常意味着非阻塞,
   可以使得我们的任务单独运行在与主线程分离的其他线程中,并且通过回调可
   以在主线程中得到异步任务的执行状态,是否完成,和是否异常等信息。
   CompletableFuture 实现了 Future, CompletionStage 接口,实现了 Future
   接口就可以兼容现在有线程池框架,而 CompletionStage 接口才是异步编程
   的接口抽象,里面定义多种异步方法,通过这两者集合,从而打造出了强大的
   CompletableFuture 类。
   12.2 Future 与 CompletableFuture
   Futrue 在 Java 里面,通常用来表示一个异步任务的引用,比如我们将任务提
   交到线程池里面,然后我们会得到一个 Futrue,在 Future 里面有 isDone 方
   法来 判断任务是否处理结束,还有 get 方法可以一直阻塞直到任务结束然后获
   取结果,但整体来说这种方式,还是同步的,因为需要客户端不断阻塞等待或
   者不断轮询才能知道任务是否完成。
   Future 的主要缺点如下:
   (1)不支持手动完成
   我提交了一个任务,但是执行太慢了,我通过其他路径已经获取到了任务结果,
   现在没法把这个任务结果通知到正在执行的线程,所以必须主动取消或者一直
   等待它执行完成
   (2)不支持进一步的非阻塞调用
   通过 Future 的 get 方法会一直阻塞到任务完成,但是想在获取任务之后执行
   额外的任务,因为 Future 不支持回调函数,所以无法实现这个功能
   (3)不支持链式调用
   对于 Future 的执行结果,我们想继续传到下一个 Future 处理使用,从而形成
   一个链式的 pipline 调用,这在 Future 中是没法实现的。
   (4)不支持多个 Future 合并
   比如我们有 10 个 Future 并行执行,我们想在所有的 Future 运行完毕之后,
   执行某些函数,是没法通过 Future 实现的。
   (5)不支持异常处理
   Future 的 API 没有任何的异常处理的 api,所以在异步运行时,如果出了问题
   是不好定位的。



参考:

**还在疑惑并发和并行？**[https://laike9m.com/blog/huan-zai-yi-huo-bing-fa-he-bing-xing,61/?hmsr=toutiao.io&utm_campaign=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io](https://laike9m.com/blog/huan-zai-yi-huo-bing-fa-he-bing-xing,61/?hmsr=toutiao.io&utm_campaign=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)

[Synchronized 和 lock 区别](https://xie.infoq.cn/article/4e370ded27e4419d2a94a44b3)

[Java多线程问题总结](https://mp.weixin.qq.com/s/4mlj5HvVE8Q3Z3G0xlADyQ?)
