package com.css.ctp.gateway.rmi.facade;

import javax.ejb.CreateException;
import javax.ejb.SessionBean;
import javax.ejb.SessionContext;

import com.css.ctp.gateway.rmi.event.BaseRequestEvent;
import com.css.ctp.gateway.rmi.event.BaseResponseEvent;
import com.css.ctp.gateway.rmi.proxy.BaseGatewayProxy;
import com.css.ctp.gateway.rmi.proxy.ProxyManager;
import com.css.sword.platform.comm.exception.CSSBizCheckedException;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

/**
 * <p>
 * Title:DomainFacadeBean
 * </p>
 * <p>
 * Description: SWORD 企业应用基础平台
 * </p>
 * <p>
 * Copyright: Copyright (c) 2007 中国软件与技术服务股份有限公司
 * </p>
 * <p>
 * Company: CS&S
 * </p>
 * 
 * @author 刘福伟
 * @version 1.0 Created on 2009-3-16 下午12:47:46
 * 
 */
public class GateWayFacadeBean implements SessionBean {
	private static final long serialVersionUID = 5504855414596105558L;

	private final static LogWritter logger = LogFactory.getLogger(GateWayFacadeBean.class);

	SessionContext sessionContext;

	public void ejbCreate() throws CreateException {
	}

	public void ejbRemove() {
	}

	public void ejbActivate() {
	}

	public void ejbPassivate() {
	}

	public void setSessionContext(SessionContext sessionContext) {
		this.sessionContext = sessionContext;
	}

	protected void onEjbCreate() {
	}

	/**
	 * facade的调用方法
	 * 
	 * @param reqEvent
	 *            IRequestEvent
	 * 
	 * @return IResponseEvent
	 */
	public BaseResponseEvent invoke(BaseRequestEvent request) {
		BaseResponseEvent response = null;

		try {
			String tid = request.getTransactionID();
			BaseGatewayProxy proxy = ProxyManager.getInstance().getProxy(tid);
			response = proxy.execute(request);
		} catch (CSSBizCheckedException ex) {
			logger.error("在处理交易" + request.getTransactionID() + "的时候发生异常", ex);
			response = new BaseResponseEvent(ex);
		}
		return response;
	}

}