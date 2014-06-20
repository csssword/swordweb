package com.css.sword.platform.web.mvc.beans;

import java.util.Map;

/**
 * Web组件Attr数据模型
 * <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.beans<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> AttrBean.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class AttrBean extends AbsDataBean<String> {

	private static final long serialVersionUID = -2219248403645710221L;
	private Map<String, String> attrMap;

	public Map<String, String> getAttrMap() {
		return attrMap;
	}

	public void setAttrMap(Map<String, String> attrMap) {
		this.attrMap = attrMap;
	}

	public Map<String, String> viewData() {
		return super.getParams();
	}
}
