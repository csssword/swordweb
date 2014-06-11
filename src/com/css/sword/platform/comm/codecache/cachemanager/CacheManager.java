package com.css.sword.platform.comm.codecache.cachemanager;

import java.io.ByteArrayOutputStream;
import java.io.StringReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;
import java.util.zip.Deflater;
import java.util.zip.DeflaterOutputStream;

import org.apache.commons.codec.binary.Base64;

import com.css.ctp.web.delegate.JDelegate;
import com.css.sword.platform.comm.codecache.CacheManagerInterface;
import com.css.sword.platform.comm.conf.ConfManager;
import com.css.sword.platform.comm.exception.CSSBizCheckedException;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.web.mvc.util.json.JSON;

/**
 * 缓存框架管理器
 * 
 * @author 张久旭
 */
@SuppressWarnings("unchecked")
public class CacheManager implements CacheManagerInterface {
	/**
	 * 日志记录对象
	 */
	private final static LogWritter logger = LogFactory.getLogger(CacheManager.class);

	private static final CacheManager instance;

	/**
	 * 缓存数据对象
	 */
	private static Map<String, CacheTable> cachePool;

	private boolean lasyLoad = false;

	/**
	 * 监控线程,用于实时从服务器端保持数据一致性更新
	 */
	private Thread monitor = null;

	/*----------------------------------------------------------------------------------------------------------------------------------*/

	static {
		instance = new CacheManager();
	}

	private CacheManager() {
		try {
			init();
		} catch (CSSBizCheckedException ex) {
			logger.error("缓存初始化失败..............", ex);
		}
	}

	/**
	 * 获取获取管理类实例
	 * 
	 * @return
	 */
	public static CacheManager getInstance() {
		return instance;
	}

	/**
	 * 初始化方法
	 * 
	 * @throws CSSBizCheckedException
	 */
	private void init() throws CSSBizCheckedException {
		Properties props = (Properties) ConfManager.getValueByKey("codecache");
		String strLazyLoad = props.getProperty("lazy-load");

		if (strLazyLoad != null && "true".equalsIgnoreCase(strLazyLoad)) {
			this.lasyLoad = true;
		} else {
			this.lasyLoad = false;
		}

		// 加载所有的缓存表数据
		loadAll();

		// 获取管理线程
		startMonitor();
	}

	public synchronized void loadAll() throws CSSBizCheckedException {
		List<Map<String, String>> tableInfo = queryCacheTableInfo(null);

		if (cachePool == null) {
			cachePool = new HashMap<String, CacheTable>(tableInfo.size(), 0.1f);
		}

		// 将所有缓存表最后访问时间置为-1，方便后面判断哪些表被移出了缓存
		for (CacheTable cache : cachePool.values()) {
			cache.setLastAccessTime(-1);
		}

		// 检查新的缓存表配置信息，并更新数据
		for (Map<String, String> data : tableInfo) {
			update(data.get(ICache.CACHE_TABLE_NAME));
		}

		// 最后访问时间为-1的缓存表对象为被移出的对象，将其清除出缓存
		List<String> removeTables = new ArrayList<String>(cachePool.size());
		for (CacheTable cache : cachePool.values()) {
			if (cache.getLastAccessTime() == -1) {
				removeTables.add(cache.getTableName());
			}
		}
		for (String tableName : removeTables) {
			cachePool.remove(tableName);
		}
	}

	/**
	 * 清除指定时间未访问过的缓存对象中的数据
	 * 
	 * @param lruCleanCyc
	 */
	private synchronized void cleanTimeoutCache(long lruCleanCyc) {
		for (CacheTable cache : CacheManager.cachePool.values()) {
			if (lruCleanCyc < System.currentTimeMillis() - cache.getLastAccessTime()) {
				cache.clear();
			}
		}
	}

	/**
	 * 更新当前缓存的数据
	 * 
	 * @param tableName
	 * @return
	 * @throws Exception
	 */
	private CacheTable update(String tableName) throws CSSBizCheckedException {
		// 从APP服务器取代码表版本信息
		CacheTable cache = cachePool.get(tableName);

		List<Map<String, String>> tableInfoList = queryCacheTableInfo(tableName);
		if (tableInfoList.size() != 1) {
			logger.error("缓存表" + tableName + "没有相关的配置信息..............");
			throw new CSSBizCheckedException("0");
		}

		Map<String, String> tableInfo = tableInfoList.get(0);
		String newVersion = tableInfo.get(ICache.CACHE_TABLE_VERSION);

		// 更新缓存表
		if (cache == null) {
			cache = new CacheTable();
			cache.setVersion(-1);
		}

		if (!newVersion.equals(String.valueOf(cache.getVersion()))) {
			CacheTable tmpCache = new CacheTable();

			tmpCache.setTableName(tableName);
			tmpCache.setCacheType(Integer.parseInt(tableInfo.get(ICache.CACHE_TABLE_TYPE)));
			tmpCache.setIndexKey(tableInfo.get(ICache.CACHE_TABLE_KEY).split(","));
			tmpCache.setValue(tableInfo.get(ICache.CACHE_TABLE_DEF_VALUE));

			if (!this.lasyLoad || tmpCache.getCacheData() != null) {
				loadTableData(tmpCache, tmpCache.getTableName(), true);
			}
			// 缓存版本一定要最后更改
			tmpCache.setVersion(Integer.parseInt(newVersion));

			cache = tmpCache;
		}

		// 更新最后访问时间
		cache.setLastAccessTime(System.currentTimeMillis());

		// 将缓存对象放入缓冲池里
		cachePool.put(tableName, cache);

		return cache;
	}

	/**
	 * 获取系统代码缓存表配置信息
	 * 
	 * @param tableName
	 *            为null则获取全部缓存信息
	 * @return
	 * @throws CSSBizCheckedException
	 */

	private List<Map<String, String>> queryCacheTableInfo(final String tableName) throws CSSBizCheckedException {
		Map<String, Object> map = new JDelegate().callRFC("ZFM_PUBLIC_GET_HCBXX", new HashMap<String, Object>(1) {
			private static final long serialVersionUID = 1L;

			{
				put(ICache.CACHE_TABLE_NAME, tableName);
			}
		});
		return (List<Map<String, String>>) map.get(ICache.CACHE_TABLE_LIST);
	}

	/**
	 * 加载缓存数据
	 * 
	 * @param tableName
	 * @param enforce
	 * @throws CSSBizCheckedException
	 */
	protected void loadTableData(CacheTable cache, String tableName, boolean enforce) throws CSSBizCheckedException {
		int cacheType = cache.getCacheType();

		if (cacheType == ICache.CACHE_TYPE_ONLY_DB) {
			cache.setCacheData(null);
			return;
		}

		synchronized (cache) {
			if (!enforce && (cache.getCacheData() != null || cache.getJsonCacheData() != null)) {
				return;
			}

			// 对JSON串进行压缩，并使用Base64对压缩后的二进制数组进行编码，以便页面缓冲框架使用
			String jsonData = getTableDataFromAPPServer(cache.getTableName());

			if (cacheType == ICache.CACHE_TYPE_ALL_IN_MEM || cacheType == ICache.CACHE_TYPE_ONLY_JSON) {
				try {
					cache.setJsonCacheData(Base64.encodeBase64String(compressBytes(jsonData)));
				} catch (Exception ex) {
					logger.error("获取JSON数据时发生错误", ex);
					return;
				}
			}

			if (cacheType == ICache.CACHE_TYPE_ALL_IN_MEM || cacheType == ICache.CACHE_TYPE_ONLY_HASH_MEM) {
				cache.setCacheData(JSON.getJsonList(jsonData));
				// 处理默认值字符
				for (Map<String, Object> row : cache.getCacheData()) {
					row.put(ICache.CACHE_TABLE_DEF_VALUE, row.get(cache.getValue()));
				}
			}
		}
	}

	/**
	 * 从APP端获取最新的代码表信息
	 * 
	 * @param rfmName
	 * @return
	 * @throws CSSBizCheckedException
	 */
	protected String getTableDataFromAPPServer(final String tableName) throws CSSBizCheckedException {
		Map<String, Object> resMap = new JDelegate().callRFC("ZFM_PUBLIC_CACHE_GET", new HashMap<String, Object>(1) {
			private static final long serialVersionUID = 1L;
			{
				put(ICache.CACHE_TABLE_NAME, tableName);
			}
		});
		return (String) resMap.get("RETURNJSON");
	}


	/**
	 * 使用zlib算法压缩JSON串
	 * 
	 * @param input
	 * @return
	 */
	protected byte[] compressBytes(String str) throws CSSBizCheckedException {
		ByteArrayOutputStream baos = new ByteArrayOutputStream();
		DeflaterOutputStream dos = new DeflaterOutputStream(baos, new Deflater(Deflater.BEST_COMPRESSION));
		StringReader reader = new StringReader(str);
		char[] buf = new char[8192];
		int len = 0;
		byte[] t = null;
		try {
			while ((len = reader.read(buf)) != -1) {
				dos.write(new String(buf, 0, len).getBytes("UTF-8"));
			}
			dos.finish();

			t = baos.toByteArray();
			reader.close();
			dos.close();
		} catch (Exception ex) {
			logger.error("压缩失败", ex);
			throw new CSSBizCheckedException("0");
		}
		return t;
	}

	/**
	 * 获取代码缓存数据结构对象
	 * 
	 * @return
	 */
	protected Map<String, CacheTable> getCodeCachePool() {
		return cachePool;
	}

	public Thread getMonitor() {
		return monitor;
	}

	/**
	 * 启动监控同步线程,用于定时从服务器完成更新
	 */
	private void startMonitor() {
		Thread thread = new Thread() {
			@Override
			public void run() {

				Properties props = (Properties) ConfManager.getValueByKey("codecache");
				String strUpdateCyc = props.getProperty("update-cyc");
				String strLruCleanCyc = props.getProperty("lru-clean-cyc");

				if (strUpdateCyc == null || strUpdateCyc.equals("")) {
					strUpdateCyc = "5"; // 默认5分钟
				}

				long updateCyc = -1L;
				long cleanCacheCyc = -1;

				try {
					updateCyc = Long.parseLong(strUpdateCyc); // 单位： 分钟
					cleanCacheCyc = Long.parseLong(strLruCleanCyc);// 单位：小时
				} catch (Exception ex) {
					logger.error("代码表缓存管理同步线程出现异常！", ex);
					return;
				}

				while (true) {
					try {
						sleep(updateCyc * 60L * 1000L);
					} catch (InterruptedException e) {
						logger.error("代码表缓存管理同步线程出现异常！", e);
					}

					// 清除指定时间未访问过的缓存对象中的数据
					try {
						cleanTimeoutCache(cleanCacheCyc * 60L * 60L * 1000L);
					} catch (Exception ex) {
						logger.error("代码表缓存管理同步线程更新出现异常！", ex);
					}

					// 更新缓存表数据
					try {
						loadAll();
					} catch (CSSBizCheckedException ex) {
						logger.error("代码表缓存管理同步线程更新出现异常！", ex);
					}
				}
			}

		};
		this.monitor = thread;
		thread.setDaemon(true);
		thread.start();
	}
}