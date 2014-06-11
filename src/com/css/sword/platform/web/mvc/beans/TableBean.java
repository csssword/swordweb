package com.css.sword.platform.web.mvc.beans;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * web组件SwordGrid数据模型 <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.beans<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> TableBean.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @see {@link TDBean} {@link TRBean}
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class TableBean extends AbsDataBean<List<TRBean>> {
	private static final long serialVersionUID = 513193831641839761L;

	private List<TRBean> trList = new ArrayList<TRBean>();

	private String tableName;

	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public List<TRBean> getTrList() {
		return trList;
	}

	public void setTrList(List<TRBean> trList) {
		this.trList = trList;
	}

	public Map<String, List<TRBean>> viewData() {
		return super.viewData;
	}
}
