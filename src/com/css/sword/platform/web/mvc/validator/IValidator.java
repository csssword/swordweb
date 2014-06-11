package com.css.sword.platform.web.mvc.validator;

/**
 * 验证组件接口 <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.validator<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> IValidator.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public interface IValidator {
	public boolean validate(Object obj);

	public String message(boolean success);
}
