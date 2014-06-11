package com.css.sword.platform.comm.conf;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;


/**
 * <p>Title: ConfLoaderFactory</p>
 * <p>Description: 属性加载器的工厂</p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 中软网络技术股份有限公司</p>
 * @author 于英民
 * @version 1.0
 */

public class ConfLoaderFactory {

	private final static LogWritter logger = LogFactory.getLogger(ConfLoaderFactory.class);
	
    private static ConfLoaderFactory instance = null;

    public static synchronized ConfLoaderFactory getInstance() {
        if (instance == null) {
            instance = new ConfLoaderFactory();
        }
        return instance;
    }

    /**
     * 返回加载类的具体实例
     * 
     * @param loadClassName String 加载类的名称
     * @return 加载类的具体实例
     */
    public IConfLoader getLoader(String loadClassName) {
        IConfLoader confLoader = null;
        try {
            confLoader = (IConfLoader) Class.forName(loadClassName).newInstance();
        } catch (ClassNotFoundException ex) {
            logger.error("获取加载类具体实例出现异常！", ex);
        } catch (IllegalAccessException ex) {
        	logger.error("获取加载类具体实例出现异常！", ex);
        } catch (InstantiationException ex) {
        	logger.error("获取加载类具体实例出现异常！", ex);
        }

        return confLoader;
    }
}
