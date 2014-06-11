package com.css.sword.platform.comm.codecache.cachemanager;

import java.io.Serializable;
import java.security.InvalidParameterException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.collections.map.MultiKeyMap;

import com.css.sword.platform.comm.exception.CSSBizCheckedException;

/**
 * 缓存表管理对象
 * 
 * @author 张久旭
 */
@SuppressWarnings("unchecked")
public class CacheTable implements Serializable {
	private static final long serialVersionUID = 580049361855781134L;

	/**
	 * 缓存数据, 数据存储方式为: List[map] ,对应为表[row]关系
	 */
	private List<Map<String, Object>> cacheData = null;

	/**
	 * JSON格式存储的数据
	 */
	private String jsonCacheData = null;

	/**
	 * 缓存表数据索引
	 */
	private Map<?, ?> cacheDataIndex = null;

	/**
	 * 版本号
	 */
	private int version;

	/**
	 * 最后访问时间
	 */
	private long lastAccessTime;

	/**
	 * 数据表名
	 */
	private String tableName;

	/**
	 * 缓存类型
	 */
	private int cacheType;

	/**
	 * 索引字段名列表
	 * 
	 * @return
	 */
	private String[] indexKey;

	/**
	 * 默认值字段名
	 */
	private String defaultValue;
	/**
	 * 透明表名
	 */
	private String transportTable;

	/**
	 * 获取缓存数据-JSON格式
	 * 
	 * @return
	 */
	public String getJsonCacheData() {
		this.lastAccessTime = System.currentTimeMillis();
		return jsonCacheData;
	}

	void setJsonCacheData(String jsonCacheData) {
		this.jsonCacheData = jsonCacheData;
	}

	public Map<?, ?> getCacheDataIndex() {
		this.lastAccessTime = System.currentTimeMillis();
		return cacheDataIndex;
	}

	/**
	 * 获取缓存数据
	 * 
	 * @return
	 * @throws CSSBizCheckedException
	 */
	public List<Map<String, Object>> getCacheData() throws CSSBizCheckedException {
		this.lastAccessTime = System.currentTimeMillis();
		return this.cacheData;
	}

	void setCacheData(List<Map<String, Object>> cacheData) {
		if (cacheData == null) {
			this.cacheData = null;
			this.cacheDataIndex = null;
			return;
		}

		Map<?, ?> cacheDataIndex = null;
		if (this.indexKey != null && this.indexKey.length > 0) {
			if (this.indexKey.length > 5) {
				throw new InvalidParameterException("索引键个数不能多于5");
			}

			if (this.indexKey.length == 1) {
				cacheDataIndex = new HashMap<String, Object>();
			} else {
				cacheDataIndex = new MultiKeyMap();
			}

			for (Map<String, Object> row : cacheData) {
				switch (this.indexKey.length) {
				case 1:
					((HashMap<Object, Object>) cacheDataIndex).put(row.get(this.indexKey[0]), row);
					break;
				case 2:
					((MultiKeyMap) cacheDataIndex).put(row.get(this.indexKey[0]), row.get(this.indexKey[1]), row);
					break;
				case 3:
					((MultiKeyMap) cacheDataIndex).put(row.get(this.indexKey[0]), row.get(this.indexKey[1]),
							row.get(this.indexKey[2]), row);
					break;
				case 4:
					((MultiKeyMap) cacheDataIndex).put(row.get(this.indexKey[0]), row.get(this.indexKey[1]),
							row.get(this.indexKey[2]), row.get(this.indexKey[3]), row);
					break;
				case 5:
					((MultiKeyMap) cacheDataIndex).put(row.get(this.indexKey[0]), row.get(this.indexKey[1]),
							row.get(this.indexKey[2]), row.get(this.indexKey[3]), row.get(this.indexKey[4]), row);
					break;
				}
			}
		}
		this.cacheData = cacheData;
		this.cacheDataIndex = cacheDataIndex;
	}

	public int getVersion() {
		return version;
	}

	void setVersion(int version) {
		this.version = version;
	}

	public long getLastAccessTime() {
		return lastAccessTime;
	}

	void setLastAccessTime(long lastAccessTime) {
		this.lastAccessTime = lastAccessTime;
	}

	public String getTableName() {
		return tableName;
	}

	void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public int getCacheType() {
		return cacheType;
	}

	void setCacheType(int cacheType) {
		this.cacheType = cacheType;
	}

	public String[] getIndexKey() {
		return indexKey;
	}

	void setIndexKey(String[] keyValues) {
		this.indexKey = keyValues;
	}

	public String getValue() {
		return defaultValue;
	}

	void setValue(String value) {
		this.defaultValue = value;
	}

	public String getTransportTable() {
		return transportTable;
	}

	void setTransportTable(String transportTable) {
		this.transportTable = transportTable;
	}

	void clear() {
		this.cacheData = null;
		this.jsonCacheData = null;
		this.cacheDataIndex = null;
	}
}