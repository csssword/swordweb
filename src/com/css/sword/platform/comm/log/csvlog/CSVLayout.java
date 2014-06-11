package com.css.sword.platform.comm.log.csvlog;


/**
 * <p/>
 * Title: CSVLayout
 * </p>
 * <p/>
 * Description:
 * </p>
 * <p/>
 * Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司
 * </p>
 * <p/>
 * Company: 中软网络技术股份有限公司
 * </p>
 * 
 * @author duanxx
 * @version 1.0
 * @since 2005-8-11
 */
public class CSVLayout /*extends Layout*/ {

	private static final String LINE_SEP = "\n";

	StringBuffer sbuf = new StringBuffer(1024);

	public CSVLayout() {
	}

	public void activateOptions() {
	}

	/**
	 * 对字符串进行格式化，这里没做处理，因为字符串在传进来之前已经做了处理。
	 * 
	 * @param event
	 * @return 格式化后的字符串
	 */
	public String format(/*LoggingEvent event*/) {
		sbuf.setLength(0);
		sbuf.append(""/*event.getRenderedMessage()*/);
		sbuf.append(LINE_SEP);
		return sbuf.toString();
	}

	public boolean ignoresThrowable() {
		return true;
	}

}
