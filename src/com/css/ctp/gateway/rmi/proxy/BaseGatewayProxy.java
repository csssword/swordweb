package com.css.ctp.gateway.rmi.proxy;

import java.util.Map;

import com.css.ctp.gateway.rmi.event.BaseRequestEvent;
import com.css.ctp.gateway.rmi.event.BaseResponseEvent;
import com.css.ctp.web.delegate.JDelegate;
import com.css.sword.platform.comm.exception.CSSBaseCheckedException;
import com.css.sword.platform.comm.exception.CSSBizCheckedException;

/**
 * 
 * 业务逻辑基类
 * 
 * @author 史文帅
 * 
 */
public abstract class BaseGatewayProxy {
	private JDelegate delegate = null;

	public BaseGatewayProxy(JDelegate delegate) {
		this.delegate = delegate;
	}

	public final BaseResponseEvent execute(BaseRequestEvent request) throws CSSBizCheckedException {
		// 调用子类预处理方法
		before(request);

		BaseResponseEvent response = null;
		String function = request.getMethod();
		Map<String, Object> param = request.getData();

		try {
			// 调用S5系统的远程方法，并将返回值放入数据传输对象中
			response = new BaseResponseEvent(this.delegate.callRFC(function, param));

			// 调用子类执行完成后的处理方法
			after(request, response);
		} catch (CSSBizCheckedException e) {
			// 调用子类异常处理方法
			response = exception(request, e);
		}
		return response;
	}

	/**
	 * 预处理方法
	 * 
	 * @param request
	 * @throws CSSBaseCheckedException
	 */
	public abstract void before(BaseRequestEvent request) throws CSSBizCheckedException;

	/**
	 * 执行完成后的处理方法
	 * 
	 * @param reqObj
	 * @param resObject
	 * @throws CSSBaseCheckedException
	 */
	public abstract void after(BaseRequestEvent request, BaseResponseEvent response) throws CSSBizCheckedException;

	/**
	 * 执行时异常回调方法
	 * 
	 * @param reqObj
	 * @param ex
	 * @return
	 * @throws CSSBaseCheckedException
	 */
	public BaseResponseEvent exception(BaseRequestEvent request, CSSBizCheckedException ex)
			throws CSSBizCheckedException {
		throw ex;
	}

}
