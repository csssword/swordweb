package com.css.sword.platform.web.mvc.beans;

import java.util.HashMap;
import java.util.Map;

/**
 * 数据模型基类
 * <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.beans<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> AbsDataBean.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public abstract class AbsDataBean<T> implements IObjectBean<T> {

	private static final long serialVersionUID = 4903437484720009789L;

	/**
	 * dataSrc属性<br>
	 * 从提交数据中获取，对应数据库中的表名
	 */
	protected String dataSrc;

	/**
	 * optFlag属性<br>
	 * 从提交的数据中获取，用于指定持久化操作类型，比如添加，删除，更新等
	 */
	protected String optFlag;

	/**
	 * submitType属性<br>
	 * 提交数据的类型，提交的form，table或者属性键值对。
	 */
	protected String submitType;

	/**
	 * params属性<br>
	 * 键值对容器，存放所提交数据的键值对。
	 */
	protected Map<String, String> params = new HashMap<String, String>();

	/**
	 * paramsJson属性<br>
	 * 存放键值对内容的json数据，用于ViewData方法解析。
	 */
	protected String paramsJson;

	protected Map<String, T> viewData;

	public Map<String, T> getViewData() {
		return viewData;
	}

	public void setViewData(Map<String, T> viewData) {
		this.viewData = viewData;
	}

	public String getParamsJson() {
		return paramsJson;
	}

	public void setParamsJson(String paramsJson) {
		this.paramsJson = paramsJson;
	}

	public Map<String, String> getParams() {
		return params;
	}

	public void setParams(Map<String, String> params) {
		this.params = params;
	}

	public String getDataSrc() {
		return dataSrc;
	}

	public void setDataSrc(String dataSrc) {
		this.dataSrc = dataSrc;
	}

	public String getOptFlag() {
		return optFlag;
	}

	public String getSubmitType() {
		return submitType;
	}

	public void setSubmitType(String submitType) {
		this.submitType = submitType;
	}

	public void setOptFlag(String optFlag) {
		this.optFlag = optFlag;
	}

	public void putParam(String key, String value) {
		params.put(key, value);
	}
}
