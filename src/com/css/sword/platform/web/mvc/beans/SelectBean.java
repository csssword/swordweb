package com.css.sword.platform.web.mvc.beans;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * web组件SwordSelect数据
 * <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.beans<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> SelectBean.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class SelectBean extends AbsDataBean<Object> {

	private static final long serialVersionUID = -4103983252103569876L;
	private List<Map<String, ?>> dataList = new ArrayList<Map<String, ?>>();

	public Map<String, Object> viewData() {
		return super.viewData;
	}

	public void setDataList(List<Map<String, ?>> dataList) {
		this.dataList = dataList;
	}

	public List<Map<String, ?>> getDataList() {
		return dataList;
	}

	public void add(Map<String, ?> dataMap){
		dataList.add(dataMap);
	}
}
