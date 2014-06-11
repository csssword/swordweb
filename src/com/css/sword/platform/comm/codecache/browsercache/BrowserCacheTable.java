package com.css.sword.platform.comm.codecache.browsercache;


/**
 * 缓存信息描述对象, 用于描述在内存中缓存的数据表
 * 
 * <p>Title: BrowserCacheTable</p>
 * <p>Description: SWORD 企业应用基础平台</p>
 * <p>Copyright: Copyright (c) 2007 中国软件与技术服务股份有限公司</p>
 * <p>Company: CS&S </p>
 * @author 刘福伟
 *
 * version 1.0 Created on 2007-9-4 下午04:01:37
 */
public class BrowserCacheTable{
	
	/**
	 * 版本号
	 */
	private int version;

	/**
	 * 数据表名
	 */
	private String tableName;
	
	public String getTableName() {
		return tableName;
	}

	public void setTableName(String tableName) {
		this.tableName = tableName;
	}

	public int getVersion() {
		return version;
	}

	public void setVersion(int version) {
		this.version = version;
	}

	
}