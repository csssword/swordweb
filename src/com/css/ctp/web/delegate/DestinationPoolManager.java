package com.css.ctp.web.delegate;

import java.util.HashMap;
import java.util.Map;

import com.css.sword.platform.comm.exception.CSSBaseCheckedException;

/**
 * JCo Destination Pool管理器
 * 
 * @author 张久旭
 * 
 */
public final class DestinationPoolManager {

	public static final String DefaultDestinationPool = "DefaultDestinationPool";

	private static Map<String, DestinationPool> destinationMap = new HashMap<String, DestinationPool>();

	private DestinationPoolManager() {
	}

	/**
	 * 向连接池管理器中增加新的池
	 * 
	 * @param dir
	 * @param destinationPoolName
	 * @throws CSSBaseCheckedException
	 */
	public static void addDestination(String dir, String destinationPoolName) throws CSSBaseCheckedException {
		destinationMap.put(destinationPoolName, new DestinationPool(dir, destinationPoolName));
	}

	/**
	 * 获取指定的连接池
	 * 
	 * @param destinationPoolName
	 * @return
	 */
	protected static DestinationPool getDestinationPool(String destinationPoolName) {
		return destinationMap.get(destinationPoolName);
	}

	/**
	 * 获取默认连接池
	 * 
	 * @return
	 */
	public static DestinationPool getDefaultDestinationPool() {
		return getDestinationPool(DefaultDestinationPool);
	}

}
