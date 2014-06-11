package com.css.sword.platform.core.vo;

import java.io.Serializable;
import java.util.List;

/**
 * <p>Title: </p>
 * <p>Description: 实现此vo的对象，会提供解析vo的方法
 * 由bscs3生成工具生成的vo对象，实现此接口</p>
 * <p>Copyright: 中国软件与技术服务股份有限公司 Copyright (c) 2006</p>
 * <p>Company: 中国软件与技术服务股份有限公司</p>
 *
 * @author 曹楠
 * @version 1.0
 */
public interface IBaseValueObject extends Serializable {

	/**
	 * 获得此vo对应所有bo的集合的接口
	 * 
	 * @return
	 */
	public List<?> getAllBO();

}
