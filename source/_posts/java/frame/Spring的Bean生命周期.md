---
title: Spring的Bean生命周期
toc: true
recommend: 1
keywords: categories-java spring,bean初始化详解spring Bean生命周期
date: 2020-01-31 18:23:32
thumbnail: https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200131182703.png
tags: [spring,bean]
categories: [java,spring]
---
### 一、获取Bean
#### 第一阶段获取Bean

这里的流程图的入口在 `AbstractBeanFactory`类的 `doGetBean`方法，这里可以配合前面的 getBean方法分析文章进行阅读。主要流程就是

**1、**先处理Bean 的名称，因为如果以“&”开头的Bean名称表示获取的是对应的FactoryBean对象；
**2、**从缓存中获取单例Bean，有则进一步判断这个Bean是不是在创建中，如果是的就等待创建完毕，否则直接返回这个Bean对象
**3、**如果不存在单例Bean缓存，则先进行循环依赖的解析
**4、**解析完毕之后先获取父类BeanFactory，获取到了则调用父类的getBean方法，不存在则先合并然后创建Bean
<!-- more -->
![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200131172749.png)

### 二、创建Bean

#### 创建Bean之前

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200131173132.png)

#### 在真正创建Bean之前逻辑

这个流程图对应的代码在 `AbstractAutowireCapableBeanFactory`类的 `createBean`方法中。

**1、**这里会先获取 `RootBeanDefinition`对象中的Class对象并确保已经关联了要创建的Bean的Class 。
**2、**这里会检查3个条件

（1）Bean的属性中的 `beforeInstantiationResolved`字段是否为true，默认是false。
（2）Bean是原生的Bean
（3）Bean的 `hasInstantiationAwareBeanPostProcessors`属性为true，这个属性在Spring准备刷新容器钱转杯BeanPostProcessors的时候会设置，如果当前Bean实现了 `InstantiationAwareBeanPostProcessor`则这个就会是true。

当三个条件都存在的时候，就会调用实现的 `InstantiationAwareBeanPostProcessor`接口的 `postProcessBeforeInstantiation`方法，然后获取返回的Bean，如果返回的Bean不是null还会调用实现的 `BeanPostProcessor`接口的 `postProcessAfterInitialization`方法，这里用代码说明

```java
protected Object  resolveBeforeInstantiation(String beanName,RootBeanDefinition mbd) {

        Object bean = null;
        //条件1
        if(! Boolean.FALSE.equals(mbd.beforeInstantiationResolved)) {
            //条件2跟条件3
            if(!mbd.isSynthetic() && hasInstantiationAwareBeanPostProcessors()) {
                Class<?> targetType = determineTargetType(beanName, mbd);
                if(targetType != null) {
                    //调用实现的postProcessBeforeInstantiation方法
                    bean = applyBeanPostProcessorsBeforeInstantiation(targetType, beanName);
                    if(bean != null ) {
                    //调用实现的postProcessAfterInitialization方法
                        bean = applyBeanPostProcessorsAfterInitialization(bean, beanName);
                    }
                }
            }
            //不满足2或者3的时候就会设置为false
            mbd.beforeInstantiationResolved = (bean != null);
        }
        return bean;
    }
```

如果上面3个条件其中一个不满足就不会调用实现的方法。默认这里都不会调用的这些 `BeanPostProcessors`的实现方法。然后继续执行后面的 `doCreateBean`方法。

#### 真正的创建Bean，doCreateBean

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200131174146.png)

#### doCreateBean方法逻辑

这个代码的实现还是在 `AbstractAutowireCapableBeanFactory`方法中。流程是

**1、**先检查 `instanceWrapper`变量是不是null，这里一般是null，除非当前正在创建的Bean在 `factoryBeanInstanceCache`中存在这个是保存还没创建完成的FactoryBean的集合。
**2、**调用createBeanInstance方法实例化Bean，这个方法在后面会讲解
**3、**如果当前 `RootBeanDefinition`对象还没有调用过实现了的 `MergedBeanDefinitionPostProcessor`接口的方法，则会进行调用 。
**4、** 当满足以下三点
（1）是单例Bean
（2）尝试解析bean之间的循环引用
（3）bean目前正在创建中
则会进一步检查是否实现了 `SmartInstantiationAwareBeanPostProcessor`接口如果实现了则调用是实现的 `getEarlyBeanReference`方法5、 调用 `populateBean`方法进行属性填充，这里后面会讲解6、 调用 `initializeBean`方法对Bean进行初始化，这里后面会讲解

#### 实例化Bean，createBeanInstance

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200131174320.png)

#### 实例化Bean

这里的逻辑稍微有一点复杂，这个流程图已经是简化过后的了。简要根据代码说明一下流程

```java
protected BeanWrapper createBeanInstance(String beanName, RootBeanDefinition mbd, Object[] args) {
        Class<?> beanClass = this.resolveBeanClass(mbd, beanName, new Class[0]);
        if (beanClass != null && !Modifier.isPublic(beanClass.getModifiers()) && !mbd.isNonPublicAccessAllowed()) {
            throw new BeanCreationException(mbd.getResourceDescription(), beanName, "Bean class isn't public, and non-public access not allowed: " + beanClass.getName());
        } else if (mbd.getFactoryMethodName() != null) {
            return this.instantiateUsingFactoryMethod(beanName, mbd, args);
        } else {
            boolean resolved = false;
            boolean autowireNecessary = false;
            if (args == null) {
                Object var7 = mbd.constructorArgumentLock;
                synchronized(mbd.constructorArgumentLock) {
                    if (mbd.resolvedConstructorOrFactoryMethod != null) {
                        resolved = true;
                        autowireNecessary = mbd.constructorArgumentsResolved;
                    }
                }
            }

            if (resolved) {
                return autowireNecessary ? this.autowireConstructor(beanName, mbd, (Constructor[])null, (Object[])null) : this.instantiateBean(beanName, mbd);
            } else {
                Constructor<?>[] ctors = this.determineConstructorsFromBeanPostProcessors(beanClass, beanName);
                return ctors == null && mbd.getResolvedAutowireMode() != 3 && !mbd.hasConstructorArgumentValues() && ObjectUtils.isEmpty(args) ? this.instantiateBean(beanName, mbd) : this.autowireConstructor(beanName, mbd, ctors, args);
            }
        }
    }
```

**1、**先检查Class是否已经关联了，并且对应的修饰符是否是public的
**2、**如果用户定义了Bean实例化的函数，则调用并返回
**3、**如果当前Bean实现了 `FactoryBean`接口则调用对应的 `FactoryBean`接口的 `getObject`方法
**4、**根据getBean时候是否传入构造参数进行处理
**4.1** 如果没有传入构造参数，则检查是否存在已经缓存的无参构造器，有则使用构造器直接创建，没有就会调用 `instantiateBean`方法先获取实例化的策略默认是 `CglibSubclassingInstantiationStrategy`，然后实例化Bean。最后返回
**4.2** 如果传入了构造参数，则会先检查是否实现了 `SmartInstantiationAwareBeanPostProcessor`接口，如果实现了会调用 `determineCandidateConstructors`获取返回的候选构造器。
**4.3** 检查4个条件是否满足一个
（1）构造器不为null，
（2）从RootBeanDefinition中获取到的关联的注入方式是构造器注入（没有构造参数就是setter注入，有则是构造器注入）
（3）含有构造参数
（4）getBean方法传入构造参数不是空

满足其中一个则会调用返回的候选构造器实例化Bean并返回，如果都不满足，则会根据构造参数选则合适的有参构造器然后实例化Bean并返回

**5、**如果上面都没有合适的构造器，则直接使用无参构造器创建并返回Bean。

#### 填充Bean，populateBean

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200131175228.png)

#### 填充Bean

这里还是根据代码来说一下流程

```java
protected void populateBean(String beanName, RootBeanDefinition mbd, BeanWrapper bw) {
        PropertyValues pvs = mbd.getPropertyValues();
        if (bw == null) {
            if (!((PropertyValues)pvs).isEmpty()) {
                throw new BeanCreationException(mbd.getResourceDescription(), beanName, "Cannot apply property values to null instance");
            }
        } else {
            boolean continueWithPropertyPopulation = true;
            if (!mbd.isSynthetic() && this.hasInstantiationAwareBeanPostProcessors()) {
                Iterator var6 = this.getBeanPostProcessors().iterator();

                while(var6.hasNext()) {
                    BeanPostProcessor bp = (BeanPostProcessor)var6.next();
                    if (bp instanceof InstantiationAwareBeanPostProcessor) {
                        InstantiationAwareBeanPostProcessor ibp = (InstantiationAwareBeanPostProcessor)bp;
                        if (!ibp.postProcessAfterInstantiation(bw.getWrappedInstance(), beanName)) {
                            continueWithPropertyPopulation = false;
                            break;
                        }
                    }
                }
            }

            if (continueWithPropertyPopulation) {
                if (mbd.getResolvedAutowireMode() == 1 || mbd.getResolvedAutowireMode() == 2) {
                    MutablePropertyValues newPvs = new MutablePropertyValues((PropertyValues)pvs);
                    if (mbd.getResolvedAutowireMode() == 1) {
                        this.autowireByName(beanName, mbd, bw, newPvs);
                    }

                    if (mbd.getResolvedAutowireMode() == 2) {
                        this.autowireByType(beanName, mbd, bw, newPvs);
                    }

                    pvs = newPvs;
                }

                boolean hasInstAwareBpps = this.hasInstantiationAwareBeanPostProcessors();
                boolean needsDepCheck = mbd.getDependencyCheck() != 0;
                if (hasInstAwareBpps || needsDepCheck) {
                    PropertyDescriptor[] filteredPds = this.filterPropertyDescriptorsForDependencyCheck(bw, mbd.allowCaching);
                    if (hasInstAwareBpps) {
                        Iterator var9 = this.getBeanPostProcessors().iterator();

                        while(var9.hasNext()) {
                            BeanPostProcessor bp = (BeanPostProcessor)var9.next();
                            if (bp instanceof InstantiationAwareBeanPostProcessor) {
                                InstantiationAwareBeanPostProcessor ibp = (InstantiationAwareBeanPostProcessor)bp;
                                pvs = ibp.postProcessPropertyValues((PropertyValues)pvs, filteredPds, bw.getWrappedInstance(), beanName);
                                if (pvs == null) {
                                    return;
                                }
                            }
                        }
                    }

                    if (needsDepCheck) {
                        this.checkDependencies(beanName, mbd, filteredPds, (PropertyValues)pvs);
                    }
                }

                this.applyPropertyValues(beanName, mbd, bw, (PropertyValues)pvs);
            }
        }
    }
```

**1、**检查当前Bean是否实现了 `InstantiationAwareBeanPostProcessor`的 `postProcessAfterInstantiation`方法则调用，并结束Bean的填充。
**2、**将按照类型跟按照名称注入的Bean分开，如果注入的Bean还没有实例化的这里会实例化，然后放到 `PropertyValues`对象中。
**3、**如果实现了 `InstantiationAwareBeanPostProcessor`类的 `postProcessProperties`则调用这个方法并获取返回值，如果返回值是null，则有可能是实现了过期的 `postProcessPropertyValues`方法，这里需要进一步调用 `postProcessPropertyValues`方法
**4、**进行参数填充

#### 初始化Bean，initializeBean

![](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200131175430.png)

#### 初始化Bean

同时这里根据代码跟流程图来说明

**1、**如果Bean实现了 `BeanNameAware`, `BeanClassLoaderAware`, `BeanFactoryAware`则调用对应实现的方法 。
**2、**Bean不为null并且bean不是合成的，如果实现了 `BeanPostProcessor`的 `postProcessBeforeInitialization`则会调用实现的 `postProcessBeforeInitialization`方法。在 `ApplicationContextAwareProcessor`类中实现了 `postProcessBeforeInitialization`方法。而这个类会在Spring刷新容器准备 `beanFactory`的时候会加进去，这里就会被调用，而调用里面会检查Bean是不是 `EnvironmentAware`, `EmbeddedValueResolverAware`, `ResourceLoaderAware`, `ApplicationEventPublisherAware`, `MessageSourceAware`, `ApplicationContextAware`的实现类。这里就会调用对应的实现方法。代码如下

```java
protected void prepareBeanFactory(ConfigurableListableBeanFactory beanFactory) {
        beanFactory.setBeanClassLoader(this.getClassLoader());
        beanFactory.setBeanExpressionResolver(new StandardBeanExpressionResolver(beanFactory.getBeanClassLoader()));
        beanFactory.addPropertyEditorRegistrar(new ResourceEditorRegistrar(this, this.getEnvironment()));
        beanFactory.addBeanPostProcessor(new ApplicationContextAwareProcessor(this));
        beanFactory.ignoreDependencyInterface(ResourceLoaderAware.class);
        beanFactory.ignoreDependencyInterface(ApplicationEventPublisherAware.class);
        beanFactory.ignoreDependencyInterface(MessageSourceAware.class);
        beanFactory.ignoreDependencyInterface(ApplicationContextAware.class);
        beanFactory.ignoreDependencyInterface(EnvironmentAware.class);
        beanFactory.registerResolvableDependency(BeanFactory.class, beanFactory);
        beanFactory.registerResolvableDependency(ResourceLoader.class, this);
        beanFactory.registerResolvableDependency(ApplicationEventPublisher.class, this);
        beanFactory.registerResolvableDependency(ApplicationContext.class, this);
        if (beanFactory.containsBean("loadTimeWeaver")) {
            beanFactory.addBeanPostProcessor(new LoadTimeWeaverAwareProcessor(beanFactory));
            beanFactory.setTempClassLoader(new ContextTypeMatchClassLoader(beanFactory.getBeanClassLoader()));
        }

        if (!beanFactory.containsLocalBean("environment")) {
            beanFactory.registerSingleton("environment", this.getEnvironment());
        }

        if (!beanFactory.containsLocalBean("systemProperties")) {
            beanFactory.registerSingleton("systemProperties", this.getEnvironment().getSystemProperties());
        }

        if (!beanFactory.containsLocalBean("systemEnvironment")) {
            beanFactory.registerSingleton("systemEnvironment", this.getEnvironment().getSystemEnvironment());
        }

    }


public Object postProcessBeforeInitialization(final Object bean, String beanName) throws BeansException {
        AccessControlContext acc = null;
        if (System.getSecurityManager() != null && (bean instanceof EnvironmentAware || bean instanceof EmbeddedValueResolverAware || bean instanceof ResourceLoaderAware || bean instanceof ApplicationEventPublisherAware || bean instanceof MessageSourceAware || bean instanceof ApplicationContextAware)) {
            acc = this.applicationContext.getBeanFactory().getAccessControlContext();
        }

        if (acc != null) {
            AccessController.doPrivileged(new PrivilegedAction<Object>() {
                public Object run() {
                    ApplicationContextAwareProcessor.this.invokeAwareInterfaces(bean);
                    return null;
                }
            }, acc);
        } else {
            this.invokeAwareInterfaces(bean);
        }

        return bean;
    }
```

**1、**实例化Bean然后，检查是否实现了 `InitializingBean`的 `afterPropertiesSet`方法，如果实现了就会调用
**2、**Bean不为null并且bean不是合成的，如果实现了 `BeanPostProcessor`的 `postProcessBeforeInitialization`则会调用实现的 `postProcessAfterInitialization`方法。

到此创建Bean 的流程就没了，剩下的就是容器销毁的时候的了

### 三、destory方法跟销毁Bean

Bean在创建完毕之后会检查用户是否指定了 `destroyMethodName`以及是否实现了 `DestructionAwareBeanPostProcessor`接口的 `requiresDestruction`方法，如果指定了会记录下来保存在 `DisposableBeanAdapter`对象中并保存在bean的 `disposableBeans`属性中。代码在 `AbstractBeanFactory`的 `registerDisposableBeanIfNecessary`中

```java
protected void registerDisposableBeanIfNecessary(String beanName, Object bean, RootBeanDefinition mbd) {
        AccessControlContext acc = System.getSecurityManager() != null ? this.getAccessControlContext() : null;
        if (!mbd.isPrototype() && this.requiresDestruction(bean, mbd)) {
            if (mbd.isSingleton()) {
                this.registerDisposableBean(beanName, new DisposableBeanAdapter(bean, beanName, mbd, this.getBeanPostProcessors(), acc));
            } else {
                Scope scope = (Scope)this.scopes.get(mbd.getScope());
                if (scope == null) {
                    throw new IllegalStateException("No Scope registered for scope name '" + mbd.getScope() + "'");
                }

                scope.registerDestructionCallback(beanName, new DisposableBeanAdapter(bean, beanName, mbd, this.getBeanPostProcessors(), acc));
            }
        }

    }

public DisposableBeanAdapter(Object bean, String beanName, RootBeanDefinition beanDefinition, List<BeanPostProcessor> postProcessors, AccessControlContext acc) {
        Assert.notNull(bean, "Disposable bean must not be null");
        this.bean = bean;
        this.beanName = beanName;
        this.invokeDisposableBean = this.bean instanceof DisposableBean && !beanDefinition.isExternallyManagedDestroyMethod("destroy");
        this.nonPublicAccessAllowed = beanDefinition.isNonPublicAccessAllowed();
        this.acc = acc;
        String destroyMethodName = this.inferDestroyMethodIfNecessary(bean, beanDefinition);
        if (destroyMethodName != null && (!this.invokeDisposableBean || !"destroy".equals(destroyMethodName)) && !beanDefinition.isExternallyManagedDestroyMethod(destroyMethodName)) {
            this.destroyMethodName = destroyMethodName;
            this.destroyMethod = this.determineDestroyMethod();
            if (this.destroyMethod == null) {
                if (beanDefinition.isEnforceDestroyMethod()) {
                    throw new BeanDefinitionValidationException("Couldn't find a destroy method named '" + destroyMethodName + "' on bean with name '" + beanName + "'");
                }
            } else {
                Class<?>[] paramTypes = this.destroyMethod.getParameterTypes();
                if (paramTypes.length > 1) {
                    throw new BeanDefinitionValidationException("Method '" + destroyMethodName + "' of bean '" + beanName + "' has more than one parameter - not supported as destroy method");
                }

                if (paramTypes.length == 1 && Boolean.TYPE != paramTypes[0]) {
                    throw new BeanDefinitionValidationException("Method '" + destroyMethodName + "' of bean '" + beanName + "' has a non-boolean parameter - not supported as destroy method");
                }
            }
        }

        this.beanPostProcessors = this.filterPostProcessors(postProcessors, bean);
    }
```

在销毁Bean的时候最后都会调用 `AbstractAutowireCapableBeanFactory`的 `destroyBean`方法。

```java
    public void destroyBean(Object existingBean) {
        (new DisposableBeanAdapter(existingBean, this.getBeanPostProcessors(), this.getAccessControlContext())).destroy();
    }
```

这里是创建一个 `DisposableBeanAdapter`对象，这个对象实现了Runnable接口，在实现的 `run`方法中会调用实现的 `DisposableBean`接口的 `destroy`方法。并且在创建 `DisposableBeanAdapter`对象的时候会根据传入的bean是否实现了 `DisposableBean`接口来设置 `invokeDisposableBean`变量，这个变量表实有没有实现 `DisposableBean`接口

```java DisposableBeanAdapter.java >folded
public DisposableBeanAdapter(Object bean, List<BeanPostProcessor> postProcessors, AccessControlContext acc) {
        Assert.notNull(bean, "Disposable bean must not be null");
        this.bean = bean;
        this.beanName = null;
        this.invokeDisposableBean = this.bean instanceof DisposableBean;
        this.nonPublicAccessAllowed = true;
        this.acc = acc;
        this.beanPostProcessors = this.filterPostProcessors(postProcessors, bean);
    }
    
public void run() {
        this.destroy();
    }

public void destroy() {
        if (!CollectionUtils.isEmpty(this.beanPostProcessors)) {
            Iterator var1 = this.beanPostProcessors.iterator();

            while(var1.hasNext()) {
                DestructionAwareBeanPostProcessor processor = (DestructionAwareBeanPostProcessor)var1.next();
                processor.postProcessBeforeDestruction(this.bean, this.beanName);
            }
        }

        if (this.invokeDisposableBean) {
            if (logger.isDebugEnabled()) {
                logger.debug("Invoking destroy() on bean with name '" + this.beanName + "'");
            }

            try {
                if (System.getSecurityManager() != null) {
                    AccessController.doPrivileged(new PrivilegedExceptionAction<Object>() {
                        public Object run() throws Exception {
                            ((DisposableBean)DisposableBeanAdapter.this.bean).destroy();
                            return null;
                        }
                    }, this.acc);
                } else {
                    ((DisposableBean)this.bean).destroy();
                }
            } catch (Throwable var3) {
                String msg = "Invocation of destroy method failed on bean with name '" + this.beanName + "'";
                if (logger.isDebugEnabled()) {
                    logger.warn(msg, var3);
                } else {
                    logger.warn(msg + ": " + var3);
                }
            }
        }

        if (this.destroyMethod != null) {
            this.invokeCustomDestroyMethod(this.destroyMethod);
        } else if (this.destroyMethodName != null) {
            Method methodToCall = this.determineDestroyMethod();
            if (methodToCall != null) {
                this.invokeCustomDestroyMethod(methodToCall);
            }
        }

    }
```

### 四、总结

![实例化之前的准备阶段](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200131181906.png)

![实例化前](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200131181931.png)

![实例化后](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200131181951.png)

![初始化前](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200131182017.png)

![初始化后+销毁](https://cdn.jsdelivr.net/gh/removeif/blog_image/img/2020/20200131182037.png)


参考文章:
[参考链接](https://mp.weixin.qq.com/s/8F2ViVXa5hnn5Lljbis0VA)


