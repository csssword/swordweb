package com.css.ctp.core.commutils;

import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.Map;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

/**
 * 日期处理工具函数包,包括日期对象、日期字符串相关转换函数
 * <p>
 * Title: DateUtils
 * </p>
 * <p>
 * Description: 广东地税大集中项目新一代税收征管信息系统
 * </p>
 * <p>
 * j Copyright: Copyright (c) 2003 广东省地方税务局, 中软网络技术股份有限公司
 * </p>
 * ,
 * <p>
 * Company: 中软网络技术股份有限公司
 * </p>
 * 
 * @author 刘付伟
 * @version 1.0 <br>
 */
public class DateUtils {

	private static ThreadLocal<Map<Integer, SimpleDateFormat>> cache = new ThreadLocal<Map<Integer, SimpleDateFormat>>();

	private static final LogWritter logger = LogFactory.getLogger(DateUtils.class);

	/**
	 * 定义常见的时间格式
	 */
	private static String[] dateFormat = { "yyyy-MM-dd HH:mm:ss", "yyyy/MM/dd HH:mm:ss", "yyyy年MM月dd日HH时mm分ss秒",
			"yyyy-MM-dd", "yyyy/MM/dd", "yy-MM-dd", "yy/MM/dd", "yyyy年MM月dd日", "HH:mm:ss", "yyyyMMddHHmmss",
			"yyyyMMdd", "yyyy.MM.dd", "yy.MM.dd" };

	/**
	 * 将日期格式从 java.util.Calendar 转到 java.sql.Timestamp 格式
	 * 
	 * @param date
	 *            java.util.Calendar 格式表示的日期
	 * 
	 * @return java.sql.Timestamp 格式表示的日期
	 */
	public static Timestamp convUtilCalendarToSqlTimestamp(Calendar date) {
		if (date == null)
			return null;
		else
			return new Timestamp(date.getTimeInMillis());
	}

	/**
	 * 将日期格式从 java.util.Timestamp 转到 java.util.Calendar 格式
	 * 
	 * @param date
	 *            java.sql.Timestamp 格式表示的日期
	 * 
	 * @return java.util.Calendar 格式表示的日期
	 */
	public static Calendar convSqlTimestampToUtilCalendar(Timestamp date) {
		if (date == null)
			return null;
		else {
			java.util.GregorianCalendar gc = new java.util.GregorianCalendar();
			gc.setTimeInMillis(date.getTime());
			return gc;
		}
	}

	/**
	 * 解析一个字符串，形成一个Calendar对象，适应各种不同的日期表示法
	 * 
	 * @param dateStr
	 *            期望解析的字符串，注意，不能传null进去，否则出错
	 * 
	 * @return 返回解析后的Calendar对象 <br>
	 * <br>
	 *         可输入的日期字串格式如下：
	 * 
	 * <br>
	 *         "yyyy-MM-dd HH:mm:ss", <br>
	 *         "yyyy/MM/dd HH:mm:ss", <br>
	 *         "yyyy年MM月dd日HH时mm分ss秒", <br>
	 *         "yyyy-MM-dd", <br>
	 *         "yyyy/MM/dd", <br>
	 *         "yy-MM-dd", <br>
	 *         "yy/MM/dd", <br>
	 *         "yyyy年MM月dd日", <br>
	 *         "HH:mm:ss", <br>
	 *         "yyyyMMddHHmmss", <br>
	 *         "yyyyMMdd", <br>
	 *         "yyyy.MM.dd", <br>
	 *         "yy.MM.dd"
	 */
	public static Calendar parseDate(String dateStr) {
		if (dateStr == null || dateStr.trim().length() == 0)
			return null;

		Date result = parseDate(dateStr, 0);
		Calendar cal = new GregorianCalendar(0, 0, 0, 0, 0, 0);
		cal.setTime(result);

		return cal;
	}

	/**
	 * 将一个日期转成日期时间格式，格式这样 2002-08-05 21:25:21
	 * 
	 * @param date
	 *            期望格式化的日期对象
	 * @return 返回格式化后的字符串 <br>
	 * <br>
	 *         例： <br>
	 *         调用：
	 * 
	 * <br>
	 *         Calendar date = new GregorianCalendar(); <br>
	 *         String ret = DateUtils.toDateTimeStr(date); <br>
	 *         返回：
	 * 
	 * <br>
	 *         ret = "2002-12-04 09:13:16";
	 */
	public static String toDateTimeStr(Calendar date) {
		if (date == null)
			return null;

		Map<Integer, SimpleDateFormat> c = cache.get();
		SimpleDateFormat f = null;

		if (c == null) {
			c = new HashMap<Integer, SimpleDateFormat>();
			cache.set(c);

			f = new SimpleDateFormat(dateFormat[0]);
			c.put(0, f);
		}

		f = c.get(0);

		if (f == null) {
			f = new SimpleDateFormat(dateFormat[0]);
			c.put(0, f);
		}

		return f.format(date.getTime());
	}

	/**
	 * 将一个日期转成日期时间格式，格式这样 2002-08-05 21:25:21
	 * 
	 * @param date
	 *            期望格式化的日期对象
	 * @return 返回格式化后的字符串 <br>
	 * <br>
	 *         例： <br>
	 *         调用：
	 * 
	 * <br>
	 *         Calendar date = new GregorianCalendar(); <br>
	 *         String ret = DateUtils.toDateTimeStr(date); <br>
	 *         返回：
	 * 
	 * <br>
	 *         ret = "2002-12-04 09:13:16";
	 */
	public static String toDateTimeStr(int format, Calendar date) {
		if (date == null)
			return null;

		Map<Integer, SimpleDateFormat> c = cache.get();
		SimpleDateFormat f = null;

		if (c == null) {
			c = new HashMap<Integer, SimpleDateFormat>();
			cache.set(c);

			f = new SimpleDateFormat(dateFormat[format]);
			c.put(format, f);
		}

		f = c.get(format);

		if (f == null) {
			f = new SimpleDateFormat(dateFormat[format]);
			c.put(format, f);
		}

		return f.format(date.getTime());
	}

	/**
	 * 将一个日期转成日期格式，格式这样 2002-08-05
	 * 
	 * @param date
	 *            期望格式化的日期对象
	 * @return 返回格式化后的字符串 <br>
	 * <br>
	 *         例： <br>
	 *         调用：
	 * 
	 * <br>
	 *         Calendar date = new GregorianCalendar(); <br>
	 *         String ret = DateUtils.toDateStr(calendar); <br>
	 *         返回：
	 * 
	 * <br>
	 *         ret = "2002-12-04";
	 */
	public static String toDateStr(Calendar date) {
		if (date == null)
			return null;

		Map<Integer, SimpleDateFormat> c = cache.get();
		SimpleDateFormat f = null;

		if (c == null) {
			c = new HashMap<Integer, SimpleDateFormat>();
			cache.set(c);

			f = new SimpleDateFormat(dateFormat[3]);
			c.put(3, f);
		}

		f = c.get(3);

		if (f == null) {
			f = new SimpleDateFormat(dateFormat[3]);
			c.put(3, f);
		}

		return f.format(date.getTime());
	}

	public static String toDateStrByFormatIndex(Calendar date, int formatIndex) {
		if (date == null)
			return null;

		Map<Integer, SimpleDateFormat> c = cache.get();
		SimpleDateFormat f = null;

		if (c == null) {
			c = new HashMap<Integer, SimpleDateFormat>();
			cache.set(c);

			f = new SimpleDateFormat(dateFormat[formatIndex]);
			c.put(formatIndex, f);
		}

		f = c.get(formatIndex);

		if (f == null) {
			f = new SimpleDateFormat(dateFormat[formatIndex]);
			c.put(formatIndex, f);
		}

		return f.format(date.getTime());
	}

	public static String toDateStrByFormatIndex(Date date, int formatIndex) {
		if (date == null)
			return null;

		Map<Integer, SimpleDateFormat> c = cache.get();
		SimpleDateFormat f = null;

		if (c == null) {
			c = new HashMap<Integer, SimpleDateFormat>();
			cache.set(c);

			f = new SimpleDateFormat(dateFormat[formatIndex]);
			c.put(formatIndex, f);
		}

		f = c.get(formatIndex);

		if (f == null) {
			f = new SimpleDateFormat(dateFormat[formatIndex]);
			c.put(formatIndex, f);
		}

		return f.format(date.getTime());
	}

	public static int calendarMinus(Calendar d1, Calendar d2) {
		if (d1 == null || d2 == null) {
			return 0;
		}

		d1.set(Calendar.HOUR_OF_DAY, 0);
		d1.set(Calendar.MINUTE, 0);
		d1.set(Calendar.SECOND, 0);

		d2.set(Calendar.HOUR_OF_DAY, 0);
		d2.set(Calendar.MINUTE, 0);
		d2.set(Calendar.SECOND, 0);

		long t1 = d1.getTimeInMillis();
		long t2 = d2.getTimeInMillis();
		logger.debug("DateUtils: d1 = " + DateUtils.toDateTimeStr(d1) + "(" + t1 + ")");
		logger.debug("DateUtils: d2 = " + DateUtils.toDateTimeStr(d2) + "(" + t2 + ")");
		long daylong = 3600 * 24 * 1000;
		t1 = t1 - t1 % (daylong);
		t2 = t2 - t2 % (daylong);

		long t = t1 - t2;
		int value = (int) (t / (daylong));

		logger.debug("DateUtils: d2 -d1 = " + value + " （天）");

		return value;
	}

	/**
	 * 
	 * @param d1
	 * @param d2
	 * @return
	 */
	public static long calendarminus(Calendar d1, Calendar d2) {
		if (d1 == null || d2 == null) {
			return 0;
		}
		return (d1.getTimeInMillis() - d2.getTimeInMillis()) / (3600 * 24000);
	}

	/**
	 * 内部方法，根据某个索引中的日期格式解析日期
	 * 
	 * @param dateStr
	 *            期望解析的字符串
	 * @param index
	 *            日期格式的索引
	 * 
	 * @return 返回解析结果
	 */
	public static Date parseDate(String dateStr, int index) {
		Map<Integer, SimpleDateFormat> c = cache.get();
		SimpleDateFormat f = null;

		if (c == null) {
			c = new HashMap<Integer, SimpleDateFormat>();
			cache.set(c);

			f = new SimpleDateFormat(dateFormat[index]);
			c.put(index, f);
		}

		f = c.get(index);

		if (f == null) {
			f = new SimpleDateFormat(dateFormat[index]);
			c.put(index, f);
		}

		try {
			return f.parse(dateStr);
		} catch (ParseException pe) {
			return parseDate(dateStr, index + 1);
		} catch (ArrayIndexOutOfBoundsException aioe) {
			return null;
		}
	}

	/**
	 * 字符转日期,字符串格式："yyyy-MM-dd"，例如2006-01-01
	 * 
	 * @param dateStr
	 * @return
	 */
	public static Date StringToDate(String dateStr) {
		if (dateStr == null || dateStr.trim().length() == 0) {
			return null;
		}
		return parseDate(dateStr, 3);
	}

	/**
	 * DATE to String，支持多种格式
	 * 
	 * @param date
	 * @return
	 */
	public static String dateToString(Date date, int index) {
		if (date == null) {
			return null;
		}

		Map<Integer, SimpleDateFormat> c = cache.get();
		SimpleDateFormat f = null;

		if (c == null) {
			c = new HashMap<Integer, SimpleDateFormat>();
			cache.set(c);

			f = new SimpleDateFormat(dateFormat[index]);
			c.put(index, f);
		}

		f = c.get(index);

		if (f == null) {
			f = new SimpleDateFormat(dateFormat[index]);
			c.put(index, f);
		}

		return f.format(date);
	}

	/**
	 * DATE to String，转换结果格式为："yyyy-MM-dd"，例如2006-01-01
	 * 
	 * @param date
	 * @return
	 */
	public static String dateToString(Date date) {
		if (date == null) {
			return null;
		}

		Map<Integer, SimpleDateFormat> c = cache.get();
		SimpleDateFormat f = null;

		if (c == null) {
			c = new HashMap<Integer, SimpleDateFormat>();
			cache.set(c);

			f = new SimpleDateFormat(dateFormat[3]);
			c.put(3, f);
		}

		f = c.get(3);

		if (f == null) {
			f = new SimpleDateFormat(dateFormat[3]);
			c.put(3, f);
		}

		return f.format(date);
	}

	/**
	 * 将日期格式从 java.util.Date 转到 java.sql.Timestamp 格式 convUtilDateToSqlTimestamp <br>
	 * 
	 * @param date
	 *            java.util.Date 格式表示的日期
	 * @return Timestamp java.sql.Timestamp 格式表示的日期
	 */
	public static Timestamp convUtilDateToSqlTimestamp(Date date) {
		if (date == null)
			return null;
		else
			return new Timestamp(date.getTime());
	}

	public static Calendar convUtilDateToUtilCalendar(Date date) {
		if (date == null)
			return null;
		else {
			java.util.GregorianCalendar gc = new java.util.GregorianCalendar();
			gc.setTimeInMillis(date.getTime());
			return gc;
		}
	}

	/**
	 * 内部方法，根据某个索引中的日期格式解析日期
	 * 
	 * @param dateStr
	 *            期望解析的字符串
	 * @param index
	 *            日期格式的索引
	 * @return 返回解析结果
	 */
	public static Timestamp parseTimestamp(String dateStr, int index) {
		Map<Integer, SimpleDateFormat> c = cache.get();
		SimpleDateFormat f = null;

		if (c == null) {
			c = new HashMap<Integer, SimpleDateFormat>();
			cache.set(c);

			f = new SimpleDateFormat(dateFormat[index]);
			c.put(index, f);
		}

		f = c.get(index);

		if (f == null) {
			f = new SimpleDateFormat(dateFormat[index]);
			c.put(index, f);
		}

		try {
			return new Timestamp(f.parse(dateStr).getTime());
		} catch (ParseException pe) {
			return new Timestamp(parseDate(dateStr, index + 1).getTime());
		} catch (ArrayIndexOutOfBoundsException aioe) {
			return null;
		}
	}

	/**
	 * 内部方法，根据默认的日期格式“yyyy-MM-dd”解析日期
	 * 
	 * @param dateStr
	 *            期望解析的字符串
	 * @return 返回解析结果
	 */
	public static Timestamp parseTimestamp(String dateStr) {
		Map<Integer, SimpleDateFormat> c = cache.get();
		SimpleDateFormat f = null;

		if (c == null) {
			c = new HashMap<Integer, SimpleDateFormat>();
			cache.set(c);

			f = new SimpleDateFormat(dateFormat[3]);
			c.put(3, f);
		}

		f = c.get(3);

		if (f == null) {
			f = new SimpleDateFormat(dateFormat[3]);
			c.put(3, f);
		}

		try {
			return new Timestamp(f.parse(dateStr).getTime());
		} catch (ParseException pe) {
			return null;
		} catch (ArrayIndexOutOfBoundsException aioe) {
			return null;
		}
	}

	/**
	 * 传入calendar 返回timestamp
	 * 
	 * @param calendar
	 * @return
	 */
	public static Timestamp parseTimestamp(Calendar calendar) {
		return new Timestamp(calendar.getTimeInMillis());
	}

	public static int calcMonthDays(Calendar date) {
		Calendar t1 = (Calendar) date.clone();
		Calendar t2 = (Calendar) date.clone();
		int year = date.get(Calendar.YEAR);
		int month = date.get(Calendar.MONTH);
		t1.set(year, month, 1);
		t2.set(year, month + 1, 1);
		t2.add(Calendar.DAY_OF_YEAR, -1);
		return calendarMinus(t2, t1) + 1;
	}

}
