package com.css.sword.platform.web.mvc.beans;

import java.util.Map;

/**
 * web组件SwordForm数据模型
 * <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.beans<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> FormBean.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class FormBean extends AbsDataBean<FormDataBean> {

	private static final long serialVersionUID = 7124104318907295747L;

	public Map<String, FormDataBean> viewData() {
		return super.viewData;
	}

}
