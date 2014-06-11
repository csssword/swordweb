package com.css.sword.platform.comm.codecache.cachemanager;

/**
 * 缓存框架常量表
 * 
 * @author 张久旭
 * 
 */
public interface ICache {

	/**
	 * 缓存类型: 数据表在内存中缓存
	 */
	public final static int CACHE_TYPE_ALL_IN_MEM = 0;

	/**
	 * 缓存类型: 数据表直接查询数据库获得
	 */
	public final static int CACHE_TYPE_ONLY_DB = 1;

	/**
	 * 缓存类型：只缓存HASH数据
	 */
	public final static int CACHE_TYPE_ONLY_HASH_MEM = 2;

	/**
	 * 缓存类型：只缓存JSON串
	 */
	public final static int CACHE_TYPE_ONLY_JSON = 3;

	/**
	 * ZFM_PUBLIC_GET_CACHE_TL 返回值KEY
	 */
	public final static String CACHE_TABLE_LIST = "TABLE_LIST";

	/**
	 * 缓存表表名
	 */
	public final static String CACHE_TABLE_NAME = "TABLE_NAME";

	/**
	 * 缓存表表索引
	 */
	public final static String CACHE_TABLE_KEY = "TABLE_KEY";

	/**
	 * 缓存表值字段名
	 */
	public final static String CACHE_TABLE_VALUE = "TABLE_VALUE";

	/**
	 * 缓存表值字段名
	 */
	public final static String CACHE_TABLE_DEF_VALUE = "TABLE_DEF_VALUE";

	/**
	 * 缓存表表类型
	 */
	public final static String CACHE_TABLE_TYPE = "TABLE_TYPE";

	/**
	 * 缓存表版本号
	 */
	public final static String CACHE_TABLE_VERSION = "GX_XH";

	/**
	 * 缓存表数据
	 */
	public final static String CACHE_TABLE_DATA = "TABLE_DATA";
	/**
	 * 透明表名
	 */
	public final static String CACHE_TABLE_TRANSPORT_TABLE = "TABLE_TEST_NAME";

}
