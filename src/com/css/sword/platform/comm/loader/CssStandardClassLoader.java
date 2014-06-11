package com.css.sword.platform.comm.loader;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.net.JarURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLClassLoader;
import java.net.URLConnection;
import java.net.URLStreamHandler;
import java.net.URLStreamHandlerFactory;
import java.security.AccessControlException;
import java.util.Enumeration;
import java.util.jar.JarFile;
import java.util.jar.JarInputStream;
import java.util.jar.Manifest;


/**
 * 
 * 
 * <p>Title: StandardClassLoader</p>
 * <p>Description: SWORD 企业应用基础平台</p>
 * <p>Copyright: Copyright (c) 2005 中国软件与技术服务股份有限公司</p>
 * <p>Company: CS&S </p>
 * @author 刘付伟
 * @version 1.0  Created on 2005-1-6
 */
public class CssStandardClassLoader
    extends URLClassLoader
    implements Reloader {

    // ----------------------------------------------------------------------------- 实例变量


    /**
     * 日志级别
     */
    protected int debug = 0;


    /**
     * "委托优先"标记,在检查本地类库之前,是否先委托父类加载器加载
     */
    protected boolean delegate = false;


    /**
     * 本地类库, 注意类库加入的顺序
     */
    protected String repositories[] = new String[0];

    /**
     * SecurityManager实例
     */
    private SecurityManager securityManager = null;


    /**
     * 父类加载器
     */
    private ClassLoader parent = null;


    /**
     * 系统类加载器
     */
    private ClassLoader system = null;


    /**
     * URL stream handler for additional protocols.
     */
    protected URLStreamHandlerFactory factory = null;



    // ----------------------------------------------------------------------------- 构造器


    /**
     * 构造器
     * 不指定类库和父类构造器
     * 
     */
    public CssStandardClassLoader() {

        super(new URL[0]);
        this.parent = getParent();
        this.system = getSystemClassLoader();
        securityManager = System.getSecurityManager();

    }


    /**
     * 构造器
     * 不指定类库和父类构造器, 但包含一个tream handler factory
     * 
     * @param factory 用于创建URLs的URLStreamHandlerFactory工厂
     */
    public CssStandardClassLoader(URLStreamHandlerFactory factory) {

        super(new URL[0], null, factory);
        this.factory = factory;

    }


    /**
     * 构造器, 指定父类构造器
     *
     * @param parent 父类构造器
     */
    public CssStandardClassLoader(ClassLoader parent) {

        super((new URL[0]), parent);
        this.parent = parent;
        this.system = getSystemClassLoader();
        securityManager = System.getSecurityManager();

    }


    /**
     * 构造器, 
     * 指定父类加载器和tream handler factory
     *
     * @param parent 父类加载器
     * @param factory 用于创建URLs的URLStreamHandlerFactory工厂
     */
    public CssStandardClassLoader(ClassLoader parent,
                               URLStreamHandlerFactory factory) {

        super((new URL[0]), parent, factory);
        this.factory = factory;

    }


    /**
     * 构造器
     * 指定关联类库
     * 
     * @param repositories 指定关联类库
     */
    public CssStandardClassLoader(String repositories[]) {

        super(convert(repositories));
        this.parent = getParent();
        this.system = getSystemClassLoader();
        securityManager = System.getSecurityManager();
        if (repositories != null) {
            for (int i = 0; i < repositories.length; i++)
                addRepositoryInternal(repositories[i]);
        }

    }


    /**
     * 构造器
     * 指定关联类库和父类加载器
     * 
     * @param repositories 关联类库
     * @param parent 父类加载器
     */
    public CssStandardClassLoader(String repositories[], ClassLoader parent) {

        super(convert(repositories), parent);
        this.parent = parent;
        this.system = getSystemClassLoader();
        securityManager = System.getSecurityManager();
        if (repositories != null) {
            for (int i = 0; i < repositories.length; i++)
                addRepositoryInternal(repositories[i]);
        }

    }


    /**
     * 构造器
     * 指定关联类库和父类加载器
     * 
     * @param repositories 关联类库
     * @param parent 父类加载器
     */
    public CssStandardClassLoader(URL repositories[], ClassLoader parent) {

        super(repositories, parent);
        this.parent = parent;
        this.system = getSystemClassLoader();
        securityManager = System.getSecurityManager();
        if (repositories != null) {
            for (int i = 0; i < repositories.length; i++)
                addRepositoryInternal(repositories[i].toString());
        }

    }



    // ------------------------------------------------------------- 属性方法


    /**
     * 返回日志级别
     */
    public int getDebug() {

        return (this.debug);

    }


    /**
     * 设置日志级别
     *
     * @param debug 日志级别
     */
    public void setDebug(int debug) {

        this.debug = debug;

    }


    /**
     * 返回"委托优先"标记
     */
    public boolean getDelegate() {

        return (this.delegate);

    }


    /**
     * 设置 "委托优先"标记
     *
     * @param delegate "委托优先"标记
     */
    public void setDelegate(boolean delegate) {

        this.delegate = delegate;

    }

    // ------------------------------------------------------- Reloader Methods

    /**
     * 为当前类加载器添加新的类库
     *
     * @param repository 类库资源名称, 如目录/jar文件/zip文件等
     */

    public void addRepository(String repository) {

        if (debug >= 1)
            log("addRepository(" + repository + ")");

        // Add this repository to our underlying class loader
        try {
            URLStreamHandler streamHandler = null;
            String protocol = parseProtocol(repository);
            if (factory != null)
                streamHandler = factory.createURLStreamHandler(protocol);
            URL url = new URL(null, repository, streamHandler);
            super.addURL(url);
        } catch (MalformedURLException e) {
            throw new IllegalArgumentException(e.toString());
        }

        // Add this repository to our internal list
        addRepositoryInternal(repository);

    }

    /**
     * 返回相关类加载器关联的类库列表信息, 如果没有,返回一个长度为0的数组
     */
    public String[] findRepositories() {

        return (repositories);
    }

    /**
     * This class loader doesn't check for reloading.
     */
    public boolean modified() {

        return (false);

    }

    /**
     * Render a String representation of this object.
     */
    public String toString() {

        StringBuffer sb = new StringBuffer("StandardClassLoader\r\n");
        sb.append("  delegate: ");
        sb.append(delegate);
        sb.append("\r\n");
        sb.append("  repositories:\r\n");
        for (int i = 0; i < repositories.length; i++) {
            sb.append("    ");
            sb.append(repositories[i]);
            sb.append("\r\n");
        }
        if (this.parent != null) {
            sb.append("----------> Parent Classloader:\r\n");
            sb.append(this.parent.toString());
            sb.append("\r\n");
        }
        return (sb.toString());

    }


    // ---------------------------------------------------- ClassLoader 方法


    
    
    /**
     * 覆盖父类方法
     * 
     * 在本地类库中加载指定的类,如果不存在,则抛出<code>ClassNotFoundException</code>.
     *
     * @param name 待加载类名
     *
     * @exception ClassNotFoundException 不存在,则抛出ClassNotFoundException.
     */
    public Class<?> findClass(String name) throws ClassNotFoundException {

        if (debug >= 3)
            log("    findClass(" + name + ")");

        // (1) Permission to define this class when using a SecurityManager
        if (securityManager != null) {
            int i = name.lastIndexOf('.');
            if (i >= 0) {
                try {
                    if (debug >= 4)
                        log("      securityManager.checkPackageDefinition");
                    securityManager.checkPackageDefinition(name.substring(0,i));
                } catch (Exception se) {
                    if (debug >= 4)
                        log("      -->Exception-->ClassNotFoundException", se);
                    throw new ClassNotFoundException(name);
                }
            }
        }

        // Ask our superclass to locate this class, if possible
        // (throws ClassNotFoundException if it is not found)
        Class<?> clazz = null;
        try {
            if (debug >= 4)
                log("      super.findClass(" + name + ")");
            try {
                synchronized (this) {
                    clazz = findLoadedClass(name);
                    if (clazz != null)
                        return clazz;
                    clazz = super.findClass(name);
                }
            } catch(AccessControlException ace) {
                throw new ClassNotFoundException(name);
            } catch (RuntimeException e) {
                if (debug >= 4)
                    log("      -->RuntimeException Rethrown", e);
                throw e;
            }
            if (clazz == null) {
                if (debug >= 3)
                    log("    --> Returning ClassNotFoundException");
                throw new ClassNotFoundException(name);
            }
        } catch (ClassNotFoundException e) {
            if (debug >= 3)
                log("    --> Passing on ClassNotFoundException", e);
            throw e;
        }

        // Return the class we have located
        if (debug >= 4)
            log("      Returning class " + clazz);
        if ((debug >= 4) && (clazz != null))
            log("      Loaded by " + clazz.getClassLoader());
        return (clazz);

    }

//    /**
//     * 自定义,测试用
//     * 
//     * 在本地类库中加载指定的类,如果不存在,则抛出<code>ClassNotFoundException</code>.
//     *
//     * @param name 待加载类名
//     *
//     * @exception ClassNotFoundException 不存在,则抛出ClassNotFoundException.
//     */
//    public Class findLocalClass(String name) throws ClassNotFoundException {
//        Class clazz = null;
//        try {
//            try {
//                synchronized (this) {
//                    clazz = super.findClass(name);
//                }
//            } catch(AccessControlException ace) {
//                throw new ClassNotFoundException(name);
//            } catch (RuntimeException e) {
//                throw e;
//            }
//            if (clazz == null) {
//                throw new ClassNotFoundException(name);
//            }
//        } catch (ClassNotFoundException e) {
//            throw e;
//        }
//
//        return (clazz);
//    }

    /**
     * 从本地类库中查找指定资源,返回指向该资源的<code>URL</code>. 如果资源不存在, 返回<code>null</code>
     *
     * @param name 待查找资源名称
     */
    public URL findResource(String name) {

        if (debug >= 3)
            log("    findResource(" + name + ")");

        URL url = super.findResource(name);
        if (debug >= 3) {
            if (url != null)
                log("    --> Returning '" + url.toString() + "'");
            else
                log("    --> Resource not found, returning null");
        }
        return (url);

    }


    /**
     * 从本地类库中查找指定资源,返回指向该资源的<code>URL</code>. 如果资源不存在, 返回
     * 空 enumerationA对象
     *
     * @param name 待查找资源名称
     *
     * @exception IOException 如果发生input/output error, 返回IOException
     */
    public Enumeration<URL> findResources(String name) throws IOException {

        if (debug >= 3)
            log("    findResources(" + name + ")");
        return (super.findResources(name));

    }


    /**
     * 根据指定名字查找资源
     * 
     * <p>
     * 按照以下算法查找: 如果找不到,返回<code>null</code>.

     * <ul>
     * <li>如果属性 <code>delegate</code>设置为 <code>true</code>,则调用父类加载器的
     *     <code>getResource()</code> 方法加载.</li>
     * <li>调用 <code>findResource()</code> 在本地类资源库中查找.</li>
     * <li>调用父类加载器的<code>getResource()</code> 方法查找</li>
     * </ul>
     *
     * @param name 待查找资源名称
     */
    public URL getResource(String name) {

        if (debug >= 2)
            log("getResource(" + name + ")");
        URL url = null;

        // (1) Delegate to parent if requested
        if (delegate) {
            if (debug >= 3)
                log("  Delegating to parent classloader");
            ClassLoader loader = parent;
            if (loader == null)
                loader = system;
            url = loader.getResource(name);
            if (url != null) {
                if (debug >= 2)
                    log("  --> Returning '" + url.toString() + "'");
                return (url);
            }
        }

        // (2) Search local repositories
        if (debug >= 3)
            log("  Searching local repositories");
        url = findResource(name);
        if (url != null) {
            if (debug >= 2)
                log("  --> Returning '" + url.toString() + "'");
            return (url);
        }

        // (3) Delegate to parent unconditionally if not already attempted
        if( !delegate ) {
            ClassLoader loader = parent;
            if (loader == null)
                loader = system;
            url = loader.getResource(name);
            if (url != null) {
                if (debug >= 2)
                    log("  --> Returning '" + url.toString() + "'");
                return (url);
            }
        }

        // (4) Resource was not found
        if (debug >= 2)
            log("  --> Resource not found, returning null");
        return (null);

    }


    /**
     * 根据指定的资源名称,返回读取该资源的流
     * 
     * @param name 待查找资源名称
     */
    public InputStream getResourceAsStream(String name) {

        if (debug >= 2)
            log("getResourceAsStream(" + name + ")");
        InputStream stream = null;

        // (0) Check for a cached copy of this resource
        stream = findLoadedResource(name);
        if (stream != null) {
            if (debug >= 2)
                log("  --> Returning stream from cache");
            return (stream);
        }

        // (1) Delegate to parent if requested
        if (delegate) {
            if (debug >= 3)
                log("  Delegating to parent classloader");
            ClassLoader loader = parent;
            if (loader == null)
                loader = system;
            stream = loader.getResourceAsStream(name);
            if (stream != null) {
                // FIXME - cache???
                if (debug >= 2)
                    log("  --> Returning stream from parent");
                return (stream);
            }
        }

        // (2) Search local repositories
        if (debug >= 3)
            log("  Searching local repositories");
        URL url = findResource(name);
        if (url != null) {
            // FIXME - cache???
            if (debug >= 2)
                log("  --> Returning stream from local");
            try {
               return (url.openStream());
            } catch (IOException e) {
               log("url.openStream(" + url.toString() + ")", e);
               return (null);
            }
        }

        // (3) Delegate to parent unconditionally
        if (!delegate) {
            if (debug >= 3)
                log("  Delegating to parent classloader");
            ClassLoader loader = parent;
            if (loader == null)
                loader = system;
            stream = loader.getResourceAsStream(name);
            if (stream != null) {
                // FIXME - cache???
                if (debug >= 2)
                    log("  --> Returning stream from parent");
                return (stream);
            }
        }

        // (4) Resource was not found
        if (debug >= 2)
            log("  --> Resource not found, returning null");
        return (null);

    }


    /**
     * 根据指定类名字加载类
     *
     * @param name 待加载类名字
     *
     * @exception  ClassNotFoundException 类找不到, 返回ClassNotFoundException
     */
    public Class<?> loadClass(String name) throws ClassNotFoundException {

        return (loadClass(name, false));

    }


    /**
     * 通过委托查找加载指定名字的类
     * 
     *
     * @param name 待加载类名字
     * @param resolve 如果为 <code>true</code> 则 resolve 指定类,即加载该类的关联类
     */
    public Class<?> loadClass(String name, boolean resolve)
        throws ClassNotFoundException {

        if (debug >= 2)
            log("loadClass(" + name + ", " + resolve + ")");
        Class<?> clazz = null;

        // (0) Check our previously loaded class cache
        clazz = findLoadedClass(name);
        if (clazz != null) {
            if (debug >= 3)
                log("  Returning class from cache");
            if (resolve)
                resolveClass(clazz);
            return (clazz);
        }

        // If a system class, use system class loader
        if( name.startsWith("java.") ) {
            ClassLoader loader = system;
            clazz = loader.loadClass(name);
            if (clazz != null) {
                if (resolve)
                    resolveClass(clazz);
                return (clazz);
            }
            throw new ClassNotFoundException(name);
        }

        // (.5) Permission to access this class when using a SecurityManager
        if (securityManager != null) {
            int i = name.lastIndexOf('.');
            if (i >= 0) {
                try {
                    securityManager.checkPackageAccess(name.substring(0,i));
                } catch (SecurityException se) {
                    String error = "Security Violation, attempt to use " +
                        "Restricted Class: " + name;
                    System.out.println(error);
                    se.printStackTrace();
                    log(error);
                    throw new ClassNotFoundException(error);
                }
            }
        }

        // (1) Delegate to our parent if requested
        if (delegate) {
            if (debug >= 3)
                log("  Delegating to parent classloader");
            ClassLoader loader = parent;
            if (loader == null)
                loader = system;
            try {
                clazz = loader.loadClass(name);
                if (clazz != null) {
                    if (debug >= 3)
                        log("  Loading class from parent");
                    if (resolve)
                        resolveClass(clazz);
                    return (clazz);
                }
            } catch (ClassNotFoundException e) {
                ;
            }
        }

        // (2) Search local repositories
        if (debug >= 3)
            log("  Searching local repositories");
        try {
            clazz = findClass(name);
            if (clazz != null) {
                if (debug >= 3)
                    log("  Loading class from local repository");
                if (resolve)
                    resolveClass(clazz);
                return (clazz);
            }
        } catch (ClassNotFoundException e) {
            ;
        }

        // (3) Delegate to parent unconditionally
        if (!delegate) {
            if (debug >= 3)
                log("  Delegating to parent classloader");
            ClassLoader loader = parent;
            if (loader == null)
                loader = system;
            try {
                clazz = loader.loadClass(name);
                if (clazz != null) {
                    if (debug >= 3)
                        log("  Loading class from parent");
                    if (resolve)
                        resolveClass(clazz);
                    return (clazz);
                }
            } catch (ClassNotFoundException e) {
                ;
            }
        }

        // This class was not found
        throw new ClassNotFoundException(name);

    }

    // ------------------------------------------------------ Protected 方法


    /**
     * 解析 URL protocol.
     *
     * @return String protocol
     */
    protected static String parseProtocol(String spec) {
        if (spec == null)
            return "";
        int pos = spec.indexOf(':');
        if (pos <= 0)
            return "";
        return spec.substring(0, pos).trim();
    }


    /**
     * 添加库到内部数组
     *
     * @param repository 新库
     */
    protected void addRepositoryInternal(String repository) {

        URLStreamHandler streamHandler = null;
        String protocol = parseProtocol(repository);
        if (factory != null)
            streamHandler = factory.createURLStreamHandler(protocol);

        // Validate the manifest of a JAR file repository
        if (!repository.endsWith(File.separator) &&
            !repository.endsWith("/")) {
            JarFile jarFile = null;
            try {
                @SuppressWarnings("unused")
				Manifest manifest = null;
                if (repository.startsWith("jar:")) {
                    URL url = new URL(null, repository, streamHandler);
                    JarURLConnection conn =
                        (JarURLConnection) url.openConnection();
                    conn.setAllowUserInteraction(false);
                    conn.setDoInput(true);
                    conn.setDoOutput(false);
                    conn.connect();
                    jarFile = conn.getJarFile();
                } else if (repository.startsWith("file://")) {
                    jarFile = new JarFile(repository.substring(7));
                } else if (repository.startsWith("file:")) {
                    jarFile = new JarFile(repository.substring(5));
                } else if (repository.endsWith(".jar")) {
                    URL url = new URL(null, repository, streamHandler);
                    URLConnection conn = url.openConnection();
                    JarInputStream jis =
                        new JarInputStream(conn.getInputStream());
                    manifest = jis.getManifest();
                } else {
                    throw new IllegalArgumentException
                        ("addRepositoryInternal:  Invalid URL '" +
                         repository + "'");
                }
            } catch (Throwable t) {
                t.printStackTrace();
                throw new IllegalArgumentException
                    ("addRepositoryInternal: " + t);
            } finally {
                if (jarFile != null) {
                    try {
                        jarFile.close();
                    } catch (Throwable t) {}
                }
            }
        }

        // Add this repository to our internal list
        synchronized (repositories) {
            String results[] = new String[repositories.length + 1];
            System.arraycopy(repositories, 0, results, 0, repositories.length);
            results[repositories.length] = repository;
            repositories = results;
        }

    }


    /**
     * 转化String数组为URL数组并返回
     *
     * @param input 待转化的String数组
     */
    protected static URL[] convert(String input[]) {
        return convert(input, null);
    }


    /**
     * 转化String数组为URL数组并返回
     *
     * @param input 待转化的String数组
     * @param factory 生成URLs的工厂对象
     */
    protected static URL[] convert(String input[],
                                   URLStreamHandlerFactory factory) {

        URLStreamHandler streamHandler = null;

        URL url[] = new URL[input.length];
        for (int i = 0; i < url.length; i++) {
            try {
                String protocol = parseProtocol(input[i]);
                if (factory != null)
                    streamHandler = factory.createURLStreamHandler(protocol);
                else
                    streamHandler = null;
                url[i] = new URL(null, input[i], streamHandler);
            } catch (MalformedURLException e) {
                url[i] = null;
            }
        }
        return (url);

    }


    /**
     * Finds the resource with the given name if it has previously been
     * loaded and cached by this class loader, and return an input stream
     * to the resource data.  If this resource has not been cached, return
     * <code>null</code>.
     *
     * @param name Name of the resource to return
     */
    protected InputStream findLoadedResource(String name) {

        return (null);  // FIXME - findLoadedResource()

    }


    /**
     * 输出日志信息
     *
     * @param message 日志信息
     */
    private void log(String message) {
        System.out.println("StandardClassLoader: " + message);

    }


    /**
     * 输出日志信息
     *
     * @param message 日志信息
     * @param throwable 异常信息
     */
    private void log(String message, Throwable throwable) {

        System.out.println("StandardClassLoader: " + message);
        throwable.printStackTrace(System.out);

    }


}

