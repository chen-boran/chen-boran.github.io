---
title: JVM-内存结构
date: 2022-03-25 12:03:30
tags:
- JVM
categories:
- Notes
keywords:
description:
top_img:
comments:
cover:https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/4f1a22d238714f1a810cc556128f5134.png
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

## 内存结构

java的内存结构可以分成

![image-20220325164905689](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220325164905689.png)

\1. 程序计数器

\2. 虚拟机栈

\3. 本地方法栈

\4. 堆

\5. 方法区

**jvm启动流程**

![image-20220331184657876](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220331184657876.png)

下面逐一进行介绍：

### 一、程序计数器

功能：程序分配时间片执行，一个程序由于时间片用完或其他原因导致执行下一条程序，用程序计数器记住下一条jvm指令执行地址

发送给解释器执行，生成机器码文件，由CPU进行执行。

- 物理上通过寄存器实现。（加快读写速度）

特点：

- 线程私有的，为了线程切换之后能够回到正确的执行位置，每一个线程都应该有一个独立的程序计数器。
- 没有程序溢出

### 二、虚拟机栈

栈的操作有入栈出栈，后进先出，先进后出的逻辑结构。

栈

- Java会为每个线程分配的内存空间，每一个线程对应一个虚拟机栈。虚拟机栈的生命周期和线程是相同的。

栈帧

- 每个方法执行的时候，虚拟机都会同步创建一个栈帧。栈帧就是每个方法运行时需要的内存。
- 栈帧包含局部变量表、动态链接、返回地址（方法出口）等信息。
- 一个方法执行，定义一个栈帧，并且压入栈内。

注：

​	局部变量表存放了各种java基本数据类型、对象指针、ReturnAdress类型。局部变量表所需内存在编译时分配，执行方法之前

其分配的局部变量空间就已经确定。

​	每个线程运行时只能有一个活动栈帧（对应正在执行的那个方法）



常见问题：

- 垃圾回收只设计堆的内存，不涉及虚拟机栈的内存回收，栈会自动得回收掉。

- 栈内存不是越大越好，栈越大通常只能增加方法调用数量，同时会影响线程数量（物理内存是一定的）

- 方法内的局部变量，如果是多个线程共享的，那么就可能是线程不安全的，如果是被某个线程私有就是线程安全的，不受其他线程影响。

  方法内的局部变量如果逃离了方法的作用范围，就会是线程不安全的。

**栈上分配**
普通情况下，对象创建之后会分配在堆上，有时候虚拟机为了减轻堆的GC 压力，会有一些特殊情况：小对象（一般几十个bytes），在没有逃逸的情况下，可以直接分配在栈上直接分配在栈上，可以自动回收，减轻GC压力。大对象或者逃逸对象无法栈上分配

#### 2.2 栈内存溢出

引起原因：

- 栈帧过多（例如：方法的递归调用）

  ![image-20220325162055182](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220325162055182.png)

- 栈帧过大（不常见）：栈帧的太大超过了栈的大小

报错显示：java.lang.StackOverflowError

#### 2.3线程运行诊断

定位： 

​		top 定位线程对于cpu的占用过高

- ps ：定位具体哪个线程的占用cpu情况
- jstack + 线程 nid  ：显示具体线程信息，进行诊断
  - 根据线程id找到相关线程，最后找到相应代码行数。

### 三、本地方法栈

java代码运行时，为本地方法分配的内存空间。

本地方法：通过c或者c++编写的方法，方便和操作系统更好的进行交互。

- 和虚拟机栈类似，不同点在于，本地方法栈是为了虚拟机使用到本地方法。
- 会出现栈溢出情况



### 四、堆

#### 4.1 概念

之前讲解的都是线程私有的。

堆是为所有线程共享的一片内存区域，因此需要考虑线程安全的问题。

有垃圾回收机制，回收堆中不在引用的对象。

创建目的：存放对象实例和数组。

- java堆可以存放在不连续的内存空间，但是逻辑上应该是连续的。

####  4.2 堆空间内存溢出

报错显示：java.lang.OutofMemoryError

如下例子：

```
public class Demo1_5 {

    public static void main(String[] args) {
        int i = 0;
        try {
            List<String> list = new ArrayList<>();
            String a = "hello";
            while (true) {
                list.add(a); // hello, hellohello, hellohellohellohello ...
                a = a + a;  // hellohellohellohello
                i++;
            }
        } catch (Throwable e) {
            e.printStackTrace();
            System.out.println(i);
        }
    }
}
```

更改堆空间大小：例如：-Xmx128M

#### 4.3 堆内存诊断

1. jps 工具

- 查看当前系统中有哪些 java 进程

2. jmap 工具

- 查看堆内存占用情况 jmap - heap 进程id

3. jconsole 工具

- 图形界面的，多功能的监测工具（监控堆内存，线程等），可以连续监测

### 五、方法区

#### 5.1 定义

java所有虚拟机线程共享的区域，存储了虚拟机加载的和类有关的数据：包括类型信息、常量、成员方法、构造器方法、方法数据、Field等。

- jvm启动时就被创建。
- HotSpot在jdk1.6之前使用永久代来实现方法区，之后把存放在永久代中的字符串常量池和静态变量等移出，在本地内存中实现元空间代替。 

#### 5.2 组成

下图所示，在内存区中的位置。

![image-20220325182024256](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220325182024256.png)

jdk1.8之后方法区移到了本地内存中，不在JVM 中。串池StringTable移到了Heap中。

#### 5.3 方法区内存溢出

1.8 以前会导致永久代内存溢出

1.8 之后会导致元空间内存溢出

由于原空间存放在内存之中，因此溢出效果并不容易发生。

演示元空间内存溢出 java.lang.OutOfMemoryError: Metaspace 

因此设置内存方法区大小：  -XX:MaxMetaspaceSize=8m



测试代码：

```
import jdk.internal.org.objectweb.asm.ClassWriter;
import jdk.internal.org.objectweb.asm.Opcodes;

/**
 * 演示元空间内存溢出 java.lang.OutOfMemoryError: Metaspace
 * -XX:MaxMetaspaceSize=8m
 */
public class Demo1_8 extends ClassLoader { // 可以用来加载类的二进制字节码
    public static void main(String[] args) {
        int j = 0;
        try {
            Demo1_8 test = new Demo1_8();
            for (int i = 0; i < 10000; i++, j++) {
                // ClassWriter 作用是生成类的二进制字节码
                ClassWriter cw = new ClassWriter(0);
                // 版本号， public， 类名, 包名, 父类， 接口
                cw.visit(Opcodes.V1_8, Opcodes.ACC_PUBLIC, "Class" + i, null, "java/lang/Object", null);
                // 返回 byte[]
                byte[] code = cw.toByteArray();
                // 执行了类的加载
                test.defineClass("Class" + i, code, 0, code.length); // Class 对象
            }
        } finally {
            System.out.println(j);
        }
    }
}
```

就会出现错误：

![image-20220325184305894](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220325184305894.png)



发生场景：Spring 、MyBatis

#### 5.4 运行时常量池

是方法区的一部分。

Class文件除了有类的版本、字段、方法、接口等信息，还有一项信息是常量池表，（Constant pool Table），存放编译期生成的字面量和符号引用。在类加载之后存放到运行常量池中

下面来看一个实例：

使用javac 反编译  

 二进制字节码（类基本信息，常量池，类方法定义，包含了虚拟机指令）

例子如下：

```
 public cn.itcast.jvm.t5.HelloWorld();
    Code:
       0: aload_0
       1: invokespecial #1                  // Method java/lang/Object."<init>":()V
       4: return

  public static void main(java.lang.String[]);
    Code:
       0: getstatic     #2                  // Field java/lang/System.out:Ljava/io/PrintStream;
       3: ldc           #3                  // String hello world
       5: invokevirtual #4                  // Method java/io/PrintStream.println:(Ljava/lang/String;)V
       8: return
}

Process finished with exit code 0
```

可以看到常量池，就是一张表，虚拟机指令根据这张常量表找到要执行的类名、方法名、参数类型、字面量等信息。

运行时常量池，常量池是 *.class 文件中的，当该类被加载，它的常量池信息就会放入运行时常量

池 。





jdk1.6之前，运行时常量池中有个重要的组成部分：StringTable（串池）



下面是一个小案例：堆、方法区、Java栈三者的关系.

![image-20220331164042446](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220331164042446.png)

代码如下：

```
public   class  AppMain     
 //运行时, jvm 把appmain的信息都放入方法区 
 { 
 public   static   void  main(String[] args)  
//main 方法本身放入方法区。 
{ 
Sample test1 = new  Sample( " 测试1 " );  
 //test1是引用，所以放到栈区里， Sample是自定义对象应该放到堆里面 
 Sample test2 = new  Sample( " 测试2 " ); 
 test1.printName(); 
 test2.printName(); 
 } 


public   class  Sample       
 //运行时, jvm 把appmain的信息都放入方法区 
 { 
 private  name;     
 //new Sample实例后， name 引用放入栈区里，  name 对象放入堆里 
 public  Sample(String name) 
 
 { 
 this .name = name; 
 } 
 //print方法本身放入 方法区里。
 public   void  printName()    
 { 
 System.out.println(name); } }
```



### 六、直接内存

直接内存不是虚拟机运行时数据区的一部分，但是这部分频繁的使用。也可能导致OutOfMemoryError出现。

我们都知道

- 每一个线程有一个工作内存和主存独立
- 工作内存存放主存中变量的值的拷贝

流程图：

​	![image-20220331164547839](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220331164547839.png)

当数据从主内存复制到工作存储时，必须出现两个动作：

​	第一，由主内存执行的读（read）操作；

​	第二，由工作内存执行的相应的load操作；

当数据从工作内存拷贝到主内存时，也出现两个操作：

​	第一个，由工作内存执行的存储（store）操作；

​	第二，由主内存执行的相应的写（write）操作

每一个操作都是原子的，即执行期间不会被中断。对于普通变量，一个线程中更新的值，不能马上反应在其他变量中。
如果需要在其他线程中立即可见，需要使用 volatile 关键字

<img src="https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220331164918953.png" alt="image-20220331164918953" style="zoom:67%;" />



为了提高性能:

Java中的NIO（New Input/Output）类，引入了基于通道和缓冲区的读写方式。

 它可以直接使⽤ Native 函数库直接分配堆外内存，然后通过⼀个存储在Java 堆中的 DirectByteBuffer 对象作为这块内存的引⽤进⾏操作。这样就能在⼀些场景中显著提⾼性能，因为**避免了在** **Java** **堆和** **Native** **堆之间来回复制数据**。

本机直接内存的分配不会收到 Java 堆的限制，但是，既然是内存就会受到本机总内存⼤⼩以及处理器寻址空间的限制

### 七、Java对象的创建

有了上面的基本了解。下面介绍一下java对象的创建。



下图是Java 对象的创建过程，：

![image-20220325214537864](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220325214537864.png)

- 类加载检查：⾸先将去检查这个指令的参数是否能在常量池中定位到这个类的符号引⽤，并且检查这个符号引⽤代表的类是否已被加载过、解析和初始化过。如果没有，那必须先执⾏相应的类加载过程。

- 分配内存： 虚拟机将为新⽣对象分配内存。对象所需的内存⼤⼩在类加载完成后便可确定，为对象分配空间的任务等同于把⼀块确定⼤⼩的内存从 Java 堆中划分出来。分配⽅式有指针碰撞”和 “空闲列表” 两种，选择那种分配⽅式由 Java 堆是否规整决定，⽽ Java堆是否规整⼜由所采⽤的垃圾收集器是否带有压缩整理功能决定。 

- 内存分配完成之后，虚拟机将分配的内存空间都设置成初始化成0。
- 还要对对象进行必要的设置。这些信息存放在对象头中。根据虚拟机的状态不同会有不同的设置方式。
- 执行init(),按照程序员的意愿进行初始化。（设置相关字段和其他资源、状态信息）

关于类的创建还要掌握的是：



**1、**内存分配的两种⽅式：（补充内容，需要掌握） 

选择以上两种⽅式中的哪⼀种，取决于 Java 堆内存是否规整。⽽ Java 堆内存是否规整，取决于 GC

收集器的算法是"标记-清除"，还是"标记-整理"（也称作"标记-压缩"），值得注意的是，复制算法内

存也是规整的



**2、**内存分配并发问题

在创建对象的时候有⼀个很重要的问题，就是线程安全，因为在实际开发过程中，创建对象是很频繁的

事情，作为虚拟机来说，必须要保证线程是安全的，通常来讲，虚拟机采⽤两种⽅式来保证线程安全：

**CAS+**失败重试：CAS 是乐观锁的⼀种实现⽅式。所谓乐观锁就是，每次不加锁⽽是假设没有冲

突⽽去完成某项操作，如果因为冲突失败就重试，直到成功为⽌。**虚拟机采⽤** **CAS** **配上失败重**

**试的⽅式保证更新操作的原⼦性。**

**TLAB**： 为每⼀个线程预先在Eden区分配⼀块⼉内存，JVM在给线程中的对象分配内存时，⾸先在

TLAB分配，当对象⼤于TLAB中的剩余内存或TLAB的内存已⽤尽时，再采⽤上述的CAS进⾏内存分

配 

**③**初始化零值： 内存分配完成后，虚拟机需要将分配到的内存空间都初始化为零值（不包括对象

头），这⼀步操作保证了对象的实例字段在 Java 代码中可以不赋初始值就直接使⽤，程序能访问到这

些字段的数据类型所对应的零值。

**④**设置对象头：初始化零值完成之后，**虚拟机要对对象进⾏必要的设置**，例如这个对象是那个类的实

例、如何才能找到类的元数据信息、对象的哈希吗、对象的 GC 分代年龄等信息。 **这些信息存放在对**

**象头中。** 另外，根据虚拟机当前运⾏状态的不同，如是否启⽤偏向锁等，对象头会有不同的设置⽅

式。

⑤执⾏ **init** **⽅法：** 在上⾯⼯作都完成之后，从虚拟机的视⻆来看，⼀个新的对象已经产⽣了，但从

Java 程序的视⻆来看，对象创建才刚开始， <init> ⽅法还没有执⾏，所有的字段都还为零。所以⼀

般来说，执⾏ new 指令之后会接着执⾏ <init> ⽅法，把对象按照程序员的意愿进⾏初始化，这样

⼀个真正可⽤的对象才算完全产⽣出来。

**3、对象的访问定位有哪两种⽅式?**

建⽴对象就是为了使⽤对象，我们的Java程序通过栈上的 reference 数据来操作堆上的具体对象。对

象的访问⽅式有虚拟机实现⽽定，⽬前主流的访问⽅式有 句柄和使用直接指针两种：

\1. **句柄：** 如果使⽤句柄的话，那么Java堆中将会划分出⼀块内存来作为句柄池，reference 中存

储的就是对象的句柄地址，⽽句柄中包含了对象实例数据与类型数据各⾃的具体地址信息

\2. **直接指针：** 如果使⽤直接指针访问，那么 Java 堆对象的布局中就必须考虑如何放置访问类型

数据的相关信息，⽽reference 中存储的直接就是对象的地址。
