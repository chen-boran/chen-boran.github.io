# 集合

集合是用来存放某种对象的。集合类有一个共同的特点。它们只容纳对象。集合容纳的对象都是Object的实例，集合类中存放的是指向Object的对象的指针。


 ## Collection 集合
 Collection 是最基本的集合接口，一个Collection 代表一组 Object，即 Collection 的元素（elements）.一些Collection 允许相同的元素而另一些不行。一些能排序而另一些不行.Java SDK不提供直接继承自 Callection 的类，Java SDK 提供的类都是维承自Collection的“子接口”，如List和Set所有实现 Collection 接口的类都必须提供两个标准的构造函数：无参数的构造函数用于创建一个空的 Collection：有一个Collection 参数的构造函数用于创建一个新的 Collection，这个新的 Collection 与传入的Collection 有相同的元素。后一个构造函数允许用户复制一个
Collection

**如何遍历 Collection 中的每一个元素？**

不论 Collection 的实际类型如何，它都支持一个
**iterator**方法，该方法返回一个送代子，使用该送代子即可逐一访问 Collection 中每一个元素。
典型的用法如下：
获得一个选代子
Iterator itcolleton.lcerator；
while(1t.hasNexc0）
//得到下一个元素
object obj t.next（）；

**Iterator和ListIterator的区别？**



-  首先 ListIterator是继承Iterator
   public interface Listiterator extends Iterator 

-   1.Iterator 迭代器包含的方法

  - hasNVext0):如果迭代器指向位置后面还有元素，则返回true,否则返回false
  - nex（）:返回集合中Iterator指向位置后面的元素。
  - remove（）:删除集合中 Iterator指向位置后面的元素。

   

- Listlterator迭代器包含的方法 

  - add(E  e):将指定的元素插入列表，插入位置为迭代器当前位置之前。
  - hasNex（）：以正向遍历列表时，如果列表迭代器后面还有元素，则返回true,否则返回false.
  - hasPrevious（）:如果以逆向遍历列表，列表迭代器前面还有元素，则返回true,否则返回false.
  - next0:返回列表中 Listlterator指向位置后面的元素。
  - nextIndex0:返回列表中 ListIterator所需位置后面元素的索引。
  - previous(:返回列表中 Listlterator指向位置前面的元素。
  - previousIndex():返回列表中 Listlterator所需位置前面元素的索引。
  - remove （）：同上
  - set(Ee):从列表中将next(或previous(返回的最后一个元素更改为指定元素 

- 不同点

  （1)使用范围不同，Iterator可以应用于所有的集合，Set、List和Map这些集合的子类型；而Listlterator只能

  用于List及其子类型。

  （2)Listlterator有add0方法，可以向List中添加对象，而Iterator不能。

  （3)Listlterator 和Iterator 都有 hasNexi0和nex10方法，可以实现顺序向后遍历，但是Listlterator 有 

  hasPrevious0和previous0方法，可以实现逆向（顺序向前）遍历，而Iterator不可以。

  （4)Listlterator可以定位当前索引的位置，用nextIndex0和previouslndex0可以实现。Iterator没有此功能。

  （5)都可实现删除操作，但是Listlterator可以实现对对象的修改，用set0方法可以实现。Iterator仅能遍历，

  不能修改。



### List接口

List 是有序的 Collection，使用此接口能够精确地控制每个元素插入的位置。用户能够使用索引（元素在 List 中的位置，类似于数组下标）来访问 List 中的元素，这类似于Java 的数组。
 除了具有Collection 接口必备的iterator方法外，List还提供一个 listteratoro方法，返回一个Listterator 接口，和标准的 Iterator接口相比，Lisuterator 多了一些 add之类的方法，允许添加、删除、设定元素，还能向前或向后遍历。
实现 List 接口的常用类有 LinkedList、ArrayList、Vector 和 Stack。

LIst集合的遍历？

遍历方式有以下几种：

- for循环遍历
- foreach遍历
- 迭代器遍历：Iterator

 #### LinkList

LinkedList实现了List接口，允许null元素。此外LinkedList提外的geto、removeo.insen0方法在 LinkedList的首部或尾部。这些操作使 LinkedList 可被用作堆栈（stack)、（queue)或双向队列（deque). 
☆注意☆ LinkedList没有同步方法。如果多个线程同时访问一个List,则必须自己实现访问同步。一种解决方法是在创建 Liu时构造一个同步的List:List l1st-Collections.synchronizedList (new LinkedList (··) ) ;

#### ArrayList

ArrayList实现了可变大小的数组。它允许所有元素，包括null.ArrayList没有同步。sizc0、isEmpty0、get0、sct0方法运行时间为常数。但是addO方法开销为分摊的常数，添加n个元素需要O(n)的时间。其他的方法运行时间为线性。每个 ArrayList 实例都有一个容量（capacity),即用于存储元素的数组的大小。这个容量可随着不断添加新元素而自动增加，但是增长算法并没有定义。当需要插入大量元素时，在插入前可以调用ensureCapacity0方法来增加ArrayList的容量以提高插入效率。和LinkedList一样，ArrayList也是非同步的（unsynchronized).

#### Vector

Vector非常类似于ArrayList,但是Vector是同步的。

由Vector创建的Iterator虽然和ArrayList创建的Iterator是同一接口，但是，因为Vector是同步的，当一个Iterator

被创建而且正在被使法时将抛出 ConcurentModificationException,因此必须捕获该异常。

#### Stack

Stack 继承自Vector,实现一个后进先出的堆栈。Stack提供5个额外的方法使得 Vector得以被当作堆栈使用。基本的有push0和pop0方法，还有peek0方法得到栈顶的元素，empty0方法测试堆栈是否为空，searchO方法检测一个元素在堆栈中的位置。

Stack刚创建后是空栈。

### Set接口

Set是一种不包含重复的元素的集合，即任意的两个元素el和c2都有cl.equals(e2)=false.Set最多有一个null元素。很明显，Set的构造函数有一个约束条件，传入的Collection参数不能包含重复的元素。☆注意☆ 必须小心操作可变对象（mutable object),如果一个Set中的可变元素改变了自身状态导致 Object.equals(Object)=true将会出现一些问题。

### Map接口

需要注意的是Map 没有继承 Collection接口，Map提供key到value的映射。一个Map中不能包含相同的key,

每个key只能映射一个value.Map接口提供3种集合的视图，Map的内容以被当作一组key集合、一组value集合，

或者一组 key-value映射。

#### HashTable

继承Map接口，实现一个Key-Value映射的hashTable。

- key和Value不允许是空对象。

- 添加数据使用put(key,value),取出数据使用get(key), 

- 由于作为key的对象将通过计算其哈希函数来确定与之对应的value的位置，因此任何作为key的对象都必须实现hashCode0和equals0方法。

- hashCode0和equals0方法继承自根类Object.objl.equals(obj2)=true,则它们的哈希码必须相同；

- 如果两个对象不同，则它们的哈希码不一定不同。

- 如果两个不同对象的哈希码相同，这种现象称为冲突，冲突会导致操作 HashTable的时间开销增大，所以尽量定义好的hashCode0方法，能加快HashTable的操作。

- 如果相同的对象有不同的哈希码，对HashTable的操作会出现意想不到的结果（期待的get0方法返回null),要避免这种问题，只需要牢记一条：**要同时复写equals0方法和hashCode0方法，而不要只写其中一个**。

- **HashTable是同步的。**

#### HashMap类

HashMap和HashTable类似，不同之处在于HashMap是**非同步**的。

并且允许null,即null value和null key. 



 **HashMap 底层数据结构+扩容机制**

 

  HashMap 原理 HashMap 在底层数据结构上采用了数组＋链表＋红黑树，通过散列映射来存储键值对数据 因

为在查询上使用散列码（通过键生成一个数字作为数组下标，这个数字就是 hash code） 所以在查询上的访问速

度比较快，HashMap 最多允许一对键值对的 Key 为 Null，允许多对键 值对的 value 为 Null。它是非线程安全

的。在排序上面是无序的。 transient int size：表示当前 HashMap 包含的键值对数量 transient int 

modCount：表示当前 HashMap 修改次数 int threshold：表示当前 HashMap 能够承受的最多的键值对数量，

一旦超过这个数量 HashMap 就会进行扩容 final float loadFactor：负载因子，用于扩容 static final int 

DEFAULT_INITIAL_CAPACITY = 1 << 4：默认的 table 初始容量 static final float DEFAULT_LOAD_FACTOR = 

0.75f：默认的负载因子 static final int TREEIFY_THRESHOLD = 8: 链表长度大于该参数转红黑树 static final int 

UNTREEIFY_THRESHOLD = 6: 当树的节点数小于等于该参数转成链表  动态扩容 假设 hashmap 的 table 长度是 

m（默认初始长度为 16，并且每次扩展或者手动初始化时， 长度必须是 2 的幂），键值对为 n。每个链表长度为 

n/m，为了使查找成本尽可能的小， 要 m 尽可能的大。可以使用 resize 实现。

 

**HashMap和HashTable有什么区别 ？**

 1.父类不同

（1)HashMap是继承自 AbstractMap类，而HashTable是继承自 Dictionary.

不过它们都同时实现了Map、Cloneable(可复制）、Serializable(可序列化）这三个接口。（

2)HashTable比HashMap 多提供了elments(和contains(两个方法。

（3)elments0方法继承自 HashTable 的父类 Dictionnary.elements()方法用于返回此HashTable中的value的枚举。

（4)contains(0方法判断该HashTable是否包含传入的value,它的作用与containsValuco-致。事实上contansValueO就只是调用了一下contains0方法。

2.null 值问题

（1)HashTable既不支持null key也不支持 null value.HashTable的put0方法的注释中有说明。 

（2)HashMap中，null可以作为键，这样的键只有一个；

3.线程安全性

（1)HashTable是线程安全的，它的每个方法中都加入了synchronize0方法。 

（2)HashMap不是线程安全的，在多线程并发的环境下，可能会产生死锁等问题。 虽然HashMap不是线程安全的，但是它的效率会比HashTable要高很多。 

4.遍历方式不同

（1)HashTable、HashMap都使用了Iterator.而由于历史原因，HashTable还使用了Enumeration的方式。

（2)HashMap的Iterator是fail-fast迭代器。当有其他线程改变了HashMap的结构（增加、删除、修改元素），将会抛出 ConcurrentModificationException.不过，通过Iterator的remove0方法移除元素则不会抛出 ConcurrentModificationException异常。 

​	在JDK8及以后的版本中，HashTable也是使用fast-fail的。 

5.初始容量不同

HashTable的初始长度是11,之后每次扩充容量变为之前的2"+1(n为上一次的长度），

HashMap的初始长度为16,之后每次扩充变为原来的两倍。

创建时，如果给定了容量初始值，那么HashTable会直接使用给定的大小，而HashMap会将其扩充为2的幂次方大小。 

6.计算哈希值的方法不同

为了得到元素的位置，首先需要根据元素的key值计算出一个哈希值，然后再用这个哈希值来计算得到最终的位置。 
HashTable 直接使用对象的哈希码，哈希码是JDK根据对象的地址或者字符串或者数字算出来的int类型的数值，然后再使用除留余数法来获得最终的位置，然而除法运算是非常耗费时间的。HashMap为了提高计算效率，将HashTable的大小固定为2的幂，这样在取模计算时，不需要做除法，只需要做位运算。位运算比除法的效率要高很多。 

**ArrayList 和 LinkedList 区别** ?

1、ArrayList 是基于动态数组实现的，LinkedList 是基于双向链表实现的 

2、ArrayList 支持随机访问，查询速度快，LinkedList 访问数据的平均效率低，需要对链表进 行遍历 

3、ArrayList 删除和插入非尾部元素时候代价高，需要移动大量元素，LinkedList 的删除和插 入只需要改变指针。

 **ArrayList 的底层实现** 

 以数组实现，节约空间，但数组有容量限制。超出限制时会增加 50%容量，用 System.arraycopy()复制到新的数组，因此最好能给出数组大小的预估值。

默认第一次插入元素时创建大小为 10 的数组。 ArrayList 是一个相对来说比较简单的数据结构，最重 要的一点就是它的自动扩容， 可以认为就是我们常说的“动态数组”。

  按数组下标访问元素—get(i)/set(i,e) 的性能很高，这是数组的基本优势。

  直接在数组末尾加入元素—add(e)的性能也高，但如果按下标插入、删除元素 —add(i,e), remove(i), remove(e)，则要用 System.arraycopy()来移动部分受影 响的元素，性能就变 差了，这是基本劣势。 

 ArrayList 是容量可变的非线程安全列表，使用数组实现，集合扩容时会创建更大的数组， 把原有数组复制到新数组。

支持对元素的快速随机访问，但插入与删除速度很慢。

 ArrayList 实现了 RandomAcess 标记接口，如果一个类实现了该接口，那么表示使用索 引遍历比迭代器更快。elementData 是 ArrayList 的数据域，被 transient 修饰，序列化 时会调用 writeObject 写入流，反序列化时调用 readObject 重新赋值到新对象的 elementData。

原因是 elementData 容量通常大于实际存储元素的数量，所以只需发送 真正有实际值的数组元素。

size 是当前实际大小，elementData 大小大于等于 size。 *modCount *记录了 ArrayList 结构性变化的次数，继承自 AbstractList。

所有涉及结构 变化的方法都会增加该值。expectedModCount 是迭代器初始化时记录的 modCount 值，每次访问新元素时都会检查 modCount 和 expectedModCount 是否相等，不相等 就会抛出异常。

这种机制叫做 fail-fast，所有集合类都有这种机制。

 **LinkedList 的底层实现** 

 以双向链表实现。链表无容量限制，但双向链表本身使用了更多空间，也需要额外的链 表指针操作。 

 按下标访问元素—get(i)/set(i,e) 要悲剧的遍历链表将指针移动到位(如果 i>数组 大小的 一半，会从末尾移起)。

  插入、删除元素时修改前后节点的指针即可，但还是要遍历部分链表的指针才 能移动 到下标所指的位置，只有在链表两头的操作—add()，addFirst()， removeLast()或用 iterator()上的 remove()能省掉指针的移动。

  LinkedList 本质是双向链表，与 ArrayList 相比插入和删除速度更快，但随机访问元素很 慢。除继承 AbstractList 外还实现了 Deque 接口，这个接口具有队列和栈的性质。成 员变量被 transient 修饰，原理和 ArrayList 类似。LinkedList 包含三个重要的成员：size、 first 和 last。size 是双向链表中节点的个数，first 和 last 分别指向首尾节点的引用。 

LinkedList 的优点在于可以将零散的内存单元通过附加引用的方式关联起来，形成按链 路顺序查找的线性结构，内存利用率较高。









hashmap的具体实现参考了一篇博客：

[Hashmap实现](http://fangjian0423.github.io/2016/03/29/jdk_hashmap/?hmsr=toutiao.io&utm_campaign=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)

[java集合](http://fangjian0423.github.io/2016/03/29/jdk_hashmap/?hmsr=toutiao.io&utm_campaign=toutiao.io&utm_medium=toutiao.io&utm_source=toutiao.io)

 

