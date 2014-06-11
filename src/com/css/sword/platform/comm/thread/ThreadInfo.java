package com.css.sword.platform.comm.thread;

import java.util.Calendar;
import java.util.GregorianCalendar;

/*
 * 线程信息,作为线程的包装类保存在线程管理池中
 * 
 * <p>Title: ThreadInfo</p>
 * <p>Description: SWORD 企业应用基础平台</p>
 * <p>Copyright: Copyright (c) 2004 中国软件与技术服务股份有限公司</p>
 * <p>Company: CS&S </p>
 * @author 刘付伟
 * @version 1.0  Created on 2004-12-30
 */

public class ThreadInfo {
    /**
     * 线程名字
     */
    private String threadName;
    /**
     * 线程对象
     */
    private Thread thread;

    /**
     * 创建日期
     */
    private Calendar createTime;

    /**
     * 线程类
     */
    private Class<? extends Thread> claz;

    /**
     * 构造器
     *
     * @param threadName
     * @param thread
     */
    public ThreadInfo(String threadName, Thread thread) {
        this.threadName = threadName;
        this.thread = thread;
        this.claz = thread.getClass();
        this.createTime = new GregorianCalendar();
    }

    public Calendar getCreateTime() {
        return createTime;
    }

    public Thread getThread() {
        return thread;
    }

    public String getThreadName() {
        return threadName;
    }

    public Class<? extends Thread> getClaz() {
        return claz;
    }
}
