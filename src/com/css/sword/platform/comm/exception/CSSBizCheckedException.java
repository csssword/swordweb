package com.css.sword.platform.comm.exception;

import java.io.PrintStream;
import java.io.PrintWriter;
import java.util.List;

/**
 * <p>
 * Title: CSSBaseBizCheckedException
 * </p>
 * <p>
 * Description: 业务已检查异常父类 分三种状态处理该异常
 * </p>
 * <p>
 * Copyright: Copyright (c) 2009
 * </p>
 * <p>
 * Company: 中国软件与技术服务股份有限公司
 * </p>
 * 
 * @author wwq
 * @version 1.0
 * @since 4.0
 */
public class CSSBizCheckedException extends CSSBaseCheckedException {

	private static final long serialVersionUID = -983233274161862190L;

	public CSSBizCheckedException(String code) {
		super(code);
	}

	public CSSBizCheckedException(String code, Throwable ex) {
		super(code, ex);
	}

	public CSSBizCheckedException(String code, List<String> params) {
		super(code, params);
	}

	public CSSBizCheckedException(String code, List<String> params, Throwable ex) {
		super(code, params, ex);
	}

	// ---------------------------------------------张久旭修改----------------------------------------------------------
	@Override
	public void printStackTrace(PrintWriter writer) {
		String msg = filterStackTrace();
		synchronized (writer) {
			writer.println(msg);
		}
	}

	@Override
	public void printStackTrace(PrintStream stream) {
		String msg = filterStackTrace();
		synchronized (stream) {
			stream.println(msg);
		}
	}

	private String getFilter() {
		return "com.css";
	}

	private String filterStackTrace() {
		StackTraceElement[] stes = this.getStackTrace();
		boolean doFilter = false;
		String filter = getFilter();
		StringBuffer msg = new StringBuffer(this.getClass().getName() + ": "
				+ this.getMessage());

		if (stes[0].getClassName().startsWith(filter)) {
			doFilter = true;
		}

		for (StackTraceElement ste : stes) {
			if (!ste.getClassName().startsWith(filter) && doFilter) {
				continue;
			}
			msg.append("\n\tat ").append(ste.getClassName()).append(".")
					.append(ste.getMethodName()).append("(")
					.append(ste.getFileName()).append(":")
					.append(ste.getLineNumber()).append(")");
		}
		return msg.toString();
	}
}
