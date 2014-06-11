package com.css.sword.platform.comm.log;

import org.slf4j.LoggerFactory;

/**
 * <p>Title: </p>
 * <p>Description: 一个logger</p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author sunhao
 * @version 4.0
 */

public class LogFactory {
	
    /**
     * 得到系统用日志输出器
     * @param clazz
     * @return
     */
	public static LogWritter getLogger(Class<?> clazz) {
		return new LogWritter(LoggerFactory.getLogger(clazz));
	} 
	
	/**
	 * 获得指定名称的logger
	 * @param name
	 * @return
	 */
	public static LogWritter getLogger(String name) {
		return new LogWritter(LoggerFactory.getLogger(name));
	} 
}