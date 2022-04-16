泛型在java中有很重要的地位，无论是开源框架还是JDK源码都能看到它。

**毫不夸张的说，泛型是通用设计上必不可少的元素，所以真正理解与正确使用泛型，是一门必修课。**



1、泛型（Generic type 或者 generics）定义 泛型是对 Java 语言的类型系统的一种扩展，以支持创建可以按类型进行参数化的类。可以 把类型参数看作是使用参数化类型时指定的类型的一个占位符，就像方法的形式参数是运行 恐涉侵权，请勿传播 227 时传递的值的占位符一样。允许在定义接口、类时声明类型形参，类型形参在整个接口、类 体内可当成类型使用，几乎所有可使用普通类型的地方都可以使用这种类型形参。 2、泛型的目的 Java 泛型就是把一种语法糖（在计算机语言中添加的某种语法，这种语法对语言的功能并 没有影响，但是更方便程序员使用。Java 中最常用的语法糖主要有泛型、变长参数、条件编 译、自动拆装箱、内部类等。），通过泛型使得在编译阶段完成一些类型转换的工作，避免 在运行时强制类型转换而出现 ClassCastException ，即类型转换异常。 3、泛型的好处： ①类 型 安 全 。 类 型 错 误 现 在 在 编 译 期 间 就 被 捕 获 到 了 ， 而 不 是 在 运 行 时 当 作 java.lang.ClassCastException 展示出来，将类型检查从运行时挪到编译时有助于开发者更容易 找到错误，并提高程序的可靠性。 ②消除了代码中许多的强制类型转换，增强了代码的可读性，编码阶段就显式知道泛型集 合、泛型方法等处理的对象类型。 ③ 代码重用，合并了同类型的处理代码。 4、Java 的泛型是如何工作的 ? 什么是类型擦除 ? 泛型是通过类型擦除来实现的，编译器在编译时擦除了所有类型相关的信息，所以在运行时 不存在任何类型相关的信息。例如 List在运行时仅用一个 List 来表示。这样做的目的， 是确保能和 Java 5 之前的版本开发二进制类库进行兼容。你无法在运行时访问到类型参数， 因为编译器已经把泛型类型转换成了原始类型。因为不管为泛型的类型形参传入哪一种类型 实参，对于 Java 来说，它们依然被当成同一类处理，在内存中也只占用一块内存空间。从 Java 泛型这一概念提出的目的来看，其只是作用于代码编译阶段，在编译过程中，对于正确 检验泛型结果后，会将泛型的相关信息擦出，也就是说，成功编译过后的 class 文件中是不 包含任何泛型信息的。泛型信息不会进入到运行时阶段。在静态方法、静态初始化块或者静 态变量的声明和初始化中不允许使用类型形参。由于系统中并不会真正生成泛型类，所以 instanceof 运算符后不能使用泛型类。 5、什么是泛型中的限定通配符和非限定通配符 限定通配符对类型进行了限制。有两种限定通配符，一种是可以接受任何继承 自 T 的类型的 List，它通过确保类型必须是 T 的子类来设定类型的上界，另一种是 可以接受任何 T 的父类构成的 List，它通过确保类型必须是 T 的父类来设定类型的下界。泛 型类型必须用限定内的类型来进行初始化，否则会导致编译错误。另一方面表示了非限 定通配符，因为可以用任意类型来替代。



7、类型擦除后保留的原始类型 原始类型就是擦除去了泛型信息，最后在字节码中的类型变量的真正类型，无论何时定义一 个泛型，相应的原始类型都会被自动提供，类型变量擦除，并使用其限定类型（无限定的变 量用 Object）替换。 8、类型擦除引起的问题及解决方法 Java 不能实现真正的泛型，只能使用类型擦除来实现伪泛型，这样虽然不会有类型膨胀问题， 但是也引起来许多新问题，所以，SUN 对这些问题做出了种种限制，避免我们发生各种错误。 （1）先检查，再编译以及编译的对象和引用传递问题 Q: 既然说类型变量会在编译的时候擦除掉，那为什么我们往 ArrayList 创建的对象中添加整 数会报错呢？不是说泛型变量String会在编译的时候变为Object类型吗？为什么不能存别的 类型呢？既然类型擦除了，如何保证我们只能使用泛型变量限定的类型呢？ A: Java 编译器是通过先检查代码中泛型的类型，然后在进行类型擦除，再进行编译。因为类 型检查就是编译时完成的，new ArrayList()只是在内存中开辟了一个存储空间，可以存储任 何类型对象，而真正设计类型检查的是它的引用，因为我们是使用它引用 list1 来调用它的 方法，比如说调用 add 方法，所以 list1 引用能完成泛型类型的检查。而引用 list2 没有使用 泛型，所以不行。 （2）自动类型转换 因为类型擦除的问题，所以所有的泛型类型变量最后都会被替换为原始类型。 既然都被替换为原始类型，那么为什么我们在获取的时候，不需要进行强制类型转换呢？ 在 ArrayList.get()方法中 public E get(int index) { RangeCheck(index); return (E) elementData[index]; } 可以看到，在 return 之前，会根据泛型变量进行强转。假设泛型类型变量为 Date，虽然泛 型信息会被擦除掉，但是会将(E)elementData[index]，编译为(Date)elementData[index]。所以 我们不用自己进行强转。当存取一个泛型域时也会自动插入强制类型转换。假设 Pair 类的 value 域是 public 的，那么表达式：Date date = pair.value; 也会自动地在结果字节码中插入强 制类型转换。 （3）类型擦除与多态的冲突和解决方法 虚拟机并不能将泛型类型变为 Date，只能将类型擦除掉，变为原始类型 Object。可是类型 擦除后，只能变为了重载。这样，类型擦除就和多态有了冲突。 解决方法：JVM 采用了一个特殊的方法，来完成这项功能，那就是桥方法。 用 javap -c className 的方式反编译下 DateInter 子类的字节码，从编译的结果来看，重写 setValue 和 getValue 方法的子类，竟然有 4 个方法，其实不用惊奇，最后的两个方法，就是 编译器自己生成的桥方法。可以看到桥方法的参数类型都是 Object，也就是说，子类中真正 覆盖父类两个方法的就是这两个我们看不到的桥方法。而打在我们自己定义的 setvalue 和 getValue 方法上面的@Oveerride 只不过是假象。而桥方法的内部实现，就只是去调用我们自 己重写的那两个方法。 所以，虚拟机巧妙的使用了桥方法，来解决了类型擦除和多态的冲突。 不过，要提到一点，这里面的 setValue 和 getValue 这两个桥方法的意义又有不同。 恐涉侵权，请勿传播 229 setValue 方法是为了解决类型擦除与多态之间的冲突。 而 getValue 却有普遍的意义，怎么说呢，如果这是一个普通的继承关系。 子类中的巧方法 Object getValue()和 Date getValue()是同 时存在的，可是如果是常规的两个 方法，他们的方法签名是一样的，也就是说虚拟机根本不能分别这两个方法。如果是我们自 己编写 Java 代码，这样的代码是无法通过编译器的检查的，但是虚拟机却是允许这样做的， 因为虚拟机通过参数类型和返回类型来确定一个方法，所以编译器为了实现泛型的多态允许 自己做这个看起来“不合法”的事情，然后交给虚拟器去区别。 （4）泛型类型变量不能是基本数据类型 不能用类型参数替换基本类型。就比如，没有 ArrayList，只有 ArrayList。 因为当类型擦除后，ArrayList 的原始类型变为 Object，但是 Object 类型不能存储 double 值， 只能引用 Double 的值。 （5）泛型在静态方法和静态类中的问题 泛型类中的静态方法和静态变量不可以使用泛型类所声明的泛型类型参数。 public class Test2 { public static T one; //编译错误 public static T show(T one){ //编译错误 return null; } } 因为泛型类中的泛型参数的实例化是在定义对象的时候指定的，而静态变量和静态方法不需 要使用对象来调用。对象都没有创建，如何确定这个泛型参数是何种类型，所以当然是错误 的。 但是要注意区分下面的一种情况： public class Test2 { public static T show(T one){ //这是正确的 return null; } } 因为在泛型方法中使用的 T 是自己在方法中定义的 T，而不是泛型类中的 T。







## 一：泛型本质

Java 泛型（generics）是 JDK 5 中引入的一个新特性, 泛型提供了编译时类型安全检测机制，该机制允许程序员在编译时检测到非法的类型。

**泛型的本质是参数化类型**，即给类型指定一个参数，然后在使用时再指定此参数具体的值，那样这个类型就可以在使用时决定了。这种参数类型可以用在类、接口和方法中，分别被称为泛型类、泛型接口、泛型方法。

![图片](/home/cbr/Documents/Blog/chen-boran.github.io/source/_posts/640.png)

## 二：为什么使用泛型

泛型的好处是在编译的时候检查类型安全，并且所有的强制转换都是自动和隐式的，提高代码的重用率。

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

**（1）保证了类型的安全性。**

在没有泛型之前，从集合中读取到的每一个对象都必须进行类型转换，如果不小心插入了错误的类型对象，在运行时的转换处理就会出错。

比如：没有泛型的情况下使用集合：

```
public static void noGeneric() {ArrayList names = new ArrayList();names.add("mikechen的互联网架构");names.add(123); //编译正常}
```

有泛型的情况下使用集合：

```
public static void useGeneric() {ArrayList<String> names = new ArrayList<>();names.add("mikechen的互联网架构");names.add(123); //编译不通过}
```

有了泛型后，定义好的集合names在编译的时候add(123)就会编译不通过。

相当于告诉编译器每个集合接收的对象类型是什么，编译器在编译期就会做类型检查，告知是否插入了错误类型的对象，使得程序更加安全，增强了程序的健壮性。

**（2） 消除强制转换**

泛型的一个附带好处是，消除源代码中的许多强制类型转换，这使得代码更加可读，并且减少了出错机会。
还是举例说明，以下没有泛型的代码段需要强制转换：

```
List list = new ArrayList();list.add("hello");String s = (String) list.get(0);
```

当重写为使用泛型时，代码不需要强制转换：

```
List<String> list = new ArrayList<String>();list.add("hello");String s = list.get(0); // no cast
```

**（3）避免了不必要的装箱、拆箱操作，提高程序的性能**

在非泛型编程中，将筒单类型作为Object传递时会引起Boxing（装箱）和Unboxing（拆箱）操作，这两个过程都是具有很大开销的。引入泛型后，就不必进行Boxing和Unboxing操作了，所以运行效率相对较高，特别在对集合操作非常频繁的系统中，这个特点带来的性能提升更加明显。

泛型变量固定了类型，使用的时候就已经知道是值类型还是引用类型，避免了不必要的装箱、拆箱操作。

```
object a=1;//由于是object类型，会自动进行装箱操作。 int b=(int)a;//强制转换，拆箱操作。这样一去一来，当次数多了以后会影响程序的运行效率。
```

使用泛型之后

```
public static T GetValue<T>(T a) {　　return a;} public static void Main() {　　int b=GetValue<int>(1);//使用这个方法的时候已经指定了类型是int，所以不会有装箱和拆箱的操作。}
```

**（4）提高了代码的重用性。**

 

## 三：如何使用泛型

泛型有三种使用方式，分别为：泛型类、泛型接口和泛型方法。

![图片](/home/cbr/Documents/Blog/chen-boran.github.io/source/_posts/640-16497881013771.png)

### 1、泛型类

泛型类：把泛型定义在类上

定义格式：
![图片](/home/cbr/Documents/Blog/chen-boran.github.io/source/_posts/640-16497881013772.png)

```
public class 类名 <泛型类型1,...> {    }
```

注意事项：泛型类型必须是引用类型（非基本数据类型）

定义泛型类，在类名后添加一对尖括号，并在尖括号中填写类型参数，参数可以有多个，多个参数使用逗号分隔：

public class GenericClass<ab,a,c> {}

当然，这个后面的参数类型也是有规范的，不能像上面一样随意，通常类型参数我们都使用大写的单个字母表示：

> T：任意类型 type
> E：集合中元素的类型 element
> K：key-value形式 key
> V：key-value形式 value
> 示例代码：

泛型类：

```
public class GenericClass<T> {    private T value;      public GenericClass(T value) {        this.value = value;    }    public T getValue() {        return value;    }    public void setValue(T value) {        this.value = value;    }}
```

测试类：

```
//TODO 1:泛型类GenericClass<String> name = new GenericClass<>("mikechen的互联网架构");System.out.println(name.getValue());  GenericClass<Integer> number = new GenericClass<>(123);System.out.println(number.getValue());
```

运行结果：

![图片](/home/cbr/Documents/Blog/chen-boran.github.io/source/_posts/640-16497881013783.png)

### 2、泛型接口

泛型方法概述：把泛型定义在方法上
![图片](/home/cbr/Documents/Blog/chen-boran.github.io/source/_posts/640-16497881013784.png)
定义格式：

```
public <泛型类型> 返回类型 方法名（泛型类型 变量名） {    }
```

- 注意要点：

- - 方法声明中定义的形参只能在该方法里使用，而接口、类声明中定义的类型形参则可以在整个接口、类中使用。当调用fun()方法时，根据传入的实际对象，编译器就会判断出类型形参T所代表的实际类型。

```
public interface GenericInterface<T> {void show(T value);}}public class StringShowImpl implements GenericInterface<String> {@Overridepublic void show(String value) {System.out.println(value);}} public class NumberShowImpl implements GenericInterface<Integer> {@Overridepublic void show(Integer value) {System.out.println(value);}}
```

注意：使用泛型的时候，前后定义的泛型类型必须保持一致，否则会出现编译异常：

```
GenericInterface<String> genericInterface = new NumberShowImpl();//编译异常
```

或者干脆不指定类型，那么 new 什么类型都是可以的：

```
GenericInterface g1 = new NumberShowImpl();GenericInterface g2 = new StringShowImpl();
```

### 3、泛型方法

泛型方法，是在调用方法的时候指明泛型的具体类型 。

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

-  定义格式：

> 修饰符 <代表泛型的变量> 返回值类型 方法名(参数){ }

例如：

```
/**     *     * @param t 传入泛型的参数     * @param <T> 泛型的类型     * @return T 返回值为T类型     * 说明：     *   1）public 与 返回值中间<T>非常重要，可以理解为声明此方法为泛型方法。     *   2）只有声明了<T>的方法才是泛型方法，泛型类中的使用了泛型的成员方法并不是泛型方法。     *   3）<T>表明该方法将使用泛型类型T，此时才可以在方法中使用泛型类型T。     *   4）与泛型类的定义一样，此处T可以随便写为任意标识，常见的如T、E等形式的参数常用于表示泛型。     */    public <T> T genercMethod(T t){        System.out.println(t.getClass());        System.out.println(t);        return t;    }  public static void main(String[] args) {    GenericsClassDemo<String> genericString  = new GenericsClassDemo("helloGeneric"); //这里的泛型跟下面调用的泛型方法可以不一样。    String str = genericString.genercMethod("hello");//传入的是String类型,返回的也是String类型    Integer i = genericString.genercMethod(123);//传入的是Integer类型,返回的也是Integer类型}  class java.lang.Stringhello  class java.lang.Integer123
```

这里可以看出，泛型方法随着我们的传入参数类型不同，他得到的类型也不同。泛型方法能使方法独立于类而产生变化。

## 四：泛型通配符

**Java泛型的通配符是用于解决泛型之间引用传递问题的特殊语法, 主要有以下三类:**

![图片](data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==)

```
// 1：表示类型参数可以是任何类型public class Apple<?>{}  // 2：表示类型参数必须是A或者是A的子类public class Apple<T extends A>{}  // 3: 表示类型参数必须是A或者是A的超类型public class Apple<T supers A>{} 
```

**1. 无边界的通配符(Unbounded Wildcards), 就是<?>, 比如List<?>**
无边界的通配符的主要作用就是让泛型能够接受未知类型的数据.

**2. 固定上边界的通配符(Upper Bounded Wildcards)，采用<? extends E>的形式**

使用固定上边界的通配符的泛型, 就能够接受指定类及其子类类型的数据。

要声明使用该类通配符, 采用<? extends E>的形式, 这里的E就是该泛型的上边界。

注意: 这里虽然用的是extends关键字, 却不仅限于继承了父类E的子类, 也可以代指显现了接口E的类

**3. 固定下边界的通配符(Lower Bounded Wildcards)，采用<? super E>的形式**

使用固定下边界的通配符的泛型, 就能够接受指定类及其父类类型的数据.。

要声明使用该类通配符, 采用<? super E>的形式, 这里的E就是该泛型的下边界.。

注意: 你可以为一个泛型指定上边界或下边界, 但是不能同时指定上下边界。



## 五：泛型中KTVE的含义

果点开JDK中一些泛型类的源码，我们会看到下面这些代码：

```
public class ArrayList<E> extends AbstractList<E> implements List<E>, RandomAccess, Cloneable, java.io.Serializable{    ...}public class HashMap<K,V> extends AbstractMap<K,V>    implements Map<K,V>, Cloneable, Serializable {    ...}    
```

上面这些泛型类定义中的泛型参数E、K和V都是什么意思呢？

其实这些参数名称是可以任意指定，就想方法的参数名一样可以任意指定，但是我们通常会起一个有意义的名称，让别人一看就知道是什么意思。

**常见泛型参数名称有如下：**

E：Element (在集合中使用，因为集合中存放的是元素)
T：Type（Java 类）
K：Key（键）
V：Value（值）
N：Number（数值类型）
？：表示不确定的java类型

## 六：泛型的实现原理

泛型本质是将数据类型参数化，它通过擦除的方式来实现，即编译器会在编译期间「擦除」泛型语法并相应的做出一些类型转换动作。

看一个例子就应该清楚了，例如：

```
public class Caculate<T> {    private T num; }
```

我们定义了一个泛型类，定义了一个属性成员，该成员的类型是一个泛型类型，这个 T 具体是什么类型，我们也不知道，它只是用于限定类型的。

反编译一下这个 Caculate 类：

```
public class Caculate{    public Caculate(){}    private Object num;}
```

发现编译器擦除 Caculate 类后面的两个尖括号，并且将 num 的类型定义为 Object 类型。

那么是不是所有的泛型类型都以 Object 进行擦除呢？大部分情况下，泛型类型都会以 Object 进行替换，而有一种情况则不是。那就是使用到了extends和super语法的有界类型，如：

```
public class Caculate<T extends String> {    private T num;}
```

这种情况的泛型类型，num 会被替换为 String 而不再是 Object。

这是一个类型限定的语法，它限定 T 是 String 或者 String 的子类，也就是你构建 Caculate 实例的时候只能限定 T 为 String 或者 String 的子类，所以无论你限定 T 为什么类型，String 都是父类，不会出现类型不匹配的问题，于是可以使用 String 进行类型擦除。

实际上编译器会正常的将使用泛型的地方编译并进行类型擦除，然后返回实例。但是除此之外的是，如果构建泛型实例时使用了泛型语法，那么编译器将标记该实例并关注该实例后续所有方法的调用，每次调用前都进行安全检查，非指定类型的方法都不能调用成功。

实际上编译器不仅关注一个泛型方法的调用，它还会为某些返回值为限定的泛型类型的方法进行强制类型转换，由于类型擦除，返回值为泛型类型的方法都会擦除成 Object 类型，当这些方法被调用后，编译器会额外插入一行 checkcast 指令用于强制类型转换，这一个过程就叫做『泛型翻译』。 



https://mp.weixin.qq.com/s/fsB2bq9FrOQnNY5hE6s2wQ



https://mp.weixin.qq.com/s/stonkCgsd2B-uhtOg1sobw
