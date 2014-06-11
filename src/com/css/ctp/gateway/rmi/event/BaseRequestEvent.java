package com.css.ctp.gateway.rmi.event;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;

/**
 * 数据传输对象基类-请求参数
 * 
 * @author 史文帅
 * 
 */
public abstract class BaseRequestEvent implements Serializable {
	private static final long serialVersionUID = -3497232976545364331L;

	protected Map<String, Object> data = new HashMap<String, Object>();

	/**
	 * 获取全部数据
	 * 
	 * @return
	 */
	public final Map<String, Object> getData() {
		return data;
	}

	/**
	 * 接口开发者在定义子类时定义固定的方法名
	 * 
	 * @return
	 */
	public abstract String getMethod();

	/**
	 * 接口开发者在定义子类时定义固定的
	 * 
	 * @return
	 */
	public abstract String getTransactionID();

}
