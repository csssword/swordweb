package com.css.sword.platform.web.mvc.util;

/**
 * 数据解析常量类 <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.util<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> Const.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class Const {
	public static final String SUBMIT_TYPE_KEY_NAME = "sword";// Json数据中提交的数据类型Key标记。
	public static final String SUBMIT_TYPE_ATTR = "attr";// Json数据中提交的数据类型Arrt标记。
	public static final String SUBMIT_TYPE_FORM = "SwordForm";// Json数据中提交的数据类型form标记
	public static final String SUBMIT_TYPE_TABLE = "SwordGrid";// Json数据中提交的数据类型table标记
	public static final String SUBMIT_TYPE_TREE = "SwordTree";// Json数据中提交的数据类型tree标记

	public static final String SUBMIT_ARG_PROXY_KEY_NAME = "proxy";// 提交参数中Proxy标记名称
	public static final String SUBMIT_ARG_CTRL_KEY_NAME = "ctrl";// 提交参数中ctrl标记名称
	public static final String SUBMIT_ARG_DATA_KEY_NAME = "data";// 提交参数中datas标记名称

	public static final String JSON_STRING_OPRATION_QUERY_VALUE = "query";// Json数据中操作类型查询的名称
	public static final String JSON_STRING_OPRATION_UPDATE_VALUE = "update";// Json数据中操作类型更新的名称
	public static final String JSON_STRING_OPRATION_DELETE_VALUE = "delete";// Json数据中操作类型删除的名称
	public static final String JSON_STRING_OPRATION_INSERT_VALUE = "insert";// Json数据中操作类型添加的名称

	public static final String JSON_STRING_ATTR_KEY_NAME = "name";// Json数据中attr标记中key的名称
	public static final String JSON_STRING_ATTR_VALUE_NAME = "value";// Json数据中attr标记中value的名称
	public static final String JSON_STRING_ATTR_TYPE_NAME = "type";// Json数据中attr标记中type的名称

	public static final String JSON_STRING_FORM_ID_KEY_NAME = "name";// Json数据中form标记中formID标记的名称
	public static final String JSON_STRING_FORM_OPRATION_KEY_NAME = "opt";// Json数据中form标记中操作类型标记的名称
	public static final String JSON_STRING_FORM_DATA_KEY_NAME = "data";// Json数据中form标记中数据内容标记的名称
	public static final String JSON_STRING_FORM_DATA_TYPE_KEY_NAME = "type";// Json数据中form标记中数据类型标记的名称
	public static final String JSON_STRING_FORM_DATA_VALUE_KEY_NAME = "value";// Json数据中form标记中数据类型标记的名称

	public static final String JSON_STRING_TABLE_ID_KEY_NAME = "name";// Json数据中table标记中tableID标记的名称
	public static final String JSON_STRING_TABLE_TR_KEY_NAME = "trs";// Json数据中table标记中表行标记的名称
	public static final String JSON_STRING_TABLE_TD_KEY_NAME = "tds";// Json数据中table标记中表列标记的名称
	public static final String JSON_STRING_TABLE_TD_VALUE_KEY_NAME = "value";// Json数据中table标记中表列值标记的名称
	public static final String JSON_STRING_TABLE_TD_CODE_KEY_NAME = "code";// Json数据中table标记中表列代码标记的名称
	public static final String JSON_STRING_TABLE_PAGINATION_TOTAL_NUMBER = "totalNum";// Json数据中table标记中的分页当前页数据总数标记
	public static final String JSON_STRING_TABLE_PAGINATION_PAGE_NUMBER = "pageNum";// Json数据中table标记中的分页当前页页码标记

	public static final String JSON_COMMON_BEANNAME_KEY_NAME = "beanname";// Json数据中JavaBean标记的名称
	public static final String JSON_COMMON_TYPE_KEY_NAME = "type";// Json数据中数据类型标记的名称
	public static final String JSON_COMMON_OPRATION_KEY_NAME = "status";// Json数据中操作标记的名称

	public static final String JSON_VALIDATOR_SUCCESS = "success";
	public static final String JSON_VALIDATOR_MESSAGE = "valiMsg";
	
	public static final String JSON_FILEUPLOAD="swordupload";

}
