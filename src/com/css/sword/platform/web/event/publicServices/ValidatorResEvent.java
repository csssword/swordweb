package com.css.sword.platform.web.event.publicServices;

import com.css.sword.platform.web.event.SwordRes;

/**
 * Validator公共服务ResponseEvent
 * <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.event.publicServices<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> ValidatorResEvent.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class ValidatorResEvent extends SwordRes {

	private static final long serialVersionUID = 8175186998225363511L;

	private boolean successed;

	public boolean isSuccessed() {
		return successed;
	}

	public void setSuccessed(boolean successed) {
		this.successed = successed;
	}

	private String message;

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
