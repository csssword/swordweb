package com.css.sword.platform.comm.thread;

/*
 * 线程管理对象的应用接口
 * 
 * <p>Title: ThreadManager</p>
 * <p>Description: SWORD 企业应用基础平台</p>
 * <p>Copyright: Copyright (c) 2004 中国软件与技术服务股份有限公司</p>
 * <p>Company: CS&S </p>
 * @author 刘付伟
 * @version 1.0  Created on 2004-12-30
 */

public interface ThreadManager {
    /**
     * 注册线程
     * <p/>
     * 将线程注册到线程管理器中,统一管理,以保证线程的不间断正常运行
     *
     * @param name   待注册的线程名字
     * @param thread 待注册的线程对象
     */
    public void registerThread(String name, Thread thread);

    /**
     * 取消注册
     *
     * @param name
     */
    public void removeThread(String name);

}
