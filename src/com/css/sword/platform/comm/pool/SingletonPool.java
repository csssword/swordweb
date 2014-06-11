package com.css.sword.platform.comm.pool;

/**
 * <p>Title: SingletonPool</p>
 * <p>Description: 单例池</p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.comm.util.StringUtils;

public class SingletonPool extends AbsBaseKeyedObjectPool implements
		IHierarchicalPool {
	
	private final static LogWritter logger = LogFactory.getLogger(SingletonPool.class);

	/**
	 * 当前池对象的缓存地点
	 */
	protected Map<String, Object> cache = Collections.synchronizedMap(new HashMap<String, Object>());

	public SingletonPool() {

	}

	public SingletonPool(String key, IKeyedObjectPool child) {
		this.cache.put(key, child);
	}

	public void invalidateObject(String key, Object object)
			throws PoolException {
		throw new UnsupportedOperationException();
	}

	public Object borrowObject(String key) {
		return cache.get(key);
	}

	public void returnObject(String key, Object object) throws PoolException {
		cache.put(key, object);
	}

	public void returnObject(String key, Object obj, boolean check)
			throws PoolException {
		if (check && cache.containsKey(key)) {
			logger.debug("当前池已有key=" + key + ",不能再放！");
			throw new OccupiedLocationException("50", key);
		}
		this.returnObject(key, obj);
	}

	public void returnObjects(Map<String, ?> objects) {
		cache.putAll(objects);
	}

	public void returnObjectFromChild(String nestkey, Object object,
			boolean check) {
		IKeyedObjectPool pool = this.setChildsPool(nestkey);

		String key = StringUtils.unqualify(nestkey,
				IHierarchicalPool.NESTED_SEPARATOR);
		if (check) {
			pool.returnObject(key, object, true);
		} else {
			pool.returnObject(key, object);
		}
	}

	public Object borrowObjectFromChild(String nestkey) {
		Object result = null;
		SingletonPool pool = (SingletonPool) this.getBottomChildPool(nestkey);
		String key = StringUtils.unqualify(nestkey,
				IHierarchicalPool.NESTED_SEPARATOR);
		if (pool != null) {// 如果底层池不为空，说明key写对了。为空说明池里没有东西，返回null;
			if ("*".equals(key)) {
				result = pool.getCache();
			} else {
				result = pool.borrowObject(key);
			}
		}
		return result;
	}

	// /////////////////////////////////////////////////////////
	/**
	 * 得到最底层的池（根据APool.BPool.key这样的key值）
	 * 
	 * @param key
	 *            :包含层次关系的key
	 * @return KeyedObjectPool:键值池接口
	 * @throws NoSuchPoolException
	 *             :没有该池则抛出异常
	 */
	protected IKeyedObjectPool getBottomChildPool(String nestkey)
			throws NoSuchPoolException {
		IKeyedObjectPool curPool = this;
		IKeyedObjectPool nextPool = null;
		// 必须带"."的key值，表明有嵌套池才处理
		if (nestkey != null && !"".equals(nestkey.trim())) {
			if (nestkey.indexOf(IHierarchicalPool.NESTED_SEPARATOR) > 0) {
				String[] names = StringUtils.delimitedListToStringArray(
						nestkey, IHierarchicalPool.NESTED_SEPARATOR);
				// 最后一个是值的key名，不是pool名所以，最后一个不用处理了
				for (int i = 0; i < names.length - 1; i++) {
					try {
						nextPool = (IKeyedObjectPool) ((IKeyedObjectPool) curPool)
								.borrowObject(names[i]);
						if (nextPool == null) {
							return null;// 表明欠套名称是错的，没有存入值，则最底层的池返回空
						}
						curPool = nextPool;
					} catch (ClassCastException ex) {
						throw new NoSuchPoolException("51", names[i]);
					}
				}
			} else {
				// 如果没有嵌套则直接返回当前池
				return this;
			}
		} else {
			throw new NoSuchPoolException("52");
		}
		return nextPool;
	}

	/**
	 * 根据key设置一级级的pool,并返回最底层的pool
	 * 
	 * @param key
	 * @return
	 * @throws PoolException
	 */
	public IKeyedObjectPool setChildsPool(String nestkey) throws PoolException {
		if (nestkey != null && !"".endsWith(nestkey.trim())
				&& nestkey.indexOf(IHierarchicalPool.NESTED_SEPARATOR) > 0) {
			String[] names = StringUtils.delimitedListToStringArray(nestkey,
					IHierarchicalPool.NESTED_SEPARATOR);
			IKeyedObjectPool curPool = this;
			IKeyedObjectPool nextPool = null;
			for (int i = 0; i < names.length - 1; i++) {
				nextPool = (IKeyedObjectPool) curPool.borrowObject(names[i]);
				if (nextPool == null) {
					nextPool = new SingletonPool();
					curPool.returnObject(names[i], nextPool, true);
				}
				curPool = nextPool;
			}
			return nextPool;
		} else {
			// 如果没有嵌套则直接返回当前池
			return this;
		}
	}

	public Map<String, Object> getCache() {
		return cache;
	}

	/**
	 * 判断池中是否有物
	 * 
	 * @param key
	 * @return
	 */
	public boolean containsObjectFromChild(String nestkey) {
		boolean result = false;
		SingletonPool pool = (SingletonPool) this.getBottomChildPool(nestkey);
		String key = StringUtils.unqualify(nestkey,
				IHierarchicalPool.NESTED_SEPARATOR);
		if (pool == null) { // 如果底层池不为空，说明key写对了。为空说明池里没有东西;
			result = false;
		} else {
			result = pool.containsObject(key);
		}
		return result;
	}

	public boolean containsObject(String key) {
		return cache.containsKey(key);
	}
}