package com.css.sword.platform.web.session;

import javax.servlet.http.HttpSession;

import com.css.sword.platform.web.context.ContextAPI;

/**
 * 
 * 用于web端的session
 * 
 */
public class HttpSessionUtils {

	public static void set(String key, Object value) {
		get().setAttribute(key, value);
	}
	
	public static Object get(String key) {
		return get().getAttribute(key);
	}

	public static void clear(String key) {
		get().removeAttribute(key);
	}

	private static HttpSession get() {
		return ContextAPI.getReq().getSession();
	}
}
