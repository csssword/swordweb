package com.css.ctp.gateway.jco;

import java.util.Map;

import com.css.ctp.web.delegate.JDelegate;
import com.css.sword.platform.comm.exception.CSSBizCheckedException;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.sap.conn.jco.AbapClassException;
import com.sap.conn.jco.AbapException;
import com.sap.conn.jco.JCoFunction;
import com.sap.conn.jco.server.JCoServerContext;
import com.sap.conn.jco.server.JCoServerFunctionHandler;

/**
 * 协议适配器器基类
 * 
 * @author 史文帅
 * 
 */
public abstract class AbsProtocolAdapter implements JCoServerFunctionHandler {
	private static final LogWritter logger = LogFactory.getLogger(AbsProtocolAdapter.class);

	public void handleRequest(JCoServerContext serverCtx, JCoFunction function) throws AbapException,
			AbapClassException {
		Map<String, Object> parameter = JDelegate.convertSapObjectToParameter(function, true);

		// 调用处理方法
		Map<String, Object> value;
		try {
			value = convert(parameter);
		} catch (CSSBizCheckedException ex) {
			logger.error("执行协议转换时发生错误", ex);
			throw new AbapException(ex.getCode());
		}

		try {
			JDelegate.convertParameterToSapObject(value, function, true);
		} catch (CSSBizCheckedException ex) {
			logger.error("将Java对象转换成Abap对象时发生错误", ex);
			throw new AbapException(ex.getCode());
		}
	}

	/**
	 * 协议转换方法
	 * 
	 * @param parameter
	 * @return
	 * @throws CSSBizCheckedException
	 */
	public abstract Map<String, Object> convert(Map<String, Object> parameter) throws CSSBizCheckedException;

	/**
	 * 获取协议转换器对应的 、S5的Funcation Module名字
	 * 
	 * @return
	 */
	public abstract String getConvertFunctionName();

}
