package com.css.ctp.core.commutils;

import java.util.UUID;

/**
 * 会话相关工具类
 * 
 * @author 张久旭
 */
public class SessionUtils {
	/**
	 * 生成会话ID
	 * 
	 * @return
	 */
	public static String genSessionID() {
		return UUID.randomUUID().toString();
	}
}
