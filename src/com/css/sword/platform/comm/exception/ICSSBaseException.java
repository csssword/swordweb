package com.css.sword.platform.comm.exception;

import java.util.List;

/**
 * <p>Title:CSSBaseRuntimeException </p>
 * <p>Description:通过返回码和参数得到异常对应的内容信息s</p>
 * <p>Copyright: Copyright (c) 2009</p>
 * <p>Company: 中国软件与技术服务股份有限公司</p>
 * @author wwq
 * @version 1.0
 * @since 4.0
 */
public interface ICSSBaseException {

	public List<?> getParam();

	public String getContent();

	public String getExceptionStackInfo();
	
	/**
	 * 将原有int型异常码修改为字符串型
	 * @return
	 */
	public String getCode();
}