---
title: Spring 5
date: 2021-10-13 20:35:05
tags: 
categories: 
keywords: 
description: some of my thinks
top_img: 
comments: 
cover: https://ae01.alicdn.com/kf/Ue5889eaf11594a4aabca090c5d5060798.jpg
toc:  
toc_number:
copyright:
mathjax:
katex:
---

 本文作为学习尚硅谷Spring5教程之后的课后笔记，仅供个人学习。 

##  一、概述

**Spring 是轻量级的开源的 JavaEE 框架。**

- 独立使用不依赖其他组件
- 导入的jar包很少，体积很小

Spring 可以解决企业应用开发的复杂

Spring 拥有两个核心部分：IOC 和 Aop

（1）IOC：控制反转，把创建对象过程交给 Spring 进行管理（不需要new初始化对象）

（2）Aop：面向切面，不修改源代码的情况下进行功能增强

Spring的特点 （优势）：

（1）方便解耦，简化开发

（2）Aop 编程支持

（3）方便程序测试

（4）方便和其他框架进行整合（Mybatis等）

（5）方便进行事务操作

（6）降低 API 开发难度（对很多组成进行了封装）

Spring项目所依赖的jar包如下：

![image-20211012095832374](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20211012095832374.png)





## 二、IOC容器

### 1.IOC概念和底层原理

（1）概念：

  					控制反转，把对象创建和对象的调用过程交给spring进行管理。

​		目的：降低耦合度。



（2）IOC底层原理：**xml，反射，工厂模式**（设计模式）

​			// 工厂模式：目的为了降低耦合 。创建工厂类，new对象，之后调用工厂类的方法即可—————>仍然具有一定的耦合度 —————>IOC:最大限度的   

​			<img src="C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20211012104003619.png" alt="image-20211012104003619" style="zoom: 67%;" />

**Spring提供IOC容器两种实现方式（两个接口）**



- BeanFactory：Spring内部使用的接口，不提倡开发人员使用。特点：加载配置文件时不会创建对象，获取（使用）对象时才会创建对象。

- ApplicationContext：BeanFactory的子接口，提供了更多更强大的功能，一般由开发人员使用。

  ​	特点：加载配置文件时会把配置文件里的对象进行创建。

  哪种方式更好？

  ​	耗时耗资源的过程都在启动工程中启动，减少用户调用时的时间，具体工程中ApplicationContext更常用

- ApplicationContext两个常用实现类：

  - FileSystemXmlApplicationContext：绝对路径，从盘符开始算起
  - ClassPathXmlApplicationContext：相对路径，从src开始算起



什么是Bean管理？

​	Bean管理是指两个操作：Spring创建对象 和 Spring注入属性

​	Bean管理有两种操作方式：

- 基于xml配置文件方式实现 
- 基于注解方式实现



### 2.IOC操作Bean管理（基于xml）

xml实现Bean管理：
（1）基于xml方式创建对象：

​	在Spring配置文件中使用bean标签，来创建对象，bean标签可以使用很多年属

性

常用属性：

- id：唯一标识

- class：目标类的路径，可以使用绝对路径和相对路径

  创建对象时，默认执行无参构造函数

（2）基于xml方式注入属性：

- 方法一：使用set方法进行注入：

  DI 注入：（IOC的具体实现）依赖注入，即注入属性 

  首先先为类的属性提供set方法：

  创建一个类，定义他们的属性和set方法

    public class User {
    private String userName;
    private String userAge;
    // set方法注入
    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setUserAge(String userAge) {
        this.userAge = userAge;
    }

    public String getUserName() {
        return userName;
    }

    public String getUserAge() {
        return userAge;
    } 
    }

然后在xml配置文件中通过property标签进行属性注入

     <!--1 配置User对象创建-->
        <!--<bean id="user" class="com.atguigu.spring5.User"></bean>-->
    
        <!--2 set方法注入属性-->
        <bean id="book" class="com.atguigu.spring5.Book">
            <!--使用property完成属性注入
                name：类里面属性名称
                value：向属性注入的值
            -->
            <property name="bname" value="易筋经"></property>
            <property name="bauthor" value="达摩老祖"></property>


​           
​     
​       
 然后进行测试

    ApplicationContext applicationContext = new ClassPathXmlApplicationContext("bean1.xml");
    
    User user = applicationContext.getBean("user", User.class);
    
    System.out.println(user.getUserName() + " " +user.getUserAge());

方法二：使用有参构造函数进行注入

首先提供有参构造方法

 

    public class User {
    private String userName;
    private String userAge;
    
    public User(String userName, String userAge){
        this.userName = userName;
        this.userAge = userAge;
    }

然后再xml配置文件中通过constructor-arg标签进行属性注入

    <!--配置User对象-->
    <bean id="user" class="com.oymn.spring5.User">
        <constructor-arg name="userName" value="haha"></constructor-arg>
        <constructor-arg name="userAge" value="18"></constructor-arg>
    </bean>


（3）xml注入其他属性

**null值**

在xml文件中设置空值

```
<!--null值-->
<!--<property name="address">
    <null/>
</property>-->
```



**属性值包含特殊符号**

假设现在userName属性需要赋值为 < sdjfs >（ 属性值中含有特殊字符，会报错 ）

 解决方法：

- 把特殊字符转义即可

- 通过 <![CDATA[值]]> 来表示

  例如：<value> **<![CDATA[**  解析 xml **]]>**<value>

#### 1.注入属性——外部bean

创建两个类，在一个类中调用另一个类的方法，使用外部bean的形式



有两个类：UserService和UserDaoImpl，其中UserDaoImpl实现UserDao接口

 

    public class UserService {
    private UserDao userDao;
    
    public void setUserDao(UserDao userDao){
        this.userDao = userDao;
    }//创建set方法，之后使用set方法注入
    
    public void add(){
        System.out.println("add");
    }

通过 ref 来指定创建userDaoImpl

```
<bean id="userDaoImpl" class="com.oymn.spring5.UserDaoImpl"></bean>//  创建userdao对象，接口不能有对象此处使用其实现类的对象

<bean id="userService" class="com.oymn.spring5.UserService">
    <property name="userDao" ref="userDaoImpl"></property>

​				//创建userservice对象
</bean>
```

```
<bean id="userService" class="com.atguigu.spring5.service.UserService">    <!--注入userDao对象        name属性：类里面属性名称        ref属性：创建userDao对象bean标签id值（想要引入的userdao对象创建时的ID值）    -->    <property name="userDao" ref="userDaoImpl"></property></bean><bean id="userDaoImpl" class="com.atguigu.spring5.dao.UserDaoImpl"></bean>
```

####  2. 注入属性——内部bean

不通过ref属性，而是通过嵌套一个bean标签实现

```
<!--内部 bean--><bean id="emp" class="com.atguigu.spring5.bean.Emp">     <!--设置两个普通属性-->     <property name="ename" value="lucy"></property>     <property name="gender" value="女"></property>     <!--设置对象类型属性-->     <property name="dept">     //不是使用外部bean 得hef引入当前bean外边创建得bean对象,而是在bean内部属性定义时嵌套创建bean         <bean id="dept" class="com.atguigu.spring5.bean.Dept">        	 <property name="dname" value="安保部"></property>         </bean>     </property></bean> 
```

#### 3.注入属性——级联赋值

写法一：外部bean，通过ref属性来获取外部bean

写法二：

emp类中有ename和dept两个属性，其中dept有dname属性，

注意：emp要提供dept属性的get方法。否则方法取不到

```
<!--级联赋值--><bean id="emp" class="com.atguigu.spring5.bean.Emp">    <!--设置两个普通属性-->    <property name="ename" value="lucy"></property> ​	<property name="gender" value="女"></property>​    <!--写法一-->​	<property name="dept" ref="dept"></property>​    <!--写法二-->​    <property name="dept.dname" value="技术部"></property></bean><bean id="dept" class="com.atguigu.spring5.bean.Dept">​    <pr operty name="dname" value="财务部"></property></bean>
```

#### 4. 注入集合属性（数组，List，Map）



共同特征：都包含多个元素

假设有一个Stu类（学生类）

1. 首先创建类，定义数组、list、map、set、等类型属性，生成对应的set方法

   public class Stu {
   private String[] courses;
   private List<String> list;
   private Map<String,String> map;
   private Set<String> set;

   //创建set
   public void setCourses(String[] courses) {
       this.courses = courses;
   }
   //list集合类型
   public void setList(List<String> list) {
       this.list = list;
   }
   //map类型属性
   public void setMap(Map<String, String> map) {
       this.map = map;
   }
   //set 集合类型
   public void setSet(Set<String> set) {
       this.set = set;
   }


2. 在xml配置文件中对这些集合属性进行注入

   这里不使用value，因为一个属性有多个属值，都是集合类型属性

    

```
<bean id="stu" class="com.oymn.spring5.Stu">    <!--数组类型属性注入-->    <property name="courses">        <array>		// 可以使用<array>或者<list>            <value>java课程</value>            <value>数据库课程</value>        </array>    </property>    <!--List类型属性注入-->    <property name="list">        <list>            <value>张三</value>            <value>李四</value>        </list>    </property>    <!--Map类型属性注入-->    <property name="map">        <map>//  map属性有键值和标签两个属性            <entry key="JAVA" value="java"></entry>            <entry key="PHP" value="php"></entry>        </map>    </property>    <!--Set类型属性注入-->    <property name="set">        <set>            <value>Mysql</value>            <value>Redis</value>        </set>    </property></bean>
```

 

**设置对象类型的值** 

上面的集合值都是字符串（string），以下设置对象类型的值，如下：

写法： 集合+外部bean

 

```
<!--创建多个 course 对象--><bean id="course1" class="com.atguigu.spring5.collectiontype.Course">	<property name="cname" value="Spring5 框架"></property></bean><bean id="course2" class="com.atguigu.spring5.collectiontype.Course">	<property name="cname" value="MyBatis 框架"></property></bean><!--注入 list 集合类型，但是值是对象--><property name="courseList">    <list>        <ref bean="course1"></ref>        <ref bean="course2"></ref>//    </list></property>
```

**把集合注入部分提取出来**

使用 util 标签，这样不同的bean都可以使用相同的集合注入部分了。

<!--将集合注入部分提取出来-->
引入名称空间

```
<!--1 提取list集合类型属性注入--><util:list id="bookList">    <value>易筋经</value>    <value>九阴真经</value>    <value>九阳神功</value>    //当然也可以引入对象类型属性，使用ref即可</util:list><!--2 提取list集合类型属性注入使用--><bean id="book" class="com.atguigu.spring5.collectiontype.Book" scope="prototype">    <property name="list" ref="bookList"></property>    //注意此时 name和ref对应util中的id</bean>
```

#### FactoryBean

Spring有两种Bean，一种是普通Bean，另一种是工厂Bean（FactoryBean）



- 普通bean：在配置文件中定义 **bean** **类型就是返回类型**

- 工厂bean：**在配置文件定义bean 类型可以和返回类型不一样**

第一步 创建类，让这个类作为工厂 bean，实现接口 FactoryBean

第二步 实现接口里面的方法，在实现的方法中定义返回的 bean 类型

```
创建的类实现接口，public class MyBean implements FactoryBean<Course> {		//适用泛型类，定义返回的类型是Course类型    //定义返回bean的类型，可以不是xml文件中定义的Mybean类型     @Override    public Course getObject() throws Exception {        Course course = new Course();        course.setCname("abc");        return course;    }    @Override    public Class<?> getObjectType() {        return null;    }    @Override    public boolean isSingleton() {        return false;    }}<bean id="myBean" class="com.atguigu.spring5.factorybean.MyBean"></bean>//测试用例public void test3() { ApplicationContext context = new ClassPathXmlApplicationContext("bean3.xml"); Course course = context.getBean("myBean", Course.class); System.out.println(course);}
```

#### Bean的作用域

在Spring中，可以设置bean实例是单实例还是多实例，默认情况下bean是单实例对象。


执行结果是相同的：

通过 bean标签的scope属性 来设置单实例还是多实例。
Scope属性值：singleton和prototype

![image-20211012163218578](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20211012163218578.png)

**singleton：**默认值，表示单实例对象。加载配置文件时就会创建单实例对象。
**prototype**：表示多实例对象。不是在加载配置文件时创建对象，在调用getBean方法时创建多实例对象。

//两者创建的时机不同

#### Bean的生命周期

从对象的创建到销毁的过程

bean的生命周期（过程）：
（1）通过构造器创建 bean 实例（执行无参数构造（默认））

（2）为 bean 的属性设置值和对其他 bean 引用（调用 set 方法）

（3）把 bean 实例传递 bean 后置处理器的方法 postProcessBeforeInitialization

（4）调用 bean 的初始化的方法（需要进行配置初始化的方法）

（5）把 bean 实例传递 bean 后置处理器的方法 postProcessAfterInitialization

（6）bean 可以使用了（对象获取到了）

（7）当容器关闭时候，调用 bean 的销毁的方法（需要进行配置销毁的方法）

 示例：

    public class Orders {    private String orderName;public Orders() {    System.out.println("第一步：执行无参构造方法创建bean实例");}public void setOrderName(String orderName) {    this.orderName = orderName;    System.out.println("第二步：调用set方法设置属性值");}//初始化方法public void initMethod(){    System.out.println("第四步：执行初始化方法");}//销毁方法public void destroyMethod(){    System.out.println("第七步：执行销毁方法");}

//实现后置处理器，需要实现BeanPostProcessor接口
public class MyBeanPost implements BeanPostProcessor {

    @Overridepublic Object postProcessBeforeInitialization(Object bean, String beanName) throws BeansException {    System.out.println("第三步：将bean实例传递给bean后置处理器的postProcessBeforeInitialization方法");    return bean;}@Overridepublic Object postProcessAfterInitialization(Object bean, String beanName) throws BeansException {    System.out.println("第五步：将bean实例传递给bean后置处理器的postProcessAfterInitialization方法");    return bean;}<bean id="orders" class="com.oymn.spring5.Orders" init-method="initMethod" destroy-method="destroyMethod">    <property name="orderName" value="hahah"></property></bean><!--配置bean后置处理器，这样配置后整个xml里面的bean用的都是这个后置处理器--><bean id="myBeanPost" class="com.oymn.spring5.MyBeanPost"></bean>@Testpublic void testOrders(){ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("bean1.xml");Orders orders = context.getBean("orders", Orders.class);System.out.println("第六步：获取bean实例对象");System.out.println(orders);//手动让bean实例销毁context.close();

 







#### xml自动装配

- 之前的配置使用name，value、ref是手动装配，下面进行自动装配

- 根据指定的装配规则（属性名称或者属性类型），Spring自动将匹配的属性值进行注入
- 要求 emp中属性的名称dept 和 bean标签的id值dept 一样，才能识别
- 要求同一个xml文件中不能有两个相同类型的bean，否则无法识别

```
<!--实现自动装配    bean标签属性autowire，配置自动装配    autowire属性常用两个值：        byName根据属性名称注入 ，注入值bean的id值和类属性名称一样        byType根据属性类型注入--><bean id="emp" class="com.atguigu.spring5.autowire.Emp" autowire="byType">    <!--<property name="dept" ref="dept"></property>--></bean>	<property name="dept1" ref="dept"></property>	//注意此时同一type有两个bean，此时会发生错误，要使用byName <bean id="dept" class="com.atguigu.spring5.autowire.Dept"></bean> 
```

#### 通过外部属性文件来操作bean

把大量配置的属性信息，存放到外部文件中，方便使用和修改。

例子：引入数据库 信息配置

- 导入数据库连接池jar包

- 创建外部属性文件，properties格式文件，写数据库信息(用户名，密码，数据库服务器，路径名称等)

- 引入context名称空间，并通过context标签引入外部属性文件，使用“${}”来获取文件中对应的值 

```
引入 context 名称空间<?xml version="1.0" encoding="UTF-8"?><beans xmlns="http://www.springframework.org/schema/beans"       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"       xmlns:p="http://www.springframework.org/schema/p"       xmlns:util="http://www.springframework.org/schema/util"       xmlns:context="http://www.springframework.org/schema/context"       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd                           http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util.xsd                           http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd"><!--直接配置连接池-->//   初始配置方法 <!--<bean id="dataSource" 			  class="com.alibaba.druid.pool.DruidDataSource"><property name="driverClassName" value="com.mysql.jdbc.Driver"></property><property name="url" value="jdbc:mysql://localhost:3306/userDb"></property>        <property name="username" value="root"></property>        <property name="password" value="root"></property>    </bean>-->    <!--引入外部属性文件-->    <context:property-placeholder location="classpath:jdbc.properties"/>    <!--配置连接池-->   //通过配置文件进行赋值，使用表达式${}    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource">        <property name="driverClassName" value="${prop.driverClass}"></property>        <property name="url" value="${prop.url}"></property>        <property name="username" value="${prop.userName}"></property>        <property name="password" value="${prop.password}"></property>            </bean></beans>
```



### 3. IOC操作Bean管理（基于注解）

引入：注解：Java代码中的特殊标记，可以使用在方法上、类上、属性上。

- 格式：@注解名称（属性名=属性值，属性名=属性值，……）

- 注解可以作用在类，属性，方法。

- 目的：简化xml配置，很少或不使用xml

#### 1. 基于注解创建对象

spring提供了四种创建对象的注解：

@Component
@Service：一般用于Service层
@Controller：一般用于web层
@ Repository：一般用于Dao层  //功能都是相同的，因为习惯划分了应用的层

流程：

- 首先需要AOP引入依赖：

- 开启组件扫描：

  扫描base-package包下所有有注解的类**并以注解的形式为其创建对象**

```
<context:component-scan base-package="com.oymn"></context:component-scan>
```

- 基于注解方式实现对象创建
  例子：在com.oymn.spring5.Service创建一个stuService类

```
//在注解里面value属性值可以省略不写，默认值是类名称，首字母小写//即:UserService -- userService			在类的前面添加@Component(value = "userService") //相当于<bean id="userService" class=".."/>@Servicepublic class UserService {    @Value(value = "abc")    private String name;    //定义dao类型属性    //不需要添加set方法    //添加注入属性注解//    @Autowired  //根据类型进行注入//    @Qualifier(value = "userDaoImpl1") //根据名称进行注入//    private UserDao userDao;    //@Resource  //根据类型进行注入    @Resource(name = "userDaoImpl1")  //根据名称进行注入    private UserDao userDao;    public void add() {        System.out.println("service add......."+name);        userDao.add();    }}
```

然后可以通过getBean方法来获取stuService对象

```
ClassPathXmlApplicationContext context = new ClassPathXmlApplicationContext("bean4.xml");StuService stuService = context.getBean("stuService", StuService.class);System.out.println(stuService);stuService.add();
```

**注意：开启组件扫描的细节配置：**

use-default-fileters设置使用默认过滤器，可以设置成false,通过include-

filter来设置只扫描base-packet 下的所有由注解修饰的类(相当于筛选)。

```
 <context:component-scan base-package="com.oymn" use-default-filters="false"><context:include-filter type="annotation" expression="org.springframework.stereotype.Controller"/></context:component-scan>
```

exclude-filter设置哪些注解不被进行扫描，

例子中为@Controller修饰的类不被扫描

```
<context:component-scan base-package="com.oymn">    <context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/></context:component-scan>
```

#### 2. 基于注解进行属性注入

@Autowired：根据属性类型自动装配


   举例子说明： 

    创建StuDao接口和StuDaoImpl实现类，为StuDaoImpl添加创建对象注解public interface StuDao {    public void add();}


​    
​    @Repository		//添加注解，获取对象
​    public class StuDaoImpl implements StuDao {
​        @Override
​        

        public void add() {        System.out.println("StuDaoImpl");    }}StuService类中添加StuDao属性，为其添加@Autowire注解，spring会自动为stuDao属性创建StuDaoImpl对象@Component(value="stuService")public class StuService {@Autowired	//添加属性，使用@Autowire注解public StuDao stuDao;public void add(){    System.out.println("addService");    stuDao.add();}




@Qualifier：根据属性名称自动装配

和@Autowire一同使用

当遇到一个接口有很多实现类时，只通过@Autowire是无法完成自动装配的，所以需要再使用@Qualifier通过名称来锁定某个类 

    @Component(value="stuService")public class StuService {@Autowired@Qualifier(value="stuDaoImpl")  //这样就能显式指定stuDaoImpl这个实现类public StuDao stuDao;public void add(){    System.out.println("addService");    stuDao.add();}

}

@Resource：可以根据类型注入，也可以根据名称注入

    @Component(value="stuService")public class StuService {//@Resource   //根据类型进行注入@Resource(name="stuDaoImpl")  //根据名称进行注入public StuDao stuDao;public void add(){    System.out.println("addService");    stuDao.add();}

@Value：注入普通类型属性

```
@Value(value = "abc")private String name;  //将name注入为abc
```



（3）完全注解开发：

- 创建配置类，替代原来xml配置文件中设置的扫 描

```
//创建一个包，创建一个配置类@Configuration    //表明为一个配置类@ComponentScan(basePackages = "com.oymn")   //开启组件扫描public class SpringConfig {}
```



- 编写测试类：

  ```
  public void testService2() {    //加载配置类    ApplicationContext context            = new AnnotationConfigApplicationContext(SpringConfig.class);    UserService userService = context.getBean("userService", UserService.class);    System.out.println(userService);    userService.add();
  ```

 


## 四.AOP

引入：
面向切面编程，利用 AOP 可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。通俗来说就是在不修改代码的情况下添加新的功能。

最终目的就是降低耦合度

### 1.AOP底层原理

底层通过动态代理来实现：

第一种：有接口的情况，使用JDK动态代理：创建接口实现类的代理对象。
第二种：无接口的情况，使用CGLIB动态代理：创建当前类子类的代理对象。

JDK动态代理举例：

通过 java.lang.reflect.Proxy类 调用 newProxyInstance方法 创建代理类。

newProxyInstance方法：

方法有三个参数：

参数一：类加载器

参数二：所增强方法所在的类，这个类实现的接口，支持多个接口

参数三：实现InvocationHandle接口，创建代理部分，重写invoke方法来添加新的功能

代码举例：

 

    //创建接口UserDaopublic interface UserDao {    public int add(int a, int b);    public int multi(int a, int b);}//定义实现类public class UserDaoImpl implements UserDao {    @Override    public int add(int a, int b) {        return a+b;    }	@Override	public int multi(int a, int b) {    return a*b;}

 







    public   class Main {@Testpublic void test1(){    //所需代理的类实现的接口，支持多个接口    Class[] interfaces = {UserDao.class};	    UserDao userDao = new UserDaoImpl();    	//调用newProxyInstance方法来创建代理类    UserDao userDaoProxy = (UserDao)        Proxy.newProxyInstance(Main.class.getClassLoader(), interfaces, new UserDaoProxy(userDao));	    int result = userDaoProxy.add(1, 2);    System.out.println(result);}


​    
​    //参数3
​    //创建内部类，实现InvocationHandler接口，增强invoke方法，添加新功能
​    class UserDaoProxy implements InvocationHandler {
​    

        Object obj;    	//通过有参构造函数将需要创建代理的类传过来    public UserDaoProxy(Object obj){//Object更加通用        this.obj = obj;    }    @Override    public Object invoke(Object proxy, Method method, Object[] args) throws Throwable {        System.out.println("进入" + method.getName() + "方法，这是新增的代码，参数有" + Arrays.toString(args));        		//执行原有的代码        Object invoke = method.invoke(obj, args);                System.out.println("方法原先的内容执行完了");                return invoke;    }}}


基于AspectJ实现AOP操作

### 2.AOP相关术语

- 连接点：类中可以被增强的方法，称为连接点。

- 切入点：实际被增强的方法，称为切入点。

- 通知：增强的那一部分逻辑代码。通知有多种类型：

  - 前置通知：增强部分代码在原代码前面。

  - 后置通知：增强部分代码在原代码后面。

  - 环绕通知：增强部分代码既有在原代码前面，也有在原代码后面。

  - 异常通知：原代码发生异常后才会执行。

  - 最终通知：类似与finally那一部分

- 切面：指把通知应用到切入点这一个动作。

### 3. AspectJ

- AspectJ是Spring一般用来实现AOP 操作；

- AspectJ 不是Spring的组成部分，独立于SPRING，一般把两者共同使用
- 需要的相关依赖：![image-20211012212607877](C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20211012212607877.png)



**1.基于AspectJ实现AOP有两种方式：**

- 基于xml配置文件
- 基于注解方法（常用） 



**2.切入点表达式**：（明确对哪个类中的那个方法进行增强）



语法结构：execution（[权限修饰符] [返回类型] [类全路径] [方法名称] [参数列表]）

```
举例1：对 com.atguigu.dao.BookDao 类里面的 add 进行增强execution(* com.auguigu.dao.BookDao.add(..))1举例2：对 com.atguigu.dao.BookDao 类里面的所有的方法进行增强execution(* com.atguigu.dao.BookDao.*(..))1举例 3：对 com.atguigu.dao 包里面所有类，类里面所有方法进行增强execution(* com.atguigu.dao.*.* (..))
```



**3.基于注解方式**



1、创建类，在类里面定义方法

```
public class User { public void add() { System.out.println("add......."); } }
```

2、创建增强类（编写增强逻辑）

（1）在增强类里面，创建方法，让不同方法代表不同通知类型

```
//增强的类*public class UserProxy { public void before() {*//前置通知* System.out.println("before......"); } }
```

3、进行通知的配置

```
（1）在 spring 配置文件中，开启注解扫描<?xml version=****"1.0"** **encoding=****"UTF-8"***?>*< beans xmlns=****"http://www.springframework.org/schema/beans"  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"xmlns:context="http://www.springframework.org/schema/context"  xmlns:aop=****"http://www.springframework.org/schema/aop" xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd**  http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context.xsd   http://www.springframework.org/schema/aop  http://www.springframework.org/schema/aop/spring-aop.xsd"* >  <!-- 开启注解扫描 -->  < context :component-scan* base  package= "com.atguigu.spring5.aopanno" ></ context :component-scan > （2）使用注解创建 User 和 UserProxy 对象（3）在增强类上面添加注解 @Aspect//增强的类*@Component@Aspect *//生成代理对象public class UserProxy {（4）在 spring 配置文件中开启生成代理对象<!-- 开启 Aspect 生成代理对象--> <aop:aspectj-autoproxy></aop:aspectj-autoproxy> 
```

4、配置不同类型的通知

（1）在增强类的里面，在作为通知方法上面添加通知类型注解，使用切入点表达式配置

```
增强的类@Component@Aspect //生成代理对象public class** UserProxy { //前置通知 //@Before 注解表示作为前置通知 @Before(value = **"execution(\* com.atguigu.spring5.aopanno.User.add(..))"**) public void** before() { System.**out**.println("before........."); } //后置通知（返回通知） @AfterReturning(value = "execution(\**com.atguigu.spring5.aopanno.User.add(..))") **public void** afterReturning() { System.out.println("afterReturning........."); } //最终通知 @After(value = "execution(\com.atguigu.spring5.aopanno.User.add(..))") public void after() { System.out.println("after........."); } //异常通知* @AfterThrowing(value = "execution(\com.atguigu.spring5.aopanno.User.add(..))") public void afterThrowing() { System.out.println("afterThrowing........."); } //环绕通知 @Around(value = **"execution(\* com.atguigu.spring5.aopanno.User.add(..))"**) public void** around(ProceedingJoinPoint proceedingJoinPoint) throws Throwable { System.out.println("环绕之前........."); //被增强的方法执行 proceedingJoinPoint.proceed(); System.out.println("环绕之后........."); } }
```

5、相同的切入点抽取

```
//相同切入点抽取@Pointcut(value = "execution(\ com.atguigu.spring5.aopanno.User.add(..))")public void pointdemo() {}//前置通知//@Before 注解表示作为前置通知@Before(value = "pointdemo()")public void** before() { System.out.println("before.........");}
```

6、有多个增强类多同一个方法进行增强，设置增强类优先级

（1）在增强类上面添加注解 @Order(数字类型值)，数字类型值越小优先级越高

```
@Component@Aspect@Order(1)public class PersonProxy
```

**7、完全使用注解开发** 

```
 1）创建配置类，不需要创建 xml 配置文件@Configuration@ComponentScan(basePackages = {"com.atguigu"})@EnableAspectJAutoProxy(proxyTargetClass = true)public class ConfigAop {}
```



**4.基于xml方式**

基于配置文件 ，了解即可

## 五、JdbcTemplate

Spring对JDBC进行封装，使用JdbcTemplate方便对数据库的操作。

### 1.引用方法

（1）增删改操作：

int update(String sql, Object... args);

（2）查询：返回某个值（例如）

T queryForObject(String sql,Class<T> requiredType);

（3）查询：返回某个对象

T queryForObject(String sql,RowMapper<T> rowMapper,Object ... args);

//三个参数：

- 第一个参数：sql 语句

- 第二个参数：RowMapper 是一个接口，针对返回不同类型数据，使用这个接口里面实现类完成数据封装

- 第三个参数：sql 语句值

（4）查询：返回集合

List<T> query(String sql,RowMapper<T> rowMapper,Object... args);

（5）批量增删改：

int[] batchUpdate(String sql,List<Object[]> batchArgs);//传入多条数据即list集合

- 第一个参数：sql 语句

- 第二个参数：List 集合，添加多条记录数据

### 2. 流程



引入相关jar包

所需jar包

<img src="C:\Users\ASUS\AppData\Roaming\Typora\typora-user-images\image-20211013181633819.png" alt="image-20211013181633819" style="zoom:80%;" />


配置数据库连接池； 

<context:component-scan base-package="com.oymn"></context:component-scan>

<!--配置数据库连接池 -->

```
<bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource" destroy-method="close">    <property name="url" value="jdbc:mysql://localhost:3306/book" />    <property name="username" value="root" />    <property name="password" value="000000" />    <property name="driverClassName" value="com.mysql.jdbc.Driver" /></bean>
```

配置JdbcTemplate对象，注入DateSourse  // 使用set方法注入

```
<!--创建JdbcTemplate对象--><bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">    <!--注入数据库连接池-->    <property name="dataSource" ref="dataSource"></property></bean>
```



创建Service类和Dao类，在Dao类中注入JdbcTemplate对象



    public interface BookDao {public void add(Book book);  //添加public void update(Book book);  //修改public void delete(int id);  //删除public int queryCount();   //查询数量public Book queryBookById(int id);  //查询public List<Book> queryBooks();   //查询所有public void batchAddBook(List<Object[]> books);  //批量添加public void batchUpdateBook(List<Object[]> books);  //批量修改public void batchDeleteBook(List<Object[]> args);  //批量删除

 






    @Repositorypublic class BookDaoImpl implements BookDao {@Autowiredprivate JdbcTemplate jdbcTemplate;//在BookDaoImpl中定义各种数据库操作方法@Override			//添加操作 public void add(Book book) {    String sql = "insert into t_book set name=?,price=?";    Object[] args = {book.getBookName(),book.getBookPrice()};    int update = jdbcTemplate.update(sql, args);    System.out.println(update);}@Override				//更改操作public void update(Book book) {    String sql = "update t_book set name=?,price=? where id=?";    Object[] args = {book.getBookName(),book.getBookPrice(),book.getBookId()};    int update = jdbcTemplate.update(sql, args);    System.out.println(update);}@Override			//删除操作public void delete(int id) {    String sql = "delete from t_book where id=?";    int update = jdbcTemplate.update(sql, id);    System.out.println(update);}@Override			//查询表中的记录条数public int queryCount() {    String sql = "select count(*) from t_book";    Integer count = jdbcTemplate.queryForObject(sql, Integer.class);    return count;}@Override			//查询返回对象public Book queryBookById(int id) {    String sql = "select id bookId,name bookName,price bookPrice from t_book where id=?";        Book book = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<Book>(Book.class), id);    //    return book;}@Override			//查询返回集合public List<Book> queryBooks() {    String sql = "select id bookId,name bookName,price bookPrice from t_book";    List<Book> bookList = jdbcTemplate.query(sql, new BeanPropertyRowMapper<Book>(Book.class));    return bookList;}//批量增删改@Overridepublic void batchAddBook(List<Object[]> books) {    String sql = "insert into t_book set id=?,name=?,price=?";    int[] ints = jdbcTemplate.batchUpdate(sql, books);    System.out.println(Arryliet.toString(ints));}@Overridepublic void batchUpdateBook(List<Object[]> books) {    String sql = "update t_book set name=?,price=? where id=?";    int[] ints = jdbcTemplate.batchUpdate(sql, books);    System.out.println(Arryliet.toString(ints));}@Overridepublic void batchDeleteBook(List<Object[]> args) {    String sql = "delete from t_book where id=?";    int[] ints = jdbcTemplate.batchUpdate(sql, args);    System.out.println(Arryliet.toString(ints));}


```
@Servicepublic class BookService {   //在service类中注入BookDao 类型属性，使用注解的方法   @Autowired    private BookDao bookDao = new BookDaoImpl();      通多调用bookDAO的方法 定义相关增删改查函数，后续进行测试   //添加    public void add(Book book){        bookDao.add(book);    }    //修改    public void update(Book book){        bookDao.update(book);    }    //删除    public void delete(Integer id){        bookDao.delete(id);    }    //查询数量    public int queryCount(){        return bookDao.queryCount();    }    //查询图书    public Book queryBookById(Integer id){        return bookDao.queryBookById(id);    }    //查询所有图书    public List<Book> queryBooks(){        return bookDao.queryBooks();    }    //批量添加图书    public void batchAddBook(List<Object[]> books){        bookDao.batchAddBook(books);    }    //批量修改图书    public void batchUpdateBook(List<Object[]> books){        bookDao.batchUpdateBook(books);    }    //批量删除图书    public void batchDeleteBook(List<Object[]> args){        bookDao.batchDeleteBook(args);    }}
```



 ## 六、事务管理

- 事务是数据库操作最基本单位，逻辑上的一组操作，要么都成功，要么都失败。

  典型场景：转账

- 事务四个特性ACID：原子性，一致性，隔离性，持久性。

- Spring事务管理有两种方式：

  - 编程式事务管理 
  - 声明式事务管理         //一般使用声明式事务管理，底层使用AOP原理。

**引入**：代码在执行中出现异常，异常之前代码执行完毕，代码之后未被执行，如何处理？

​	使用事务进行解决：

- 开启事务
- 进行事务操作
- 没有发生异常，提交事务
- 发生异常，回滚事务

### 1.声明事务管理



声明式事务管理有两种方式：

- 基于xml配置方式 

- 基于注解方式          //     一般使用注解方式。

  

**Spring事务管理API:**

Spring事务管理提供了一个接口，代表事务管理器，这个接口针对不同的框架提供不同的实现类。

对于使用JdbcTemplate进行数据库交互，则使用DataSourceTransactionManager实现类，如果整合Hibernate框架则使用HibernateTransactionManager实现类，具体情况具体使用。

**范例**

下面重点演示 以注解方式实现声明式事务管理：

```
<!-- 数据库连接池 --><bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource"      destroy-method="close">    <property name="url" value="jdbc:mysql://localhost:3306/book" />    <property name="username" value="root" />    <property name="password" value="000000" />    <property name="driverClassName" value="com.mysql.jdbc.Driver" /></bean><!--创建JdbcTemplate对象--><bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">    <!--注入数据库连接池-->    <property name="dataSource" ref="dataSource"></property></bean><!--创建事务管理器--><bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">//配置数据源​    <property name="dataSource" ref="dataSource"/></bean><!--开启事务注解--><tx:annotation-driven transaction-manager="transactionManager"></tx:annotation-driven><!--在service类上面或者service类的方法上面添加事务注解@Transactional-->//如果把@Transactional添加在类上面，这个类里面所有方法都添加事务。//如果只是添加在方法上面，则只为这个方法添加事务。//我们一般在整个类前面添加@Service@Transactionalpublic class UserService {} 
```

 //

### 2.声明式事务管理的参数配置：

在 service类上面添加注解@Transactional，在这个注解里面可以配置事务相关参数



- propagation：事务传播行为

  **即：多事务方法直接进行调用，这个过程中事务 是如何进行管理的**

  

  ![image-20211030205951405](https://cdn.jsdelivr.net/gh/chen-boran/Picture_bed/img/image-20211030205951405.png)

  记住前两个

- isolation：事务隔离级别

  解决事务隔离性，并发操作时发生的问题，防止多事务操作产生的互相影响

  可能有三个读问题：脏读，不可重复读，虚读（幻读）。

  设置隔离级别，解决读问题：

  ​																脏读			不可重复读			虚读
  READ UNCOMMITED（读未提交）	有						有						有
  READ COMMITED（读已提交）		无						 有						有
  REPEATABLE READ（可重复读）		无						无						有
  SERIALIZABLE（串行化）						无					无						 

- timeout：超时时间

  事务需要在一定时间内进行提交，超过时间后回滚。
  默认值是-1，设置时间以秒为单位。

- readOnly：是否只读
  默认值为false，表示可以查询，也可以增删改。
  设置为true，只能查询。

- rollbackFor：回滚，设置出现哪些异常进行事务回滚。

- noRollbackFor：不回滚，设置出现哪些异常不进行事务回滚。

  下面是类之前@Transactional注释得相关参数举例

  ```
  @Service@Transactional(propagation = Propagation.REQUIRED,isolation = Isolation.READ_COMMITTED)public class AccountService {
  ```

  

### 3.完全注解实现声明式事务管理：



创建配置类：（代替xml文件）

 

    @Configuration  //配置类@ComponentScan(basePackages = "com.oymn.spring5")  //开启组件扫描@EnableTransactionManagement  //开启事务public class Config {//创建数据库连接池@Beanpublic DruidDataSource getDruidDataSource(){    DruidDataSource druidDataSource = new DruidDataSource();    druidDataSource.setDriverClassName("com.mysql.jdbc.Driver");    druidDataSource.setUrl("jdbc:mysql://localhost:3306/book");    druidDataSource.setUsername("root");    druidDataSource.setPassword("000000");    return druidDataSource;}//创建JdbcTemplate对象@Beanpublic JdbcTemplate getJdbcTemplate(DataSource dataSource){    //到ioc容器中根据类型注入  找到datesourse    JdbcTemplate jdbcTemplate = new JdbcTemplate();    //注入datesource对象    jdbcTemplate.setDataSource(dataSource);    return jdbcTemplate;}//创建事务管理器@Beanpublic DataSourceTransactionManager getDataSourceTransactionManager(DataSource dataSource){    DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();    transactionManager.setDataSource(dataSource);    return transactionManager;}}


@Service
public class AccountService {

    @Autowiredprivate AccountDao accountDao;@Transactionalpublic void accountMoney(){    accountDao.add();    //int i=1/0;   //用来模拟转账失败    accountDao.reduce();}

### 4. xml实现声明式事务管理：

大致流程：

- 大致创建事务管理器
- 配置事务通知
- 配置切入点和切面：事务加到哪个类哪个方法上

```
<context:component-scan base-package="com.oymn"></context:component-scan><!-- 数据库连接池 --><bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource"      destroy-method="close">    <property name="url" value="jdbc:mysql://localhost:3306/book" />    <property name="username" value="root" />    <property name="password" value="000000" />    <property name="driverClassName" value="com.mysql.jdbc.Driver" /></bean><!--创建JdbcTemplate对象--><bean id="jdbcTemplate" class="org.springframework.jdbc.core.JdbcTemplate">    <!--注入数据库连接池-->    <property name="dataSource" ref="dataSource"></property></bean><!--创建事务管理器--><bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">    <property name="dataSource" ref="dataSource"/></bean><!--配置事务通知--><tx:advice id="txadvice">    <!--配置事务参数-->    <tx:attributes>//指定哪种规则的方法上添加事务        <tx:method name="accountMoney" propagation="REQUIRED" />        //name="accountMoney"目标类的名字    </tx:attributes></tx:advice><!--配置切入点和切面--><aop:config>    <!--配置切入点-->//切入点表达式    <aop:pointcut id="pt" expression="execution(com.oymn.spring5.Service..(..))"/>    <!--配置切面-->    <aop:advisor advice-ref="txadvice" pointcut-ref="pt"/></aop:config>
```



## 六、Spring5新特性

#### 自带了日志封装

Spring5移除了Log4jConfigListener，官方建议使用Log4j2
Spring5整合Log4j2：

第一步：引入jar包


第二步：创建log4j2.xml配置文件

```
<?xml version="1.0" encoding="UTF-8"?><!--日志级别以及优先级排序: OFF > FATAL > ERROR > WARN > INFO > DEBUG > TRACE > ALL --><!--Configuration后面的status用于设置log4j2自身内部的信息输出，可以不设置，当设置成trace时，可以看到log4j2内部各种详细输出--><configuration status="INFO">    <!--先定义所有的appender-->    <appenders>        <!--输出日志信息到控制台-->        <console name="Console" target="SYSTEM_OUT">            <!--控制日志输出的格式-->            <PatternLayout pattern="%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n"/>        </console>    </appenders>    <!--然后定义logger，只有定义了logger并引入的appender，appender才会生效-->    <!--root：用于指定项目的根日志，如果没有单独指定Logger，则会使用root作为默认的日志输出-->    <loggers>        <root level="info">            <appender-ref ref="Console"/>        </root>    </loggers></configuration> 
```



#### @Nullable注解

@Nullable注解可以用在方法上，属性上，参数上，表示方法返回值可以为空，属性可以为空，参数可以为空。

@Nullable     //表示方法返回值可以为空
public int getId();

@Nullable     //表示参数可以为空
public void setId(@Nullable int Id);

@Nullable     //表示属性可以为空
public int id;

#### 支持函数式风格编程

这是因为java8新增了lamda表达式

@Test
public void test() {
    //1 创建 GenericApplicationContext 对象
    GenericApplicationContext context = new GenericApplicationContext();
    //2 调用 context 的方法对象注册
    context.refresh();
    context.registerBean("user1",User.class,() -> new User());
    //3 获取在 spring 注册的对象
    // User user = (User)context.getBean("com.atguigu.spring5.test.User");
    User user = (User)context.getBean("user1");
    System.out.println(user);
}

#### 支持整合JUnit5

（1）整合JUnit4：

第一步：引入jar包


第二步：创建测试类，使用注解方式完成

@RunWith(SpringJUnit4ClassRunner.class) //单元测试框架
@ContextConfiguration("classpath:bean4.xml") //加载配置文件
public class JUnitTest {

    @Autowiredpublic User user;@Testpublic void test(){    System.out.println(user);}

}

bean4.xml：

<context:component-scan base-package="com.oymn"></context:component-scan>
1
通过使用@ContextConfiguration注解，测试方法中就不用每次都通过context来获取对象了，比较方便。

ApplicationContext context = new ClassPathXmlApplicationContext("bean2.xml");
BookService bookService = context.getBean("bookService",BookService.class);

（2）整合JUnit5：

#### Webflux

 

 
