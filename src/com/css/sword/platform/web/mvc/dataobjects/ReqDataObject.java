package com.css.sword.platform.web.mvc.dataobjects;

import java.util.Map;

/**
 * Request数据逻辑模型 <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.dataobjects<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> ReqDataObject.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class ReqDataObject implements IDataObject {

	private static final long serialVersionUID = -6511763517661863305L;

	private Map<String, Object> viewData;

	public Map<String, Object> getViewData() {
		return viewData;
	}

	public void setViewData(Map<String, Object> viewData) {
		this.viewData = viewData;
	}
}
