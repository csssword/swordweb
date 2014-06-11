package com.css.sword.platform.comm.codecache.browsercache;

import java.io.File;
import java.io.FileOutputStream;
import java.io.PrintWriter;
import java.util.GregorianCalendar;

/**
 * 日志记录器
 * 
 * <p>Title: BrowserCacheLog</p>
 * <p>Description: SWORD 企业应用基础平台</p>
 * <p>Copyright: Copyright (c) 2007 中国软件与技术服务股份有限公司</p>
 * <p>Company: CS&S </p>
 * @author 刘福伟
 *
 * version 1.0 Created on 2007-9-4 下午04:01:04
 */
public class BrowserCacheLog {

	private PrintWriter log; 
	
	
	public BrowserCacheLog(String rootdir){
		File file = new File(rootdir,"cachemanager.log");
		try {
			FileOutputStream out = new FileOutputStream(file,true);
			log = new PrintWriter(out);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void log(String msg){
		String time = this.getCurrentTime();
		System.out.println(time + " " +msg);
		log.println(time + " " +msg);
		log.flush();
	}
	
	public void log(String msg, Throwable e){
		String time = this.getCurrentTime();
		System.out.println(time + " " + msg + " " + e.getMessage());
		e.printStackTrace();
		
		log.println(time + " " + msg + " " + e.getMessage());
		e.printStackTrace(log);
		log.flush();
	}
	
	   /**-------------------------------------------------------------------------
     * 取当前时间
     */
    private String getCurrentTime(){
        GregorianCalendar gc = new GregorianCalendar();
        String retStr = "";
        retStr += gc.get(GregorianCalendar.YEAR);
        if(gc.get(GregorianCalendar.MONDAY)+1 < 10)
            retStr += "-0" + (gc.get(GregorianCalendar.MONDAY)+1);
        else
            retStr += "-" + (gc.get(GregorianCalendar.MONDAY)+1);

        if(gc.get(GregorianCalendar.DATE) < 10)
            retStr += "-0" + gc.get(GregorianCalendar.DATE);
        else
            retStr += "-" + gc.get(GregorianCalendar.DATE);

        int hour = gc.get(GregorianCalendar.HOUR);
        hour += 12 * gc.get(GregorianCalendar.AM_PM);
        if(hour < 10)
            retStr += " 0" + hour;
        else
            retStr += " " + hour;

        if(gc.get(GregorianCalendar.MINUTE) < 10)
            retStr += ":0" + gc.get(GregorianCalendar.MINUTE);
        else
            retStr += ":" + gc.get(GregorianCalendar.MINUTE);

        if(gc.get(GregorianCalendar.SECOND) < 10)
            retStr += ":0" + gc.get(GregorianCalendar.SECOND);
        else
            retStr += ":" + gc.get(GregorianCalendar.SECOND);

        return retStr;
    }
	
}
