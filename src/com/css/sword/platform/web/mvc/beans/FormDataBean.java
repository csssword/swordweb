package com.css.sword.platform.web.mvc.beans;

import java.util.Map;

/**
 * web组件SwordForm数据模型
 * <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.beans<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> FormDataBean.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class FormDataBean extends AbsDataBean<String> {
	private static final long serialVersionUID = 8582878606121078176L;
	private String value;
	private String dataType;
	private String code;

	public String getValue() {
		return value;
	}

	public String getDataType() {
		return dataType;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public void setDataType(String dataType) {
		this.dataType = dataType;
	}

	public Map<String, String> viewData() {
		return super.getParams();
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getCode() {
		return code;
	}

}
