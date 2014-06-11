package com.css.sword.platform.comm.pool;

/**
 * <p>Title: IHierarchicalPool</p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

public interface IHierarchicalPool {
    final static String NESTED_SEPARATOR = ".";
    public void returnObjectFromChild(String key, Object object,boolean check) throws
        PoolException;

    public Object borrowObjectFromChild(String key) throws PoolException;
}