package com.css.sword.platform.core.event;

import java.io.Serializable;

/**
 * <p>Title: IRequestEvent</p> 
 * <p>Description: 所有请求事件的接口</p> 
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 *
 * @author wwq
 * @version 1.0
 * @since 4.0
 */
public interface IRequestEvent extends Cloneable , Serializable {
	/**
	 * 得到客户端请求的TransactionID
	 * 
	 * @return
	 */
	String getTransactionID();

	String getSessionID();

	void setKey(int key);

	int getKey();

	public String getMethod();

	public void setMethod(String method);

	public String getMonitorId();

	public void setMonitorId(String id);

}