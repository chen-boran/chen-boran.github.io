---
title: JVM-垃圾回收
date: 2022-03-26 11:30:01
tags:
---

## **垃圾回收**

java 中堆和方法区这两个区域有很明显的不确定性。内存的回收不随着线程的生命周期而进行。

程序编译期不能确定内存的分配和垃圾的回收。因为他们是动态的，在运行期间才会知道创建哪些创建多少对象。垃圾回收器关注的正是这部分内存。



关于垃圾回收，主要分以下几点进行介绍：

\1. 如何判断对象可以回收

\2. 垃圾回收算法

\3. 分代垃圾回收

\4. 垃圾回收器

\5. 垃圾回收调优

主要思考一下三个问题：

哪些内存需要回收？

什么时候回收

怎么回收？



### 一、如何判断对象是否可以回收

#### 1.1引用计数法

引用计数法是给每个对象添加一个引用计数器，每当有一个计数器引用它，就把标记加一。

这种方法很简单易行，但是也有局限性。

引用计数法对于对象之间的循环引用问题，无法进行及时的回收，容易造成内存泄漏。



循环引用：即两个对象相互引用，各自的标记都。如下图所示：

![image-20220326113529107](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220326113529107.png)

#### 1.2 可达性分析算法

java虚拟机使用的垃圾回收策略来探索是否有存货的对象。

根对象：一定不会被回收的对象



- 扫描堆中的对象，看是否能沿着GC Root对象为七起点的引用链来找到该对象（说明被root对象引用），找不到的话，就可以进行回收。

- 哪些对象可以作为root对象呢？
  - 虚拟机运行中需要的系统核心类
  - 操作系统运行引用的Java对象
  - Busy Monitor ：正在加锁的对象
  - 活动进程中的对象

#### 1.3 四种引用

无论是通过引用计数法判断对象引用的数量，还是可达性分析判断对象是否链可达，判定对象是否存活都和引用离不开关系。

jdk1.2之后对引用进行了细化。引用强度主键弱化。

1.强引用

​	平常所用的引用，例如对象的创建，强引用只要沿着GC root找到就不会被垃圾回收，只有没有GC root直接或者间接引用才会被垃圾回收。

2.软引用

​	用来描述一些还有用的，但是非必须的对象。

​	仅有软引用引用该对象时，在垃圾回收后，会把对象列进内存回收的范畴之内，内存仍不足时会再次出发垃圾回收，进行回收软引用对象。

​	可以配合引用队列来释放软引用自身。

​	 

3.弱引用

​	被弱引用关联的对象只能生存到下一次垃圾收集发生之前

​	仅有弱引用引用该对象时，在垃圾回收时，无论内存是否充足，都会回收弱引用对象

​	可以配合引用队列来释放弱引用自身

4.虚引用

​	它是最弱的一种引用关系。一个对象是否有虚引用的存在，完全不会对其生存时间构成影响，也无法通过虚引用来取得一个对象实例。

​	**必须配合引用队列使用**，主要配合 ByteBuffffer 使用，被引用对象回收时，会将虚引用加入，

由 引用队列中的 Reference Handler 线程调用虚引用相关方法（UNsafe.freeMemory）释放直接内存。



注：对象死亡，至少要经历两次标记过程：如果对象在进行可达性分析后发现没有与GC Roots相连接的引用链，那它将会被第一次标记并且进行一次筛选，筛选的条件是此对象是否有必要执行finalize()方法。

​	如果这个对象被判定为有必要执行finalize()方法，那么这个对象将会放置在一个叫做F-Queue的队列之中，稍后由Finalizer线程去执行它

5.终结器引用

​	无需手动编码，但其内部**配合引用队列使用**，在垃圾回收时，终结器引用入队（被引用对象

暂时没有被回收），再由 Finalizer 线程(线程优先级很低)通过终结器引用找到被引用对象并调用它的 fifinalize方法，第二次 GC 时才能回收被引用对象。



特别注意，在程序设计中⼀般很少使⽤弱引⽤与虚引⽤，使⽤软引⽤的情况᫾多，这是因为**软引⽤可以** **加速**JVM 对垃圾内存的回收速度，可以维护系统的运⾏安全，防⽌内存溢出（ OutOfMemory ）等问题的产生

![image-20220326114854831](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220326114854831.png)

下面是来看个：



软引用对象的创建：

```
public static void soft() {
    // list --> SoftReference --> byte[]

    List<SoftReference<byte[]>> list = new ArrayList<>();
    for (int i = 0; i < 5; i++) {
        SoftReference<byte[]> ref = new SoftReference<>(new byte[_4MB]);
        System.out.println(ref.get());
        list.add(ref);
        System.out.println(list.size());

    }
    System.out.println("循环结束：" + list.size());
    for (SoftReference<byte[]> ref : list) {
        System.out.println(ref.get());
    }
}
//内存中不重要的对象可以使用软引用
```

运行结果可以看到，前四个软引用内存不足时都被垃圾回收了

（设置VM参数：-Xmx20m -XX:+PrintGCDetails -verbose:gc）

![image-20220326120220651](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220326120220651.png)

之前我们知道，软引用被回收之后，软引用本身也占用内存，需要使用引用队列进行回收。

正如上例，前四个软引用对象都是null了。可以把它们从List中去除。

下面使用引用队列演示：

```
/**
 * 演示软引用, 配合引用队列
 */
public class Demo2_4 {
    private static final int _4MB = 4 * 1024 * 1024;

    public static void main(String[] args) {
        List<SoftReference<byte[]>> list = new ArrayList<>();

        // 引用队列
        ReferenceQueue<byte[]> queue = new ReferenceQueue<>();

        for (int i = 0; i < 5; i++) {
            // 关联了引用队列， 当软引用所关联的 byte[]被回收时，软引用自己会加入到 queue 中去
            SoftReference<byte[]> ref = new SoftReference<>(new byte[_4MB], queue);
            System.out.println(ref.get());
            list.add(ref);
            System.out.println(list.size());
        }

        // 从队列中获取无用的 软引用对象，并移除
        Reference<? extends byte[]> poll = queue.poll();
        while( poll != null) {
            list.remove(poll);
            poll = queue.poll();
        }

        System.out.println("===========================");
        for (SoftReference<byte[]> reference : list) {
            System.out.println(reference.get());
        }

    }
}
```



弱引用对象创建和垃圾回收

```
/**
 * 演示弱引用
 * -Xmx20m -XX:+PrintGCDetails -verbose:gc
 */
public class Demo2_5 {
    private static final int _4MB = 4 * 1024 * 1024;

    public static void main(String[] args) {
        //  list --> WeakReference --> byte[]
        List<WeakReference<byte[]>> list = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            WeakReference<byte[]> ref = new WeakReference<>(new byte[_4MB]);
            list.add(ref);
            for (WeakReference<byte[]> w : list) {
                System.out.print(w.get()+" ");
            }
            System.out.println();

        }
        System.out.println("循环结束：" + list.size());
    }
}
```

运行结果：

![image-20220326121701031](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220326121701031.png)

### 二、垃圾回收算法

之前讨论了什么对象应该被回收。

那么垃圾对象需要怎么回收呢？

#### 2.1 垃圾收集理论

根据对象存活周期的不

同将内存分为⼏块。⼀般将java堆分为新⽣代和⽼年代，这样我们就可以根据各个年代的特点选择合适

的垃圾收集算法。

**⽐如在新⽣代中，每次收集都会有⼤量对象死去，所以可以选择复制算法，只需要付出少量对象的复制**

**成本就可以完成每次垃圾收集。⽽⽼年代的对象存活⼏率是⽐较⾼的，⽽且没有额外的空间对它进⾏分**

 **配担保，所以我们必须选择标记清除和标记整理算法**  

分代收集理论：大多数虚拟机都遵循了这个理论。它建立在两个假说之上：

- 弱分代假说：绝大多数对象都是招生夕灭。
- 强分代假说：熬过越多次垃圾收集过程的对象就越难以消亡。

因此垃圾收集器的一致性设计原则：收集器应该将java堆分成不同的区域，将回收对象依据年龄分配到不同的区域进行存储。

垃圾收集器因此可以回收其中某一个或者某些部分区域。因此有了Minor GC、MajorGC、Full GC 这样的回收类型划分。

设计者通常把内存区域分成新生代和老年代两个区域。

因此针对不同区域安排与存储对象存亡特性相匹配的垃圾回收算法

主要的垃圾回收算法有：标记清除法、标记整理法、标记复制法

这里区分一些常见概念：

- 部分收集（Partial GC）：指目标不是完整收集整个Java堆的垃圾收集，其中又分为：

- 新生代收集（Minor GC/Young GC）：指目标只是新生代的垃圾收集。

- 老年代收集（Major GC/Old GC）：指目标只是老年代的垃圾收集。目前只有CMS收集器会有单独收集老年代的行为。另外请注意“Major GC”这个说法现在有点混淆，在不同资料上常有不同所指，读者需按上下文区分到底是指老年代的收集还是整堆收集。

- 混合收集（Mixed GC）：指目标是收集整个新生代以及部分老年代的垃圾收集。目前只有G1收集器会有这种行为。

- 整堆收集（Full GC）：收集整个Java堆和方法区的垃圾收集。

#### 2.1标记清除

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220326122731856.png" alt="image-20220326122731856" style="zoom:50%;" />



优点：速度快，只需要进行标记，不用做出其他的操作。

缺点：会造成空间不连续，如过没有，回收之后的空间整理，会造成内存碎片。

​			执行效率不稳定，标记和清除两个过程的执行效率都随对象数量增长而降低。

#### **2.2** **标记整理**

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220326122715110.png" alt="image-20220326122715110" style="zoom: 50%;" />



和标记清除的区别是：

优点：不会有内存碎片

缺点：整理的过程伴随着对象的移动。对象在内存中的地址变化了。会有额外的开销。

 

#### 2.3 复制算法

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220326122832151.png" alt="image-20220326122832151" style="zoom:50%;" />

优点：不会有内存碎片

缺点：空间利用率不高。

现在的商用Java虚拟机大多都优先采用了这种收集算法去回收新生代

### 三、分代垃圾回收

实际的jvm虚拟机不使用一种垃圾回收算法，整合三种算法。

把堆内存分成两个区域：新生代、老年代

新生代：存放引用时间短的，生命周期短的对象。

老年代：引用时间长，垃圾回收频率不频繁。

![image-20220326123605077](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220326123605077.png)

#### 新生代

分成伊甸园 、幸存区From、幸存区to

新创建的对象首先放到伊甸园中

第一次垃圾回收：出发 Minor GC

没被回收的对象放到幸存区To中，之后两个幸存区交换地址。

如图所示：

![image-20220326123616814](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220326123616814.png)

- 对象首先分配在伊甸园区域

- 新生代空间不足时，触发 minor gc，伊甸园和 from 存活的对象使用 copy 复制到 to 中，存活的

对象年龄加 1并且交换 from to。

- 下一次的 minor gc 会回收伊甸园和幸存区from中的对象。对象年龄继续加一，并且交换 from to。
- minor gc 会引发 stop the world，暂停其它用户的线程，等垃圾回收结束，用户线程才恢复运行。（垃圾回收涉及对象空间的复制，地址会发生改变。为了防止混乱，需要阻塞其他进程）

- 如果经历了多次的垃圾回收，当对象寿命超过阈值时，会晋升至**老年代**，最大寿命是15（4bit）。



- 当老年代空间不足，会先尝试触发 minor gc，如果之后空间仍不足，那么触发 full gc，STW的时

间更长



#### 3.1 相关VM参数

![image-20220326140529222](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220326140529222.png)



### 四、经典垃圾回收器

垃圾回收器是内存回收的实践者。

常见的有：

![image-20220326201351214](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220326201351214.png)

#### 4.1 串行 Serial收集器

- 单线程

- 适用于堆内存较小，适合个人电脑

它进行垃圾收集时，必须暂停其他所有工作线程，直到它收集结束。

它只会使用一个处理器或一条收集线程去完成垃圾收集工作

![image-20220326201613444](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220326201613444.png)

优点：简单而高效（与其他收集器的单线程相比），对于内存资源受限的环境，它是所有收集器里额外内存消耗（Memory Footprint）最小的

#### 4.2 ParNew收集器

ParNew收集器实质上是Serial收集器的多线程并行版本，除了同时使用多条线程进行垃圾收集之外，其余的行为包括Serial收集器可用的所有控制参数（例如：-XX：SurvivorRatio、-XX：PretenureSizeThreshold、-XX：HandlePromotionFailure等）、收集算法、Stop TheWorld、对象分配规则、回收策略等都与Serial收集器完全一致

![image-20220326202310963](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220326202310963.png)

除了Serial收集器外，目前只有它能与CMS收集器配合工作。

因此为了配合CMS 使用，Parnew依旧很常用。

#### 4.3 Parallel Scavenge收集器

Parallel Scavenge收集器也是一款新生代收集器，它同样是基于标记-复制算法实现的收集器

Parallel Scavenge的诸多特性从表面上看和ParNew非常相似

 Parallel Scavenge收集器的目标则是达到一个可控制的吞吐量（Throughput）

也就是吞吐量优先的收集器。

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220326202604589.png" alt="image-20220326202604589" style="zoom: 50%;" />

#### 4.4 CMS收集器

CMS（Concurrent Mark Sweep）收集器是一种以获取最短回收停顿时间为目标的收集器。

现在很多应用通常都会较为关注服务的响应速度，希望系统停顿时间尽可能短，以给用户带来良好的交互体验。CMS收集器就非常符合这类应用的需求。

整个回收过程包括：

1）初始标记（CMS initial mark）

2）并发标记（CMS concurrent mark）

3）重新标记（CMS remark）

4）并发清除（CMS concurrent sweep）

其中初始标记、重新标记这两个步骤仍然需要“Stop TheWorld

初始标记仅仅只是标记一下GC Roots能直接关联到的对象，速度很快；并

发标记阶段就是从GC Roots的直接关联对象开始遍历整个对象图的过程，这个过程耗时较长但是不需要停顿用户线程，可以与垃圾收集线程一起并发运行；

重新标记阶段则是为了修正并发标记期间，因用户程序继续运作而导致标记产生变动的那一部分对象的标记记录，

并发清除阶段，清理删除掉标记阶段判断的已经死亡的对象，由于不需要移动存活对象，所以这个阶段也是可以与用户线程同时并发的。

CMS收集器的运作步骤中并发和需要停顿的阶段：

![image-20220326211101219](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220326211101219.png)

优点：并发收集、低停顿

 缺点：CMS是一款基于“标记-清除”算法实现的收集器，收集结束时会有大量空间碎片产生。

​			CMS收集器对处理器资源非常敏感。会因为占用了一部分线程（或者说处理器的计算能力）而导致应用程序变慢，降低总吞吐量

#### 4.5 G1回收器

定义：Garbage First

2004 论文发布

2009 JDK 6u14 体验

2012 JDK 7u4 官方支持

2017 JDK 9 默认

适用场景

- 同时注重吞吐量（Throughput）和低延迟（Low latency），默认的暂停目标是 200 ms

- 超大堆内存，会将堆划分为多个大小相等的 Region

- 整体上是 标记+整理 算法，两个区域（region）之间是 复制 算法

- G1是一款主要面向服务端应用的垃圾收集器

- JDK 9发布之日，G1宣告取代Parallel Scavenge加Parallel Old组合，成为服务端模式下的默认垃圾收集器

- G1收集器的运作⼤致分为以下⼏个步骤：

  初始标记（Initial Marking）：仅仅只是标记一下GC Roots能直接关联到的对象，并且修改TAMS指针的值，让下一阶段用户线程并发运行时，能正确地在可用的Region中分配新对象。这个阶段需要停顿线程，但耗时很短，而且是借用进行Minor GC的时候同步完成的，所以G1收集器在这个阶段实际并没有额外的停顿。

  ·并发标记（Concurrent Marking）：从GC Root开始对堆中对象进行可达性分析，递归扫描整个堆里的对象图，找出要回收的对象，这阶段耗时较长，但可与用户程序并发执行。当对象图扫描完成以后，还要重新处理SATB记录下的在并发时有引用变动的对象。

  ·最终标记（Final Marking）：对用户线程做另一个短暂的暂停，用于处理并发阶段结束后仍遗留下来的最后那少量的SATB记录。

  ·筛选回收（Live Data Counting and Evacuation）：负责更新Region的统计数据，对各个Region的回收价值和成本进行排序，根据用户所期望的停顿时间来制定回收计划，可以自由选择任意多个Region构成回收集，然后把决定回收的那一部分Region的存活对象复制到空的Region中，再清理掉整个旧Region的全部空间。这里的操作涉及存活对象的移动，是必须暂停用户线程，由多条收集器线程并行完成的。

 **G1**收集器在后台维护了⼀个优先列表，每次根据允许的收集时间，优先选择回收价值最⼤的* region这也就是它的名字 Garbage-First 的由来 。这种使⽤Region划分内存空间以及有优先级的区域回收⽅式，

保证了GF收集器在有限时间内可以尽可能⾼的收集效率（把内存化整为零）。

1、G1  **垃圾回收阶段**

这里介绍三个阶段：

- 对新生代的垃圾回收期
- 新生代的垃圾收集同时执行并发标记
- 混合收集
- 如下图所示：

![image-20220326184024543](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220326184024543.png)





**1) Young Collection**

会 STW

2）Young Collection + CM

在 Young GC 时会进行 GC Root 的初始标记

老年代占用**堆空间**比例达到阈值时，进行并发标记（不会 STW），由下面的 JVM 参数决定

 XX:InitiatingHeapOccupancyPercent=percent （默认45%）

**3)  Mixed Collection**

会对 E、S、O 进行全面垃圾回收

最终标记（Remark）会 STW

拷贝存活（Evacuation）会 STW

-XX:MaxGCPauseMillis=ms

**4）Full GC**

SerialGC

新生代内存不足发生的垃圾收集 - minor gc

老年代内存不足发生的垃圾收集 - full gc

ParallelGC

新生代内存不足发生的垃圾收集 - minor gc

老年代内存不足发生的垃圾收集 - full gc

CMS

新生代内存不足发生的垃圾收集 - minor gc

老年代内存不足

G1

新生代内存不足发生的垃圾收集 - minor gc

老年代内存不足

 

**5) Young Collection** **跨代引用**

新生代回收的跨代引用（老年代引用新生代）问题

卡表与 Remembered Set

在引用变更时通过 post-write barrier + dirty card queue 

concurrent refinement threads 更新 Remembered Set

北京市昌平区建材城西路金燕龙办公楼一层 电话：400-618-9090

**6) Remark**

pre-write barrier + satb_mark_queue

北京市昌平区建材城西路金燕龙办公楼一层 电话：400-618-9090

**7) JDK 8u20** **字符串去重**

优点：节省大量内存

缺点：略微多占用了 cpu 时间，新生代回收时间略微增加

-XX:+UseStringDeduplication

将所有新分配的字符串放入一个队列

当新生代回收时，G1并发检查是否有字符串重复

如果它们值一样，让它们引用同一个 char[]

注意，与 String.intern() 不一样

String.intern() 关注的是字符串对象

而字符串去重关注的是 char[]

在 JVM 内部，使用了不同的字符串表

**8) JDK 8u40** **并发标记类卸载**

所有对象都经过并发标记后，就能知道哪些类不再被使用，当一个类加载器的所有类都不再使用，则卸

载它所加载的所有类 -XX:+ClassUnloadingWithConcurrentMark 默认启用

String s1 = new String("hello"); // char[]{'h','e','l','l','o'} 

String s2 = new String("hello"); // char[]{'h','e','l','l','o'}

北京市昌平区建材城西路金燕龙办公楼一层 电话：400-618-9090

**9) JDK 8u60** **回收巨型对象**

一个对象大于 region 的一半时，称之为巨型对象

G1 不会对巨型对象进行拷贝

回收时被优先考虑

G1 会跟踪老年代所有 incoming 引用，这样老年代 incoming 引用为0 的巨型对象就可以在新生

代垃圾回收时处理掉

**10) JDK 9** **并发标记起始时间的调整**

并发标记必须在堆空间占满前完成，否则退化为 FullGC

JDK 9 之前需要使用 -XX:InitiatingHeapOccupancyPercent

JDK 9 可以动态调整

-XX:InitiatingHeapOccupancyPercent 用来设置初始值

进行数据采样并动态调整

总会添加一个安全的空档空间

 

 

 





 
