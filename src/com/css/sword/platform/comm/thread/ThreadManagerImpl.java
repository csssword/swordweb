package com.css.sword.platform.comm.thread;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

/*
 * 线程管理对象实现类
 * 
 * <p>Title: ThreadManager</p>
 * <p>Description: SWORD 企业应用基础平台</p>
 * <p>Copyright: Copyright (c) 2004 中国软件与技术服务股份有限公司</p>
 * <p>Company: CS&S </p>
 * @author 刘付伟
 * @version 1.0  Created on 2004-12-30
 */
public class ThreadManagerImpl implements ThreadManager {
    //----------------------------------------------------------------------------------  属性

	private final static LogWritter logger = LogFactory.getLogger(ThreadManagerImpl.class);
	
    /**
     * 线程池
     */
    private Map<String, ThreadInfo> threadpool = new HashMap<String, ThreadInfo>();

    /**
     * 检查线程, 用以保证注册线程的稳定运行
     */
    private Checker checker = null;

    /**
     * 监控线程,用以保证检查线程的稳定运行
     */
    private Monitor monitor = null;

    /**
     * 检查周期, 检查线程和监控线程运行的休眠周期
     */
    private int checkInterval = 60;

    /**
     * ThreadManager的单例对象
     */
    private static ThreadManager tm = null;


    //--------------------------------------------------------------------------------  构造器

    /**
     * 私有构造器
     */
    private ThreadManagerImpl() {
        init();
    }


    //--------------------------------------------------------------------------------  单例方法

    /**
     * 单例方法,返回ThreadManager就口对象实例
     *
     * @return
     */
    public static ThreadManager sigleton() {
        if (tm == null) {
            tm = new ThreadManagerImpl();
        }

        return tm;
    }

    //--------------------------------------------------------------------------------  public 方法

    /**
     * 注册线程
     * <p/>
     * 将线程注册到线程管理器中,统一管理,以保证线程的不间断正常运行
     *
     * @param name   待注册的线程名字
     * @param thread 待注册的线程对象
     */
    public void registerThread(String name, Thread thread) {
        ThreadInfo ti = new ThreadInfo(name, thread);
        this.threadpool.put(name, ti);
    }

    /**
     * 取消注册
     *
     * @param name
     */
    public void removeThread(String name) {
        ThreadInfo ti = (ThreadInfo) threadpool.get(name);
        if (ti == null) {
            return;
        }

        synchronized (ti) {
            this.threadpool.remove(name);
        }
    }

    //--------------------------------------------------------------------------------  private 方法

    /**
     * 初始化
     */
    private void init() {
        start();
    }

    /**
     * 启动线程
     */
    private void start() {
        checker = new Checker();
        monitor = new Monitor();

        checker.start();
        monitor.start();
    }

    //--------------------------------------------------------------------------------  inner class

    /**
     * 检查线程, 按照给定的检查周期, 检查池中线程是否运行正常
     */
    class Checker extends Thread {
        public void run() {
            while (true) {
                //1. 检查monitor线程
                if (!checker.isAlive()) {
                    checker = new Checker();
                    checker.start();
                }

                //2. 检查线程池
                Iterator<String> iter = threadpool.keySet().iterator();
                while (iter.hasNext()) {
                    Object key = iter.next();
                    ThreadInfo ti = (ThreadInfo) threadpool.get(key);
                    if (!ti.getThread().isAlive()) {
                        //线程死亡,创建新的线程
                        try {
                            Thread thread = (Thread) ti.getClaz().newInstance();
                            ThreadInfo newTi = new ThreadInfo(ti.getThreadName(), thread);
                            threadpool.remove(key);
                            threadpool.put(newTi.getThreadName(), newTi);
                        } catch (Exception e) {
                            logger.error("线程池异常: 监控线程池时出现异常!");
                        }
                    }
                }

                try {
                    //3. 休眠
                    sleep(checkInterval * 1000); //休眠等待指定时间
                } catch (InterruptedException e) {
                    logger.error("线程池异常: 监控线程池时出现异常!");
                }
            }
        }
    }

    /**
     * 监控线程, 按照给定的检查周期, 检查线程Checker是否运行正常
     */
    class Monitor extends Thread {
        public void run() {
            while (true) {
                try {
                    sleep(checkInterval * 1000); //休眠等待指定时间
                } catch (InterruptedException e) {
                    logger.error("线程池异常: 监控线程Checker时出现异常!");
                    continue;
                }

                if (!checker.isAlive()) {
                    checker = new Checker();
                    checker.start();
                }
            }
        }
    }
}
