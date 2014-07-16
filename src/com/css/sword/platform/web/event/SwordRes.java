package com.css.sword.platform.web.event;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.css.sword.kernel.base.exception.SwordBaseCheckedException;

import com.css.sword.kernel.base.persistence.FenYePageParam;
import com.css.sword.platform.comm.pool.ThreadLocalManager;
import com.css.sword.platform.core.event.CSSBaseResponseEvent;
import com.css.sword.platform.persistence.pagination.PaginationManager;
import com.css.sword.platform.web.comm.CommParas;
import com.css.sword.platform.web.context.ContextAPI;
import com.css.sword.platform.web.mvc.SwordDataSet;
import com.css.sword.utils.SwordTypeUtils;

/**
 * 用户Request接口DTO<br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.event<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> SwordRes.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class SwordRes extends CSSBaseResponseEvent implements IResData {
	private static final long serialVersionUID = 6953677318612572553L;

	private SwordDataSet resDataSet = new SwordDataSet();

	/**
	 * 获得SwordDataSet
	 * 
	 * @return {@link SwordDataSet}
	 */
	public SwordDataSet getResDataSet() {
		return resDataSet;
	}

	public IResData joinRes(IResData res) {
		SwordRes sRes = (SwordRes) res;
		SwordDataSet sds = sRes.getResDataSet();
		List<Object> dataList = sds.getResDataObject().getJsonDatas();
		this.getResDataSet().getResDataObject().getJsonDatas()
				.addAll((Collection<Object>) dataList);
		// 2010 4 16 wjl修改，添加对JSTL数据的合并。
		Map<String, Object> jstlMap = sRes.getResDataSet().getJstlDataMap();
		this.getResDataSet().getJstlDataMap().putAll(jstlMap);
		return this;
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addAttr(java.lang.String,
	 *      java.lang.Object)
	 */
	public void addAttr(String key, Object value) {
		resDataSet.addAttr(key, value);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addForm(java.lang.String,
	 *      sun.jdbc.rowset.CachedRowSet)
	 */
//	public void addForm(String widgetName, CachedRowSet crs) {
//		resDataSet.addForm(widgetName, crs);
//	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addForm(java.lang.String,
	 *      java.util.Map)
	 */
	public void addForm(String widgetName, Map<String, String> map) {
		resDataSet.addForm(widgetName, map);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addForm(java.lang.String,
	 *      java.lang.Object)
	 */
	public void addForm(String widgetName, Object obj) {
		if(null == obj){
			obj = new HashMap<String, Object>();
		}
		if (obj instanceof Map)
			resDataSet.addForm(widgetName, (Map) obj);
		else
			resDataSet.addForm(widgetName, obj);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addForm(java.lang.String,
	 *      sun.jdbc.rowset.CachedRowSet,
	 *      com.css.sword.platform.web.mvc.cachecode.ICacheCodeConfig)
	 */
//	public void addForm(String widgetName, CachedRowSet crs,
//			ICacheCodeConfig config) {
//		resDataSet.addForm(widgetName, crs, config);
//	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addMultiSelectWithDataName(java.lang.String,
	 *      sun.jdbc.rowset.CachedRowSet)
	 */
//	public void addMultiSelectWithDataName(String widgetName, CachedRowSet crs) {
//		resDataSet.addMultiSelectWithDataName(widgetName, crs);
//	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addMultiSelectWithName(java.lang.String,
	 *      sun.jdbc.rowset.CachedRowSet)
	 */
//	public void addMultiSelectWithName(String widgetName, CachedRowSet crs) {
//		resDataSet.addMultiSelectWithName(widgetName, crs);
//	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addPage(java.lang.String)
	 */
	public void addPage(String pageName) {
		resDataSet.addPage(pageName);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addRootAttr(java.lang.String,
	 *      java.lang.Object)
	 */
	public void addRootAttr(String name, Object value) {
		resDataSet.addRootAttr(name, value);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addSelectWithDataName(java.lang.String,
	 *      sun.jdbc.rowset.CachedRowSet)
	 */
//	public void addSelectWithDataName(String widgetName, CachedRowSet crs) {
//		resDataSet.addSelectWithDataName(widgetName, crs);
//	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addSelectWithDataName(java.lang.String,
	 *      java.util.Map)
	 */
	public void addSelectWithDataName(String dataName, Map<String, String> map) {
		resDataSet.addSelectWithDataName(dataName, map);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addSelectWithWidgetName(java.lang.String,
	 *      sun.jdbc.rowset.CachedRowSet)
	 */
//	public void addSelectWithWidgetName(String widgetName, CachedRowSet crs) {
//		resDataSet.addSelectWithWidgetName(widgetName, crs);
//	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addSelectWithWidgetName(java.lang.String,
	 *      java.util.Map)
	 */
//	public void addSelectWithWidgetName(String widgetName,
//			Map<String, Object> map) {
//		resDataSet.addSelectWithWidgetName(widgetName, map);
//	}

	public void addTableMap(String widgetName, List<Map<String, Object>> list) {
		resDataSet.addTableMap(widgetName, list);
	}

	public void addTableBeanMap(String widgetName, List<?> beanList, Object p) throws SwordBaseCheckedException {
		List<Map<String, Object>> beanMapList = SwordTypeUtils.beanListToMapList(beanList, true, true,false);
		addTableMap(widgetName, beanMapList, p);
	}
	public void addTableMap(String widgetName, List<Map<String, Object>> list, Object p) {
		if (p != null) {
			FenYePageParam fp = (FenYePageParam) p;
			PaginationManager.setParams(widgetName,
					PaginationManager.PAGE_NUMBER, fp.getPageNum());
			PaginationManager.setParams(widgetName,
					PaginationManager.TOTAL_NUMBER, fp.getRows());
			long count = fp.getRowCount();
			if (count != 0)
				PaginationManager.setTotalRecorder(widgetName,
						new Integer(Long.toString(count)));
			PaginationManager.setCommonConfig(widgetName,
					PaginationManager.getRdoDatas());
			String sn = fp.getSortName();
			String sf = fp.getSortFlag();
			if (sn != null)
				PaginationManager.setParams(widgetName,
						PaginationManager.SORT_FLAG, sf);
			if (sf != null)
				PaginationManager.setParams(widgetName,
						PaginationManager.SORT_NAME, sn);
		}
		resDataSet.addTableMap(widgetName, list);
	}

	public void addTableMap(String widgetName, List<Map<String, Object>> list,
			int totalRows, int pageNum, int rowsPerPage, String sortName,
			PaginationManager.SortFlag sf) {
		PaginationManager.setParams(widgetName, PaginationManager.PAGE_NUMBER,
				pageNum);
		PaginationManager.setParams(widgetName, PaginationManager.TOTAL_NUMBER,
				rowsPerPage);
		PaginationManager.setTotalRecorder(widgetName, totalRows);
		PaginationManager.setCommonConfig(widgetName,
				PaginationManager.getRdoDatas());
		if (sortName != null)
			PaginationManager.setParams(widgetName,
					PaginationManager.SORT_FLAG, sf.toString());
		if (sf != null)
			PaginationManager.setParams(widgetName,
					PaginationManager.SORT_NAME, sortName);

		resDataSet.addTableMap(widgetName, list);
	}

	public void addTable(String widgetName, List<?> list, int totalRows,
			int pageNum, int rowsPerPage, String sortName,
			PaginationManager.SortFlag sf) {
		PaginationManager.setParams(widgetName, PaginationManager.PAGE_NUMBER,
				pageNum);
		PaginationManager.setParams(widgetName, PaginationManager.TOTAL_NUMBER,
				rowsPerPage);
		PaginationManager.setTotalRecorder(widgetName, totalRows);
		PaginationManager.setCommonConfig(widgetName,
				PaginationManager.getRdoDatas());
		if (sortName != null)
			PaginationManager.setParams(widgetName,
					PaginationManager.SORT_FLAG, sf.toString());
		if (sf != null)
			PaginationManager.setParams(widgetName,
					PaginationManager.SORT_NAME, sortName);

		resDataSet.addTable(widgetName, list);
	}

//	public void addTable(String widgetName, CachedRowSet crs, int totalRows,
//			int pageNum, int rowsPerPage, String sortName,
//			PaginationManager.SortFlag sf) {
//
//		PaginationManager.setParams(widgetName, PaginationManager.PAGE_NUMBER,
//				pageNum);
//		PaginationManager.setParams(widgetName, PaginationManager.TOTAL_NUMBER,
//				rowsPerPage);
//		PaginationManager.setTotalRecorder(widgetName, totalRows);
//		PaginationManager.setCommonConfig(widgetName,
//				PaginationManager.getRdoDatas());
//		if (sortName != null)
//			PaginationManager.setParams(widgetName,
//					PaginationManager.SORT_FLAG, sf.toString());
//		if (sf != null)
//			PaginationManager.setParams(widgetName,
//					PaginationManager.SORT_NAME, sortName);
//
//		resDataSet.addTable(widgetName, crs);
//	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addTable(java.lang.String,
	 *      sun.jdbc.rowset.CachedRowSet)
	 */
//	public void addTable(String widgetName, CachedRowSet crs) {
//		resDataSet.addTable(widgetName, crs);
//	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addTable(java.lang.String,
	 *      sun.jdbc.rowset.CachedRowSet,
	 *      com.css.sword.platform.web.mvc.cachecode.ICacheCodeConfig)
	 */
//	public void addTable(String widgetName, CachedRowSet crs,
//			ICacheCodeConfig config) {
//		resDataSet.addTable(widgetName, crs, config);
//	}

	// xg

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addTable(java.lang.String,
	 *      java.util.List)
	 */
	public void addTable(String widgetName, List<?> objList, String... config) {
		resDataSet.addTable(widgetName, objList, config);
	}

	public void addTable(String widgetName, List<?> objList) {
		if(objList != null && objList.size() >0){
			Object obj = objList.get(0);
			if (obj instanceof Map){
				List<Map<String, Object>> objMapList = (List<Map<String, Object>>)objList;
				resDataSet.addTableMap(widgetName, objMapList);
			}else
				resDataSet.addTable(widgetName, objList);
		}else{
			List<Map<String, Object>> objMapList = new ArrayList<Map<String, Object>>();
			resDataSet.addTableMap(widgetName, objMapList);
		}
//		resDataSet.addTable(widgetName, objList);
	}
	public void addTable(String widgetName, List<?> objList, FenYePageParam fy) {
		if(objList != null && objList.size() >0){
			Object obj = objList.get(0);
			if (obj instanceof Map){
				List<Map<String, Object>> objMapList = (List<Map<String, Object>>)objList;
				resDataSet.addTableMap(widgetName, objMapList);
			}else
				resDataSet.addTable(widgetName, objList);
			
		}else{
			List<Map<String, Object>> objMapList = new ArrayList<Map<String, Object>>();
			resDataSet.addTableMap(widgetName, objMapList);
		}
		
//		this.addTableMap(widgetName, (List<Map<String, Object>>) objList, fy);
	}
	

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addTree(java.lang.String,
	 *      sun.jdbc.rowset.CachedRowSet, boolean)
	 */
//	public void addTree(String widgetName, CachedRowSet crs, boolean loadData) {
//		resDataSet.addTree(widgetName, crs, loadData);
//	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addTree(java.lang.String,
	 *      sun.jdbc.rowset.CachedRowSet)
	 */
//	public void addTree(String widgetName, CachedRowSet crs) {
//		resDataSet.addTree(widgetName, crs);
//	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addTree(java.lang.String,
	 *      java.util.List, java.util.Map)
	 */
	public void addTree(String widgetName, List<?> treeDatas) {
		resDataSet.addTree(widgetName, treeDatas);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addValidator(boolean,
	 *      java.lang.String)
	 */
	public void addValidator(boolean success, String massage) {
		resDataSet.addValidator(success, massage);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addValidator(boolean)
	 */
	public void addValidator(boolean success) {
		resDataSet.addValidator(success);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#getJson()
	 */
	public String getJson() {
		return resDataSet.getJson();
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#setCustomRes(boolean)
	 */
	public void setCustomRes(boolean flag) {
		ThreadLocalManager.add("customRes", flag);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IResData#addTable(java.lang.String,
	 *      sun.jdbc.rowset.CachedRowSet, java.lang.String[])
	 */
//	public void addTable(String widgetName, CachedRowSet crs, String... config) {
//		resDataSet.addTable(widgetName, crs, config);
//	}

	public void addMessage(Object value) {
		resDataSet.addRootAttr("message", value);
	}

	public void setCusJson(boolean custom) {
		resDataSet.getResDataObject().setCustomJson(custom);
	}

	public void addJSTL(String name, Object data) {
		resDataSet.addJSTL(name, data);
	}

//	public void addCheckBoxWithDataName(String dataName, CachedRowSet crs) {
//		resDataSet.addCheckBoxWithDataName(dataName, crs);
//	}

	public void addCheckBoxWithDataName(String dataName, Map<String, String> map) {
		resDataSet.addCheckBoxWithDataName(dataName, map);
	}

	public void addCheckBoxWithDataName(String dataName, Object obj) {
		resDataSet.addCheckBoxWithDataName(dataName, obj);
	}

//	public void addCheckBoxWithWidgetName(String widgetName, CachedRowSet crs) {
//		resDataSet.addCheckBoxWithWidgetName(widgetName, crs);
//	}

	public void addCheckBoxWithWidgetName(String widgetName,
			Map<String, Object> map) {
		resDataSet.addCheckBoxWithWidgetName(widgetName, map);
	}

	public void addCheckBoxWithWidgetName(String widgetName, Object obj) {
		resDataSet.addCheckBoxWithWidgetName(widgetName, obj);
	}

//	public void addListWithDataName(String dataName, CachedRowSet crs) {
//		resDataSet.addListWithDataName(dataName, crs);
//	}

	public void addListWithDataName(String dataName, Map<String, String> map) {
		resDataSet.addListWithDataName(dataName, map);
	}

	// add
	public void addSelectWithDataName(String dataName,
			List<?> list, String... mapping) {
		resDataSet.addSelectWithDataName(dataName, list, mapping);
	}

	public void addListWithDataName(String dataName, Object obj) {
		resDataSet.addListWithDataName(dataName, obj);
	}

//	public void addListWithWidgetName(String widgetName, CachedRowSet crs) {
//		resDataSet.addListWithWidgetName(widgetName, crs);
//	}

//	public void addListWithWidgetName(String widgetName, Map<String, ?> map) {
//		resDataSet.addListWithWidgetName(widgetName, map);
//	}

	// add
//	public void addSelectWithWidgetName(String dataName,
//			List<Map<String, Object>> list, String... mapping) {
//		resDataSet.addSelectWithWidgetName(dataName, list, mapping);
//	}

//	public void addListWithWidgetName(String widgetName, Object obj) {
//		resDataSet.addListWithWidgetName(widgetName, obj);
//	}

//	public void addRadioWithDataName(String dataName, CachedRowSet crs) {
//		resDataSet.addRadioWithDataName(dataName, crs);
//	}

	public void addRadioWithDataName(String dataName, Map<String, String> map) {
		resDataSet.addRadioWithDataName(dataName, map);
	}

	public void addRadioWithDataName(String dataName, Object obj) {
		resDataSet.addRadioWithDataName(dataName, obj);
	}

//	public void addRadioWithWidgetName(String widgetName, CachedRowSet crs) {
//		resDataSet.addRadioWithWidgetName(widgetName, crs);
//	}

	public void addRadioWithWidgetName(String widgetName,
			Map<String, Object> map) {
		resDataSet.addRadioWithWidgetName(widgetName, map);
	}

	public void addRadioWithWidgetName(String widgetName, Object obj) {
		resDataSet.addRadioWithWidgetName(widgetName, obj);
	}

	public void addChart(String widgetName, String datas) {
		resDataSet.addChart(widgetName, datas);
	}

	/**
	 * 将原生数据转化为SwordSelect组件可解析的数据。<br>
	 * 此接口传入dataName，用于不同数据的Select。<br>
	 * 
	 * @param dataName
	 *            组件名称
	 * @param mapping
	 *            select映射对
	 */

	public void addSelectWithCacheData(String dataName, String tableName,
			String... mapping) {
		resDataSet.addSelectWithCacheData(dataName, tableName, mapping);
	}

	public Locale getLocale() {
		HttpServletRequest request = ContextAPI.getReq();
		Locale _locale = request.getLocale();
		HttpSession session = request.getSession();
		Object object = session.getAttribute(CommParas.CUSTOMER_LOCALE);
		if (object != null) {
			_locale = Locale.class.cast(object);
		}
		if (_locale == null)
			_locale = Locale.getDefault();
		return _locale;
	}

	@Override
	public void addTree(String widgetName, List<?> treeDatas, String codeSign,
			String pCodeSign) {
		resDataSet.addTree(widgetName, treeDatas,codeSign,pCodeSign);
	}
}
