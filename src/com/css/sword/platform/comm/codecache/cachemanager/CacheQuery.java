package com.css.sword.platform.comm.codecache.cachemanager;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.collections.map.MultiKeyMap;

import com.css.sword.platform.comm.codecache.CacheFilterInterface;
import com.css.sword.platform.comm.codecache.CacheQueryInterface;
import com.css.sword.platform.comm.exception.CSSBizCheckedException;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.web.mvc.util.json.JSON;

/**
 * 公共过滤器
 * 
 * @author 张久旭
 * 
 */
@SuppressWarnings("unchecked")
public class CacheQuery implements CacheQueryInterface {
	/**
	 * 日志记录对象
	 */
	private final static LogWritter logger = LogFactory.getLogger(CacheQuery.class);

	/**
	 * 获取缓存表的CacheTable对象
	 * 
	 * @param tableName
	 * @return
	 * @throws CSSBizCheckedException
	 */
	private CacheTable getCacheTableObject(String tableName) throws CSSBizCheckedException {
		CacheManager manager = CacheManager.getInstance();
		CacheTable cache = manager.getCodeCachePool().get(tableName);

		if (cache == null) {
			logger.error(tableName + "不是缓存表，请检查代码或缓存表配置！");
			throw new CSSBizCheckedException("0");
		}

		// 判断当前缓存模式下数据是否加载了，如果没有则进行加载
		if (cache.getCacheType() != ICache.CACHE_TYPE_ONLY_DB
				&& (cache.getCacheData() == null || cache.getJsonCacheData() == null)) {
			manager.loadTableData(cache, tableName, false);
		}

		return cache;
	}

	/**
	 * 获取缓存数据
	 * 
	 * @param tableName
	 * @return
	 * @throws Exception
	 */
	private List<Map<String, Object>> getTableData(String tableName) throws CSSBizCheckedException {
		CacheTable cache = getCacheTableObject(tableName);
		CacheManager manager = CacheManager.getInstance();
		int cacheType = cache.getCacheType();

		if (cacheType == ICache.CACHE_TYPE_ONLY_DB) {
			return JSON.getJsonList(manager.getTableDataFromAPPServer(tableName));
		} else if (cacheType == ICache.CACHE_TYPE_ONLY_JSON) {
			logger.error(tableName + "缓存类型为只缓存JSON串，不能使用此方法获取数据 ！");
			throw new CSSBizCheckedException("0");
		}

		return cache.getCacheData();
	}

	public List<Map<String, Object>> getData(String tableName, CacheFilterInterface filter)
			throws CSSBizCheckedException {
		List<Map<String, Object>> data = getTableData(tableName);
		if (filter == null) {
			return data;
		} else {
			List<Map<String, Object>> tmp = data;
			data = new ArrayList<Map<String, Object>>();
			for (Map<String, Object> row : tmp) {
				if (filter.filter(row)) {
					data.add(row);
				}
			}
		}
		return data;
	}

	public String getJsonData(String tableName) throws CSSBizCheckedException {
		CacheTable cache = getCacheTableObject(tableName);
		CacheManager manager = CacheManager.getInstance();
		int cacheType = cache.getCacheType();

		if (cacheType == ICache.CACHE_TYPE_ONLY_DB) {
			return Base64.encodeBase64String(manager.compressBytes(manager.getTableDataFromAPPServer(tableName)));
		} else if (cacheType == ICache.CACHE_TYPE_ONLY_HASH_MEM) {
			logger.error(tableName + "缓存类型为只缓存Hash对象，不能使用此方法获取JSON数据串！");
			throw new CSSBizCheckedException("0");
		}

		return cache.getJsonCacheData();
	}

	public Map<String, Object> getRowByKey(String tableName, Object[] keys) throws CSSBizCheckedException {
		CacheTable cache = getCacheTableObject(tableName);
		Map<?, ?> index = cache.getCacheDataIndex();
		Map<String, Object> row = null;

		if (index == null) {
			logger.error("缓存表" + tableName + "不是索引内存表，不能使用索引方式进行访问，请使用getData方法自行过滤！");
			throw new CSSBizCheckedException("0");
		}

		if (keys.length != cache.getIndexKey().length) {
			logger.error("查询参数个数与索引键个数不等。");
			throw new CSSBizCheckedException("0");
		}

		switch (keys.length) {
		case 1:
			row = (Map<String, Object>) index.get(keys[0]);
			break;
		case 2:
			row = (Map<String, Object>) ((MultiKeyMap) index).get(keys[0], keys[1]);
			break;
		case 3:
			row = (Map<String, Object>) ((MultiKeyMap) index).get(keys[0], keys[1], keys[2]);
			break;
		case 4:
			row = (Map<String, Object>) ((MultiKeyMap) index).get(keys[0], keys[1], keys[2], keys[3]);
			break;
		case 5:
			row = (Map<String, Object>) ((MultiKeyMap) index).get(keys[0], keys[1], keys[2], keys[3], keys[4]);
			break;
		}

		return row;
	}

	public Object getDefaultValueByKey(String tableName, Object[] keys) throws CSSBizCheckedException {
		return getRowByKey(tableName, keys).get(ICache.CACHE_TABLE_VALUE);
	}

	public int getVersion(String tableName) throws CSSBizCheckedException {
		CacheTable cache = getCacheTableObject(tableName);
		return cache.getVersion();
	}

}
