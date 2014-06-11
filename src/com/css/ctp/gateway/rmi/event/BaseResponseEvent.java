package com.css.ctp.gateway.rmi.event;

import java.io.Serializable;
import java.util.Map;

import com.css.sword.platform.comm.exception.CSSBizCheckedException;

/**
 * 数据传输对象基类-返回结果
 * 
 * @author 史文帅
 * 
 */
public class BaseResponseEvent implements Serializable {
	private static final long serialVersionUID = -7082425127069767526L;

	private Map<String, Object> value = null;

	private CSSBizCheckedException exception = null;

	public BaseResponseEvent(Map<String, Object> value) {
		this.value = value;
	}

	public BaseResponseEvent(CSSBizCheckedException exception) {
		this.exception = exception;
	}

	/**
	 * 获取异常对象
	 * 
	 * @return
	 */
	public CSSBizCheckedException getException() {
		return exception;
	}

	/**
	 * 获取所有返回值
	 * 
	 * @return
	 */
	public Map<String, Object> getValue() {
		return value;
	}

}
