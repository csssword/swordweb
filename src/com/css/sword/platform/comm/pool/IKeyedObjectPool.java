package com.css.sword.platform.comm.pool;

/**
 * <p>Title: IKeyedObjectPool</p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

public interface IKeyedObjectPool {
    /**
     * Obtain an instance from my pool
     * for the specified <i>key</i>.
     * By contract, clients MUST return
     * the borrowed object using
     * {@link #returnObject(java.lang.Object,java.lang.Object) <tt>returnObject</tt>},
     * or a related method as defined in an implementation
     * or sub-interface,
     * using a <i>key</i> that is equivalent to the one used to
     * borrow the instance in the first place.
     *
     * @param key the key used to obtain the object
     * @return an instance from my pool.
     */
    Object borrowObject(String key) throws PoolException;

    /**
     * Return an instance to my pool.
     * By contract, <i>obj</i> MUST have been obtained
     * using {@link #borrowObject(java.lang.Object) <tt>borrowObject</tt>}
     * or a related method as defined in an implementation
     * or sub-interface
     * using a <i>key</i> that is equivalent to the one used to
     * borrow the <tt>Object</tt> in the first place.
     *
     * @param key the key used to obtain the object
     * @param obj a {@link #borrowObject(java.lang.Object) borrowed} instance to be returned.
     */
    void returnObject(String key, Object obj) throws PoolException;

    /**
     * 增加校验功能
     * @param key
     * @param obj
     * @param check
     * @throws PoolException
     */
    void returnObject(String key, Object obj,boolean check) throws PoolException;

    /**
     * Invalidates an object from the pool
     * By contract, <i>obj</i> MUST have been obtained
     * using {@link #borrowObject borrowObject}
     * or a related method as defined in an implementation
     * or sub-interface
     * using a <i>key</i> that is equivalent to the one used to
     * borrow the <tt>Object</tt> in the first place.
     * <p>
     * This method should be used when an object that has been borrowed
     * is determined (due to an exception or other problem) to be invalid.
     * If the connection should be validated before or after borrowing,
     * then the {@link PoolableObjectFactory#validateObject} method should be
     * used instead.
     *
     * @param obj a {@link #borrowObject borrowed} instance to be returned.
     */
    void invalidateObject(String key, Object obj) throws PoolException;

    /**
     * Create an object using my {@link #setFactory factory} or other
     * implementation dependent mechanism, and place it into the pool.
     * addObject() is useful for "pre-loading" a pool with idle objects.
     * (Optional operation).
     */
    void addObject(String key) throws PoolException;

    /**
     * Returns the number of instances
     * corresponding to the given <i>key</i>
     * currently idle in my pool (optional operation).
     * Throws {@link UnsupportedOperationException}
     * if this information is not available.
     *
     * @param key the key
     * @return the number of instances corresponding to the given <i>key</i> currently idle in my pool
     * @throws UnsupportedOperationException when this implementation doesn't support the operation
     */
    int getNumIdle(String key) throws UnsupportedOperationException;

    /**
     * Returns the number of instances
     * currently borrowed from but not yet returned
     * to my pool corresponding to the
     * given <i>key</i> (optional operation).
     * Throws {@link UnsupportedOperationException}
     * if this information is not available.
     *
     * @param key the key
     * @return the number of instances corresponding to the given <i>key</i> currently borrowed in my pool
     * @throws UnsupportedOperationException when this implementation doesn't support the operation
     */
    int getNumActive(String key) throws UnsupportedOperationException;

    /**
     * Returns the total number of instances
     * currently idle in my pool (optional operation).
     * Throws {@link UnsupportedOperationException}
     * if this information is not available.
     *
     * @return the total number of instances currently idle in my pool
     * @throws UnsupportedOperationException when this implementation doesn't support the operation
     */
    int getNumIdle() throws UnsupportedOperationException;

    /**
     * Returns the total number of instances
     * current borrowed from my pool but not
     * yet returned (optional operation).
     * Throws {@link UnsupportedOperationException}
     * if this information is not available.
     *
     * @return the total number of instances currently borrowed from my pool
     * @throws UnsupportedOperationException when this implementation doesn't support the operation
     */
    int getNumActive() throws UnsupportedOperationException;

    /**
     * Clears my pool, removing all pooled instances
     * (optional operation).
     * Throws {@link UnsupportedOperationException}
     * if the pool cannot be cleared.
     * @throws UnsupportedOperationException when this implementation doesn't support the operation
     */
    void clear() throws PoolException, UnsupportedOperationException;

    /**
     * Clears the specified pool, removing all
     * pooled instances corresponding to
     * the given <i>key</i>  (optional operation).
     * Throws {@link UnsupportedOperationException}
     * if the pool cannot be cleared.
     * @param key the key to clear
     * @throws UnsupportedOperationException when this implementation doesn't support the operation
     */
    void clear(String key) throws PoolException, UnsupportedOperationException;

    /**
     * Close this pool, and free any resources associated with it.
     */
    void close() throws PoolException;

    /**
     * Sets the {@link KeyedPoolableObjectFactory factory} I use
     * to create new instances (optional operation).
     * @param factory the {@link KeyedPoolableObjectFactory} I use to create new instances.
     * @throws IllegalStateException when the factory cannot be set at this time
     * @throws UnsupportedOperationException when this implementation doesn't support the operation
     */
    void setFactory(KeyedPoolableObjectFactory factory) throws IllegalStateException, UnsupportedOperationException;
}
