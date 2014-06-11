package com.css.sword.platform.comm.codecache;

import com.css.sword.platform.comm.exception.CSSBizCheckedException;

/**
 * 缓存管理器接口
 * 
 * @author 张久旭
 */
public interface CacheManagerInterface {

	/**
	 * 加载全部缓存数据
	 * 
	 * @throws Exception
	 */
	public void loadAll() throws CSSBizCheckedException;

	/**
	 * 获取管理线程对象
	 * 
	 * @return
	 */
	public Thread getMonitor();
}
