---
title: JVM-类文件结构
date: 2022-03-28 12:18:36
tags:
- JVM
categories:
- Notes
keywords:
description:
top_img:
comments:
cover:https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/d08f2fb2bc3b4bfd8cf3d1795f422e6d.jpg
---

# Class文件结构

Java虚拟机和字节码文件存储格式是Java实现语言无关性的基础。

Java虚拟机只和Class文件这种二进制文件相关联，后者中包含了java指令集和符号表和其他辅助信息。

虚拟机丝毫不关心Class文件来源于什么语言。



字节码是构成平台无关性的基石，虚拟机可以在如何执行同一种平台无关的代码，从而实现了一次编写，到处实现。

 JAVA语言中的哥终于发关键字、常量、变量、运算符号的语义最终都会由多条字节码指令组合来表示。

 

## 一、Class类文件结构

java语言保持着很好的向后兼容性。因此绝大多数的Class文件结构内容都在JDK1.2时代定义完毕。

- Class文件是一组以八个字节为单位的二进制字节流。需要注意的是，他们中间紧密排列，没有任何分隔符，仅仅存储必要的数据。

- 根据java虚拟机规范：Class文件使用一种类似于C语言中结构体的伪结构来存储数据。这种结构中只有两种数据类型：
  - 无符号数：（属于基本数据类型）u1，u2....表示一个字节、两个字节.....。用来描述数字、索引引用、数量值、或者按照UTF-8构成的字符串值
  - 表：由多个无符号或者其他表构成的符合数据结构。通常以info结尾。

注:实际上Class文件也是一个“表”

​	Class文件因为没有空隙，因此其中的所有数据项的顺序和数量都是规定好的。

每一个 Class 文件对应于一个如下所示的 ClassFile 结构体：

```
ClassFile {
 u4 magic;
 u2 minor_version;
 u2 major_version;
 u2 constant_pool_count;
 cp_info constant_pool[constant_pool_count-1];
 u2 access_flags;
 u2 this_class;
 u2 super_class;
 u2 interfaces_count;
 u2 interfaces[interfaces_count];
 u2 fields_count;
 field_info fields[fields_count];
 u2 methods_count;
 method_info methods[methods_count];
 u2 attributes_count;
 attribute_info attributes[attributes_count];
}
```

简单看一下各项的含义：

![图片](https://mmbiz.qlogo.cn/mmbiz_png/PMZOEonJxWfOTibyJzLhdKfDIJ0Sd9UduUxwQXJm2XdDzUpLcvUDrBzHVJSYDFWiaDzRRpNyRuhiaCVAaMvQX9GYA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1&retryload=2)

 下面逐项详细介绍：

### 1.1 魔数

每个Class文件前四字节被称为魔数。

唯一作用是确定这个文件是否能被虚拟机接受并且执行(使用魔数不使用文件扩展名，是出于安全考虑，文件扩展名可以随意更改)

这是基本上每个Java开发人员的第一个Java程序：

 

第一行中有一串特殊的字符 `cafebabe`，它就是一个魔数，是 JVM 识别 class 文件的标志，JVM 会在验证阶段检查 class 文件是否以该魔数开头，如果不是则会抛出 `ClassFormatError`。

 

### 1.2 版本号

紧跟着魔数的四个字节 存储的是 class 文件的版本号：第 5 和第 6 个字节是次版本号（Minor Version），第 7 和第 8 个字节是主版本号（Major Version）。

Java的版本号是从 45 开始的，JDK1.1 之后的每个 JDK  大版本发布主版本号向上加1（JDK1.0~JDK1.1使用了45.0~45.3的版本号），高版本的 JDK 能向下兼容以前版本的 Class  文件，但不能运行以后版本的 Class 文件，即使文件格式未发生变化。

### 1.3 常量池

紧接着主、次版本号之后的是常量池入口。常量池可以比喻成Class文件中的资源仓库。

是一个表数据项目

由于常量池中常量的数量是不固定的，所以在常量池的入口需要放置一项u2类型的数据，代表**常量池容量计数值**（constant_pool_count）。与Java中语言习惯不同，这个容量计数是从1而不是0开始的。

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWfOTibyJzLhdKfDIJ0Sd9UduWzbia5JJOdWjO4SWqYmXy8su5sm3AS2yv8IgsRroo6HnAwLB4EibuZsg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1) 

 Class文件结构中只有常量池的容量计数是从1开始，对于其他集合类型，包括接口索引集合、字段表集合、方法表集合等的容量计数都与一般习惯相同，是从0开始。

1、

常量池中主要存放两大类常量：`字面量（Literal）`和`符号引用（Symbolic References）`。

字面量比较接近于Java语言层面的常量概念，如文本字符串、被声明为final的常量值等。

符号引用则属于编译原理方面的概念，主要包括下面几类常量：

- 被模块导出或者开放的包（Package）
- 类和接口的全限定名（Fully Qualified Name）
- 字段的名称和描述符（Descriptor）
- 方法的名称和描述符
- 方法句柄和方法类型（Method Handle、Method Type、Invoke Dynamic）
- 动态调用点和动态常量（Dynamically-Computed Call Site、Dynamically-Computed Constant）

2、

动态连接：Java代码在进行javac编译的时候，没有连接这个说法，而是在加载Class文件的时候进行动态连接，Class文件中不会保存各个方法、字段最终在内存中的布局信息，这些信息不经过虚拟机在运行期间的转换的话是无法得到真正的内存入口地址，也就无法直接被虚拟机使用。

常量池会在类加载的时候提供对应的常量池引用，经过解析翻译到对应的内存地址中。

3、

常量池中的每一个常量都是一个表，介质JDK13，常量池中常量有17种不同类型。

这17类常量结构只有一个相同之处，表结构起始的第一位是个u1类型的标志位（tag），代表着当前常量属于哪种常量类型。

17种常量类型所代表的具体含义如表所示：

| **类型**                         | **标志** | **描述**                       |
| :------------------------------- | :------- | :----------------------------- |
| CONSTANT_Utf8_info               | 1        | UTF-8 编码的字符串             |
| CONSTANT_Integer_info            | 3        | 整型字面量                     |
| CONSTANT_Float_info              | 4        | 浮点型字面量                   |
| CONSTANT_Long_info               | 5        | 长整型型字面量                 |
| CONSTANT_Double_info             | 6        | 双精度浮点型字面量             |
| CONSTANT_Class_info              | 7        | 类或接口的符号引用             |
| CONSTANT_String_info             | 8        | 字符串类型字面量               |
| CONSTANT_Fieldref_info           | 9        | 字段的符号引用                 |
| CONSTANT_Methodref_info          | 10       | 类中方法的符号引用             |
| CONSTANT_InterfaceMethodref_info | 11       | 接口中方法的符号引用           |
| CONSTANT_NameAndType_info        | 12       | 字段或方法的部分符号引用       |
| CONSTANT_MethodHandle_info       | 15       | 表示方法句柄                   |
| CONSTANT_MethodType_info         | 16       | 表示方法类型                   |
| CONSTANT_Dynamic_info            | 17       | 表示一个动态计算常量           |
| CONSTANT_InvokeDynamic_info      | 18       | 表示一个动态方法调用点         |
| CONSTANT_Moudle_info             | 19       | 表示一个模块                   |
| CONSTANT_Package_info            | 20       | 表示一个模块中开放或者导出的包 |

 

我们直接看一下常量池中的17种数据类型的结构总表：

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWfOTibyJzLhdKfDIJ0Sd9UduUn9Yx0DUmUVplWMGTlicpYtupU6n5hOYhFc3RFfh4rEcOibwhMeUjnyA/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)image-20210418173430171

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWfOTibyJzLhdKfDIJ0Sd9UduMade1vouy6IicIVQLjXagjOXvBZZLwwA85sLgL7CWOGBRy42Tgkzayg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)image-20210418173535751

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWfOTibyJzLhdKfDIJ0Sd9UdugKvEVoaGck4eG1wRWo4OJVUHdMtBOVTUONRW6D1juWL2k5JR37JibzQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)image-20210418173624816

### 1.4 访问标志

在常量池结束之后，紧接着的2个字节代表访问标志（access_flags）。

- 这个标志用于识别一些类或者接口层次的访问信息
- 包括：这个Class是类还是接口；是否定义为public类型；是否定义为abstract类型；如果是类的话，是否被声明为final等等。

具体的标志位以及标志的含义如表：

| **标志名称**   | **标志值** | **含义**                                                     |
| :------------- | :--------- | :----------------------------------------------------------- |
| ACC_PUBLIC     | 0x0001     | 是否为 Public 类型                                           |
| ACC_FINAL      | 0x0010     | 是否被声明为 final，只有类可以设置                           |
| ACC_SUPER      | 0x0020     | 是否允许使用 invokespecial 字节码指令的新语义                |
| ACC_INTERFACE  | 0x0200     | 标志这是一个接口                                             |
| ACC_ABSTRACT   | 0x0400     | 是否为 abstract 类型，对于接口或者抽象类来说，次标志值为真，其他类型为假 |
| ACC_SYNTHETIC  | 0x1000     | 标志这个类并非由用户代码产生                                 |
| ACC_ANNOTATION | 0x2000     | 标志这是一个注解                                             |
| ACC_ENUM       | 0x4000     | 标志这是一个枚举                                             |

access_flags中一共有16个标志位可以使用，当前只定义了其中9个，没有使用到的标志位要求一 律为零。

### 1.5 类索引、父类索引与接口索引集合

类索引、父类索引与接口索引集合都是u2类型的，其中接口索引集合是一组u2类型的数据集合

 这三者通常用来确定类的继承关系。

- 类索引用于确定这个**类的全限定名**。
- 父类索引用于确定这个类的**父类的全限定名**。
- 由于Java语言不允许多重继承，所以父类索引只有一个，除了java.lang.Object之外，所有的Java类都有父类，因此除了 java.lang.Object外，所有Java类的父类索引都不为0。

接口索引集合就用来描述这个类实现了哪些接口，这些被实现的接口将按implements关键字后的接口顺序从左到右排列在接口索引集合中。



注：同之前的常量池计数器类似，接口索引集合，入口第一项有u2类型的数据类型的接口计数器，表示索引表的容量。

### 1.6 字段表集合

接口索引结束后，接着是字段表（field_info），

- 字段表用于**描述接口或者类中声明的变量**——这里的`字段（Field）`只包括类级变量以及实例级变量，不包括在方法内部声明的局部变量。
- 字段的名字、被定义成了什么数据类型，这些都是无法确定的，因此通常引用常量池中的常量进行描述。

描述的主要信息包括：

①字段的作用域（public，protected，private修饰）

②是类级变量还是实例级变量（static修饰）

③是否可变（final修饰）

④并发可见性（volatile修饰，是否强制从主从读写）

⑤是否可序列化（transient修饰）

⑥字段数据类型（8种基本数据类型，对象，数组等引用类型）

⑦字段名称

字段表的结构如下：

| 类型           | 名称             | 数量             |
| :------------- | :--------------- | :--------------- |
| u2             | access_flags     | 1                |
| u2             | name_index       | 1                |
| u2             | descriptor_index | 1                |
| u2             | attributes_count | 1                |
| attribute_info | attributes       | attributes_count |

- access_flags是该字段的的访问标志，它和类中的访问标志很类似，用以描述该字段的权限类型：private、protected、public；并发可见性：volatile；可变性：final；

  访问标志详情如下图所示：

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWfOTibyJzLhdKfDIJ0Sd9UduXic7S3xQCVhIzSdMbLhibFcH5TFYFiboZpqKFCnreC1wJrYlurZMDQdibg/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)image-20210419220242129

​		由于Java语法规则的约束，ACC_PUBLIC、ACC_PRIVATE、ACC_PROTECTED三个标志最多只能选择其一，ACC_FINAL、ACC_VOLATILE不能同时选择。接口之中的字段必须有ACC_PUBLIC、ACC_STATIC、ACC_FINAL标志。

- name_index：表示字段的简单名称（简单名称是指没有类型或者参数修饰的方法名称或者字段名称）
- descriptor_index：表示方法描述符（描述符的作用是用来描述字段的数据类型、方法和参数列表、返回值）

### 1.7 方法表集合

方法表的结构如同字段表一样，依次包括访问标志（access_flags）、名称索引（name_index）、描述符索引（descriptor_index）、属性表集合（attributes）几项，如表所示：

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWfOTibyJzLhdKfDIJ0Sd9UdulDhchdsVJJ5dZeUW7Bo1vmFJZ3LDQiciauMZzCNicbecEwPhrw023eKcQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)image-20210419220451611

有区别的部分只有方法访问标志`access_flag`, 因为volatile关键字和transient关键字不能修饰方法。

方法表标志位及其取值如下：

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWfOTibyJzLhdKfDIJ0Sd9UdugF5AVhuOsYwP4bcZ3wdWB5ohQX84kOSppwqBWnVlm9h5y290LTgo3A/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)image-20210419220603688

### 1.8 属性表集合

接下来终于到了最后一项：属性表集合。

前面提到的Class文件、字段表、方法表都可以携带自己的属性表集合，就是引用的这里。

属性表集合中的属性如下所示：

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWfOTibyJzLhdKfDIJ0Sd9UdukL2ZicOJVWhOWxV66ibys8yt6icMGxQ7UQLGcUYdH90L8yX03PYyGgVGQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)image-20210419220806085

![图片](https://mmbiz.qpic.cn/mmbiz_png/PMZOEonJxWfOTibyJzLhdKfDIJ0Sd9UduZg0bmic9vXt3mq1gTKicPVTjnYRFYr6PI23rKbI9vbrKhXWSSIYmib0yQ/640?wx_fmt=png&wxfrom=5&wx_lazy=1&wx_co=1)image-20210419220927662

 属性表集合的属性在此不做过多介绍

