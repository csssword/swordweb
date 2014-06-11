package com.css.sword.platform.web.mvc.beans;

import java.util.List;
import java.util.Map;

/**
 * web组件SwordGrid数据模型 <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.beans<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> TRBean.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @see {@link TableBean}
 * @see {@link TDBean}
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class TRBean extends AbsDataBean<List<TDBean>> {

	private static final long serialVersionUID = -4612366409609892207L;
	private List<TDBean> tdList;

	public List<TDBean> getTdList() {
		return tdList;
	}

	public void setTdList(List<TDBean> tdBean) {
		this.tdList = tdBean;
	}

	public Map<String, List<TDBean>> viewData() {
		return super.viewData;
	}

}
