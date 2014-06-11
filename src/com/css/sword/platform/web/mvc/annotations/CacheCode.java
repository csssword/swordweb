package com.css.sword.platform.web.mvc.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.Inherited;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

/**
 * 缓存表(业务)Annotation<br>
 * 
 * <li>tableName 指定代码列对应的代码表<br>
 * <li>codeRowName 指定哪个列是代码<br>
 * <li>codeName <b>代码表</b>中的代码的列名<br>
 * <li>valueName <b>代码表</b>中值的列名<br>
 * <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.annotations<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> CacheCode.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface CacheCode {
	/**
	 * 指定代码列对应的代码表
	 */
	public String tableName();

	/**
	 * 指定哪个列是代码
	 */
	public String codeRowName();

	/**
	 * <b>代码表</b>中的代码的列名
	 */
	public String codeName() default "";

	/**
	 * <b>代码表</b>中值的列名
	 */
	public String valueName() default "";
}
