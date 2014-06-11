package com.css.ctp.gateway.rmi.delegate;

import com.css.ctp.gateway.rmi.event.BaseRequestEvent;
import com.css.ctp.gateway.rmi.event.BaseResponseEvent;
import com.css.ctp.gateway.rmi.facade.LocalDebugDomainFacadeBean;
import com.css.sword.platform.comm.conf.ConfManager;
import com.css.sword.platform.comm.exception.CSSBizCheckedException;

/**
 * <p>
 * BizDelegate.java
 * </p>
 * <p>
 * Description:
 * </p>
 * 
 * Company: 中国软件与技术服务股份有限公司 2009 Department: 应用产品研发中心 Project: 中软睿剑业务基础平台
 * 
 * @author 刘福伟
 * @version 4.0
 * @since 4.0 date: 2009-6-3下午04:41:55
 */
public class BizDelegate {

	public static final String EJB_DELEGATE_MODEL = "EJB";

	public static BaseResponseEvent delegate(BaseRequestEvent request) throws CSSBizCheckedException {
		BaseResponseEvent response = null;
		try {
			String oEjbModel = (String) ConfManager.getValueByKey("ejb-delegate-model");
			if (!EJB_DELEGATE_MODEL.equalsIgnoreCase(oEjbModel)) {
				response = LocalDebugDomainFacadeBean.getInstance().invoke(request);
			} else {
				GateWayFacade facade = EJBLocator.singleton().getDomainFacade("GateWayFacadeBean");
				response = (BaseResponseEvent) facade.invoke(request);
			}
		} catch (Exception ex) {
			if (ex instanceof CSSBizCheckedException)
				throw (CSSBizCheckedException) ex;
			throw new CSSBizCheckedException("00000015", ex);
		}

		if (response.getException() != null) {
			throw response.getException();
		}

		return response;
	}

}
