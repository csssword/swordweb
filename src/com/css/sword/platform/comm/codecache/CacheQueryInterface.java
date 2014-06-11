package com.css.sword.platform.comm.codecache;

import java.util.List;
import java.util.Map;

import com.css.sword.platform.comm.exception.CSSBizCheckedException;

/**
 * 查询器接口
 * 
 * @author 张久旭
 */
public interface CacheQueryInterface {

	/**
	 * 通用过滤方法：自行编写判断代码 获取满足条件的记录，无法在ZT_XT_HCBXX中无法配置索引键的使用此方法
	 * 
	 * @param tableName
	 * @param filter
	 * @return
	 * @throws CSSBizCheckedException
	 */
	public List<Map<String, Object>> getData(String tableName, CacheFilterInterface filter)
			throws CSSBizCheckedException;

	/**
	 * 获取缓存表的JSON数据字符串
	 * 
	 * @param tableName
	 * @return
	 * @throws CSSBizCheckedException
	 */
	public String getJsonData(String tableName) throws CSSBizCheckedException;

	/**
	 * 根据配置的查询键值获取行数据，如果ZT_XT_HCBXX配置的查询键有重复，则返回随即记录。
	 * 
	 * 注：此方法仅适用内存缓存表，查询从数据库获取的缓存表将抛异常
	 * 
	 * @param tableName
	 * @param keys
	 * @return
	 * @throws CSSBizCheckedException
	 */
	public Map<String, Object> getRowByKey(String tableName, Object[] keys) throws CSSBizCheckedException;

	/**
	 * 根据配置的查询键值获取默认字段值
	 * 
	 * 注：此方法仅适用内存缓存表，查询从数据库获取的缓存表将抛异常
	 * 
	 * @param tableName
	 * @param keys
	 * @return
	 * @throws CSSBizCheckedException
	 */
	public Object getDefaultValueByKey(String tableName, Object[] keys) throws CSSBizCheckedException;

	/**
	 * 根据表名获取表的版本信息
	 * 
	 * @param tableName
	 * @return
	 * @throws CSSBizCheckedException
	 */
	public int getVersion(String tableName) throws CSSBizCheckedException;
}
