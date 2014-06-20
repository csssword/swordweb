package com.css.sword.platform.web.mvc.beans;

import java.util.Map;

/**
 * web组件SwordTable数据模型 <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.beans<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> TDBean.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @see {@link TableBean}
 * @see {@link TRBean}
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class TDBean extends AbsDataBean<String> {
	private static final long serialVersionUID = -3221519776874836709L;
	private String key;
	private String value;
	private String valueType;
	private String code;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getKey() {
		return key;
	}

	public String getValue() {
		return value;
	}

	public String getValueType() {
		return valueType;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public void setValueType(String valueType) {
		this.valueType = valueType;
	}

	public Map<String, String> viewData() {
		return super.getParams();
	}

}
