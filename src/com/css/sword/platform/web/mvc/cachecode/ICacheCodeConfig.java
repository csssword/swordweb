package com.css.sword.platform.web.mvc.cachecode;

import java.util.List;
import java.util.Map;

/**
 * 缓存表配置接口 <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.cachecode<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> ICacheCodeConfig.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @see {@link AbsCacheCodeConfig}
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public interface ICacheCodeConfig {
	public static final String tableName = "tableName";
	public static final String codeRowName = "codeRowName";
	public static final String codeName = "codeName";
	public static final String valueName = "valueName";

	public void set();

	public ICacheCodeConfig setMore(String tableName, String codeRowName);

	public List<Map<String, String>> getAllSet();
}
