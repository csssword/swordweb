package com.css.sword.platform.web.event.publicServices;

import com.css.sword.platform.web.event.SwordReq;

/**
 * Validator公共服务RequestEvent
 * <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.event.publicServices<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> ValidatorReqEvent.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class ValidatorReqEvent extends SwordReq {

	private static final long serialVersionUID = 6570413330457258071L;

	private Object validateValue;

	private String validator;

	public ValidatorReqEvent(String tid) {
		super(tid);
	}

	public String getValidator() {
		return validator;
	}

	public void setValidator(String validator) {
		this.validator = validator;
	}

	public Object getValidateValue() {
		return validateValue;
	}

	public void setValidateValue(Object obj) {
		this.validateValue = obj;
	}

}
