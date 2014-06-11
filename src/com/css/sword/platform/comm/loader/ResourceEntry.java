
package com.css.sword.platform.comm.loader;

import java.net.URL;
import java.security.cert.Certificate;
import java.util.jar.Manifest;

/**
 * 
 * 
 * <p>Title: ResourceEntry</p>
 * <p>Description: SWORD 企业应用基础平台</p>
 * <p>Copyright: Copyright (c) 2005 中国软件与技术服务股份有限公司</p>
 * <p>Company: CS&S </p>
 * @author 刘付伟
 * @version 1.0  Created on 2005-1-6
 */

public class ResourceEntry {


    /**
     * The "last modified" time of the origin file at the time this class
     * was loaded, in milliseconds since the epoch.
     */
    public long lastModified = -1;


    /**
     * Binary content of the resource.
     */
    public byte[] binaryContent = null;


    /**
     * Loaded class.
     */
    public Class<?> loadedClass = null;


    /**
     * URL source from where the object was loaded.
     */
    public URL source = null;


    /**
     * URL of the codebase from where the object was loaded.
     */
    public URL codeBase = null;


    /**
     * Manifest (if the resource was loaded from a JAR).
     */
    public Manifest manifest = null;


    /**
     * Certificates (if the resource was loaded from a JAR).
     */
    public Certificate[] certificates = null;


}

