package com.css.ctp.gateway.rmi.delegate;

import java.rmi.RemoteException;

import javax.ejb.EJBObject;

import com.css.ctp.gateway.rmi.event.BaseRequestEvent;
import com.css.sword.platform.core.event.IResponseEvent;

/**
 * <p>Title: DomainFacade</p>
 * <p>Description: Domain的EJB远程调用业务接口</p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */
public interface GateWayFacade extends EJBObject {

	/**
	 * 业务逻辑的执行，这里需要使用配置文件来反射出后续的处理类， 并调用相应的处理方法。
	 * 
	 * @param req
	 *            获得的请求事件
	 * 
	 * @return ResponseEvent 返回的响应事件
	 */
	public IResponseEvent invoke(BaseRequestEvent reqObject) throws RemoteException;
}