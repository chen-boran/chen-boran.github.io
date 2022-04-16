Java提供了一个特殊的类`Class`，用来描述类的内部信息，是反射的核心类。



Java获取反射的三种方法

1.通过new对象实现反射机制 

2.通过路径实现反射机制 

3.通过类名实现反射机制

当然还可以通过类加载器实现反射机制

```
public class Student {
private int id;
String name;
protected boolean sex;
public float score;
}
public class Get {
//获取反射机制三种方式
public static void main(String[] args) throws ClassNotFoundException {
//方式一(通过建立对象)
Student stu = new Student();
Class classobj1 = stu.getClass();
System.out.println(classobj1.getName());
//方式二(所在通过路径-相对路径)
Class classobj2 = Class.forName("fanshe.Student");
System.out.println(classobj2.getName());
//方式三(通过类名)
Class classobj3 = Student.class;
System.out.println(classobj3.getName());
}
}
```

**Java反射机制**
Java 反射机制是在运行状态中,对于任意一个类,都能够获得这个类的所有属性和方法,对于任意一个对象都能够
调用它的任意一个属性和方法。这种在运行时动态的获取信息以及动态调用对象的方法的功能称为 Java 的反射机
制。
Class 类与 java.lang.reflect 类库一起对反射的概念进行了支持,该类库包含了 Field,Method,Constructor 类 (每
个类都实现了 Member 接口)。这些类型的对象时由 JVM 在运行时创建的,用以表示未知类里对应的成员。
这样你就可以使用 Constructor 创建新的对象,用 get() 和 set() 方法读取和修改与 Field 对象关联的字段,用
invoke() 方法调用与 Method 对象关联的方法。另外,还可以调用 getFields() getMethods() 和
getConstructors() 等很便利的方法,以返回表示字段,方法,以及构造器的对象的数组。这样匿名对象的信息
就能在运行时被完全确定下来,而在编译时不需要知道任何事情。

```
import java.lang.reflect.Constructor;
public class ReflectTest {
public static void main(String[] args) throws Exception {
Class clazz = null;
clazz = Class.forName("com.jas.reflect.Fruit");
Constructor<Fruit> constructor1 = clazz.getConstructor();
Constructor<Fruit> constructor2 = clazz.getConstructor(String.class);
Fruit fruit1 = constructor1.newInstance();
Fruit fruit2 = constructor2.newInstance("Apple");
}
}
class Fruit{
public Fruit(){
System.out.println("无参构造器 Run...........");
}
public Fruit(String type){
System.out.println("有参构造器 Run..........." + type);
}
} 
```



java反射机制参考：

https://mp.weixin.qq.com/s/-JfevVj0xVHBAZ_AgowZAQ
