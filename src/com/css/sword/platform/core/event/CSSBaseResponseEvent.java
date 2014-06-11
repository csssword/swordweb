package com.css.sword.platform.core.event;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>
 * Title: CSSBaseResponseEvnet
 * </p>
 * <p>
 * Description: 所有单一返回事件的基类
 * </p>
 * <p>
 * Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司
 * </p>
 * <p>
 * Company: 应用产品研发中心
 * </p>
 * 
 * @author wwq
 * @version 1.0
 */

public class CSSBaseResponseEvent implements IResponseEvent {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private long costTime;

	/**
	 * 表明当前返回成功
	 */
	public boolean isSuccess() {
		return true;
	}

	/**
	 * 指明当前只是单一的返回事件
	 * 
	 * @return
	 */
	public boolean isOne() {
		return true;
	}

	public void setSuccess() {
		// 应去掉！！！
	}

	public void setCostTime(long costTime) {
		this.costTime = costTime;
	}

	public long getCostTime() {
		return costTime;
	}

	private Map<String, Object> cache = new HashMap<String, Object>();

	public void put(String name, Object object) {
		cache.put(name, object);
	}

	public Object get(String name) {
		return cache.get(name);
	}
}
