package com.css.sword.platform.comm.log.csvlog;

import java.net.URL;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.comm.util.DateUtils;

/**
 * <p/>
 * Title: PerformanceLogger
 * </p>
 * <p/>
 * Description:
 * </p>
 * <p/>
 * Copyright: Copyright (c) 2004 ???????缼??????????
 * </p>
 * <p/>
 * Company: ???????缼??????????
 * </p>
 * 
 * @author duanxx
 * @version 1.0
 * @since 2005-8-11
 */
public class PerformanceLogger {

	/**
	 * logWritter????????????,???????????·??????
	 */
	private static final String confFileName = "performancelog.properties";
	private static LogWritter perlog = null;

	static {
		ClassLoader loader = PerformanceLogger.class.getClassLoader();
		@SuppressWarnings("unused")
		URL fileUrl = loader.getResource(confFileName);
//		PropertyConfigurator.configure(fileUrl);
		perlog = LogFactory.getLogger("Performance");
	}

	public synchronized static void writeLog(String methodName,
			String className, String desc, Calendar beginTime, Calendar endTime) {
		String[] msgs = { methodName, className, desc };
		writeLog(perlog, msgs, beginTime, endTime);
	}

	/**
	 * ????????Logger?????????????????????????С?
	 * 
	 * @param logger
	 *            ??????????
	 * @param msgs
	 *            ???????????
	 * @param beginTime
	 *            ??????
	 * @param endTime
	 *            ???????
	 */
	private synchronized static void writeLog(LogWritter logger, String[] msgs,
			Calendar beginTime, Calendar endTime) {
		if (null == beginTime || null == endTime)
			return;
		String message = formatMessage(msgs, beginTime, endTime);
		logger.debug(message);
	}

	/**
	 * ??????????е??????????????????????????????????з?
	 * 
	 * @param msgs
	 *            ???????
	 * @param beginTime
	 *            ??????
	 * @param endTime
	 *            ???????
	 * @return ???????????
	 */
	private static String formatMessage(String[] msgs, Calendar beginTime,
			Calendar endTime) {
		//int strNums = msgs.length;
		StringBuffer strBuf = new StringBuffer();
		strBuf.append(formatMessage(msgs));
		strBuf.append(',');
		if (null != beginTime)
			strBuf.append(DateUtils.convUtilCalendarToSqlTimestamp(beginTime)
					.toString());
		strBuf.append(',');
		if (null != endTime)
			strBuf.append(DateUtils.convUtilCalendarToSqlTimestamp(endTime)
					.toString());
		strBuf.append(',');
		if (null != beginTime && null != endTime) {
			long dur = endTime.getTimeInMillis() - beginTime.getTimeInMillis();
			strBuf.append(dur);
		}

		// strBuf.append ( "\n") ;
		return strBuf.toString();
	}

	/**
	 * ??????????е?????????????????????з?
	 * 
	 * @param msgs
	 *            ???????
	 * @return ???????????
	 */
	private static String formatMessage(String[] msgs) {
		int strNums = msgs.length;
		StringBuffer strBuf = new StringBuffer();
		for (int i = 0; i < strNums - 1; i++) {
			String s = msgs[i];
			strBuf.append(includeStrWithDQ(s));
			strBuf.append(',');
		}
		strBuf.append(includeStrWithDQ(msgs[strNums - 1]));
		return strBuf.toString();
	}

	/**
	 * ???????????(??4??????а????????}????????
	 * 
	 * @param s
	 *            ???????????
	 * @return ?????????
	 */
	private static String includeStrWithDQ(String s) {
		//String message = null;
		StringBuffer strBuf = new StringBuffer();
		int len = 0;
		if (null != s)
			len = s.length(); // ??????????
		strBuf.append('"'); // ???????????????
		// ??????????????????????У????????????????
		for (int i = 0; i < len; i++) {
			char c = s.charAt(i);
			strBuf.append(c);
			if (c == '"')
				strBuf.append(c);
		}
		strBuf.append('"'); // ???????????????
		return strBuf.toString();
	}

	public static void main(String[] args) {
		// PerformanceLogger.writeLog ("" , "" , "" ,
		// new GregorianCalendar() , new GregorianCalendar() );
		try {
			Map<String, String> map = (Map<String, String>) /* MethodProxy.createNewMethodProxy ( */new HashMap<String, String>()/* ) */;
			//
			// LogWritter log = (LogWritter)MethodProxy.createNewMethodProxy
			// (new LogWritter());
			// log.debug ("!!!!!!!!1" , "!!!!!!!!");
			map.put("", "");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

}
