---
title: Mybatis
date: 2021-10-28 21:47:32
tags:
---

[![返回主页](https://raw.githubusercontent.com/chen-boran/Picture_bed/main/img/logo.gif)](https://www.cnblogs.com/diffx/)

 

 

## 1.MyBatis简介

MyBatis 是一款优秀的持久层框架，它支持自定义 SQL、存储过程以及高级映射。MyBatis 免除了几乎所有的 JDBC 代码以及设置参数和获取结果集的工作。MyBatis 可以通过简单的 XML 或注解来配置和映射原始类型、接口和 Java POJO 

官方文档 http://www.mybatis.org/mybatis-3/getting-started.html

## 2.Mybaits整体架构

![image-20211026214833917](https://raw.githubusercontent.com/chen-boran/Picture_bed/main/img/image-20211026214833917.png)



## 3.流程概述

### 3.1.引入依赖（pom.xml）

```
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis</artifactId>
    <version>3.2.8</version>
</dependency>
```

### 3.2.全局配置文件（mybatis-config.xml）

```
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE configuration
  PUBLIC "-//mybatis.org//DTD Config 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-config.dtd">
<!-- 根标签 -->
<configuration>
<properties>
	<property name="driver" value="com.mysql.jdbc.Driver"/>
	<property name="url" value="jdbc:mysql://127.0.0.1:3306/mybatis-110?useUnicode=true&amp;characterEncoding=utf-8&amp;allowMultiQueries=true"/>
	<property name="username" value="root"/>
    	<property name="password" value="123456"/>
   </properties>

   <!-- 环境，可以配置多个，default：指定采用哪个环境 -->
   <environments default="test">
      <!-- id：唯一标识 -->
      <environment id="test">
         <!-- 事务管理器，JDBC类型的事务管理器 -->
         <transactionManager type="JDBC" />
         <!-- 数据源，池类型的数据源 -->
         <dataSource type="POOLED">
            <property name="driver" value="com.mysql.jdbc.Driver" />
            <property name="url" value="jdbc:mysql://127.0.0.1:3306/mybatis-110" />
            <property name="username" value="root" />
            <property name="password" value="123456" />
         </dataSource>
      </environment>
      <environment id="development">
         <!-- 事务管理器，JDBC类型的事务管理器 -->
         <transactionManager type="JDBC" />
         <!-- 数据源，池类型的数据源 -->
         <dataSource type="POOLED">
            <property name="driver" value="${driver}" /> <!-- 配置了properties，所以可以直接引用 -->
            <property name="url" value="${url}" />
            <property name="username" value="${username}" />
            <property name="password" value="${password}" />
         </dataSource>
      </environment>
   </environments>
  </configuration>
```

### 3.3.配置Map.xml 

```
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
  PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<!-- mapper:根标签，namespace：命名空间，随便写，一般保证命名空间唯一 -->
<mapper namespace="MyMapper">
   <!-- statement，内容：sql语句。id：唯一标识，随便写，在同一个命名空间下保持唯一
      resultType：sql语句查询结果集的封装类型,tb_user即为数据库中的表
    -->
   <select id="selectUser" resultType="com.zpc.mybatis.User">
      select * from tb_user where id = #{id}
   </select>
</mapper>
```

### 3.4.修改全局配置文件（mybatis-config.xml）

配上MyMapper.xml

```
<configuration>
   <!-- 环境，可以配置多个，default：指定采用哪个环境 -->
   <environments default="test">
      <!-- id：唯一标识 -->
      <environment id="test">
         <!-- 事务管理器，JDBC类型的事务管理器 -->
         <transactionManager type="JDBC" />
         <!-- 数据源，池类型的数据源 -->
         <dataSource type="POOLED">
            <property name="driver" value="com.mysql.jdbc.Driver" />
            <property name="url" value="jdbc:mysql://127.0.0.1:3306/ssmdemo" />
            <property name="username" value="root" />
            <property name="password" value="123456" />
         </dataSource>
      </environment>
   </environments>
   <mappers>
     <mapper resource="mappers/MyMapper.xml" />
   </mappers>
</configuration>
```

### 3.5.构建sqlSessionFactory（MybatisTest.java）

```
	// 指定全局配置文件
        String resource = "mybatis-config.xml";
        // 读取配置文件
        InputStream inputStream = Resources.getResourceAsStream(resource);
        // 构建sqlSessionFactory
        SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
```

### 3.6.开启sqlSession会话，执行sql（MybatisTest.java）

```
	 // 获取sqlSession
        SqlSession sqlSession = sqlSessionFactory.openSession();
        // 操作CRUD，第一个参数：指定statement，规则：命名空间+“.”+statementId
        // 第二个参数：指定传入sql的参数：这里是用户id
        User user = sqlSession.selectOne("MyMapper.selectUser", 1);
        System.out.println(user);
```

##  

### 日志配置

方便在控制台显示日志信息

 步骤 1：添加 Log4J 的 jar 包

我们使用的是 Log4J，要确保它的 jar 包可以被应用使用。需要将 jar 包添加到应用的类路径中。 

步骤 2：配置 Log4J

配置 Log4J 比较简单。假设你需要记录这个映射器的日志：

```
package org.mybatis.example;
public interface BlogMapper {
  @Select("SELECT * FROM blog WHERE id = #{id}")
  Blog selectBlog(int id);
}
```

在应用的类路径中创建一个名为 `log4j.properties` 的文件，文件的具体内容如下：

```
# 全局日志配置
log4j.rootLogger=ERROR, stdout
# MyBatis 日志配置
log4j.logger.org.mybatis.example.BlogMapper=TRACE
# 控制台输出
log4j.appender.stdout=org.apache.log4j.ConsoleAppender
log4j.appender.stdout.layout=org.apache.log4j.PatternLayout
log4j.appender.stdout.layout.ConversionPattern=%5p [%t] - %m%n
```

### MyBatis使用步骤

1) 配置mybatis-config.xml 全局的配置文件 (1、数据源，2、外部的mapper)

2) 创建SqlSessionFactory

3) 通过SqlSessionFactory创建SqlSession对象

4) 通过SqlSession操作数据库 CRUD

5) 调用session.commit()提交事务

6) 调用session.close()关闭会话



 

## 4.mybatis-config.xml详解

mybatis-config.xml讲究严格的顺序，具体顺序遵循文档的顺序

![img](https://raw.githubusercontent.com/chen-boran/Picture_bed/main/img/1456626-20190327210626940-903705426.png)

### 4.1.properties属性读取外部资源

properties配置的属性都是可外部配置且可动态替换的，既可以在典型的 Java 属性文件中配置，亦可通过 properties 元素的子元素来传递。例如：

```
<properties resource="org/mybatis/example/config.properties">
  <property name="username" value="dev_user"/>
  <property name="password" value="F2Fa3!33TYyg"/>
</properties>
```

然后其中的属性就可以在整个配置文件中被用来替换需要动态配置的属性值。比如:

```
<dataSource type="POOLED">
  <property name="driver" value="${driver}"/>
  <property name="url" value="${url}"/>
  <property name="username" value="${username}"/>
  <property name="password" value="${password}"/>
</dataSource>
```

这个例子中的 username 和 password 将会由 properties 元素中设置的相应值来替换。 driver 和 url 属性将会由 config.properties 文件中对应的值来替换。这样就为配置提供了诸多灵活选择。

属性也可以被传递到 SqlSessionFactoryBuilder.build()方法中。例如：

```
SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(reader, props);
// ... or ...
SqlSessionFactory factory = new SqlSessionFactoryBuilder().build(reader, environment, props);
```

如果属性在不只一个地方进行了配置，那么 MyBatis 将按照下面的顺序来加载：

- 1）在 properties 元素体内指定的属性首先被读取。
- 2）然后根据 properties 元素中的 resource 属性读取类路径下属性文件或根据 url 属性指定的路径读取属性文件，并覆盖已读取的同名属性。
- 3）最后读取作为方法参数传递的属性，并覆盖已读取的同名属性。

**因此，通过方法参数传递的属性具有最高优先级，resource/url 属性中指定的配置文件次之，最低优先级的是 properties 属性中指定的属性。**

8.2.settings设置

![img](https://img2018.cnblogs.com/blog/1456626/201903/1456626-20190327210741776-205936991.png)

```
<settings>
    <setting name="mapUnderscoreToCamelCase" value="true"/>
</settings>
```

测试：
没有开启驼峰匹配：

```
2018-07-01 13:57:56,486 [main] [com.zpc.mybatis.dao.UserMapper.queryUserById]-[DEBUG] ==>  Preparing: select * from tb_user where id = ? 
2018-07-01 13:57:56,524 [main] [com.zpc.mybatis.dao.UserMapper.queryUserById]-[DEBUG] ==> Parameters: 1(String)
2018-07-01 13:57:56,568 [main] [com.zpc.mybatis.dao.UserMapper.queryUserById]-[DEBUG] <==      Total: 1
User{id='1', userName='null', password='123456', name='大神', age=20, sex=2, birthday='2018-07-01', created='2018-07-01 13:36:09.0', updated='2018-07-01 13:36:09.0'}
```

开启驼峰匹配：

```
2018-07-01 13:58:40,599 [main] [com.zpc.mybatis.dao.UserMapper.queryUserById]-[DEBUG] ==>  Preparing: select * from tb_user where id = ? 
2018-07-01 13:58:40,642 [main] [com.zpc.mybatis.dao.UserMapper.queryUserById]-[DEBUG] ==> Parameters: 1(String)
2018-07-01 13:58:40,661 [main] [com.zpc.mybatis.dao.UserMapper.queryUserById]-[DEBUG] <==      Total: 1
User{id='1', userName='bigGod222', password='123456', name='大神', age=20, sex=2, birthday='2018-07-01', created='2018-07-01 13:36:09.0', updated='2018-07-01 13:36:09.0'}
```

8.3.typeAliases
类型别名是为 Java 类型命名的一个短的名字。它只和 XML 配置有关，存在的意义仅在于用来减少类完全限定名的冗余。

```
<typeAliases>
    <typeAlias type="com.zpc.mybatis.pojo.User" alias="User"/>
</typeAliases>
```

**缺点**：每个pojo类都要去配置。
**解决方案**：使用扫描包，扫描指定包下的所有类，扫描之后的别名就是类名（不区分大小写），建议使用的时候和类名一致。

```
<typeAliases>
    <!--type:实体类的全路径。alias:别名，通常首字母大写-->
    <!--<typeAlias type="com.zpc.mybatis.pojo.User" alias="User"/>-->
    <package name="com.zpc.mybatis.pojo"/>
</typeAliases>
```

Mybatis已经为普通的 Java 类型内建了许多相应的类型别名。它们都是大小写不敏感的.

![img](https://raw.githubusercontent.com/chen-boran/Picture_bed/main/img/1456626-20190327210946024-1568261798.png)

### 4.4.typeHandlers（类型处理器）

无论是 MyBatis 在预处理语句（PreparedStatement）中设置一个参数时，还是从结果集中取出一个值时， 都会用类型处理器将获取的值以合适的方式转换成 Java 类型。可以重写类型处理器或创建你自己的类型处理器来处理不支持的或非标准的类型。

### 4.5.plugins（插件）拦截器

MyBatis 允许你在已映射语句执行过程中的某一点进行拦截调用。默认情况下，MyBatis 允许使用插件来拦截的方法调用包括：

```
Executor (update, query, flushStatements, commit, rollback, getTransaction, close, isClosed)
ParameterHandler (getParameterObject, setParameters)
ResultSetHandler (handleResultSets, handleOutputParameters)
StatementHandler (prepare, parameterize, batch, update, query)
```

现在一些MyBatis 插件比如PageHelper都是基于这个原理，有时为了监控sql执行效率，也可以使用插件机制
原理：

![img](https://img2018.cnblogs.com/blog/1456626/201903/1456626-20190327211135308-2074954352.png)

自定义拦截器：

```
// ExamplePlugin.java
@Intercepts({@Signature(
  type= Executor.class,
  method = "update",
  args = {MappedStatement.class,Object.class})})
public class ExamplePlugin implements Interceptor {
  public Object intercept(Invocation invocation) throws Throwable {
    return invocation.proceed();
  }
  public Object plugin(Object target) {
    return Plugin.wrap(target, this);
  }
  public void setProperties(Properties properties) {
  }
}
```

配置：

```
<!-- mybatis-config.xml -->
<plugins>
  <plugin interceptor="org.mybatis.example.ExamplePlugin">
    <property name="someProperty" value="100"/>
  </plugin>
</plugins>
```

上面的插件将会拦截在 Executor 实例中所有的 “update” 方法调用， 这里的 Executor 是负责执行低层映射语句的内部对象。

### 4.6.environments(环境)

MyBatis 可以配置成适应多种环境，例如，开发、测试和生产环境需要有不同的配置；
尽管可以配置多个环境，每个 SqlSessionFactory 实例只能选择其一。
虽然，这种方式也可以做到很方便的分离多个环境，但是实际使用场景下，我们更多的是选择使用spring来管理数据源，来做到环境的分离。

### 4.7.mappers

需要告诉 MyBatis 到哪里去找到 SQL 映射语句。即告诉 MyBatis 到哪里去找映射文件。你可以使用相对于类路径的资源引用， 或完全限定资源定位符（包括 file:/// 的 URL），或类名和包名等。例如：

```
<!-- 使用相对于类路径的资源引用 -->
<mappers>
  <mapper resource="org/mybatis/builder/AuthorMapper.xml"/>
  <mapper resource="org/mybatis/builder/BlogMapper.xml"/>
  <mapper resource="org/mybatis/builder/PostMapper.xml"/>
</mappers>

<!-- 使用映射器接口实现类的完全限定类名 -->
<mappers>
  <mapper class="org.mybatis.builder.AuthorMapper"/>
  <mapper class="org.mybatis.builder.BlogMapper"/>
  <mapper class="org.mybatis.builder.PostMapper"/>
</mappers>
```

这里所谓的mapper接口路径。实际上就是dao的接口路径。在mybatis中，通常把dao的包叫做mapper。类名，也叫做mapper

- 1、定义一个接口。
- 2、在接口所在的包中定义mapper.xml，并且要求xml文件和interface的名称要相同。
- 3、在mybatis-config.xml 中通过class路径，引入mapper（注解方式）。要求mapper.xml 中的名称空间是类的接口的全路径。

注解方式：

```
<mappers>
    <mapper resource="mappers/MyMapper.xml"/>
    <mapper resource="mappers/UserDaoMapper.xml"/>
    <!--注解方式可以使用如下配置方式-->
    <mapper class="com.zpc.mybatis.dao.UserMapper"/>
</mappers>
```

*问题：*

- 1、mapper.xml 和 java文件没有分离。 之后的教程讲述和spring整合之后解决。
- 2、需要一个一个的去加载mapper。

当然也可以使用包扫描（必须使用注解方式，即在接口方法上使用注解，如@Select("select * from tb_user ")）：
*缺点*：

- 1、如果包的路径有很多？
- 2、mapper.xml和mapper.java没有分离。
  spring整合的时候解决。

## 5.Mapper XML文件详解

### 5.1.CRUD标签

#### 5.1.1.select

select – 书写查询sql语句
select中的几个属性说明：
id属性：当前名称空间下的statement的唯一标识。必须。要求id和mapper接口中的方法的名字一致。
resultType：将结果集映射为java的对象类型。必须（和 resultMap 二选一）
parameterType：传入参数类型。可以省略

#### 5.1.2.insert

insert 的几个属性说明：
id：唯一标识，随便写，在同一个命名空间下保持唯一，使用动态代理之后要求和方法名保持一致
parameterType：参数的类型，使用动态代理之后和方法的参数类型一致
useGeneratedKeys:开启主键回写
keyColumn：指定数据库的主键
keyProperty：主键对应的pojo属性名
标签内部：具体的sql语句。

#### 5.1.3.update

id属性：当前名称空间下的statement的唯一标识(必须属性)；
parameterType：传入的参数类型，可以省略。
标签内部：具体的sql语句。

#### 5.1.4.delete

delete 的几个属性说明：
id属性：当前名称空间下的statement的唯一标识(必须属性)；
parameterType：传入的参数类型，可以省略。
标签内部：具体的sql语句。

### 5.2.#{}和${}

场景：数据库有两个一模一样的表。历史表，当前表
查询表中的信息，有时候从历史表中去查询数据，有时候需要去新的表去查询数据。
希望使用1个方法来完成操作。

```
<select id="queryUserByTableName" resultType="com.zpc.mybatis.pojo.User">
    select * from #{tableName}
</select>

/**
 * 根据表名查询用户信息（直接使用注解指定传入参数名称）
 *
 * @param tableName
 * @return
 */
public List<User> queryUserByTableName(String tableName);
```

测试输出：

![img](https://raw.githubusercontent.com/chen-boran/Picture_bed/main/img/1456626-20190327211514143-697503265.png)

有问题,报语法错误：相当于执行了这样一条sql:
`select * from “tb_user”;`
显然表名多了引号。

改正：

```
<select id="queryUserByTableName" resultType="com.zpc.mybatis.pojo.User">
    select * from ${tableName}
</select>
```

*注意：*
`#{}` 只是替换？，相当于PreparedStatement使用占位符去替换参数，可以防止sql注入。
`${}` 是进行字符串拼接，相当于sql语句中的Statement，使用字符串去拼接sql；$可以是sql中的任一部分传入到Statement中，不能防止sql注入。

使用`${}` 去取出参数值信息，需要使用`${value}`
`#{}` 只是表示占位，与参数的名字无关，如果只有一个参数，会自动对应。

推荐：

```
/**
 * 根据表名查询用户信息（直接使用注解指定传入参数名称）
 *
 * @param tableName
 * @return
 */
public List<User> queryUserByTableName(@Param("tableName") String tableName);

<select id="queryUserByTableName" resultType="com.zpc.mybatis.pojo.User">
    select * from ${tableName}
</select>
```

`#{}`多个参数时：

```
/**
 * 登录（直接使用注解指定传入参数名称）
 *
 * @param userName
 * @param password
 * @return
 */
public User login( String userName, String password);

<select id="login" resultType="com.zpc.mybatis.pojo.User">
    select * from tb_user where user_name = #{userName} and password = #{password}
</select>
```

报错：

```
org.apache.ibatis.exceptions.PersistenceException: 
Error querying database.  Cause: org.apache.ibatis.binding.BindingException: Parameter 'userName' not found. Available parameters are [0, 1, param1, param2]
Cause: org.apache.ibatis.binding.BindingException: Parameter 'userName' not found. Available parameters are [0, 1, param1, param2]
```

解决方案一：

```
<select id="login" resultType="com.zpc.mybatis.pojo.User">
    select * from tb_user where user_name = #{0} and password = #{1}
</select>
```

解决方案二：

```
<select id="login" resultType="com.zpc.mybatis.pojo.User">
    select * from tb_user where user_name = #{param1} and password = #{param2}
</select>
```

最终解决方案：

```
/**
 * 登录（直接使用注解指定传入参数名称）
 *
 * @param userName
 * @param password
 * @return
 */
public User login(@Param("userName") String userName, @Param("password") String password);

<select id="login" resultType="com.zpc.mybatis.pojo.User">
    select * from tb_user where user_name = #{userName} and password = #{password}
</select>
```

> 通常在方法的参数列表上加上一个注释@Param(“xxxx”) 显式指定参数的名字，然后通过${“xxxx”}或#{“xxxx”}
> sql语句动态生成的时候，使用${};
> sql语句中某个参数进行占位的时候#{}

### 5.3.#、$区别

```
/**
 * #号
 * @param username1
 * @return
 */
User queryUserListByName1(@Param("username1") String username1);

/**
 * $号
 * @param username2
 * @return
 */
User queryUserListByName2(@Param("username2") String username2);

<select id="queryUserListByName1" resultType="com.zpc.mybatis.pojo.User">
    select * from tb_user WHERE user_name=#{username1}
</select>

<select id="queryUserListByName2" resultType="com.zpc.mybatis.pojo.User">
    select * from tb_user WHERE user_name='${username2}'//手动加了引号
</select>
```

### 5.4.resultMap

![img](https://raw.githubusercontent.com/chen-boran/Picture_bed/main/img/1456626-20190327211835662-809178670.png)

![img](https://raw.githubusercontent.com/chen-boran/Picture_bed/main/img/1456626-20190327211845574-1504006745.png)

使用：

![img](https://img2018.cnblogs.com/blog/1456626/201903/1456626-20190327211856049-978145666.png)

### 5.5.sql片段

```
<sql id=””></sql>
<include refId=”” />
```

例如在UserMapper.xml中定义如下片段：

```
<sql id="commonSql">
		id,
			user_name,
			password,
			name,
			age,
			sex,
			birthday,
			created,
			updated	
</sql> 
```

则可以在UserMapper.xml中使用它：

```
<select id="queryUserById" resultMap="userResultMap">
	select <include refid="commonSql"></include> from tb_user where id = #{id}
</select>

<select id="queryUsersLikeUserName" resultType="User">
	select <include refid="commonSql"></include> from tb_user where user_name like "%"#{userName}"%"
</select>
```

Sql片段也可以定义在单独的.xml文件中如：
定义CommonSQL.xml：

```
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
  PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="CommonSQL">
	<sql id="commonSql">
		id,
			user_name,
			password,
			name,
			age,
			sex,
			birthday,
			created,
			updated	
	</sql>
</mapper>
```

使用：

```
	<select id="queryUserById" resultMap="userResultMap">
		select <include refid="CommonSQL.commonSql"></include> from tb_user where id = #{id}
	</select>
	
	<select id="queryUsersLikeUserName" resultType="User">
		select <include refid="CommonSQL.commonSql"></include> from tb_user where user_name like "%"#{userName}"%"
	</select>
```

当然要完成这个功能还需要在全局配置文件mybatis-config.xml中引入该外部配置文件：

```
<mappers>
		<mapper resource="CommonSQL.xml"/>
		<!-- 开启mapper接口的包扫描，基于class的配置方式 -->
		<package name="com.zpc.mybatis.mapper"/>
</mappers>
```

## 6.动态sql

动态 SQL 是 MyBatis 的强大特性之一， 解决了根据不同条件拼接 SQL 语句 

 借助可用于任何 SQL 映射语句中的强大的动态 SQL 语言，MyBatis 显著地提升了这一特性的易用性。

 动态sql常用标签

- if
- choose (when, otherwise)
- trim (where, set)
- foreach

### if

使用动态 SQL 最常见情景是根据条件包含 where 子句的一部分。比如：

```
<select id="findActiveBlogWithTitleLike"
     resultType="Blog">
  SELECT * FROM BLOG
  WHERE state = ‘ACTIVE’
  <if test="title != null">//使用text
    AND title like #{title}
  </if>
</select>
```

这条语句提供了可选的查找文本功能。如果不传入 “title”，那么所有处于 “ACTIVE” 状态的 BLOG 都会返回；如果传入了 “title” 参数，那么就会对 “title” 一列进行模糊查找并返回对应的 BLOG 结果 。

如果希望通过 “title” 和 “author” 两个参数进行可选搜索.首先，我想先将语句名称修改成更名副其实的名称；接下来，只需要加入另一个条件即可。

```
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG WHERE state = ‘ACTIVE’
  <if test="title != null">
    AND title like #{title}
  </if>
  <if test="author != null and author.name != null">
    AND author_name like #{author.name}
  </if>
</select>
```



### choose、when、otherwise

有时候，我们不想使用所有的条件，而只是想从多个条件中选择一个使用。 

MyBatis 提供了 choose 元素，它有点像 Java 中的 switch 语句。

还是上面的例子，但是策略变为：传入了 “title” 就按 “title” 查找，传入了 “author” 就按 “author” 查找的情形。若两者都没有传入，就返回标记为 featured 的 BLOG（这可能是管理员认为，与其返回大量的无意义随机 Blog，还不如返回一些由管理员精选的 Blog）。

```
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG WHERE state = ‘ACTIVE’
  <choose>
    <when test="title != null">
      AND title like #{title}
    </when>
    <when test="author != null and author.name != null">
      AND author_name like #{author.name}
    </when>
    <otherwise>
      AND featured = 1
    </otherwise>
  </choose>
</select>
```



### trim、where、set

前面几个例子已经方便地解决了一个臭名昭著的动态 SQL 问题。现在回到之前的 “if” 示例，这次我们将 “state = ‘ACTIVE’” 设置成动态条件，看看会发生什么。

```
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG
  WHERE
  <if test="state != null">
    state = #{state}
  </if>
  <if test="title != null">
    AND title like #{title}
  </if>
  <if test="author != null and author.name != null">
    AND author_name like #{author.name}
  </if>
</select>
```

如果没有匹配的条件会怎么样？最终这条 SQL 会变成这样：

```
SELECT * FROM BLOG
WHERE
```

这会导致查询失败。如果匹配的只是第二个条件又会怎样？这条 SQL 会是这样:

```
SELECT * FROM BLOG
WHERE
AND title like ‘someTitle’
```

这个查询也会失败。这个问题不能简单地用条件元素来解决。这个问题是如此的难以解决，以至于解决过的人不会再想碰到这种问题。

MyBatis 有一个简单且适合大多数场景的解决办法。而在其他场景中，可以对其进行自定义以符合需求。而这，只需要一处简单的改动：

```
<select id="findActiveBlogLike"
     resultType="Blog">
  SELECT * FROM BLOG
  <where>
    <if test="state != null">
         state = #{state}
    </if>
    <if test="title != null">
        AND title like #{title}
    </if>
    <if test="author != null and author.name != null">
        AND author_name like #{author.name}
    </if>
  </where>
</select>
```

*where* 元素只会在子元素返回任何内容的情况下才插入 “WHERE” 子句。而且，若子句的开头为 “AND” 或 “OR”，*where* 元素也会将它们去除。

如果 *where* 元素与你期望的不太一样，你也可以通过自定义 trim 元素来定制 *where* 元素的功能。比如，和 *where* 元素等价的自定义 trim 元素为：

```
<trim prefix="WHERE" prefixOverrides="AND |OR ">
  ...
</trim>
```

*prefixOverrides* 属性会忽略通过管道符分隔的文本序列（注意此例中的空格是必要的）。上述例子会移除所有 *prefixOverrides* 属性中指定的内容，并且插入 *prefix* 属性中指定的内容。

用于动态更新语句的类似解决方案叫做 *set*。*set* 元素可以用于动态包含需要更新的列，忽略其它不更新的列。比如：

```
<update id="updateAuthorIfNecessary">
  update Author
    <set>
      <if test="username != null">username=#{username},</if>
      <if test="password != null">password=#{password},</if>
      <if test="email != null">email=#{email},</if>
      <if test="bio != null">bio=#{bio}</if>
    </set>
  where id=#{id}
</update>
```

这个例子中，*set* 元素会动态地在行首插入 SET 关键字，并会删掉额外的逗号（这些逗号是在使用条件语句给列赋值时引入的）。

来看看与 *set* 元素等价的自定义 *trim* 元素吧：

```
<trim prefix="SET" suffixOverrides=",">
  ...
</trim>
```

注意，我们覆盖了后缀值设置，并且自定义了前缀值。

### foreach

动态 SQL 的另一个常见使用场景是对集合进行遍历（尤其是在构建 IN 条件语句的时候）。比如：

```
<select id="selectPostIn" resultType="domain.blog.Post">
  SELECT *
  FROM POST P
  WHERE ID in
  <foreach item="item" index="index" collection="list"
      open="(" separator="," close=")">
        #{item}
  </foreach>
</select>
```

*foreach* 元素的功能非常强大，它允许你指定一个集合，声明可以在元素体内使用的集合项（item）和索引（index）变量。它也允许你指定开头与结尾的字符串以及集合项迭代之间的分隔符。这个元素也不会错误地添加多余的分隔符，看它多智能！

**提示** 你可以将任何可迭代对象（如 List、Set 等）、Map 对象或者数组对象作为集合参数传递给 *foreach*。当使用可迭代对象或者数组时，index 是当前迭代的序号，item 的值是本次迭代获取到的元素。当使用 Map 对象（或者 Map.Entry 对象的集合）时，index 是键，item 是值。

至此，我们已经完成了与 XML 配置及映射文件相关的讨论。下一章将详细探讨 Java API，以便你能充分利用已经创建的映射配置。

### script

要在带注解的映射器接口类中使用动态 SQL，可以使用 *script* 元素。比如:

```
    @Update({"<script>",
      "update Author",
      "  <set>",
      "    <if test='username != null'>username=#{username},</if>",
      "    <if test='password != null'>password=#{password},</if>",
      "    <if test='email != null'>email=#{email},</if>",
      "    <if test='bio != null'>bio=#{bio}</if>",
      "  </set>",
      "where id=#{id}",
      "</script>"})
    void updateAuthorValues(Author author);
```

### bind

`bind` 元素允许你在 OGNL 表达式以外创建一个变量，并将其绑定到当前的上下文。比如：

```
<select id="selectBlogsLike" resultType="Blog">
  <bind name="pattern" value="'%' + _parameter.getTitle() + '%'" />
  SELECT * FROM BLOG
  WHERE title LIKE #{pattern}
</select>
```

   

### 多数据库支持

如果配置了 databaseIdProvider，你就可以在动态代码中使用名为 “_databaseId” 的变量来为不同的数据库构建特定的语句。比如下面的例子：

```
<insert id="insert">
  <selectKey keyProperty="id" resultType="int" order="BEFORE">
    <if test="_databaseId == 'oracle'">
      select seq_users.nextval from dual
    </if>
    <if test="_databaseId == 'db2'">
      select nextval for seq_users from sysibm.sysdummy1"
    </if>
  </selectKey>
  insert into users values (#{id}, #{name})
</insert>
```

 

## 7.缓存

![image-20211026214739683](https://raw.githubusercontent.com/chen-boran/Picture_bed/main/img/image-20211026214739683.png)

### 7.1.一级缓存



- 一级缓存(local cache), 即本地缓存, 作用域默认为sqlSession。当 Session flush 或 close 后, 该Session 中的所有 Cache 将被清空。

- 本地缓存不能被关闭, 但可以调用 clearCache() 来清空本地缓存, 或者改变缓存的作用域. 

  在mybatis3.1之后, 可以配置本地缓存的作用域

- 在mybatis中，一级缓存默认是开启的，并且一直无法关闭

一级缓存满足条件：

- 1、同一个session中
- 2、相同的SQL和参数 

#### 一级缓存失效

1. sqlsession不同的情况
2. 同一个sqlsession,查询条件不同,缓存中还没有
3. 两次查询执行了增删改，导致缓存内容失效
4. 手动清除了一级缓存

### 7.2.二级缓存

也就是全局缓存，：基于namespace级别的缓存：

二级缓存：  一个namespace对应一个二级缓存：



工作机制：

* 1、一个会话，查询一条数据，这个数据就会被放在当前会话的一级缓存中；

* 2、如果会话关闭；一级缓存中的数据会被保存到二级缓存中；新的会话查询信息，就可以参照二级缓存中的内容；

* 3、sqlSession===EmployeeMapper==>EmployeeDepartmentMapper===>Department

  ​		不同namespace查出的数据会放在自己对应的缓存中（map）

  ​		效果：数据会从二级缓存中获取

  ​		查出的数据都会被默认先放在一级缓存中。

  ​		只有**会话提交或者关闭**以后，一级缓存中的数据才会转移到二级缓存中

 使用：

* ```
      1）、开启全局二级缓存配置：<setting name="cacheEnabled" value="true"/>
      
      2）mapper.xml中配置使用二级缓存：      
      	<cache>		</cache>
      
      3）我们的POJO需要实现序列化接口
  ```

  缓存有关的设置/属性：

  1）cacheEnabled=true：false：关闭缓存（二级缓存关闭）(一级缓存一直可用的)

  2）每个select标签都有useCache="true"：

  ​				false：不使用缓存（一级缓存依然使用，二级缓存不使用）

  3）每个增删改标签的：flushCache="true"：（一级二级都会清除）

  ​	  		  增删改执行完成后就会清除缓存；

  ​				测试：flushCache="true"：一级缓存就清空了；二级也会被清除；

  ​				查询标签：flushCache="false"：如果flushCache=true;每次查询之后都会清				空缓存；缓存是没有被使用的；

  4）、sqlSession.clearCache();只是清除当前session的一级缓存；

  5）、localCacheScope：本地缓存作用域：（一级缓存SESSION）；当前会话的所有数			据保存在会话缓存中；

  ​			STATEMENT：可以禁用一级缓存；       

  

 



## 8.Spring 集成Mybatis

### 8.1引入spring和Mybatis相关依赖

pom.xml

```
<!--数据库连接池-->
<dependency>
    <groupId>com.alibaba</groupId>
    <artifactId>druid</artifactId>
    <version>1.1.8</version>
</dependency>
<dependency>
    <groupId>org.mybatis</groupId>
    <artifactId>mybatis-spring</artifactId>
    <version>1.2.2</version>
</dependency>
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-jdbc</artifactId>
    <version>4.1.3.RELEASE</version>
</dependency>
<!--spring集成Junit测试-->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-test</artifactId>
    <version>4.1.3.RELEASE</version>
    <scope>test</scope>
</dependency>
<!--spring容器-->
<dependency>
    <groupId>org.springframework</groupId>
    <artifactId>spring-context</artifactId>
    <version>4.1.3.RELEASE</version>
</dependency>
```

### 8.2配置spring配置文件

applicationContext-dao.xml

```
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:context="http://www.springframework.org/schema/context" xmlns:p="http://www.springframework.org/schema/p"
       xmlns:aop="http://www.springframework.org/schema/aop" xmlns:tx="http://www.springframework.org/schema/tx"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-4.0.xsd
   http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-4.0.xsd
   http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-4.0.xsd http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-4.0.xsd
   http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util-4.0.xsd">

    <!-- 加载配置文件 -->
    <context:property-placeholder location="classpath:properties/*.properties"/>
    <!-- 数据库连接池 -->
    <bean id="dataSource" class="com.alibaba.druid.pool.DruidDataSource"
          destroy-method="close">
        <property name="driverClassName" value="${jdbc.driver}"/>
        <property name="url"
                  value="jdbc:mysql://${jdbc.host}:3306/${jdbc.database}?useUnicode=true&amp;characterEncoding=utf-8&amp;zeroDateTimeBehavior=convertToNull"/>
        <property name="username" value="${jdbc.userName}"/>
        <property name="password" value="${jdbc.passWord}"/>
        <!-- 初始化连接大小 -->
        <property name="initialSize" value="${jdbc.initialSize}"></property>
        <!-- 连接池最大数据库连接数  0 为没有限制 -->
        <property name="maxActive" value="${jdbc.maxActive}"></property>
        <!-- 连接池最大的空闲连接数，这里取值为20，表示即使没有数据库连接时依然可以保持20空闲的连接，而不被清除，随时处于待命状态 0 为没有限制 -->
        <property name="maxIdle" value="${jdbc.maxIdle}"></property>
        <!-- 连接池最小空闲 -->
        <property name="minIdle" value="${jdbc.minIdle}"></property>
        <!--最大建立连接等待时间。如果超过此时间将接到异常。设为-1表示无限制-->
        <property name="maxWait" value="${jdbc.maxWait}"></property>
    </bean>

    <!-- spring和MyBatis完美整合 -->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource"/>
        <!-- 自动扫描mapping.xml文件 -->
        <property name="mapperLocations" value="classpath:mappers/*.xml"></property>
        <!--如果mybatis-config.xml没有特殊配置也可以不需要下面的配置-->
        <property name="configLocation" value="classpath:mybatis-config.xml" />
    </bean>

    <!-- DAO接口所在包名，Spring会自动查找其下的类 -->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="com.zpc.mybatis.dao"/>
        <property name="sqlSessionFactoryBeanName" value="sqlSessionFactory"></property>
    </bean>

    <!-- (事务管理)transaction manager -->
    <bean id="transactionManager"
          class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource"/>
    </bean>
</beans>
```

db.properties

```
jdbc.driver=com.mysql.jdbc.Driver
jdbc.host=localhost
jdbc.database=ssmdemo
jdbc.userName=root
jdbc.passWord=123456
jdbc.initialSize=0
jdbc.maxActive=20
jdbc.maxIdle=20
jdbc.minIdle=1
jdbc.maxWait=1000
```

由于applicationContext-dao.xml中配置了Mapper接口扫描，所以删除mybatis-config.xml中的配置，否则报已映射错误：
Caused by: org.apache.ibatis.builder.BuilderException: Error parsing Mapper XML. Cause: java.lang.IllegalArgumentException: Mapped Statements collection already contains value for MyMapper.selectUser
删除mybatis-config.xml中的映射配置：

```
<!--<mappers>-->
    <!--<mapper resource="mappers/MyMapper.xml"/>-->
    <!--<mapper resource="mappers/UserDaoMapper.xml"/>-->
    <!--<mapper resource="mappers/UserMapper.xml"/>-->
    <!--<mapper resource="mappers/OrderMapper.xml"/>-->
<!--</mappers>-->
```

或者在构建sqlSessionFactory时不配置mybatis-config.xml也行：

```
<!-- spring和MyBatis完美整合 -->
<bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
    <property name="dataSource" ref="dataSource"/>
    <!-- 自动扫描mapping.xml文件 -->
    <property name="mapperLocations" value="classpath:mappers/*.xml"></property>
    <!--如果mybatis-config.xml没有特殊配置也可以不需要下面的配置-->
    <!--<property name="configLocation" value="classpath:mybatis-config.xml" />-->
</bean>
```

### 8.3 测试

UserMapperSpringTest.java

```
import com.zpc.mybatis.dao.UserMapper;
import com.zpc.mybatis.pojo.User;
import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import java.io.InputStream;
import java.util.Date;
import java.util.List;

//目标：测试一下spring的bean的某些功能
@RunWith(SpringJUnit4ClassRunner.class)//junit整合spring的测试//立马开启了spring的注解
@ContextConfiguration(locations="classpath:spring/applicationContext-*.xml")//加载核心配置文件，自动构建spring容器
public class UserMapperSpringTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    public void testQueryUserByTableName() {
        List<User> userList = this.userMapper.queryUserByTableName("tb_user");
        for (User user : userList) {
            System.out.println(user);
        }
    }

    @Test
    public void testLogin() {
        System.out.println(this.userMapper.login("hj", "123456"));
    }

    @Test
    public void testQueryUserById() {
        System.out.println(this.userMapper.queryUserById("1"));
        User user = new User();
        user.setName("美女");
        user.setId("1");
        userMapper.updateUser(user);

        System.out.println(this.userMapper.queryUserById("1"));
    }

    @Test
    public void testQueryUserAll() {
        List<User> userList = this.userMapper.queryUserAll();
        for (User user : userList) {
            System.out.println(user);
        }
    }

    @Test
    public void testInsertUser() {
        User user = new User();
        user.setAge(20);
        user.setBirthday(new Date());
        user.setName("大神");
        user.setPassword("123456");
        user.setSex(2);
        user.setUserName("bigGod222");
        this.userMapper.insertUser(user);
        System.out.println(user.getId());
    }

    @Test
    public void testUpdateUser() {
        User user = new User();
        user.setBirthday(new Date());
        user.setName("静静");
        user.setPassword("123456");
        user.setSex(0);
        user.setUserName("Jinjin");
        user.setId("1");
        this.userMapper.updateUser(user);
    }

    @Test
    public void testDeleteUserById() {
        this.userMapper.deleteUserById("1");
    }

    @Test
    public void testqueryUserList() {
        List<User> users = this.userMapper.queryUserList(null);
        for (User user : users) {
            System.out.println(user);
        }
    }

    @Test
    public void queryUserListByNameAndAge() throws Exception {
        List<User> users = this.userMapper.queryUserListByNameAndAge("鹏程", 20);
        for (User user : users) {
            System.out.println(user);
        }
    }

    @Test
    public void queryUserListByNameOrAge() throws Exception {
        List<User> users = this.userMapper.queryUserListByNameOrAge(null, 16);
        for (User user : users) {
            System.out.println(user);
        }
    }

    @Test
    public void queryUserListByIds() throws Exception {
        List<User> users = this.userMapper.queryUserListByIds(new String[]{"5", "2"});
        for (User user : users) {
            System.out.println(user);
        }
    }
```

目录结构：

![img](https://raw.githubusercontent.com/chen-boran/Picture_bed/main/img/1456626-20190327213559514-141765959.png)

## 9.SpringBoot 集成Mybatis

请参见博客：https://blog.csdn.net/hellozpc/article/details/82531834

 

###  

## 10. Mabitis 逆向工程

**MyBatis Generator：** 

 一个专门为MyBatis框架使用者定制的代码生成器，快速的根据表生成对应的映射文件，接口，以及bean类。支持基本的增删改查，以及QBC风格的条件查询。但是表连接、存储过程等这些复杂sql的定义需要我们手工编写。

• 官方文档地址

http://www.mybatis.org/generator/ 

• 官方工程地址

https://github.com/mybatis/generator/releases

**使用**：创建数据库文件

倒入逆向工程jar包     mybatis-generator-core-1.3.2.jar

使用步骤：

1）编写MBG的配置文件（重要几处配置）

```
1）jdbcConnection配置数据库连接信息

2）javaModelGenerator配置javaBean的生成策略

3）sqlMapGenerator 配置sql映射文件生成策略

4）javaClientGenerator配置Mapper接口的生成策略

5）table 配置要逆向解析的数据表

tableName：表名

domainObjectName：对应的javaBean名 
```

  2）运行代码生成器生成代码

 

## 11.Mybatis工作原理



```
步骤：
*  1、根据配置文件（全局，sql映射）初始化出Configuration对象
*  2、创建一个DefaultSqlSession对象，
*     他里面包含Configuration以及
*     Executor（根据全局配置文件中的defaultExecutorType创建出对应的Executor）
*  3、DefaultSqlSession.getMapper（）：拿到Mapper接口对应的MapperProxy；
*  4、MapperProxy里面有（DefaultSqlSession）；
*  5、执行增删改查方法：
*         1）、调用DefaultSqlSession的增删改查（Executor）；
*         2）、会创建一个StatementHandler对象。
*            （同时也会创建出ParameterHandler和ResultSetHandler）
*         3）、调用StatementHandler预编译参数以及设置参数值;
*            使用ParameterHandler来给sql设置参数
*         4）、调用StatementHandler的增删改查方法；
*         5）、ResultSetHandler封装结果
*  注意：
*      四大对象每个创建的时候都有一个				         interceptorChain.pluginAll(parameterHandler);
* 
```







 

 
