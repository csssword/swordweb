package com.css.sword.platform.comm.conf;

/**
 * 系统环境信息
 * 
 * @author 张久旭
 * 
 */
public class SystemInfo {

	/**
	 * 主机名或主机IP
	 */
	static private String host;

	public static String getHost() {
		return host;
	}

	protected static void setHost(String host) {
		SystemInfo.host = host;
	}

}
