package com.css.sword.platform.comm.util.io;


/**
 * <p>Title: </p>
 * <p>Description:  * Default implementation of the ResourceLoader interface.
 * Used by ResourceEditor, but also suitable for standalone usage.
 *
 * <p>Will return an UrlResource if the location value is a URL, and a
 * ClassPathResource if it is a non-URL path or a "classpath:" pseudo-URL.</p>
 *
 * <p>Copyright: Copyright (c) 2004 中软网络??术股份有限公??</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

import java.net.MalformedURLException;
import java.net.URL;


public class DefaultResourceLoader implements IResourceLoader {

    public IResource getResource(String location) {
        if (location.startsWith(CLASSPATH_URL_PREFIX)) {
            return new ClassPathResource(location.substring(
                CLASSPATH_URL_PREFIX.length()));
        } else {
            try {
                // try URL
                URL url = new URL(location);
                return new UrlResource(url);
            } catch (MalformedURLException ex) {
                // no URL -> resolve resource path
                return getResourceByPath(location);
            }
        }
    }

    /**
     * Return a Resource handle for the resource at the given path.
     * <p>Default implementation supports class path locations. This should
     * be appropriate for standalone implementations but can be overridden,
     * e.g. for implementations targeted at a Servlet container.
     * @param path path to the resource
     * @return Resource handle
     * @see ClassPathResource
     * @see com.css.sword.platform.comm.context.support.FileSystemXmlApplicationContext#getResourceByPath
     * @see com.css.sword.platform.comm.web.context.support.XmlWebApplicationContext#getResourceByPath
     */
    protected IResource getResourceByPath(String path) {
        return new ClassPathResource(path);
    }

}