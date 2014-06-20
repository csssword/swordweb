package com.css.sword.platform.web.exception;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.log4j.Logger;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

public class BizRuntimeException extends RuntimeException {
	private static final long serialVersionUID = -5257929274394630566L;
	protected static final LogWritter log = LogFactory
			.getLogger(BizRuntimeException.class);

	private String logEnable = Logger.getLogger("com.css").getLevel()
			.toString();

	public BizRuntimeException() {
		this.printOut("======捕获业务运行时异常！！请根据控制台信息调整代码！======");
		this.printStackTrace();
	}

	public BizRuntimeException(String... message) {
		this.printOut("======捕获业务运行时异常！！请根据控制台信息调整代码！======");
		this.printOut(message);
		this.printStackTrace();
	}

	private void printOut(String... message) {
		SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss,SSS");
		sdf.format(new Date(System.currentTimeMillis()));
		StackTraceElement trace = this.getStackTrace()[0];
		if (logEnable.equals("DEBUG")) {
			for (int i = 0; i < message.length; i++) {
				System.out.println(sdf.format(new Date(System
						.currentTimeMillis()))
						+ " ERROR "
						+ trace.getClassName()
						+ ":"
						+ trace.getLineNumber() + " - " + message[i]);
			}
		}
	}
}
