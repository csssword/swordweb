package com.css.sword.platform.comm.pool;

import java.util.HashMap;
import java.util.Map;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

public class ThreadLocalManager {

	private static ThreadLocal<HashMap<String, Object>> pool = new ThreadLocal<HashMap<String, Object>>();
	protected static final LogWritter log = LogFactory
			.getLogger(ThreadLocalManager.class);

	public static Object get(String key) {
		Map<?, ?> map = (Map<?, ?>) pool.get();
		if (map == null) {
			return null;
		}
		return map.get(key);
	}

	public static void add(String key, Object value) {

		if (pool.get() == null) {
			pool.set(new HashMap<String, Object>());
		}
		Map<String, Object> map = pool.get();
		map.put(key, value);
	}

	public static Map<String, Object> getMap() {
		return pool.get();
	}

	public static void clear() {
		pool.set(null);
	}
}