package com.css.sword.platform.comm.pool;

/**
 * <p>Title: PoolManager</p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

import java.util.Map;

public class PoolManager {
    private static PoolManager poolManager = null;

    private final static SingletonPool single = new SingletonPool();

    /**
     * 单例
     * @return
     */
    public static PoolManager getInstance() {
        if (poolManager == null) {
            poolManager = new PoolManager();
        }
        return poolManager;
    }

    //私有构造器
    private PoolManager() {
        init();
    }

    //初始化方法，要在此实现配置文件的读取及缓存。
    private void init() {
        
    }

    /**
     *
     * @param key
     * @param obj
     */
    public void addSingle(String key, Object object) {
        single.returnObjectFromChild(key, object, true);
    }

    /**
     *
     * @param objects
     */
    public void addSingles(Map<String, ?> objects) {
        single.returnObjects(objects);
    }

    /**
     *
     * @param key
     * @return
     */
    public Object borrowObject(String key) {
        return single.borrowObjectFromChild(key);
    }

    public Object borrowObject(Object key, Class<?> type) {
        //要根据配置文件提供对Object创建的服务，现在暂时没有此功能，等beanFactory模块
        return null;
    }

    /**
     *
     * @param key
     * @param object
     */
    public void returnObject(String key, Object object) {
        single.returnObjectFromChild(key, object, true);
    }

    /**
     *
     * @param key
     * @param object
     */
    public void refreshObject(String key, Object object) {
        single.returnObjectFromChild(key, object, false);
    }

    /**
     *
     * @param key
     * @param object
     */
    public boolean containsObject(String key) {
        return single.containsObjectFromChild(key);
    }

}