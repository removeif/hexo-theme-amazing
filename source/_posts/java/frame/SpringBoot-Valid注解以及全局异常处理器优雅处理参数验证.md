---
title: SpringBoot@Valid注解以及全局异常处理器优雅处理参数验证
toc: true
recommend: 1
keywords: categories-java,SpringBoot@Valid注解以及全局异常处理器优雅处理参数验证
uniqueId: '2020-02-20 10:04:31/"SpringBoot@Valid注解以及全局异常处理器优雅处理参数验证".html'
date: 2020-02-20 18:04:31
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200220180804.png
tags: [springboot,Valid]
categories: [java,springboot]
---
### 一、为什么使用 @Valid 来验证参数

在平常通过 Spring 框架写代码时候，会经常写接口类，相信大家对该类的写法非常熟悉。在写接口时经常要写效验请求参数逻辑，这时候我们会常用做法是写大量的 `if` 与 `if else` 类似这样的代码来做判断，如下：<!-- more -->

```java
@RestController
public class TestController {

    @PostMapping("/user")
    public String addUserInfo(@RequestBody User user) {
        if (user.getName() == null || "".equals(user.getName()) {
            ......
        } else if(user.getSex() == null || "".equals(user.getSex())) {
            ......
        } else if(user.getUsername() == null || "".equals(user.getUsername())) {
            ......
        } else {
            ......
        }
        ......
    }
    
}
```

这样的代码如果按正常代码逻辑来说，是没有什么问题的，不过按优雅来说，简直糟糕透了。不仅不优雅，而且如果存在大量的验证逻辑，这会使代码看起来乱糟糟，大大降低代码可读性，那么有没有更好的方法能够简化这个过程呢？答案当然是有，推荐的是使用 `@Valid` 注解来帮助我们简化验证逻辑。

### 二、@Valid 注解的作用

注解 `@Valid` 的主要作用是用于数据效验，可以在定义的实体中的属性上，添加不同的注解来完成不同的校验规则，而在接口类中的接收数据参数中添加 `@valid` 注解，这时你的实体将会开启一个校验的功能。

### 三、@Valid 的相关注解

下面是 @Valid 相关的注解，在实体类中不同的属性上添加不同的注解，就能实现不同数据的效验功能。

| 注解名称                  | 作用描述                                                     |
| :------------------------ | :----------------------------------------------------------- |
| @Null                     | 限制只能为null                                               |
| @NotNull                  | 限制必须不为null                                             |
| @AssertFalse              | 限制必须为false                                              |
| @AssertTrue               | 限制必须为true                                               |
| @DecimalMax(value)        | 限制必须为一个不大于指定值的数字                             |
| @DecimalMin(value)        | 限制必须为一个不小于指定值的数字                             |
| @Digits(integer,fraction) | 限制必须为一个小数，且整数部分的位数不能超过integer，小数部分的位数不能超过fraction |
| @Future                   | 限制必须是一个将来的日期                                     |
| @Max(value)               | 限制必须为一个不大于指定值的数字                             |
| @Min(value)               | 限制必须为一个不小于指定值的数字                             |
| @Past                     | 限制必须是一个过去的日期                                     |
| @Pattern(value)           | 限制必须符合指定的正则表达式                                 |
| @Size(max,min)            | 限制字符长度必须在min到max之间                               |
| @Past                     | 验证注解的元素值（日期类型）比当前时间早                     |
| @NotEmpty                 | 验证注解的元素值不为null且不为空（字符串长度不为0、集合大小不为0） |
| @NotBlank                 | 验证注解的元素值不为空（不为null、去除首位空格后长度为0），不同于@NotEmpty，@NotBlank只应用于字符串且在比较时会去除字符串的空格 |
| @Email                    | 验证注解的元素值是Email，也可以通过正则表达式和flag指定自定义的email格式 |

### 四、使用 @Valid 进行参数效验步骤

整个过程如下图所示，用户访问接口，然后进行参数效验，因为 @Valid 不支持平面的参数效验（直接写在参数中字段的效验）所以基于 GET 请求的参数还是按照原先方式进行效验，而 POST 则可以以实体对象为参数，可以使用 @Valid 方式进行效验。如果效验通过，则进入业务逻辑，否则抛出异常，交由全局异常处理器进行处理。

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200220175349.png)

#### 1、实体类中添加 @Valid 相关注解

使用 `@Valid` 相关注解非常简单，只需要在参数的实体类中属性上面添加如 `@NotBlank`、`@Max`、`@Min` 等注解来对该字段进限制，如下：

**User：**

```java
public class User {
    @NotBlank(message = "姓名不为空")
    private String username;
    @NotBlank(message = "密码不为空")
    private String password;
}
```

如果是嵌套的实体对象，则需要在最外层属性上添加 `@Valid` 注解：

**User：**

```java
public class User {
    @NotBlank(message = "姓名不为空")
    private String username;
    @NotBlank(message = "密码不为空")
    private String password;
    //嵌套必须加 @Valid，否则嵌套中的验证不生效
    @Valid
    @NotNull(message = "用户信息不能为空")
    private UserInfo userInfo;
}
```

**UserInfo：**

```java
public class User {
    @NotBlank(message = "年龄不为空")
    @Max(value = 18, message = "不能超过18岁")
    private String age;
    @NotBlank(message = "性别不能为空")
    private String gender;
}
```

#### 2、接口类中添加 @Valid 注解

在 `Controller` 类中添加接口，`POST` 方法中接收设置了 @Valid 相关注解的实体对象，然后在参数中添加 `@Valid` 注解来开启效验功能，需要注意的是， `@Valid` 对 `Get` 请求中接收的平面参数请求无效，稍微略显遗憾。

```java
@RestController
public class TestController {

    @PostMapping("/user")
    public String addUserInfo(@Valid @RequestBody User user) {
        return "调用成功!";
    }

}
```

#### 3、全局异常处理类中处理 @Valid 抛出的异常

最后，我们写一个全局异常处理类，然后对接口中抛出的异常进行处理，而 `@Valid` 配合 `Spring` 会抛出 `MethodArgumentNotValidException` 异常，这里我们需要对该异常进行处理即可。

```java
@RestControllerAdvice("club.mydlq.valid")   //指定异常处理的包名
public class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.BAD_REQUEST) //设置状态码为 400
    @ExceptionHandler({MethodArgumentNotValidException.class})
    public String paramExceptionHandler(MethodArgumentNotValidException e) {
        BindingResult exceptions = e.getBindingResult();
        // 判断异常中是否有错误信息，如果存在就使用异常中的消息，否则使用默认消息
        if (exceptions.hasErrors()) {
            List<ObjectError> errors = exceptions.getAllErrors();
            if (!errors.isEmpty()) {
                // 这里列出了全部错误参数，按正常逻辑，只需要第一条错误即可
                FieldError fieldError = (FieldError) errors.get(0);
                return fieldError.getDefaultMessage();
            }
        }
        return "请求参数错误";
    }
    
}
```

### 五、SpringBoot 中使用 @Valid 示例

#### 1、Maven 引入相关依赖

Maven 引入 SpringBoot 相关依赖，这里引入了 Lombok 包来简化开发过程。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.2.1.RELEASE</version>
    </parent>
    
    <groupId>com.aspire</groupId>
    <artifactId>springboot-valid-demo</artifactId>
    <version>0.0.1-SNAPSHOT</version>
    <name>springboot-valid-demo</name>
    <description>@valid demo</description>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

#### 2、自定义个异常类

自定义个异常类，方便我们处理 GET 请求（GET 请求参数中一般是没有实体对象的，所以不能使用 @Valid），当请求验证失败时，手动抛出自定义异常，交由全局异常处理。

```java
public class ParamaErrorException extends RuntimeException {

    public ParamaErrorException() {
    }

    public ParamaErrorException(String message) {
        super(message);
    }

}
```

#### 3、自定义响应枚举类

定义一个返回信息的枚举类，方便我们快速响应信息，不必每次都写返回消息和响应码。

```java
public enum ResultEnum {

    SUCCESS(1000, "请求成功"),
    PARAMETER_ERROR(1001, "请求参数有误!"),
    UNKNOWN_ERROR(9999, "未知的错误!");

    private Integer code;
    private String message;

    ResultEnum(Integer code, String message) {
        this.code = code;
        this.message = message;
    }

    public Integer getCode() {
        return code;
    }

    public String getMessage() {
        return message;
    }
}
```

#### 4、自定义响应对象类

创建用于返回调用方的响应信息的实体类。

```java
import com.aspire.parameter.enums.ResultEnum;
import lombok.Data;

@Data
public class ResponseResult {
    private Integer code;
    private String msg;

    public ResponseResult(){
    }

    public ResponseResult(ResultEnum resultEnum){
        this.code = resultEnum.getCode();
        this.msg = resultEnum.getMessage();
    }

    public ResponseResult(Integer code, String msg) {
        this.code = code;
        this.msg = msg;
    }
}
```

#### 5、自定义实体类中添加 @Valid 相关注解

下面将创建用于 POST 方法接收参数的实体对象，里面添加 @Valid 相关验证注解，并在注解中添加出错时的响应消息。

**User**

```java
import lombok.Data;
import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

/**
 * user实体类
 */
@Data
public class User {
    @NotBlank(message = "姓名不为空")
    private String username;
    @NotBlank(message = "密码不为空")
    private String password;
    // 嵌套必须加 @Valid，否则嵌套中的验证不生效
    @Valid
    @NotNull(message = "userinfo不能为空")
    private UserInfo userInfo;
}
```

**UserInfo**

```java
import lombok.Data;
import javax.validation.constraints.Max;
import javax.validation.constraints.NotBlank;

@Data
public class UserInfo {
    @NotBlank(message = "年龄不为空")
    @Max(value = 18, message = "不能超过18岁")
    private String age;
    @NotBlank(message = "性别不能为空")
    private String gender;
}
```

#### 6、Controller 中添加 @Valid 注解

接口类中添加 GET 和 POST 方法的两个接口用于测试，其中 POST 方法以上面创建的 Uer 实体对象接收参数，并使用 @Valid，而 GET 请求一般接收参数较少，所以使用正常判断逻辑进行参数效验。

```java
import club.mydlq.valid.entity.ResponseResult;
import club.mydlq.valid.entity.User;
import club.mydlq.valid.enums.ResultEnum;
import club.mydlq.valid.exception.ParamaErrorException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import javax.validation.Valid;

@RestController
public class TestController {

    /**
     * 获取用户信息
     *
     * @param username 姓名
     * @return ResponseResult
     */
    @Validated
    @GetMapping("/user/{username}")
    public ResponseResult findUserInfo(@PathVariable String username) {
        if (username == null || "".equals(username)) {
            throw new ParamaErrorException("username 不能为空");
        }
        return new ResponseResult(ResultEnum.SUCCESS);
    }


    /**
     * 新增用户
     *
     * @param user 用户信息
     * @return ResponseResult
     */
    @PostMapping("/user")
    public ResponseResult addUserInfo(@Valid @RequestBody User user) {
        return new ResponseResult(ResultEnum.SUCCESS);
    }

}
```

#### 7、全局异常处理

这里创建一个全局异常处理类，方便统一处理异常错误信息。里面添加了不同异常处理的方法，专门用于处理接口中抛出的异常信。

```java
import club.mydlq.valid.entity.ResponseResult;
import club.mydlq.valid.enums.ResultEnum;
import club.mydlq.valid.exception.ParamaErrorException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import java.util.List;

@Slf4j
@RestControllerAdvice("club.mydlq.valid")
public class GlobalExceptionHandler {

    /**
     * 忽略参数异常处理器
     *
     * @param e 忽略参数异常
     * @return ResponseResult
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseResult parameterMissingExceptionHandler(MissingServletRequestParameterException e) {
        log.error("", e);
        return new ResponseResult(ResultEnum.PARAMETER_ERROR.getCode(), "请求参数 " + e.getParameterName() + " 不能为空");
    }

    /**
     * 缺少请求体异常处理器
     *
     * @param e 缺少请求体异常
     * @return ResponseResult
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseResult parameterBodyMissingExceptionHandler(HttpMessageNotReadableException e) {
        log.error("", e);
        return new ResponseResult(ResultEnum.PARAMETER_ERROR.getCode(), "参数体不能为空");
    }

    /**
     * 参数效验异常处理器
     *
     * @param e 参数验证异常
     * @return ResponseInfo
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseResult parameterExceptionHandler(MethodArgumentNotValidException e) {
        log.error("", e);
        // 获取异常信息
        BindingResult exceptions = e.getBindingResult();
        // 判断异常中是否有错误信息，如果存在就使用异常中的消息，否则使用默认消息
        if (exceptions.hasErrors()) {
            List<ObjectError> errors = exceptions.getAllErrors();
            if (!errors.isEmpty()) {
                // 这里列出了全部错误参数，按正常逻辑，只需要第一条错误即可
                FieldError fieldError = (FieldError) errors.get(0);
                return new ResponseResult(ResultEnum.PARAMETER_ERROR.getCode(), fieldError.getDefaultMessage());
            }
        }
        return new ResponseResult(ResultEnum.PARAMETER_ERROR);
    }

    /**
     * 自定义参数错误异常处理器
     *
     * @param e 自定义参数
     * @return ResponseInfo
     */
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler({ParamaErrorException.class})
    public ResponseResult paramExceptionHandler(ParamaErrorException e) {
        log.error("", e);
        // 判断异常中是否有错误信息，如果存在就使用异常中的消息，否则使用默认消息
        if (!StringUtils.isEmpty(e.getMessage())) {
            return new ResponseResult(ResultEnum.PARAMETER_ERROR.getCode(), e.getMessage());
        }
        return new ResponseResult(ResultEnum.PARAMETER_ERROR);
    }

}
```

#### 8、启动类

```java
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
```

#### 9、示例测试

下面将针对上面示例中设置的两种接口进行测试，分别来验证参数效验功能。

**|| - 测试接口 /user/{username}**

使用 GET 方法请求地址 http://localhost:8080/user?username=test 时，返回信息：

```json
{
    "code": 1000,
    "msg": "请求成功"
}
```

当不输入参数，输入地址 http://localhost:8080/user 时，返回信息：

```json
{
    "code": 1001,
    "msg": "请求参数 username 不能为空"
}
```

可以看到在执行 GET 请求，能够正常按我们全局异常处理器中的设置处理异常信息。

**|| - 测试接口 /user**

(1)、使用 POST 方法发起请求，首先进行不加 JSON 请求体来对 http://localhost:8080/user 地址进行请求，返回信息：

```json
{
    "code": 1001,
    "msg": "参数体不能为空"
}
```

(2)、输入部分参数进行测试。

- 请求内容：

```json
{
 "username":"test",
 "password":"123"
}
```

- 返回信息：

```json
{
    "code": 1001,
    "msg": "userinfo不能为空"
}
```

(3)、输入完整参数，且设置 age > 18 时，进行测试。

```json
{
 "username":"111",
 "password":"sa",
  "userInfo":{
    "age":19,
    "gender":"男"
  }
}
```

- 返回信息：

```json
{
    "code": 1001,
    "msg": "不能超过18岁"
}
```

可以看到在执行 POST 请求，也能正常按我们全局异常处理器中的设置处理异常信息，且提示信息为我们设置在实体类中的 Message。

参考文章:
[参考链接1](http://www.mydlq.club/article/49/)
