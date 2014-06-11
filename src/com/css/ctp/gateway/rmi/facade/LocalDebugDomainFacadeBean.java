package com.css.ctp.gateway.rmi.facade;

import com.css.ctp.gateway.rmi.event.BaseRequestEvent;
import com.css.ctp.gateway.rmi.event.BaseResponseEvent;
import com.css.ctp.gateway.rmi.proxy.BaseGatewayProxy;
import com.css.ctp.gateway.rmi.proxy.ProxyManager;
import com.css.sword.platform.comm.exception.CSSBaseCheckedException;

/**
 * <p>
 * LocalDebugDomainFacadeBean.java
 * </p>
 * <p>
 * Description:
 * </p>
 * 
 * Company: 中国软件与技术服务股份有限公司 2009 Department: 应用产品研发中心 Project: 中软睿剑业务基础平台
 * 
 * @author 刘福伟
 * @version 4.0
 * @since 4.0 date: 2009-6-3下午04:50:23
 */
public class LocalDebugDomainFacadeBean {
	public static final String DEBUG_EJB_SESSION_ID = "debug_ejb_sessionid";

	private LocalDebugDomainFacadeBean() {
	}

	public static LocalDebugDomainFacadeBean getInstance() {
		return new LocalDebugDomainFacadeBean();
	}

	public BaseResponseEvent invoke(BaseRequestEvent request) throws CSSBaseCheckedException {
		BaseResponseEvent response = null;
		try {
			String transactionID = request.getTransactionID();
			if (transactionID == null || "".equals(transactionID)) {
				transactionID = "DefaultTracsactionID";
			}
			BaseGatewayProxy proxy = ProxyManager.getInstance().getProxy(transactionID);
			response = proxy.execute(request);
		} catch (Throwable e) {
			throw new CSSBaseCheckedException("JDelegete 调用失败", e);
		}

		return response;
	}

}