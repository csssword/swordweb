package com.css.sword.platform.web.mvc.beans;

import java.io.Serializable;
import java.util.Map;

/**
 * 数据模型
 * <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.beans<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> IObjectBean.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public interface IObjectBean<T> extends Serializable{
	
	
	/**
	 * 数据键值对<BR>
	 * key：formID，tableID，RowID，Attr的key等<BR>
	 * value：form的数据，对应一个params的Map，table的数据为一个TableRowBean<BR>
	 * <li>Attr为一层形式，attr的ViewData里面存放{key,value}<BR>
	 * </li><li>Form为二层形式，form的ViewData里面存放{formID,formParam}->formParam里面存放{key,value}<BR>
	 * </li><li>Table为三层嵌套形式，Table的ViewData里面存放{tableID,tableData}->tableData里面存放{tableRowID,rowData}->RowData里面存放{key,value}
	 * </li>
	 * @return Map
	 * @see AbsDataBean
	 */
	public Map<String, T> viewData();
}
