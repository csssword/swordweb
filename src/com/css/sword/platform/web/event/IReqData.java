package com.css.sword.platform.web.event;

import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.List;
import java.util.Map;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;

import com.css.sword.kernel.base.persistence.FenYePageParam.PageQueryValueObject;
import com.css.sword.platform.core.event.IRequestEvent;
import com.css.sword.platform.web.mvc.SwordDataSet;

/**
 * RequestEvent用户接口DTO <br>
 * 此接口根据{@link SwordDataSet}数据模型的实现获得用户接口。<br>
 * <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.event<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> IReqData.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public interface IReqData extends IRequestEvent {
//    public Map<?, ?> getPaginationParams();
	
//	public void setAttr(String name, Object obj);
	/**
	 * 根据组件名称获得前端组件数据。<br>
	 * 组件类型：SwordGrid<br>
	 * 此方法根据用户传入的Class，填充到用户BO中，返回BO List。<br>
	 * 
	 * @param widgetName
	 *            组件名称
	 * @param clz
	 *            BO Class
	 * @return BO List
	 */
	public List<?> getTable(String widgetName, Class<?> clz);

	/**
	 * 根据组件名称获得前端组件数据。<br>
	 * 组件类型：SwordGrid<br>
	 * 此方法根据用户传入的Class，填充到用户BO中，返回BO List。<br>
	 * 与{@link #getTable(String, Class)}不同的是，BO Class的声明需要从前端获取。<br>
	 * <br>
	 * code:
	 * <hr>
	 * <code>beanname:com.css.sword.test.TestBo</code>
	 * <hr>
	 * 如果未获取到beanname，框架将抛出运行时异常。
	 * 
	 * @see #getTable(String, Class)
	 * @param widgetName
	 *            组件名称
	 * @return BO List
	 */
//	public List<?> getTable(String widgetName);

	/**
	 * 根据组件名称，获得SwordGrid组件数据模型。<br>
	 * 组件类型：SwordGrid<br>
	 * 
	 * @param widgetName
	 *            组件名称
	 * @return {@link TableBean}
	 */
//	public TableBean getTableMetaData(String widgetName);

	/**
	 * 根据组件名称，获得SwordGrid组件原始解析数据。<br>
	 * 组件类型：SwordGrid<br>
	 * 返回的List中是二维结构，外层List表示表格的每一行，内层Map表示存放表格中每一行中每个Cell的数据。Key为数据库中的字段名称，
	 * value是值。<br>
	 * 
	 * 
	 * @param widgetName
	 *            组件名称
	 * @return 原始解析数据
	 */
	public List<Map<String, String>> getTableData(String widgetName);

	/**
	 * 根据组件名称获得SwordFrom组件原始解析数据<br>
	 * 组件类型：SwordForm<br>
	 * 此方法返回一维结构Map，对应的key为表单中填写控件的name，value为控件的值。
	 * 
	 * @param widgetName
	 *            组件名称
	 * @return 原始解析数据
	 */
	public Map<String, String> getFormData(String widgetName);

	/**
	 * 根据组件名称获得SwordForm中的数据。<br>
	 * 组件类型：SwordForm<br>
	 * 此方法能将数据自动填充到BO当中，调用时传入Class。
	 * 
	 * @param widgetName
	 *            组件名称
	 * @param clz
	 *            BO Class
	 * @return BO实例
	 */
	public Object getForm(String widgetName, Class<?> clz);


    //在obj中填充widgetName提交的对应数据 
    public Object getForm(String widgetName, Object obj);
    

	/**
	 * 根据组件名称获得SwordForm中的数据。<br>
	 * 组件类型：SwordForm<br>
	 * 此方法与{@link #getForm(String, Class)}类似，需要用户在前端传入BO Class。 <br>
	 * code:
	 * <hr>
	 * <code>beanname:com.css.sword.test.TestBo</code>
	 * <hr>
	 * 如果未获取到beanname，框架将抛出运行时异常。
	 * 
	 * @see #getForm(String, Class)
	 * @param widgetName
	 *            组件名称
	 * @return BO Class
	 */
//	public Object getForm(String widgetName);

	/**
	 * 根据组件名称获得原始解析数据。<br>
	 * 组件类型：SwordForm<br>
	 * 
	 * @param widgetName
	 *            组件名称
	 * @return {@link FormBean}
	 */
//	public FormBean getFormMetaData(String widgetName);

	/**
	 * 根据组件名称获得原始解析数据。<br>
	 * 组件类型：SwordTree<br>
	 * 
	 * @param widgetName
	 *            组件名称
	 * @return {@link TreeBean}
	 */
//	public TreeBean getTreeMataData(String widgetName);

	/**
	 * 根据组件名称获得SwordTree组件原始数据。<br>
	 * 组件类型：SwordTree<br>
	 * Map表示节点的参数信息。<br>
	 * 
	 * @param widgetName
	 *            组件名称
	 * @return SwordTree原始数据
	 */
	public List<Map<String, Object>> getTree(String widgetName);

	/**
	 * 根据组件名称，获得SwordAttr组件的原始数据。 <br>
	 * 传入组件名称，将返回value。
	 * 
	 * @param widgetName
	 *            组件名称
	 * @return attr的value
	 */
	public Object getAttr(String widgetName);

	/**
	 * 根据组件名称获得标记为insert的SwordGrid组件数据。<br>
	 * 组件类型：SwordGrid<br>
	 * 此方法将返回原始数据。用法同{@link #getTableData(String)}
	 * 
	 * @see #getTableData(String)
	 * @param widgetName
	 *            组件名称
	 * @return 原始数据
	 */
	public List<Map<String, String>> getInsertTableData(String widgetName);

	/**
	 * 根据组件名称获得标记为insert的SwordGrid组件数据。<br>
	 * 组件类型：SwordGrid<br>
	 * 此方法根据传入的Class自动将数据封装成传入的BO对象。返回BO对象的列表。用法同
	 * {@link #getTable(String, Class)}
	 * 
	 * @see #getTable(String, Class)
	 * @param widgetName
	 *            组件名称
	 * @param clz
	 *            BO Class
	 * @return BO List
	 */
	public List<?> getInsertTable(String widgetName, Class<?> clz);

	/**
	 * 根据组件名称获得标记为insert的SwordGrid组件数据。<br>
	 * 组件类型：SwordGrid<br>
	 * 此方法根据用户传入的Class，填充到用户BO中，返回BO List。<br>
	 * 与{@link #getTable(String)}类似，BO Class的声明需要从前端获取。<br>
	 * <br>
	 * code:
	 * <hr>
	 * <code>beanname:com.css.sword.test.TestBo</code>
	 * <hr>
	 * 如果未获取到beanname，框架将抛出运行时异常。
	 * 
	 * @see #getTable(String)
	 * @param widgetName
	 *            组件名称
	 * @return BO List
	 */
//	public List<?> getInsertTable(String widgetName);

	/**
	 * 根据组件名称获得标记为delete的SwordGrid组件数据。<br>
	 * 组件类型：SwordGrid<br>
	 * 此方法将返回原始数据。用法同{@link #getTableData(String)}
	 * 
	 * @see #getTableData(String)
	 * @param widgetName
	 *            组件名称
	 * @return 原始数据
	 */
	public List<Map<String, String>> getDeleteTableData(String widgetName);

	/**
	 * 根据组件名称获得标记为delete的SwordGrid组件数据。<br>
	 * 组件类型：SwordGrid<br>
	 * 此方法根据传入的Class自动将数据封装成传入的BO对象。返回BO对象的列表。用法同
	 * {@link #getTable(String, Class)}
	 * 
	 * @see #getTable(String, Class)
	 * @param widgetName
	 *            组件名称
	 * @param clz
	 *            BO Class
	 * @return BO List
	 */
	public List<?> getDeleteTable(String widgetName, Class<?> clz);

	/**
	 * 根据组件名称获得标记为delete的SwordGrid组件数据。<br>
	 * 组件类型：SwordGrid<br>
	 * 此方法根据用户传入的Class，填充到用户BO中，返回BO List。<br>
	 * 与{@link #getTable(String)}类似，BO Class的声明需要从前端获取。<br>
	 * <br>
	 * code:
	 * <hr>
	 * <code>beanname:com.css.sword.test.TestBo</code>
	 * <hr>
	 * 如果未获取到beanname，框架将抛出运行时异常。
	 * 
	 * @see #getTable(String)
	 * @param widgetName
	 *            组件名称
	 * @return BO List
	 */
//	public List<?> getDeleteTable(String widgetName);

	/**
	 * 根据组件名称获得标记为update的SwordGrid组件数据。<br>
	 * 组件类型：SwordGrid<br>
	 * 此方法将返回原始数据。用法同{@link #getTableData(String)}
	 * 
	 * @see #getTableData(String)
	 * @param widgetName
	 *            组件名称
	 * @return 原始数据
	 */
	public List<Map<String, String>> getUpdateTableData(String widgetName);

	/**
	 * 根据组件名称获得标记为update的SwordGrid组件数据。<br>
	 * 组件类型：SwordGrid<br>
	 * 此方法根据传入的Class自动将数据封装成传入的BO对象。返回BO对象的列表。用法同
	 * {@link #getTable(String, Class)}
	 * 
	 * @see #getTable(String, Class)
	 * @param widgetName
	 *            组件名称
	 * @param clz
	 *            BO Class
	 * @return BO List
	 */
	public List<?> getUpdateTable(String widgetName, Class<?> clz);

	/**
	 * 根据组件名称获得标记为update的SwordGrid组件数据。<br>
	 * 组件类型：SwordGrid<br>
	 * 此方法根据用户传入的Class，填充到用户BO中，返回BO List。<br>
	 * 与{@link #getTable(String)}类似，BO Class的声明需要从前端获取。<br>
	 * <br>
	 * code:
	 * <hr>
	 * <code>beanname:com.css.sword.test.TestBo</code>
	 * <hr>
	 * 如果未获取到beanname，框架将抛出运行时异常。
	 * 
	 * @see #getTable(String)
	 * @param widgetName
	 *            组件名称
	 * @return BO List
	 */
//	public List<?> getUpdateTable(String widgetName);

	/**
	 * 设置业务参数
	 * 
	 * @param key key
	 * @param value 值
	 */
	public void setBizParams(String key, Object value);

	/**
	 * 设置业务参数
	 * 
	 * @param bizMap
	 */
//	public void setBizParams(Map<String, Object> bizMap);

	public List<FileItem> getUploadList() throws UnsupportedEncodingException,
			FileUploadException;

	/**
	 * 获得通过上传组件提交的上传文件流。
	 * 
	 * @return InputStream
	 * @throws UnsupportedEncodingException
	 * @throws FileUploadException
	 */
	public InputStream getUploadStream() throws UnsupportedEncodingException,
			FileUploadException;

	/**
	 * 获得通过上传组件提交的上传文件列表
	 * 
	 * @param tempFilePath 缓存文件路径
	 * @param bufferSize 缓冲区大小
	 * @param fileMaxSize 上传文件大小
	 * @param encoding 文件编码
	 * @return List<FileItem>
	 * @throws UnsupportedEncodingException
	 * @throws FileUploadException
	 */
//	public List<FileItem> getUploadList(String tempFilePath, int bufferSize,
//			int fileMaxSize, String encoding)
//			throws UnsupportedEncodingException, FileUploadException;

	/**
	 * 添加对上传文件总大小设置的接口,同时支持上传文件大小设置和总大小设置
	 * @param tempFilePath
	 * @param bufferSize
	 * @param fileMaxSize
	 * @param uploadMaxSize
	 * @param encoding
	 * @return
	 * @throws UnsupportedEncodingException
	 * @throws FileUploadException
	 */
//	public List<FileItem> getUploadList(String tempFilePath, int bufferSize,
//			int fileMaxSize, int uploadMaxSize, String encoding)
//			throws UnsupportedEncodingException, FileUploadException;
	
	/**
	 * 获得通过上传组件提交的上传文件流。
	 * 
	 * @param tempFilePath 缓存文件路径
	 * @param bufferSize 缓冲区大小
	 * @param fileMaxSize 上传文件大小
	 * @param encoding 文件编码
	 * @return InputStream
	 * @throws UnsupportedEncodingException
	 * @throws FileUploadException
	 */
//	public InputStream getUploadStream(String tempFilePath, int bufferSize,
//			int fileMaxSize, String encoding)
//			throws UnsupportedEncodingException, FileUploadException;
	
	/**
	 * 添加对上传文件总大小设置的接口,同时支持上传文件大小设置和总大小设置
	 * @param tempFilePath
	 * @param bufferSize
	 * @param fileMaxSize
	 * @param uploadMaxSize
	 * @param encoding
	 * @return
	 * @throws UnsupportedEncodingException
	 * @throws FileUploadException
	 */
//	public InputStream getUploadStream(String tempFilePath, int bufferSize,
//			int fileMaxSize, int uploadMaxSize, String encoding)
//			throws UnsupportedEncodingException, FileUploadException;
	
	public List<Map<String, String>> getNonStatusTableData(String widgetName);
	
	public List<?> getNonStatusTable(String widgetName, Class<?> clz);
	
//	public List<?> getNonStatusTable(String widgetName);
	
	public Object getBizParam(String key);

	public PageQueryValueObject getPageQueryValueObject();
}
