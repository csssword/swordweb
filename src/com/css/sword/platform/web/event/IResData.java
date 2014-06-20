package com.css.sword.platform.web.event;

import java.util.List;
import java.util.Locale;
import java.util.Map;

import sun.jdbc.rowset.CachedRowSet;

import com.css.sword.platform.core.event.IResponseEvent;
import com.css.sword.platform.persistence.pagination.PaginationManager;
import com.css.sword.platform.web.mvc.cachecode.ICacheCodeConfig;

/**
 * ResponseEvent用户接口DTO <br>
 * 此接口根据{@link SwordDataSet}数据模型的实现获得用户接口。<br>
 * <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.event<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> IResData.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
/**
 * @author NoGrief
 * 
 */
public interface IResData extends IResponseEvent {
	/**
	 * 将持久化数据（CachedRowSet）转化成SwordGrid可解析的数据。
	 * 
	 * @param widgetName
	 *            前端组件名称
	 * @param crs
	 *            数据集
	 */
//	public void addTable(String widgetName, CachedRowSet crs);


//    public void addTableMap(String widgetName, List<Map<String, ?>> list,int totalRows,int pageNum ,int rowsPerPage ,String sortName, PaginationManager.SortFlag sf);
//    public void addTable(String widgetName, List<?> list,int totalRows,int pageNum ,int rowsPerPage,String sortName, PaginationManager.SortFlag sf);
//    public void addTable(String widgetName, CachedRowSet crs,int totalRows,int pageNum ,int rowsPerPage,String sortName, PaginationManager.SortFlag sf);

	/**
	 * 将持久化数据（CachedRowSet）转化成SwordGrid可解析的数据。 <br>
	 * 此方法与{@link #addTable(String, CachedRowSet)}不同的是，添加的代码转名称接口。 <br>
	 * 使用方法时，需要实现代码转名称接口。详细使用方法请参考代码转名称文档。
	 * 
	 * @see #addTable(String, CachedRowSet)
	 * @see com.css.sword.platform.web.mvc.cachecode.ICacheCodeConfig
	 * @param widgetName
	 *            前端组件名称
	 * @param crs
	 *            数据集
	 * @param config
	 *            代码转名称配置
	 */
//	public void addTable(String widgetName, CachedRowSet crs,ICacheCodeConfig config);

	/**
	 * 将持久化数据（CachedRowSet）转化成SwordGrid可解析的数据。 <br>
	 * 此方法与{@link #addTable(String, CachedRowSet)}不同的是，添加的代码转名称接口。 <br>
	 * 使用方法时，传入配置信息。详细使用方法请参考代码转名称文档。
	 * 
	 * @see #addTable(String, CachedRowSet)
	 * @see com.css.sword.platform.web.mvc.cachecode.ICacheCodeConfig
	 * @param widgetName
	 *            前端组件名称
	 * @param crs
	 *            数据集
	 * @param config
	 *            代码转名称配置
	 */
//	public void addTable(String widgetName, CachedRowSet crs, String... config);

	
	//xg
	/**
	 * 将一组BO转化成SwordGrid可解析的数据。 <br>
	 * 使用添加的代码转名称接口方法时，传入配置信息。详细使用方法请参考代码转名称文档。
	 * 
	 * @see #addTable(String, CachedRowSet)
	 * @see com.css.sword.platform.web.mvc.cachecode.ICacheCodeConfig
	 * @param widgetName
	 *            前端组件名称
	 * @param crs
	 *            数据集
	 * @param config
	 *            代码转名称配置
	 */
//	public void addTable(String widgetName, List<?> objList, String... config);
	
	public void addTable(String widgetName, List<?> objList);
	
	
	
	/**
	 * 将一组Map转化成SwordGrid可解析的数据。
	 * 
	 * @param widgetName
	 *            前端组件名称
	 * @param list
	 *            一组Map数据的List
	 */
//	public void addTableMap(String widgetName, List<Map<String,Object>> list);
	
	/**
	 * 将持久化数据（CachedRowSet）转化成SwordForm可解析的数据。
	 * 
	 * @param widgetName
	 *            前端组件名称
	 * @param crs
	 *            数据集
	 */
//	public void addForm(String widgetName, CachedRowSet crs);

	/**
	 * 将原生数据转化成SwordGrid可解析的数据。
	 * 
	 * @param widgetName
	 *            前端组件名称
	 * @param map
	 *            Map数据
	 */
	public void addForm(String widgetName, Map<String, String> map);

	/**
	 * 将一个BO转化成SwordGrid可解析的数据。
	 * 
	 * @param widgetName
	 *            前端组件名称
	 * @param obj
	 *            BO
	 */
	public void addForm(String widgetName, Object obj);

	/**
	 * 将持久化数据（CachedRowSet）转化成SwordForm可解析的数据。<br>
	 * 此方法与 {@link #addForm(String, CachedRowSet)}不同的是，添加的代码转名称接口。 <br>
	 * 使用方法时，需要实现代码转名称接口。详细使用方法请参考代码转名称文档。
	 * 
	 * @see #addForm(String, CachedRowSet)
	 * @see com.css.sword.platform.web.mvc.cachecode.ICacheCodeConfig
	 * @param widgetName
	 *            前端组件名称
	 * @param crs
	 *            数据集
	 * @param config
	 *            代码转名称配置
	 */
//	public void addForm(String widgetName, CachedRowSet crs,
//			ICacheCodeConfig config);

	/**
	 * 将传入的Key，Value转化成SwordAttr组件可解析的数据。<br>
	 * 转化后，widgetName相当于这里的key。
	 * 
	 * @param key
	 *            Attr的key
	 * @param value
	 *            Attr的value
	 */
	public void addAttr(String key, Object value);

	/**
	 * 用于页面跳转，传入页面的绝对路径。
	 * 
	 * @param pageName
	 *            页面名称
	 */
	public void addPage(String pageName);

	/**
	 * 将持久化信息转化为SwordSelect组件可解析的数据。<br>
	 * 此接口传入widgetName，用于不同数据的Select。<br>
	 * 如果存在相同数据的多个Select请使用{@link #addSelectWithDataName(String, CachedRowSet)}。<br>
	 * 
	 * @param widgetName
	 *            组件名称
	 * @param crs
	 *            数据集
	 */
//	public void addSelectWithWidgetName(String widgetName, CachedRowSet crs);

	/**
	 * 将原生数据转化为SwordSelect组件可解析的数据。<br>
	 * 此接口传入widgetName，用于不同数据的Select。<br>
	 * 如果存在相同数据的多个Select请使用{@link #addSelectWithDataName(String, Map)}。<br>
	 * 
	 * @param widgetName
	 *            组件名称
	 * @param map
	 *            原生Map数据
	 */
	public void addSelectWithWidgetName(String widgetName,
			Map<String, Object> map);

	//add
    /**
	 * 将持久化信息转化为SwordSelect组件可解析的数据。<br>
	 * 此接口传入widgetName，用于不同数据的Select。<br>
	 * 如果存在相同数据的多个Select请使用
	 * {@link #addSelectWithDataName(String, List <Map<String, Object>>)}。<br>
	 *
	 * @param dataName
	 *            组件名称
	 * @param list
	 *            数据list
	 */
	public void addSelectWithWidgetName(String dataName, List <Map<String, Object>> list,String... mapping);

	/**
	 * 将持久化信息转化为SwordSelect组件可解析的数据。<br>
	 * 此接口传入dataName，用于不同数据的Select。<br>
	 * 如果存在相同数据的多个Select请使用
	 * {@link #addSelectWithWidgetName(String, CachedRowSet)}。<br>
	 * 
	 * @param dataName
	 *            组件名称
	 * @param crs
	 *            数据集
	 */
//	public void addSelectWithDataName(String dataName, CachedRowSet crs);

	/**
	 * 将原生数据转化为SwordSelect组件可解析的数据。<br>
	 * 此接口传入dataName，用于不同数据的Select。<br>
	 * 如果存在相同数据的多个Select请使用{@link #addSelectWithWidgetName(String, Map)}。<br>
	 * 
	 * @param dataName
	 *            组件名称
	 * @param map
	 *            原生Map数据
	 */
	public void addSelectWithDataName(String dataName, Map<String, String> map);

	//add
    /**
	 * 将持久化信息转化为SwordSelect组件可解析的数据。<br>
	 * 此接口传入dataName，用于同样数据的多个Select。<br>
	 *
	 * @param dataName
	 *            组件名称
	 * @param list
	 *            数据list
	 */
	public void addSelectWithDataName(String dataName, List <Map<String, Object>> list,String... mapping);

	/**
	 * 将数据集转化成级联下拉菜单组件可解析的数据。<br>
	 * 详细使用方法相见相关文档。 <br>
	 * 此接口传入widgetName。
	 * 
	 * @see #addSelectWithWidgetName(String, CachedRowSet)
	 * @param widgetName
	 *            组件名称
	 * @param crs
	 *            数据集
	 */
//	public void addMultiSelectWithName(String widgetName, CachedRowSet crs);

	/**
	 * 将数据集转化成级联下拉菜单组件可解析的数据。<br>
	 * 详细使用方法相见相关文档。 <br>
	 * 此接口传入dataName。
	 * 
	 * @see #addSelectWithDataName(String, CachedRowSet)
	 * @param widgetName
	 *            组件名称
	 * @param crs
	 *            数据集
	 */
//	public void addMultiSelectWithDataName(String widgetName, CachedRowSet crs);

	/**
	 * 将数据集转化成SwordTree可解析的数据。<br>
	 * 此方法可以通过loadData参数设置本次请求的数据是否让web框架自动处理。
	 * 
	 * @param widgetName
	 *            组件名称
	 * @param crs
	 *            数据集
	 * @param loadData
	 *            标识web框架是否自动处理数据
	 */
//	public void addTree(String widgetName, CachedRowSet crs, boolean loadData);

	/**
	 * 将数据集转化成SwordTree可解析的数据。<br>
	 * 
	 * @param widgetName
	 *            组件名称
	 * @param crs
	 *            数据集
	 */
//	public void addTree(String widgetName, CachedRowSet crs);

	/**
	 * 将数据集转化成SwordTree可解析的数据。<br>
	 * 使用原生数据构件树。<br>
	 * treeDatas表示树数据，Map中Key必须为id、title、pid，id表示此节点id，title表示此节点名称，
	 * pid表示此节点的父节点id。<br>
	 * treeMataDatas表示树的根节点信息。
	 * 
	 * @param widgetName
	 *            组建名称
	 * @param treeDatas
	 *            树的数据
	 */
	public void addTree(String widgetName, List<Map<String, Object>> treeDatas);

	/**
	 * 获得ResData的Json数据。用作前台组件解析。
	 * 
	 * @return String Json
	 */
//	public String getJson();

	/**
	 * 添加提示信息。
	 * 
	 * @param value
	 */
	public void addMessage(Object value);

	/**
	 * 标记是否使用自定义Res流。
	 * 
	 * @param flag
	 *            标记 true|false
	 */
//	public void setCustomRes(boolean flag);

	/**
	 * 添加验证消息。
	 * 
	 * @param success
	 *            是否成功
	 * @param massage
	 *            返回消息
	 */
//	public void addValidator(boolean success, String massage);

	/**
	 * 添加验证结果
	 * 
	 * @param success
	 *            是否验证成功
	 */
//	public void addValidator(boolean success);

	/**
	 * 合并IResData
	 * 
	 * @param res
	 *            传入要合并的Res
	 * @return IResData
	 */
//	public IResData joinRes(IResData res);

	/**
	 * 设置是否使用自定义Json
	 * 
	 * @param custom
	 *            true|false
	 */
//	public void setCusJson(boolean custom);

	/**
	 * 添加jstl支持
	 * 
	 * @param name
	 *            attr的key
	 * @param data
	 *            attr的value
	 */
	public void addJSTL(String name, Object data);

	/**
	 * 将数据集转化成前端Radio组件
	 * 
	 * @param widgetName 组件名称
	 * @param crs 数据集
	 */
//	public void addRadioWithWidgetName(String widgetName, CachedRowSet crs);

//	public void addRadioWithDataName(String dataName, CachedRowSet crs);

//	public void addRadioWithDataName(String dataName, Map<String, String> map);

	/**
	 * 将Map转化成前端Radio组件
	 * 
	 * @param widgetName 组件名称
	 * @param map 数据map
	 */
	public void addRadioWithWidgetName(String widgetName,
			Map<String, Object> map);

//	public void addRadioWithDataName(String dataName, Object obj);

	/**
	 * 将对象转化成前端Radio组件
	 * 
	 * @param widgetName 组件名称
	 * @param obj java Bean对象
	 */
//	public void addRadioWithWidgetName(String widgetName, Object obj);

	/**
	 * 将数据集转化成前端CheckBox组件
	 * 
	 * @param widgetName 组件名称
	 * @param crs 数据集
	 */
//	public void addCheckBoxWithWidgetName(String widgetName, CachedRowSet crs);

//	public void addCheckBoxWithDataName(String dataName, CachedRowSet crs);

//	public void addCheckBoxWithDataName(String dataName, Map<String, String> map);

	/**
	 * 将map转化成前端CheckBox组件
	 * 
	 * @param widgetName 组件名称
	 * @param map 数据map
	 */
	public void addCheckBoxWithWidgetName(String widgetName,
			Map<String, Object> map);

//	public void addCheckBoxWithDataName(String dataName, Object obj);

	/**
	 * 将对象转化成前端CheckBox组件
	 * 
	 * @param widgetName 组件名称
	 * @param obj java bean 对象
	 */
//	public void addCheckBoxWithWidgetName(String widgetName, Object obj);

	/**
	 * 将数据集转化成前端List组件
	 * 
	 * @param widgetName 组件名称
	 * @param crs 数据集
	 */
//	public void addListWithWidgetName(String widgetName, CachedRowSet crs);

//	public void addListWithDataName(String dataName, CachedRowSet crs);

//	public void addListWithDataName(String dataName, Map<String, String> map);

	/**
	 * 将map转化成前端List组件
	 * 
	 * @param widgetName 组件名称
	 * @param map 数据map
	 */
//	public void addListWithWidgetName(String widgetName, Map<String, ?> map);

//	public void addListWithDataName(String dataName, Object obj);

	/**
	 * 将对象转化成前端List组件
	 * 
	 * @param widgetName 组件名称
	 * @param obj java bean 对象
	 */
//	public void addListWithWidgetName(String widgetName, Object obj);
	
	/**
	 * 将Charts组件数据封装成JSON
	 * 
	 * @param widgetName 组件名称
	 * @param datas Charts组件数据
	 */
//	public void addChart(String widgetName,String datas);
	
	/**
	 * 获取Locale
	 * 
	 */
//	public Locale getLocale();
	
	/**
	 * 将数据返回给调用该服务的服务
	 * add by chechw
	 * @param name
	 * @param object
	 */
//	public void put(String name, Object object);

	/**
	 * 获取服务返回的数据
	 * add by chechw
	 * @param name
	 * @return
	 */
//	public Object get(String name);
	
}
