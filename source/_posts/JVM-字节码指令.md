---
title: JVM-字节码指令
date: 2022-03-30 18:10:50
tags:
- JVM
categories:
- Notes
keywords:
description:
top_img:
comments:
cover:https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/202203151833189.jpg 
---

 # JVM 字节码指令

- java虚拟机指令是由一个字节长度的代表着某种特定含义的数字（操作码）组以及跟随其后的0至多个代表此操作所需的参数（操作数）构成。

- 由于限制了Java虚拟机操作码的长度是一个字节。因此指令集中的操作码总数不超过256条。

  在java虚拟机指令集中，大多数指令都包含其操作所对应的数据类型信息。

例如 ：iload指令表明从局部变量表中加载int类型的数据到操作数栈中，同理fload是加载浮点数类型的数据到操作数栈。

​	对于大部分的数据类型相关的字节码指令，他们的操作码助记符中都有特殊字符表明专门为哪种数据类型服务：

 i代表对int类型的数据操作，l代表long，s代表short，b代表byte，c代表char，f代表 float，d代表double，a代表reference。

 当然还有一些指令时和数据类型无关的。

​	JVM主要支持byte、short、int、long、float、double、char、reference集中数据类型，每种数据类型的操作码分别以不同的字母开头。 

 	Java虚拟机指令集支持的数据类型

![image-20220330204336013](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220330204336013.png)

续：

![image-20220330204311916](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20220330204311916.png)

上图列举了Java虚拟机所支持的与数据类型相关的字节码指令，通过使用数据类型列 所代表的特殊字符替换opcode列的指令模板中的T，就可以得到一个具体的字节码指令。如 果在表中指令模板与数据类型两列共同确定的格为空，则说明虚拟机不支持对这种数据类型 执行这项操作。例如，load指令有操作int类型的iload，但是没有操作byte类型的同类指令。

注：大部分的指令都没有支持整数类型byte、char和short，甚至没有任何指令支持boolean类型。编译器会在编译期或运行期将byte和short类型的数据带符号 扩展（Sign-Extend）为相应的int类型数据，将boolean和char类型数据零位扩展（ZeroExtend）为相应的int类型数据。与之类似，在处理boolean、byte、short和char类型的数组时，也会转换为使用对应的int类型的字节码指令来处理。因此，大多数对于boolean、byte、short 和char类型数据的操作，实际上都是使用相应的int类型作为运算类型（Computational Type）。

主要把字节码按照用途大致分成九类。

# 1、加载和存储指令

加载（load）和存储（store）指令用于将数据在栈帧中的局部变量表和操作数栈之间来回传输：

 

这类的主要指令有：

- 将一个局部变量加载到操作栈：iload、iload_<n>、lload、lload_<n>、fload、fload_、dload、 dload_、aload、aload_<n>
- 将一个数值从操作数栈存储到局部变量表：istore、istore_<n>、lstore、lstore_<n>、fstore、 fstore_、dstore、dstore_<n>、astore、astore_<n>
- 将一个常量加载到操作数栈：bipush、sipush、ldc、ldc_w、ldc2_w、aconst_null、iconst_m1、 iconst_<i>、lconst_<l>、fconst_<f>、dconst_<d>
- 扩充局部变量表的访问索引的指令：wide

存储数据的操作数栈和局部变量表主要由加载和存储指令进行操作，除此之外，还有少量指令， 如访问对象的字段或数组元素的指令也会向操作数栈传输数据。

iload_这一类以尖括号结尾的指令，实际上代表了一组指令，例如iload_，它可能代表了iload_0、iload_1、iload_2和iload_3这几条指令，这几条指令表示把第1、2、3个局部变量加载进操作数栈。

# 2、运算指令

算术指令用于对两个操作数栈上的值进行某种特定运算，并把结果重新存入到操作栈顶。大体上运算指令可以分为两种：对整型数据进行运算的指令与对浮点型数据进行运算的指令。

所有的算术指令包括：

- 加法指令：iadd、ladd、fadd、dadd
- 减法指令：isub、lsub、fsub、dsub
- 乘法指令：imul、lmul、fmul、dmul
- 除法指令：idiv、ldiv、fdiv、ddiv 这类的主要指令有：
- 求余指令：irem、lrem、frem、drem
- 取反指令：ineg、lneg、fneg、dneg
- 位移指令：ishl、ishr、iushr、lshl、lshr、lushr
- 按位或指令：ior、lor
- 按位与指令：iand、land
- 按位异或指令：ixor、lxor
- 局部变量自增指令：iinc
- 比较指令：dcmpg、dcmpl、fcmpg、fcmpl、lcmp

# 3、类型转换指令

类型转换指令可以将两种不同的数值类型相互转换，这些转换操作有两个作用：

- 显示类型操作转换
- 字节码指令不支持的类型转换

类型转换指令主要分为两种：

1）宽化，小类型向大类型转换，比如 `int–>long–>float–>double`，对应的指令有：i2l、i2f、i2d、l2f、l2d、f2d。

- 从 int 到 long，或者从 int 到 double，是不会有精度丢失的；
- 从 int、long 到 float，或者 long 到 double 时，可能会发生精度丢失；
- 从 byte、char 和 short 到 int 的宽化类型转换实际上是隐式发生的，这样可以减少字节码指令，毕竟字节码指令只有 256 个，占一个字节。

2）窄化，大类型向小类型转换，比如从 int 类型到 byte、short 或者 char，对应的指令有：i2b、i2s、i2c；从 long 到 int，对应的指令有：l2i；从 float 到 int 或者 long，对应的指令有：f2i、f2l；从 double 到 int、long 或者  float，对应的指令有：d2i、d2l、d2f。

- 窄化很可能会发生精度丢失，毕竟是不同的数量级；
- 但 Java 虚拟机并不会因此抛出运行时异常。

# 4、对象创建与访问指令

在前面我们已经接触过了对象创建的指令。

ava虚拟机对类实例和数组的创建与操作使用了不同的字节码指令。对象创建后，就可以通过对象访问指令获取对象实例或者数组实例中的字段或者数组元素，这些指令包括：

- 创建类实例的指令：new
- 创建数组的指令：newarray、anewarray、multianewarray
- 访问类字段（static字段，或者称为类变量）和实例字段（非static字段，或者称为实例变量）的指令：getfield、putfield、getstatic、putstatic
- 把一个数组元素加载到操作数栈的指令：baload、caload、saload、iaload、laload、faload、 daload、aaload
- 将一个操作数栈的值储存到数组元素中的指令：bastore、castore、sastore、iastore、fastore、 dastore、aastore
- 取数组长度的指令：arraylength
- 检查类实例类型的指令：instanceof、checkcast

# 5、操作数栈管理指令

如同操作一个普通数据结构中的堆栈那样，Java虚拟机提供了一些用于直接操作操作数栈的指令，包括：

- 将操作数栈的栈顶一个或两个元素出栈：pop、pop2
- 复制栈顶一个或两个数值并将复制值或双份的复制值重新压入栈顶：dup、dup2、dup_x1、dup2_x1、dup_x2、dup2_x2
- 将栈最顶端的两个数值互换：swap

# 6、控制转移指令

控制转移指令可以让Java虚拟机有条件或无条件地从指定位置指令（而不是控制转移指令）的下一条指令继续执行程序，从概念模型上理解，可以认为控制指令就是在有条件或无条件地修改PC寄存器的值。

控制转移指令包括：

- 条件分支：ifeq、iflt、ifle、ifne、ifgt、ifge、ifnull、ifnonnull、if_icmpeq、if_icmpne、if_icmplt、 if_icmpgt、if_icmple、if_icmpge、if_acmpeq和if_acmpne
- 复合条件分支：tableswitch、lookupswitch
- 无条件分支：goto、goto_w、jsr、jsr_w、ret

在Java虚拟机中有专门的指令集用来处理int和reference类型的条件分支比较操作，为了可以无须明显标识一个数据的值是否null，也有专门的指令用来检测null值。

# 7、方法调用和返回指令

方法调用在后面会学到，我们这里只是了解一下方法调用的一些指令：

- invokevirtual指令：用于调用对象的实例方法，根据对象的实际类型进行分派（虚方法分派）， 这也是Java语言中最常见的方法分派方式。
- invokeinterface指令：用于调用接口方法，它会在运行时搜索一个实现了这个接口方法的对象，找出适合的方法进行调用。
- invokespecial指令：用于调用一些需要特殊处理的实例方法，包括实例初始化方法、私有方法和父类方法。
- invokestatic指令：用于调用类静态方法（static方法）。
- invokedynamic指令：用于在运行时动态解析出调用点限定符所引用的方法。并执行该方法。前面四条调用指令的分派逻辑都固化在Java虚拟机内部，用户无法改变，而invokedynamic指令的分派逻辑 是由用户所设定的引导方法决定的。

方法调用指令与数据类型无关，而方法返回指令是根据返回值的类型区分的，包括ireturn（当返回值是boolean、byte、char、short和int类型时使用）、lreturn、freturn、dreturn和areturn，另外还有一条return指令供声明为void的方法、实例初始化方法、类和接口的类初始化方法使用。

# 8、异常处理指令

在Java程序中显式抛出异常的操作（throw语句）都由athrow指令来实现，除了用throw语句显式抛出异常的情况之外，《Java虚拟机规范》还规定了许多运行时异常会在其他Java虚拟机指令检测到异常状况时自动抛出。例如当除数为零时，虚拟机会在idiv或ldiv指令中抛出 ArithmeticException异常。

而在Java虚拟机中，处理异常（catch语句）不是由字节码指令来实现的（很久之前曾经使用jsr和ret指令来实现，现在已经不用了），而是采用异常表来完成。

# 9、同步指令

Java虚拟机可以支持方法级的同步和方法内部一段指令序列的同步，这两种同步结构都是使用管程（Monitor，更常见的是直接将它称为“锁”）来实现的。

方法级的同步是隐式的，无须通过字节码指令来控制，它实现在方法调用和返回操作之中。虚拟机可以从方法常量池中的方法表结构中的ACC_SYNCHRONIZED访问标志得知一个方法是否被声明为同步方法。当方法调用时，调用指令将会检查方法的ACC_SYNCHRONIZED访问标志是否被设置，如果设置了，执行线程就要求先成功持有管程，然后才能执行方法，最后当方法完成（无论是正常完成还是非正常完成）时释放管程。在方法执行期间，执行线程持有了管程，其他任何线程都无法再获取到同一个管程。如果一个同步方法执行期间抛出了异常，并且在方法内部无法处理此异常，那这个同步方法所持有的管程将在异常抛到同步方法边界之外时自动释放。

 

同步一段指令集序列通常是由Java语言中的synchronized语句块来表示的，Java虚拟机的指令集中有monitorenter和monitorexit两条指令来支持synchronized关键字的语义，正确实现synchronized关键字需要Javac编译器与Java虚拟机两者共同协作支持。

例如一段代码：

```
    void onlyMe(String f) {
        synchronized (f) {
            System.out.println(f);
        }
    }
```

编译后查看字节码指令：

```
         0: aload_1                          
         1: dup                              
         2: astore_2                         
         3: monitorenter                     // 以栈顶元素作为锁，开始同步
         4: getstatic     #2                 
         7: aload_1                          
         8: invokevirtual #3                 
        11: aload_2
        12: monitorexit                     // 退出同步
        13: goto          21
        16: astore_3
        17: aload_2
        18: monitorexit
        19: aload_3
        20: athrow
        21: return
```
