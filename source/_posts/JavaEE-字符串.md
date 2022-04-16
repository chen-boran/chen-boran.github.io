# 字符串

Java中的String类包含了50多个方法。 绝大多数都很有用，可以设想使用的频繁非常高。下面的API注释汇总了一部分最常用的方法。

java.lang.string 1.0

● char charAt (int index)返回给定位置的代码单元。除非对底层的代码单元感兴趣，否则不需要调用这个方法。

● int codePointAt(int index) 5.0返回从给定位置开始的码点。

● int offsetByCodePoints(int startIndex, int cpCount) 5.0返回从startIndex代码点开始，位移cpCount后的码点索引。

● int compareTo(String other)按照字典顺序，如果字符串位于other之前，返回一个负数；如果字符串位于other之后，返回一个正数；如果两个字符串相等，返回0。

● IntStream codePoints() 8将这个字符串的码点作为一个流返回。调用toArray将它们放在一个数组中。

● new String(int[ ] codePoints, int offset, int count) 5.0用数组中从offset开始的count个码点构造一个字符串。

● boolean equals(Object other)如果字符串与other相等，返回true。

● boolean equalsIgnoreCase(String other)如果字符串与other相等（忽略大小写），返回true。

● boolean startsWith(String prefix)

● boolean endsWith(String suffix)如果字符串以suffix开头或结尾，则返回true。

● int index0f(String str)

● int index0f(String str, int fromIndex)

● int index0f(int cp)

● int index0f(int cp, int fromIndex)返回与字符串str或代码点cp匹配的第一个子串的开始位置。这个位置从索引0或fromIndex开始计算。如果在原始串中不存在str，返回-1。

● int lastIndex0f(String str)

● int lastIndex0f(String str, int fromIndex)

● int lastindex0f(int cp)

● int lastindex0f(int cp, int fromIndex)返回与字符串str或代码点cp匹配的最后一个子串的开始位置。这个位置从原始串尾端或fromIndex开始计算。

● int length( )返回字符串的长度。

● int codePointCount(int startIndex, int endIndex) 5.0返回startIndex和endIndex-1之间的代码点数量。没有配成对的代用字符将计入代码点。

● String replace(CharSequence oldString, CharSequence newString)返回一个新字符串。这个字符串用

newString代替原始字符串中所有的oldString。可以用String或StringBuilder对象作为CharSequence参数。

● String substring(int beginIndex)

● String substring(int beginIndex, int endIndex)返回一个新字符串。这个字符串包含原始字符串中从beginIndex到串尾或endIndex-1的所有代码单元。

● String toLowerCase( )

● String toUpperCase( )返回一个新字符串。这个字符串将原始字符串中的大写字母改为小写，或者将原始字符串中的所有小写字母改成了大写字母。

● String trim( )返回一个新字符串。这个字符串将删除了原始字符串头部和尾部的空格。

● String join(CharSequence delimiter, CharSequence... elements) 

返回一个新字符串，用给定的定界符连接所有元素。



当然也可以使用联机文档：浏览器访问：docs/api/index.html

## String类



![image-20220410223052516](/home/cbr/Documents/Blog/chen-boran.github.io/source/_posts/image-20220410223052516.png)

## 常见问题

### Stringbuilder和Stringbuffer的区别？



 1.可变性：只有 String 不可变 

2.安全性：只有 StringBuilder 不是线程安全的，StringBuffer 是线程安全的，内部使 用 synchronized 进行同步  

**String 不可变的原因：** 

被声明为 final，因此它不可被继承。(Integer 等包装类也不能被继承）

String 类和其存储 数据的成员变量 value 字节数组都是 final 修饰的。

对一个 String 对象的任何修改实际上 都是创建一个新 String 对象，再引用该对象。只是修改 String 变量引用的对象，没有修改 原 String 对象的内容。

 **2. String 不可变的好处**： 

（1）可以作为 hashmap 的 key 

（2）String Pool 的需要 

（3）安全性，经常作为参数，保证不可变 

（4）线程安全 3. 字符串拼接的方式



