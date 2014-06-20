package com.css.sword.platform.web.mvc.beans;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * web组件SwordTree数据模型 <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.beans<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> TreeBean.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class TreeBean extends AbsDataBean<Object> {
	private static final long serialVersionUID = 3284282312709196713L;
	private List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();

	public Map<String, Object> viewData() {
		return super.viewData;
	}

	public void setDataList(List<Map<String, Object>> dataList) {
		this.dataList = dataList;
	}

	public List<Map<String, Object>> getDataList() {
		return dataList;
	}

	public void add(Map<String, Object> dataMap) {
		dataList.add(dataMap);
	}

}
