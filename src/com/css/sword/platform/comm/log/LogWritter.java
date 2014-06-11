package com.css.sword.platform.comm.log;

import org.slf4j.Logger;
import org.slf4j.spi.LocationAwareLogger;

/**
 * <p>Title: LogWritter</p>
 * <p>Description: 调用log4j写日志，基本思路是用当前的类??(加包??)去得到logger??
 * 这样形成??个天然的树型继承关系，利用log4j的继承机制，实现日志输出的灵活配置???</p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: cssnet</p>
 * @author wwq
 * @version 1.0
 * @since 4.0
 */
public class LogWritter {
//    /**
//     * logWritter的配置文件名??,该存放在同级系统路径下面
//     */
//    private static final String LOG_CONFIG_FILE = "log4j.properties";

    /**
     * java语言的静态初始化方法。这个方法用来初始化LogWritter类中的两个静态Logger属???和
     * 读取属???文件中的内容???它会首先调用org.apache.log4j.PropertyConfigurator类的??
     * 态方法configure（：String），来读取属性文件中的参数???configure方法??要一个String
     * 类型的参数，来表示属性文件的存放路径。属性文件的存放路径是与该LogWritter.class存放
     * 在相同路径下的，因此只需要传递近参数"logWriter.porperites"即可??
     */
//    static {
//        try {
//            ClassPathResource resource = new ClassPathResource(LOG_CONFIG_FILE);
//            PropertyConfigurator.configure(resource.getURL());
//        } catch (IOException ex) {
//            System.out.println("LogWritter IoException");
//        }
//    }

	private static final String FQCN = LogWritter.class.getName();

    private LocationAwareLogger logger;

    public LogWritter(Logger logger) {
        this.logger = (LocationAwareLogger)logger;//采用SLF4J的位置记录日志器        
    }
       
    public void debug(String message) {
        if (logger.isDebugEnabled()) {
        	logger.log(null,FQCN, LocationAwareLogger.DEBUG_INT, message, null);
        	//logger.debug(message);
        }
    }

    /**
     * 加入异常log
     */
    public void debug(String message, Throwable ex) {
        if (logger.isDebugEnabled()) {
        	logger.log(null,FQCN, LocationAwareLogger.DEBUG_INT, message, ex);
        	//logger.debug(message, ex);
        }
    }

    /**
     * 用于INFO级别信息输出
     */
    public void info(String message) {
        if (logger.isInfoEnabled()) {
        	logger.log(null,FQCN, LocationAwareLogger.INFO_INT, message, null);
        	//logger.info(message);
        }
    }

    public void info(String message, Throwable ex) {
        if (logger.isInfoEnabled()) {
        	logger.log(null,FQCN, LocationAwareLogger.INFO_INT, message, ex);
        	//logger.info(message, ex);
        }
    }

    /**
     * 用于WARN级别信息输出
     */
//    public void warn(String message) {
//        if (logger.isWarnEnabled()/*isEnabledFor(Priority.WARN)*/) {
//            logger.warn(message);
//        }
//    }
//
//    public void warn(String message, Throwable ex) {
//        if (logger.isWarnEnabled()/*isEnabledFor(Priority.WARN)*/) {
//            logger.warn(message, ex);
//        }
//    }

    /**
     * 用于ERROR级别信息输出
     */
    public void error(String message) {
        if (logger.isErrorEnabled()/*isEnabledFor(Priority.ERROR)*/) {
        	logger.log(null,FQCN, LocationAwareLogger.ERROR_INT, message, null);
        	//logger.error(message);
        }
    }

    public void error(String message, Throwable ex) {
        if (logger.isErrorEnabled()/*isEnabledFor(Priority.ERROR)*/) {
        	logger.log(null,FQCN, LocationAwareLogger.ERROR_INT, message, ex);
        	//logger.error(message, ex);
        }
    }

}