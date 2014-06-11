package com.css.sword.platform.comm.codecache;

import java.util.Map;

/**
 * 缓存查询过滤器标准接口
 * 
 * @author 张久旭
 */
public interface CacheFilterInterface {

	/**
	 * 记录判断方法
	 * 
	 * @param row
	 * @return
	 */
	public boolean filter(Map<String, ?> row);
}
