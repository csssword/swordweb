package com.css.sword.platform.comm.pool;

/**
 * <p>Title: AbsBaseKeyedObjectPool</p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

public abstract class AbsBaseKeyedObjectPool implements IKeyedObjectPool {
    public abstract Object borrowObject(String key) throws PoolException;
    public abstract void returnObject(String key, Object obj) throws PoolException;
    public abstract void invalidateObject(String key, Object obj) throws PoolException;

    /**
     * Not supported in this base implementation.
     */
    public void addObject(String key) throws PoolException, UnsupportedOperationException {
        throw new UnsupportedOperationException();
    }

    /**
     * Not supported in this base implementation.
     */
    public int getNumIdle(String key) throws UnsupportedOperationException {
        throw new UnsupportedOperationException();
    }

    /**
     * Not supported in this base implementation.
     */
    public int getNumActive(String key) throws UnsupportedOperationException {
        throw new UnsupportedOperationException();
    }

    /**
     * Not supported in this base implementation.
     */
    public int getNumIdle() throws UnsupportedOperationException {
        throw new UnsupportedOperationException();
    }

    /**
     * Not supported in this base implementation.
     */
    public int getNumActive() throws UnsupportedOperationException {
        throw new UnsupportedOperationException();
    }

    /**
     * Not supported in this base implementation.
     */
    public void clear() throws PoolException, UnsupportedOperationException {
        throw new UnsupportedOperationException();
    }

    /**
     * Not supported in this base implementation.
     */
    public void clear(String key)
    throws PoolException, UnsupportedOperationException {
        throw new UnsupportedOperationException();
    }

    /**
     * Does nothing this base implementation.
     */
    public void close() throws PoolException {
    }


    /**
     * Not supported in this base implementation.
     */
    public void setFactory(KeyedPoolableObjectFactory factory)
    throws IllegalStateException, UnsupportedOperationException {
        throw new UnsupportedOperationException();
    }

}
