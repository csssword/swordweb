package com.css.sword.platform.web.mvc.dataobjects;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.css.sword.platform.web.mvc.beans.IObjectBean;

/**
 * Response数据逻辑模型 <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.dataobjects<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> ResDataObject.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class ResDataObject implements IDataObject {

	private static final long serialVersionUID = -8291329970330280955L;
	private List<Object> jsonDatas = new ArrayList<Object>();
	private IObjectBean<?> objectBean;
	private Map<String, Object> jsonStringMap = new HashMap<String, Object>();
	private Object object;
	private boolean customJson = false;
	
	public boolean isCustomJson() {
		return customJson;
	}

	public void setCustomJson(boolean customJson) {
		this.customJson = customJson;
	}

	public Object getObject() {
		return object;
	}

	public void setObject(Object object) {
		this.object = object;
	}

	public IObjectBean<?> getObjectBean() {
		return objectBean;
	}

	public void setObjectBean(IObjectBean<?> objectBean) {
		this.objectBean = objectBean;
	}

	public List<Object> getJsonDatas() {
		return jsonDatas;
	}

	public void setJsonDatas(List<Object> jsonDatas) {
		this.jsonDatas = jsonDatas;
	}

	public Map<String, Object> getJsonStringMap() {
		return jsonStringMap;
	}

	public void setJsonStringMap(Map<String, Object> jsonStringMap) {
		this.jsonStringMap = jsonStringMap;
	}

	public void putToJson(String key, Object value) {
		jsonStringMap.put(key, value);
	}

	public void addJsonDatas(Object obj) {
		jsonDatas.add(obj);
	}
}
