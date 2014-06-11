package com.css.sword.platform.comm.exception.helper;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.css.sword.platform.comm.filetemplet.FileTempletManager;

/**
 * <p>
 * Title: CSSExceptionHelper
 * </p>
 * <p>
 * Description: 实现的返回码和参数的读取功能，用于服务自定义的Exception
 * </p>
 * <p>
 * Copyright: Copyright (c) 2009
 * </p>
 * <p>
 * Company: 中国软件与技术服务股份有限公司
 * </p>
 * 
 * @author wwq
 * @version 1.0
 */
public class CSSExceptionHelper implements Serializable {

	private static final long serialVersionUID = -8420003610577985529L;

	/**
	 * 定义的异常码
	 */
	String code;

	/**
	 * 返回码所对应的参数，用于从配置文件中读取内容时，动态替换其变量部分
	 */
	List<String> params = new ArrayList<String>();

	static final String FILETEMPLET_NAME = "exception";

	private String exceptionStackInfo = "";

	private String exceptionContent = null;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public void addParam(String param) {
		this.params.add(param);
	}

	public void addParam(List<String> param) {
		this.params.addAll(param);
	}

	public List<String> getParam() {
		return this.params;
	}

	public void cleanParam() {
		this.params.clear();
	}

	public String getContent() {
		if (this.exceptionContent != null) {
			return this.exceptionContent;
		}

		Map<String, List<String>> mapparam = new HashMap<String, List<String>>();
		mapparam.put(code, params);
		Map<?, ?> mapresult = (Map<?, ?>) FileTempletManager.getContent(FILETEMPLET_NAME,
				mapparam);
		this.exceptionContent = (String) mapresult.get(code);

		return this.exceptionContent;
	}

	public void parseExceptionStackInfo(Throwable ex) {
		StringBuffer sb = new StringBuffer();
		if (ex == null) {
			return;
		}

		sb.append(ex.getClass().getName()).append(":").append(ex.getMessage())
				.append("\r\n");
		StackTraceElement[] stack = ex.getStackTrace();
		for (int i = 0; i < stack.length; i++) {
			sb.append("\t").append(stack[i]).append("\r\n");
		}

		this.exceptionStackInfo = sb.toString();
	}

	public String getExceptionStackInfo() {
		return this.exceptionStackInfo;
	}

}