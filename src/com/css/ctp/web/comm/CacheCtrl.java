package com.css.ctp.web.comm;

import java.util.HashMap;
import java.util.Map;

import com.css.sword.kernel.utils.SwordServiceUtils;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.web.controller.BaseDomainCtrl;
import com.css.sword.platform.web.controller.annotations.CTRL;
import com.css.sword.platform.web.event.IReqData;
import com.css.sword.platform.web.event.IResData;
import com.css.sword.platform.web.event.SwordRes;

/**
 * 缓存代码表公共 2011.4.14
 * 
 * @author 刘轶屹
 * 
 * 2012/4/14  增加批量获取缓存代码表版本、缓存数据的方法
 */
@CTRL("CacheCtrl")
public class CacheCtrl extends BaseDomainCtrl {

	private final static LogWritter logger = LogFactory.getLogger(CacheCtrl.class);

	/**
	 * 获取web端缓存表数据
	 * 
	 * @param req
	 * @return
	 * @throws Exception
	 */
	public IResData getCacheData(IReqData req) throws Exception {
		IResData res = new SwordRes();
		String tableName = this.getHttpReq().getParameter("tableName");
		logger.debug("*****************************请求缓存表名称:" + tableName + "*****************************");
		// CacheQuery c = new CacheQuery();
		// String temp = c.getJsonData(tableName);
		// int version = c.getVersion(tableName);

		// 张久旭改-20111123-开始
		// String temp = SwordCacheUtils.getJSONFromKV(tableName);
		// int version = Integer.valueOf(SwordComponentRef.cacheMasterManager.getCacheManagerByPoolName(tableName).getCachePool(tableName)
		// .getVersion());
		String temp = SwordServiceUtils.callService("SwordCacheUtils_getJSONFromKV", new Object[] { tableName }).toString();
		int version = Integer.valueOf(SwordServiceUtils.callService("SwordCacheUtils_getVersion", new Object[] { tableName }).toString());
		// 张久旭改-20111123-结束
		res.addAttr(tableName, temp);
		res.addAttr("version", version);
		return res;
	}
	/**
	 * 量获取缓存代码表数据
	 * @param req
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public IResData batchGetCacheData(IReqData req) throws Exception {
		String tableNameList = this.getHttpReq().getParameter("tableNameList");
		IResData res = new SwordRes(); 
		if(tableNameList==null) {
            throw new RuntimeException("请求的表名错误\n 对应表明为："+tableNameList+"\n完整请求地址为"+this.getHttpReq().getRequestURL()+"?" + this.getHttpReq().getQueryString());
        }
		String[] tbnarr = tableNameList.split("#");		
		HashMap<String, String> cachedatamap= (HashMap<String, String>) SwordServiceUtils.callService("SwordCacheUtils_getJSONFromKVForBatch", new Object[] { tbnarr });
		HashMap<String, String> versionmap= (HashMap<String, String>) SwordServiceUtils.callService("SwordCacheUtils_getVersionForBatch", new Object[] { tbnarr });
		
		for (Map.Entry<String, String> entry : cachedatamap.entrySet()) {
		    String tableName = entry.getKey().toString();
		    String cachedata = entry.getValue().toString();
		    int version = Integer.valueOf(versionmap.get(tableName));
		    //int version = Integer.valueOf(SwordServiceUtils.callService("SwordCacheUtils_getVersion", new Object[] { tableName }).toString());
		    res.addAttr(tableName + "^" + version, cachedata);
		 }
		/*
		for (int i=0;i<tbnarr.length;i++){
			String tableName = tbnarr[i];
			int version = Integer.valueOf(SwordServiceUtils.callService("SwordCacheUtils_getVersion", new Object[] { tableName }).toString());
			String temp = SwordServiceUtils.callService("SwordCacheUtils_getJSONFromKV", new Object[] { tableName }).toString();
			
			//res.addAttr("version", version);
			res.addAttr(tableName+"^" + version, temp);
		}	
		*/
		 
		return res; 
	} 
	/**
	 * 量获取缓存代码表版本
	 * @param req
	 * @return  
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public IResData batchGetCacheTableVersion(IReqData req) throws Exception {
		String tableNameList = this.getHttpReq().getParameter("tableNameList");
		IResData res = new SwordRes();
		String[] tbnarr = tableNameList.split("#");		
		HashMap<String, String> versionmap= (HashMap<String, String>) SwordServiceUtils.callService("SwordCacheUtils_getVersionForBatch", new Object[] { tbnarr });		
		 
		for (Map.Entry<String, String> entry : versionmap.entrySet()) {
		    String tableName = entry.getKey().toString();
		    String version = entry.getValue().toString();
		    res.addAttr(tableName, version);
		 }
	 
		/*
		for (int i=0;i<tbnarr.length;i++){
			String tableName = tbnarr[i];
			int version = Integer.valueOf(SwordServiceUtils.callService("SwordCacheUtils_getVersion", new Object[] { tableName }).toString());			
			res.addAttr(tableName, version);
		}
	  */	 
		return res;
	}
	/**
	 * 量获取缓存代码表版本
	 * @param req
	 * @return  
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public IResData getAllVersion(IReqData req) throws Exception {
		IResData res = new SwordRes();
		HashMap<String, String> versionmap= (HashMap<String, String>) SwordServiceUtils.callService("SwordCacheUtils_getAllVersion", new Object[] {  });		
		 
		for (Map.Entry<String, String> entry : versionmap.entrySet()) {
		    String tableName = entry.getKey().toString();
		    String version = entry.getValue().toString();
		    res.addAttr(tableName, version);
		 }
		return res;
	}
	/**
	 * 获取web端缓存表版本
	 * 
	 * @param req
	 * @return
	 * @throws Exception
	 */
	public IResData getCacheTableVersion(IReqData req) throws Exception {
		String tableName = this.getHttpReq().getParameter("tableName");
		IResData res = new SwordRes();
		// CacheQuery c = new CacheQuery();

		// 张久旭改-20111123-开始
		// int version = Integer.valueOf(SwordComponentRef.cacheMasterManager.getCacheManagerByPoolName(tableName).getCachePool(tableName)
		// .getVersion());
		int version = Integer.valueOf(SwordServiceUtils.callService("SwordCacheUtils_getVersion", new Object[] { tableName }).toString());
		// 张久旭改-20111123-结束

		logger.debug("*****************************请求缓存表 名称:" + tableName + "版本:V" + version);
		res.addAttr("version", version);
		return res;
	}

}
