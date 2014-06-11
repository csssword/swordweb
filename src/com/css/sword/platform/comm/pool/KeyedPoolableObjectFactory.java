package com.css.sword.platform.comm.pool;

/**
 * <p>Title: KeyedPoolableObjectFactory</p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

public interface KeyedPoolableObjectFactory {
    /**
     * Create an instance that can be served by the pool.
     * @param key the key used when constructing the object
     * @return an instance that can be served by the pool.
     */
    Object makeObject(Object key) throws Exception;

    /**
     * Destroy an instance no longer needed by the pool.
     * @param key the key used when selecting the instance
     * @param obj the instance to be destroyed
     */
    void destroyObject(Object key, Object obj) throws Exception;

    /**
     * Ensures that the instance is safe to be returned by the pool.
     * Returns <tt>false</tt> if this instance should be destroyed.
     * @param key the key used when selecting the object
     * @param obj the instance to be validated
     * @return <tt>false</tt> if this <i>obj</i> is not valid and should
     *         be dropped from the pool, <tt>true</tt> otherwise.
     */
    boolean validateObject(Object key, Object obj);

    /**
     * Reinitialize an instance to be returned by the pool.
     * @param key the key used when selecting the object
     * @param obj the instance to be activated
     */
    void activateObject(Object key, Object obj) throws Exception;

    /**
     * Uninitialize an instance to be returned to the pool.
     * @param key the key used when selecting the object
     * @param obj the instance to be passivated
     */
    void passivateObject(Object key, Object obj) throws Exception;
}
