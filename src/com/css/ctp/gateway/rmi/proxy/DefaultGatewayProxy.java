package com.css.ctp.gateway.rmi.proxy;

import com.css.ctp.gateway.rmi.event.BaseRequestEvent;
import com.css.ctp.gateway.rmi.event.BaseResponseEvent;
import com.css.ctp.web.delegate.JDelegate;
import com.css.sword.platform.comm.exception.CSSBizCheckedException;

/**
 * 默认的BLH
 * 
 * @author 史文帅
 * 
 */
public class DefaultGatewayProxy extends BaseGatewayProxy {

	public DefaultGatewayProxy(JDelegate delegate) {
		super(delegate);
	}

	@Override
	public void before(BaseRequestEvent request) throws CSSBizCheckedException {
	}

	@Override
	public void after(BaseRequestEvent request, BaseResponseEvent response) throws CSSBizCheckedException {
	}

}
