---
title: JVM-内存泄漏和溢出
date: 2022-03-30 18:15:23
tags:
---

本文转载于：[【JVM进阶之路】四：直面内存溢出和内存泄漏](https://mp.weixin.qq.com/s?__biz=MzkwODE5ODM0Ng==&mid=2247485412&idx=1&sn=bcb6805623c744a37a42157d8eaa64a1&chksm=c0ccef41f7bb6657f8719b9d55759b2766d8fed1223699d9ec0c8655cd5d388600a5299615b3&cur_album_id=1785069014436593665&scene=190#rd)



在Java中，和内存相关的问题主要有两种，**内存溢出**和**内存泄漏**。

- **内存溢出（\**Out Of Memory\**）** ：就是申请内存时，JVM没有足够的内存空间。通俗说法就是去蹲坑发现坑位满了。
- **内存泄露 （Memory Leak）**：就是申请了内存，但是没有释放，导致内存空间浪费。通俗说法就是有人占着茅坑不拉屎。

# 1、内存溢出

在JVM的几个内存区域中，除了程序计数器外，其他几个运行时区域都有发生内存溢出（OOM）异常的可能。

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWeaHDVASQXNBtGp0PMuZ53icBLAyZxNkaYVGRAYJX71F2tDyO0Uxbo15jnpIbA829CCia73mcbJHfTA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)JDK 1.8内存区域

## 1.1、Java堆溢出

Java堆用于储存对象实例，我们只要不断地创建对象，并且保证GC Roots到对象之间有可达路径来避免垃圾回收机制清除这些对象，那么随着对象数量的增加，总容量触及最大堆的容量限制后就会产生内存溢出异常。

我们来看一个代码的例子：

```
/**
 * VM参数： -Xms20m -Xmx20m -XX:+HeapDumpOnOutOfMemoryError
 */
public class HeapOOM {
    static class OOMObject {
    }

    public static void main(String[] args) {
        List<OOMObject> list = new ArrayList<OOMObject>();
        while (true) {
            list.add(new OOMObject());
        }
    }
}
```

接下来，我们来设置一下程序启动时的JVM参数。限制内存大小为20M，不允许扩展，并通过参数-XX：+HeapDumpOnOutOf-MemoryError 让虚拟机Dump出内存堆转储快照。

在Idea中设置JVM启动参数如下图：

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWeaHDVASQXNBtGp0PMuZ53icnMxcGDmibT4CzTTGfsKCN7cwYT39kGoo11mKibFeO93oucKWSftSDr5g/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)Idea设置JVM参数

运行一下：

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)堆内存溢出异常

Java堆内存的OutOfMemoryError异常是实际应用中最常见的内存溢出异常情况。出现Java堆内存溢出时，异常堆栈信息“java.lang.OutOfMemoryError”会跟随进一步提示“Java heap space”。Java堆文件快照文件dump到了java_pid18728.hprof文件。

要解决这个内存区域的异常，常规的处理方法是首先通过内存映像分析工具（如JProfiler、Eclipse Memory Analyzer等）对Dump出来的堆转储快照进行分析。

看到内存占用信息如下：

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWeaHDVASQXNBtGp0PMuZ53icgYD1GOOgsNfaFKmmfdTYgNpJXicHnjAbLibrO1xJyia4npmOBibo1Uc9bg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)Jprofiler 打开的堆转储快照文件

然后可以查看代码问题如下：

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWeaHDVASQXNBtGp0PMuZ53icziaMLn90icj6IgOUClvzTCHPGf1guEWicVPTrojwPvIWCbrXUKc1UTjOA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)Jprofiler查看代码问题

> 常见堆JVM相关参数：
>
> `-XX:PrintFlagsInitial`: 查看所有参数的默认初始值`-XX:PrintFlagsFinal`：查看所有的参数的最终值（可能会存在修改，不再是初始值）`-Xms`: 初始堆空间内存（默认为物理内存的1/64）`-Xmx`: 最大堆空间内存（默认为物理内存的1/4）`-Xmn`: 设置新生代大小（初始值及最大值）`-XX:NewRatio`: 配置新生代与老年代在堆结构的占比`-XX:SurvivorRatio`：设置新生代中Eden和S0/S1空间的比例`-XX:MaxTenuringThreshold`：设置新生代垃圾的最大年龄(默认15)`-XX:+PrintGCDetails`：输出详细的GC处理日志 打印`GC`简要信息：① `-XX:+PrintGC` ② `-verbose:gc``-XX:HandlePromotionFailure`：是否设置空间分配担保

## 1.2、虚拟机栈和本地方法栈溢出

HotSpot虚拟机中将虚拟机栈和本地方法栈合二为一，因此对于HotSpot来说，-Xoss参数（设置本地方法栈大小）虽然存在，但实际上是没有任何效果的，栈容量只能由-Xss参数来设定。关于虚拟机栈和本地方法栈，有两种异常：

- 如果线程请求的栈深度大于虚拟机所允许的最大深度，将抛出`StackOverflowError`异常。
- 如果虚拟机的栈内存允许动态扩展，当扩展栈容量无法申请到足够的内存时，将抛出 `OutOfMemoryError`异常。

### 1.2.1、StackOverflowError

HotSpot虚拟机不支持栈的动态扩展，在HotSpot虚拟机中，以下两种情况都会导致StackOverflowError。

- **栈容量过小**

  如下，使用Xss参数减少栈内存容量

```
/**
 * vm参数：-Xss128k
 */
public class JavaVMStackSOF {
    private int stackLength = 1;

    public void stackLeak() {
        stackLength++;
        stackLeak();
    }

    public static void main(String[] args) throws Throwable {
        JavaVMStackSOF oom = new JavaVMStackSOF();
        try {
            oom.stackLeak();
        } catch (Throwable e) {
            System.out.println("stack length:" + oom.stackLength);
            throw e;
        }
    }

}
```

运行结果：

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWeaHDVASQXNBtGp0PMuZ53icuHtsd4Zc9HIyNy413OSdPvQCWbWOUGEyMAsvzQjKPYico2vzv0dKZyA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)栈内存溢出

- **栈帧太大**

  如下，通过一长串变量，来占用局部变量表空间。

  ![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWeaHDVASQXNBtGp0PMuZ53icFPsv1htDVlHnuyTleqfGOVbeibnnrRGBic6icS0Iqp4moibMpx0Co8b0rw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)carbon

运行结果：

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)image-20210324211958180

无论是由于栈帧太大还是虚拟机栈容量太小，当新的栈帧内存无法分配的时候， HotSpot虚拟机抛出的都是StackOverflowError异常。

### 1.2.2、OutOfMemoryError

虽然不支持动态扩展栈，但是通过不断建立线程的方式，也可以在HotSpot上产生内存溢出异常。

需要注意，这样产生的内存溢出异常和栈空间是否足够并不存在任何直接的关系，主要取决于操作系统本身的内存使用状态。因为操作系统给每个进程的内存时有限的，线程数一多，自然会超过进程的容量。

创建线程导致内存溢出异常 ：

```
/**
 * vm参数：-Xss2M
 */
public class JavaVMStackOOM {
    private void dontStop() {
        while (true) {
        }
    }

    public void stackLeakByThread() {
        while (true) {
            Thread thread = new Thread(new Runnable() {
                public void run() {
                    dontStop();
                }
            });
            thread.start();
        }
    }

    public static void main(String[] args) throws Throwable {
        JavaVMStackOOM oom = new JavaVMStackOOM();
        oom.stackLeakByThread();
    }
}
```

以上是一段比较有风险的代码，可能会导致系统假死，运行结果如下：

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWeaHDVASQXNBtGp0PMuZ53icWk4ibmGibtgr5XUvWnQAMQo4fEabiaSTsKJcJGq4lrViawDQ7d1wiaGHBdQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)image-20210324213320530

## 1.3、方法区和运行时常量池溢出

这里再提一下方法区和运行时常量池的变迁，JDK1.7以后字符串常量池移动到了堆中，JDK1.8在直接内存中划出一块区域**元空间**来实现方区域。

String:intern()是一个本地方法，它的作用是如果字符串常量池中已经包含一个等于此String对象的 字符串，则返回代表池中这个字符串的String对象的引用；否则，会将此String对象包含的字符串添加到常量池中，并且返回此String对象的引用。在JDK 6或更早之前的HotSpot虚拟机中，常量池都是分配在永久代中，永久代本身内存不限制可能会出现错误：

```
java.lang.OutOfMemoryError: PermGen space
```

## 1.4、本机直接内存溢出

直接内存（Direct Memory）的容量大小可通过-XX：MaxDirectMemorySize参数来指定，如果不去指定，则默认与Java堆最大值（由-Xmx指定）一致。

直接通过反射获取`Unsafe`实例，通过反射向操作系统申请分配内存：

```
/**
 * vm参数：-Xmx20M -XX:MaxDirectMemorySize=10M
 */
public class DirectMemoryOOM {
    private static final int _1MB = 1024 * 1024;

    public static void main(String[] args) throws Exception {
        Field unsafeField = Unsafe.class.getDeclaredFields()[0];
        unsafeField.setAccessible(true);
        Unsafe unsafe = (Unsafe) unsafeField.get(null);
        while (true) {
            unsafe.allocateMemory(_1MB);
        }
    }
}
```

运行结果：

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)image-20210324215114989

由直接内存导致的内存溢出，一个明显的特征是在Heap Dump文件中不会看见有什么明显的异常情况。

# 2、内存泄漏

内存回收，简单说就是应该被垃圾回收的对象没有被垃圾回收。

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWeaHDVASQXNBtGp0PMuZ53ic2AQ25VfYhW3f0oWWCf1SOUHKShVE6zOicMaYdVDiaIhDtyEwRPVejsHg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)内存泄漏

在上图中：对象 X 引用对象 Y，X 的生命周期比 Y 的生命周期长，Y生命周期结束的时候，垃圾回收器不会回收对象Y。

我们来看几个内存泄漏的例子：

- **静态集合类引起内存泄漏**

  静态集合的生命周期和 JVM 一致，所以静态集合引用的对象不能被释放。

```
public class OOM {
 static List list = new ArrayList();

 public void oomTests(){
   Object obj = new Object();

   list.add(obj);
  }
}
```

- **单例模式**：

  和上面的例子原理类似，单例对象在初始化后会以静态变量的方式在 JVM 的整个生命周期中存在。如果单例对象持有外部的引用，那么这个外部对象将不能被 GC 回收，导致内存泄漏。

- **数据连接、IO、Socket等连接**

  创建的连接不再使用时，需要调用 **close** 方法关闭连接，只有连接被关闭后，GC 才会回收对应的对象（Connection，Statement，ResultSet，Session）。忘记关闭这些资源会导致持续占有内存，无法被 GC 回收。

```
        try {
            Connection conn = null;
            Class.forName("com.mysql.jdbc.Driver");
            conn = DriverManager.getConnection("url", "", "");
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("....");
          } catch (Exception e) { 
           
          }finally {
            //不关闭连接
          }
        }
```

- **变量不合理的作用域**

  一个变量的定义作用域大于其使用范围，很可能存在内存泄漏；或不再使用对象没有及时将对象设置为 null，很可能导致内存泄漏的发生。

```
public class Simple {
    Object object;
    public void method1(){
        object = new Object();
        //...其他代码
        //由于作用域原因，method1执行完成之后，object 对象所分配的内存不会马上释放
        object = null;
    }
}
```

- **引用了外部类的非静态内部类**

  非静态内部类（或匿名类）的初始化总是需要依赖外部类的实例。默认情况下，每个非静态内部类都包含对其**包含类**的隐式引用，若在程序中使用这个内部类对象，那么**即使在包含类对象超出范围之后，也不会被回收**（内部类对象隐式地持有外部类对象的引用，使其成不能被回收）。

- **Hash 值发生改变**

  对象Hash值改变，使用HashMap、HashSet等容器中时候，由于对象修改之后的Hah值和存储进容器时的Hash值不同，会导致无法从容器中**单独删除**当前对象，造成内存泄露。

- **ThreadLocal** 造成的内存泄漏

  ThreadLocal 可以实现变量的线程隔离，但若使用不当，就可能会引入内存泄漏问题。
