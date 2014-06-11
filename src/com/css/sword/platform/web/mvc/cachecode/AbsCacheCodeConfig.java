package com.css.sword.platform.web.mvc.cachecode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 代码表配置基类 <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.cachecode<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> AbsCacheCodeConfig.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @see {@link ICacheCodeConfig}
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public abstract class AbsCacheCodeConfig implements ICacheCodeConfig {
	private List<Map<String, String>> codeMap = new ArrayList<Map<String, String>>();

	public List<Map<String, String>> getAllSet() {
		return codeMap;
	}

	public ICacheCodeConfig setMore(String tableName, String codeRowName) {
		Map<String, String> setMap = new HashMap<String, String>();
		setMap.put(ICacheCodeConfig.tableName, tableName);
		setMap.put(ICacheCodeConfig.codeRowName, codeRowName);
		codeMap.add(setMap);
		return this;
	}

	public ICacheCodeConfig customSetting() {
		return null;
	}
}
