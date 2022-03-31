---
title: JVM-类加载机制
date: 2022-03-28 12:19:06
tags:
- JVM
categories:
- Notes
keywords:
description:
top_img:
comments:
cover:https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203151833182.jpg
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

# JVM 类加载机制



## 一、类加载的过程



一个类从被加载到虚拟机内存中开始，到从内存中卸载，整个生命周期需要经过七个阶段：加载 （Loading）、验证（Verification）、准备（Preparation）、解析（Resolution）、初始化 （Initialization）、使用（Using）和卸载（Unloading）。

其中验证、准备、解析三个部分统称为连接（Linking）。



注：加载、验证、准备、初始化、卸载这五个步骤的顺序是确定的。类加载过程必须按照这个顺序按部就班的开始（开始是说明仅仅是步骤开始，不必等待上一个步骤完成，下一个步骤就可以开始。）。但是解析阶段却不一定，解析可以在初始化的之后进行（即运行时绑定）。



如图所示：类的生命周期

 ![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWfTeSZ3GWTEI2Aq4yTahy8cFba2pnScwnfXmhhhp84bNK9fWw8UwD8IAOnWOZIjicuvs5WWMpqEdUg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1) 

《Java虚拟机规范》 严格规定了有且只有六种情况必须立即对类进行“初始化”：

- 1）遇到new、getstatic、putstatic或invokestatic这四条字节码指令时，如果类型没有进行过初始化，则需要先触发其初始化阶段。
- 2）使用java.lang.reflect包的方法对类型进行反射调用的时候，如果类型没有进行过初始化，则需要先触发其初始化。
- 3）当初始化类的时候，如果发现其父类还没有进行过初始化，则需要先触发其父类的初始化。
- 4）当虚拟机启动时，用户需要指定一个要执行的主类（包含main()方法的那个类），虚拟机会先初始化这个主类。
- 5）当使用JDK 7新加入的动态语言支持时，如果一个java.lang.invoke.MethodHandle实例最后的解析结果为REF_getStatic、REF_putStatic、REF_invokeStatic、REF_newInvokeSpecial四种类型的方法句柄，并且这个方法句柄对应的类没有进行过初始化，则需要先触发其初始化。
- 6）当一个接口中定义了JDK 8新加入的默认方法（被default关键字修饰的接口方法）时，如果有这个接口的实现类发生了初始化，那该接口要在其之前被初始化。

这六种场景中的行为称为对一个类型进行主动引用。

除此之外，所有引用类型方式都不会出发初始化，成为被动引用。



**被动引用**：

有三点说明：

- 通过子类引用父类的**静态字段**，不会导致子类初始化，只会导致父类的初始化
- 通过数组来引用类，不会触发此类的初始化
- 常量在编译阶段会存入调用类的常量池中，本质上没有引用到定义常量的类，因此不会触发定义常量的类的初始化。

注：一个类在初始化的时候，要求其父类已经全部初始化过了，但是一个借口在初始化时，并不要求其父接口全部完成了初始化。

 下面详细介绍类加载的过程：

### 1、加载

加载是JVM加载的起点，具体什么时候开始加载，《Java虚拟机规范》中并没有进行强制约束，可以交给虚拟机的具体实现来自由把握。

在加载阶段，JVM要做三件事情：

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWfTeSZ3GWTEI2Aq4yTahy8cNjgPgic0MibcRqHc4g2kfEtJ8nnRf0ge3ZKapQLhaZkFpSpxtiacGoOibg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1) 

- 1）通过一个类的全限定名来获取定义此类的二进制字节流。
- 2）将这个字节流所代表的静态存储结构转化为方法区的运行时数据结构。
- 3）在内存中生成一个代表这个类的java.lang.Class对象，作为方法区这个类的各种数据的访问入口。

注：虚拟机规范对于这三点描述不是很具体，因此留给了java应用的灵活性是很大的。加载阶段既可以是虚拟机内置的引导类加载器来完成，也可以是由用户自定义的类加载器来完成。

加载阶段结束后，Java虚拟机外部的二进制字节流就按照虚拟机所设定的格式存储在方法区之中了，方法区中的数据存储格式完全由虚拟机实现自行定义，《Java虚拟机规范》未规定此区域的具体数据结构。

类型数据妥善安置在方法区之后，会在Java堆内存中实例化一个java.lang.Class类的对象， 这个对象将作为程序访问方法区中的类型数据的外部接口。

注：加载阶段和连接阶段的部分动作是交叉进行的，但是仍然保持固定的开始顺序。



### 2、验证

验证是连接阶段的第一步。

- 目的：**确保Class文件的字节流中包含的信息符合《Java虚拟机规范》的全部约束要求。**
- 验证阶段是非常重要的但是却不是必须的。只有使用的代码是完全经过了使用和验证，安全的，可考虑使用-Xverify：none参数关闭大部分的类验证措施，以缩短虚拟机类加载时间 。

验证阶段大致上会完成下面四个阶段的检验动作：文件格式验证、元数据验证、字节码验证和符号引用验证。

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWfTeSZ3GWTEI2Aq4yTahy8cBuDTWyVsn0QUI8w3J5q6khuUlpUibe0HrJYicwicgibDJpHrE4WVLEHCicw/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

- 文件格式验证

第一阶段要验证字节流是否符合Class文件格式的规范，并且能被当前版本的虚拟机处理。需要验证魔数、版本号、常量池常量类型是否支持、指向常量的索引值等等。

- 元数据验证

第二阶段是对字节码描述的信息进行语义分析，以保证其描述的信息符合《Java语言规范》的要求，包括类是否有父类、父类是否继承了final修饰的类、非抽象类是否实现了父类定义的方法、类是否与父类有矛盾等等。

主要是对类的元数据信息进行**语义**检索，保证不存在与JAVA语言规范相悖的元数据信息。

- 字节码验证

第三阶段是整个验证过程中最复杂的一个阶段，主要目的是通过数据流分析和控制流分析，确定程序语义是合法的、符合逻辑的。

- 符号引用验证

最后一个阶段的校验行为发生在虚拟机将符号引用转化为直接引用的时候，这个转化动作将在连接的第三阶段——解析阶段中发生。

符号引用验证主要验证类是否缺少或者被禁止访问它依赖的某些外部类、方法、字段等资源。

### 3、准备

准备阶段是给静态变量分配内存并设置类变量初始值的阶段。

在JDK 7及之前，这些变量的内存在方法区（永久代）中分配，在JDK 8及之后，静态变量则会随着Class对象一起存放在Java堆中。

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWfTeSZ3GWTEI2Aq4yTahy8c5DNVIuTicia7d6akzQ7WQQX45JD6gIoKZbUFe6ys84DXMySAdQiaXoVfg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)

注：准备阶段，容易混淆的概念：

​		1.进行内存分配的时候，仅仅包括类变量，不包括实例变量。实例变量会随着对象一起分配在Java堆中

基本数据类型在准备阶段会被赋予初始值。

但是对于static final类型，在准备阶段就会被赋上正确的值。例如：public static final  int v=1;



### 4、解析

解析阶段是Java虚拟机将常量池内的符号引用替换为直接引用的过程。

- 符号引用（Symbolic References）：符号引用以一组符号来描述所引用的目标，符号可以是任何形式的字面量，只要使用时能无歧义地定位到目标即可。与虚拟机实现的内存布局无关。
- 直接引用（Direct References）：直接引用是可以直接指向目标的指针、相对偏移量或者是一个能间接定位到目标的句柄。与虚拟机实现的内存布局有关。如果有了直接引用那么引用的目标必定已经在虚拟机的内存中存在。

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWfTeSZ3GWTEI2Aq4yTahy8cs6smUScMl9iaOM9ZTibjMr8z6T5iarSTLeic2mmdicicykCuFOEp95FVXNog/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1) 

### 5、初始化

类的初始化阶段是类加载过程的最后一个步骤。

直到这个阶段，才开始执行Java程序中的代码。将主导权移交给应用程序。会根据程序员通过程序编码制定的主观计划去初始化类变量和其他资源。

更直接的表示：初始化阶段就是执行类构造器<clinit>()方法的过程。

- static变量 赋值语句

- static{}语句

注：<clinit>()：是javac的自动生成物。

​		准备阶段，变量被赋的是系统要求的零值，在初始化阶段，赋的是代码里编写的值。

​		子类的<clinit>调用前保证父类的<clinit>被调用

​		<clinit>是线程安全的

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWfTeSZ3GWTEI2Aq4yTahy8cibTSXPVDMwDnSuSRkNdUYicpkhEWqIsvOCG0aZjVibyTYXp3vBGeKmVCA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1) 

 







## 二、类与类加载器



类加载器只用于实现类的加载动作。

但对于任意一个类，都必须由加载它的类加载器和这个类本身一起共同确立其在Java虚拟机中的唯一性，每 一个类加载器，都拥有一个独立的类名称空间。



这句话可以表达得更通俗一些：比较两个类是否“相等”，只有在这两个类是由同一个类加载器加载的前提下才有意义，否则,即使这两个类来源于同一个Class文件，被同一个Java虚拟机加载，只要加载它们的类加载器不同，那这两个类就必定不相等。



如下演示了不同的类加载器对instanceof关键字运算的结果的影响。

```
public class ClassLoaderTest {
    public static void main(String[] args) throws Exception {
        //自定义一个简单的类加载器
        ClassLoader myLoader = new ClassLoader() {
            @Override
            //加载类方法
            public Class<?> loadClass(String name) throws ClassNotFoundException {
                try {
                    //获取文件名
                    String fileName = name.substring(name.lastIndexOf(".") + 1) + ".class";
                    //加载输入流
                    InputStream is = getClass().getResourceAsStream(fileName);
                    //使用父类加载
                    if (is == null) {
                        return super.loadClass(name);
                    }
                    byte[] b = new byte[is.available()];
                    is.read(b);
                    //从流中转化类的实例
                    return defineClass(name, b, 0, b.length);
                } catch (IOException e) {
                    throw new ClassNotFoundException(name);
                }
            }
        };
        //使用自己实现的类加载器加载
        Object obj = myLoader.loadClass("cn.fighter3.loader.ClassLoaderTest").newInstance();
        System.out.println(obj.getClass());
        //实例判断
        System.out.println(obj instanceof cn.fighter3.loader.ClassLoaderTest);
    }
}
```



 







## 三、双亲委派模型

从Java虚拟机的角度来看，只存在两种不同的类加载器：

- 一种是启动类加载器（Bootstrap ClassLoader），这个类加载器使用C++语言实现，是虚拟机自身的一部分；

- 另外一种就是其他所有的类加载器，这些类加载器都由Java语言实现，独立存在于虚拟机外部，并且全都继承自抽象类 java.lang.ClassLoader。

站在Java开发人员的角度来看，类加载器就应当划分得更细致一些。自JDK 1.2以来，Java一直保持着三层类加载器、双亲委派的类加载架构。

![image-20220331095734552](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220331095734552.png)

双亲委派模型如上图：

- 启动类加载器（Bootstrap Class Loader）：负责加载存放在 <JAVA_HOME>\lib目录，或者被-Xbootclasspath参数所指定的路径中存放的，能被Java虚拟机能够识别的（按照文件名识别，如rt.jar、tools.jar，名字不符合的类库即使放在lib目录中也不会被加载）类。
- 扩展类加载器（Extension Class Loader）：负责加载<JAVA_HOME>\lib\ext目录中，或者被java.ext.dirs系统变量所指定的路径中所有的类库。
- 应用程序类加载器（Application Class Loader）：负责加载用户类路径 （ClassPath）上所有的类库，如果没有自定义类加载器，一般情况下这个加载器就是程序中默认的类加载器。

用户还可以加入自定义的类加载器器来进行扩展。

注：如图展示的各种类之间的层次关系被称为类加载器的双亲委派模型。

​		这里的类加载器之间的父子关系不是通过继承来实现的呃，是通过组合关系复用父加载器的代码。

**双亲委派模型的工作过程**：如果一个类加载器收到了类加载的请求，它首先不会自己去尝试加载这个类，而是把这个请求委派给父类加载器去完成，每一个层次的类加载器都是如此，因此所有的加载请求最终都应该传送到最顶层的启动类加载器中，只有当父加载器反馈自己无法完成这个加载请求时，子加载器才会尝试自己去完成加载。

**使用双亲委派模型原因？**

使用双亲委派模型来阻止类加载器之间的的关系，显而易见的好处就是java中的类随着类加载器一起具备了一种带有优先级的层次关系。

例如类java.lang.Object，它存放在rt.jar之中，通过双亲委派机制，保证最终都是委派给处于模型最顶端的启动类加载器进行加载，保证Object的一致。反之，都由各个类加载器自行去加载的话，如果用户自己也编写了一个名为java.lang.Object的类，并放在程序的 ClassPath中，那系统中就会出现多个不同的Object类。

双亲委派模型的代码实现非常简单，在`java.lang.ClassLoader.java`中有一个 `loadClass`方法：

```
    protected Class<?> loadClass(String name, boolean resolve)
        throws ClassNotFoundException
    {
        synchronized (getClassLoadingLock(name)) {
            // 首先，判断类是否被加载过
            Class<?> c = findLoadedClass(name);
            if (c == null) {
                long t0 = System.nanoTime();
                try {
                    if (parent != null) {
                        c = parent.loadClass(name, false);
                    } else {
                        c = findBootstrapClassOrNull(name);
                    }
                } catch (ClassNotFoundException e) {
                    // 如果父类加载器抛出ClassNotFoundException 
                    // 说明父类加载器无法完成加载请求
                }

                if (c == null) {
                    // 在父类加载器无法加载时 
                    // 再调用本身的findClass方法来进行类加载
                    long t1 = System.nanoTime();
                    c = findClass(name);

                    // this is the defining class loader; record the stats
                    sun.misc.PerfCounter.getParentDelegationTime().addTime(t1 - t0);
                    sun.misc.PerfCounter.getFindClassTime().addElapsedTimeFrom(t1);
                    sun.misc.PerfCounter.getFindClasses().increment();
                }
            }
            if (resolve) {
                resolveClass(c);
            }
            return c;
        }
    }
```

## 四、破坏双亲委派模型

双亲委派机制在历史上主要有三次破坏：

> **第一次破坏**

双亲委派模型的第一次“被破坏”其实发生在双亲委派模型出现之前——即JDK 1.2面世以前的“远古”时代。

由于双亲委派模型在JDK 1.2之后才被引入，但是类加载器的概念和抽象类 java.lang.ClassLoader则在Java的第一个版本中就已经存在，为了向下兼容旧代码，所以无法以技术手段避免loadClass()被子类覆盖的可能性，只能在JDK 1.2之后的java.lang.ClassLoader中添加一个新的 protected方法findClass()，并引导用户编写的类加载逻辑时尽可能去重写这个方法，而不是在 loadClass()中编写代码。

 

> **第二次破坏**

双亲委派模型的第二次“被破坏”是由这个模型自身的缺陷导致的，如果有基础类型又要调用回用户的代码，那该怎么办呢？

例如我们比较熟悉的JDBC:

各个厂商各有不同的JDBC的实现，Java在核心包`\lib`里定义了对应的SPI，那么这个就毫无疑问由`启动类加载器`加载器加载。

但是各个厂商的实现，是没办法放在核心包里的，只能放在`classpath`里，只能被`应用类加载器`加载。那么，问题来了，启动类加载器它就加载不到厂商提供的SPI服务代码。

为了解决这个我呢提，引入了一个不太优雅的设计：线程上下文类加载器 （Thread Context ClassLoader）。这个类加载器可以通过java.lang.Thread类的setContext-ClassLoader()方法进行设置，如果创建线程时还未设置，它将会从父线程中继承一个，如果在应用程序的全局范围内都没有设置过的话，那这个类加载器默认就是应用程序类加载器。

JNDI服务使用这个线程上下文类加载器去加载所需的SPI服务代码，这是一种父类加载器去请求子类加载器完成类加载的行为。



> **第三次破坏**

双亲委派模型的第三次“被破坏”是由于用户对程序动态性的追求而导致的，例如代码热替换（Hot Swap）、模块热部署（Hot Deployment）等。

OSGi实现模块化热部署的关键是它自定义的类加载器机制的实现，每一个程序模块（OSGi中称为 Bundle）都有一个自己的类加载器，当需要更换一个Bundle时，就把Bundle连同类加载器一起换掉以实现代码的热替换。在OSGi环境下，类加载器不再双亲委派模型推荐的树状结构，而是进一步发展为更加复杂的网状结构。



**热替换**

含义：当一个class被替换后，系统无需重启，替换的类立即生效

例子：

```
geym.jvm.ch6.hot.CVersionA

public class CVersionA {
	public void sayHello() {
		System.out.println("hello world! (version A)");
	}
}
```

DoopRun 不停调用CVersionA . sayHello()方法，因此有输出：
		hello world! (version A)
在DoopRun 的运行过程中，替换CVersionA 为：

```
public class CVersionA {
	public void sayHello() {
		System.out.println("hello world! (version B)");
	}
}

```

替换后， DoopRun 的输出变为
		hello world! (version B)



------

破坏双亲委派模型 ：见[破坏双亲委派模型](https://www.cnblogs.com/ronnieyuan/p/11975584.html)

