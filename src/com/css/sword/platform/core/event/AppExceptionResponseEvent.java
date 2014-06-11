package com.css.sword.platform.core.event;

/**
 * <p>Title: </p> <p>Description: </p> 
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p> 
 * <p>Company: 应用产品研发中心</p>
 *
 * @author wwq
 * @version 1.0
 * @since 4.0
 */
public class AppExceptionResponseEvent implements IResponseEvent {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public String getExceptionMessage() {
		return this.exceptionMessage;
	}

	protected Throwable ex;
	protected String exceptionMessage = "";
	private long costTime;

	public boolean isOne() {
		return true;
	}

	public void setException(Throwable ex) {
		this.ex = ex;
	}

	public Throwable getException() {
		return this.ex;
	}

	public boolean isSuccess() {
		return false;
	}

	public void setExceptionMessage(String exceptionMessage) {
		this.exceptionMessage = exceptionMessage;
	}

	public void setCostTime(long costTime) {
		this.costTime = costTime;
	}

	public long getCostTime() {
		return costTime;
	}
}
