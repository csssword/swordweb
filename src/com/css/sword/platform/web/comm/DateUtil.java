package com.css.sword.platform.web.comm;

import java.sql.Date;
import java.sql.Timestamp;
import java.text.DecimalFormat;
import java.util.Calendar;

import com.css.sword.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.kernel.utils.SwordDateUtils;

public class DateUtil {

	private static final ThreadLocal<DecimalFormat> decimalFormaterCache = new ThreadLocal<DecimalFormat>() {
		protected DecimalFormat initialValue() {
			return new DecimalFormat("#0.###########");
		};
	};

	public static void main(String[] args) {
		System.out.println(parseToDate("2000年12月31日"));
	}

	// public static final String[] dateFormat = { "yyyy-MM-dd hh:mm:ss",
	// "yyyy-MM-dd HH:mm:ss.SSSS", "yyyy-MM-dd", "yyyy年MM月dd日 hh时mm分ss秒",
	// "yyyy年MM月dd日" };

	public static final String[] dateFormat = { "yyyy-MM-dd HH:mm:ss", "yyyy/MM/dd HH:mm:ss", "yyyy年MM月dd日HH时mm分ss秒", "yyyy-MM-dd",
			"yyyy/MM/dd", "yy-MM-dd", "yy/MM/dd", "yyyy年MM月dd日" };

	// public static final String[] dateRegex = {
	// "[1-9][0-9][0-9]{2}-[0|1][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]",
	// "[1-9][0-9][0-9]{2}-[0|1][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9].[0-9]{1,4}",
	// "[1-9][0-9][0-9]{2}-[0|1][0-9]-[0-3][0-9]",
	// "[1-9][0-9][0-9]{2}年[0|1][0-9]月[0-3][0-9]日 [0-2][0-9]时[0-5][0-9]分[0-5][0-9]秒",
	// "[1-9][0-9][0-9]{2}年[0|1][0-9]月[0-3][0-9]日" };

	public static final String[] dateRegex = { "[1-9][0-9][0-9]{2}-[0|1][0-9]-[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]",
			"[1-9][0-9][0-9]{2}/[0|1][0-9]/[0-3][0-9] [0-2][0-9]:[0-5][0-9]:[0-5][0-9]",
			"[1-9][0-9][0-9]{2}年[0|1][0-9]月[0-3][0-9]日 [0-2][0-9]时[0-5][0-9]分[0-5][0-9]秒", "[1-9][0-9][0-9]{2}-[0|1][0-9]-[0-3][0-9]",
			"[1-9][0-9][0-9]{2}/[0|1][0-9]/[0-3][0-9]", "[0-9][0-9]-[0|1][0-9]-[0-3][0-9]", "[0-9][0-9]/[0|1][0-9]/[0-3][0-9]",
			"[1-9][0-9][0-9]{2}年[0|1][0-9]月[0-3][0-9]日" };

	public enum DataYear {
		yy, yyyy
	};

	public enum Month {
		M, MM
	};

	public enum Day {
		d, dd
	};

	public enum Hour {
		h, hh
	};

	public enum Minute {
		m, mm
	};

	public enum Second {
		s, ss
	};

	public enum MilliSecond {
		S, SS, SSS, SSSS
	};

	public static Date parseToDate(String dateStr) {
		for (int i = 0; i < dateRegex.length; i++) {
			if (dateStr.matches(dateRegex[i])) {
				// SimpleDateFormat sdf = new SimpleDateFormat(dateFormat[i]);
				try {
					// Date date = new Date(sdf.parse(dateStr).getTime());
					// return date;
					java.util.Date date = SwordDateUtils.parseDate(dateStr, i);
					Date d = new Date(date.getTime());
					return d;
				} catch (SwordBaseCheckedException e) {
					throw new RuntimeException("字符串转换日期出错！" + dateStr);
				}
			}
		}
		throw new RuntimeException("输入的字符串不合法！请检查。" + dateStr);
	}

	public static Timestamp parseToTimestamp(String dateStr) {
		return new Timestamp(parseToDate(dateStr).getTime());
	}

	public static Calendar parseToCalendar(String dateStr) {
		Calendar c = Calendar.getInstance();
		c.setTimeInMillis(parseToDate(dateStr).getTime());
		return c;
	}

	public static String dateToStr(Object obj) {
		if (obj == null || obj.toString() == null) {
			return "";
		}
		// SimpleDateFormat sdf = new SimpleDateFormat(dateFormat[1]);
		if (obj instanceof Calendar) {
			Calendar calendar = (Calendar) obj;
			return SwordDateUtils.dateToString(new java.util.Date(calendar.getTimeInMillis()), 0);
			// return sdf.format(new java.util.Date(calendar.getTimeInMillis()));
		} else if (obj instanceof Timestamp) {
			Timestamp timestamp = (Timestamp) obj;
			return SwordDateUtils.dateToString(new java.util.Date(timestamp.getTime()), 0);
			// return sdf.format(new java.util.Date(timestamp.getTime()));
		} else if (obj instanceof java.util.Date) {
			java.util.Date date = (java.util.Date) obj;
			return SwordDateUtils.dateToString(date, 0);
			// return sdf.format(date);
		} else if (obj instanceof Double) {
			DecimalFormat df = decimalFormaterCache.get();
			return df.format((Double) obj);
		}
		return obj.toString();
	}
	/*
	 * private void test() { long currentTime = System.currentTimeMillis(); Date date = new Date(currentTime); SimpleDateFormat sdf = new
	 * SimpleDateFormat("yyyy-M-d hh:mm:ss:SSSS"); String dateStr = sdf.format(date); System.out.println(dateStr);
	 * 
	 * Timestamp ts = new Timestamp(currentTime); String timestampStr = sdf.format(ts); System.out.println(timestampStr);
	 * 
	 * Calendar c = Calendar.getInstance(); c.setTimeInMillis(currentTime); System.out.println(c); }
	 */
}
