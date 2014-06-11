package com.css.sword.platform.core.event;

import java.util.HashMap;
import java.util.Map;

/**
 * <p>Title: CSSBaseRequestEvent</p> 
 * <p>Description: 抽象请求事件，所有业务请求事件（除动态）都应继承此抽象类</p> 
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p> 
 * <p>Company: 应用产品研发中心</p>
 *
 * @author wwq
 * @version 1.0
 * @since 4.0
 */

public class CSSBaseRequestEvent implements IRequestEvent {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	/*
	 * 系统监控 开始
	 */
	private String monitorId = null;

	public String getMonitorId() {
		return monitorId;
	}

	public void setMonitorId(String id) {
		this.monitorId = id;
	}

	/*
	 * 系统监控 结束
	 */
	protected String transactionID;
	
	public void setTransactionID(String transactionID) {
		this.transactionID = transactionID;
	}

	protected String sessionID;
	
	private String method;

	private int key = -1;

	public String transaction_flag = "";

	/**
	 * 暂时在absrequestevent的构造器里处理name和method的解析 并分别赋值tid和方法名称
	 * 注意不能在用户实现的子类中重载method 先这样规定，后面统一规则
	 * 
	 * zzBLH_mehtodname
	 */
	public CSSBaseRequestEvent(String transactionID, String sessionID) {
		if (transactionID != null && transactionID.indexOf("_") > -1) {
			this.transactionID = transactionID.substring(0, transactionID
					.indexOf("_"));
			this.method = transactionID
					.substring(transactionID.indexOf("_") + 1);
		} else {
			this.transactionID = transactionID;
		}
		this.sessionID = sessionID;
	}

	public String getTransactionID() {
		return transactionID;
	}

	public String getSessionID() {
		return sessionID;
	}

	public void setKey(int key) {
		this.key = key;
	}

	public int getKey() {
		return key;
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}

	private Map<String, Object> cache = new HashMap<String, Object>();

	public void put(String name, Object object) {
		cache.put(name, object);
	}

	public Object get(String name) {
		return cache.get(name);
	}
}
