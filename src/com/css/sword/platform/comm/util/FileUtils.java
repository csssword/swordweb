package com.css.sword.platform.comm.util;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

/**
 * <p>Title: ClassName</p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 中软网络技术股份有限公司</p>
 * @author 于英民
 * @version 1.0
 */
public class FileUtils {
	
	private final static LogWritter logger = LogFactory.getLogger(FileUtils.class);
	
    private String loadFilename;

    public FileUtils() {
    }

    public FileUtils(String loadFilename) {
        this.loadFilename = loadFilename;
    }

    public String getAbsolutePath(String loadFilename) {
        ClassLoader loader = this.getClass().getClassLoader();
        URL url = loader.getResource(loadFilename);
        return url.getPath();
    }

    public String getAbsolutePath() {
        ClassLoader loader = this.getClass().getClassLoader();
        URL url = loader.getResource(loadFilename);
        return url.getPath();
    }

    public InputStream getInputStream() {
        ClassLoader loader = this.getClass().getClassLoader();
        URL url = loader.getResource(loadFilename);
        
        logger.debug(loadFilename + ".url=" + url.toString());
        
        try {
        	if(url!=null)
        		return url.openStream();
        } catch (IOException ex) {
            logger.error("打开配置文件流错误");
        }
        return null;
    }

}
