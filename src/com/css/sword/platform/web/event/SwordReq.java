package com.css.sword.platform.web.event;

import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.core.event.CSSBaseRequestEvent;
import com.css.sword.platform.persistence.pagination.IPaginationReqEvent;
import com.css.sword.platform.persistence.pagination.PaginationManager;
import com.css.sword.platform.web.context.ContextAPI;
import com.css.sword.platform.web.download.FileExport;
import com.css.sword.platform.web.fileupload.UploadTools;
import com.css.sword.platform.web.mvc.SwordDataSet;
import com.css.sword.platform.web.mvc.beans.FormBean;
import com.css.sword.platform.web.mvc.beans.TableBean;
import com.css.sword.platform.web.mvc.beans.TreeBean;

/**
 * 用户Request接口DTO<br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.event<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> SwordReq.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class SwordReq extends CSSBaseRequestEvent implements
		IPaginationReqEvent, IReqData {
	protected static final LogWritter log = LogFactory
			.getLogger(SwordReq.class);
	private static final long serialVersionUID = 4421299729184631995L;
	private SwordDataSet reqDataSet;
	private Map<String, Object> mapPageParam = null;
	private Map<String, Object> bizParamMap = new HashMap<String, Object>();

	/**
	 * Event构造方法，用于最基础的交互
	 * 
	 * @param tid
	 *            transaction id
	 * @param sid
	 *            session id
	 */
	public SwordReq(String tid) {
		super(tid, null);
		/*ITicket ticket = WebSecurityManager.getTicket();
		if(ticket==null)
			sessionID = LocalDebugDomainFacadeBean.DEBUG_EJB_SESSION_ID;
		else
			sessionID = ticket.getUserSessionId();*/
	}

	/**
	 * 用户传输数据模型的Event构造方法
	 * 
	 * @param tid
	 *            transaction id
	 * @param sid
	 *            session id
	 */
	public SwordReq(String tid, SwordDataSet dataset) {
		this(tid);
		this.reqDataSet = dataset;
		mapPageParam = new HashMap<String, Object>();
		mapPageParam.put(PaginationManager.QUERY_FLAG, dataset
				.getAttr(PaginationManager.QUERY_FLAG));
		mapPageParam.put(PaginationManager.TOTAL_NUMBER, dataset
				.getAttr(PaginationManager.TOTAL_NUMBER));
		mapPageParam.put(PaginationManager.PAGE_NUMBER, dataset
				.getAttr(PaginationManager.PAGE_NUMBER));
		mapPageParam.put(PaginationManager.SORT_FLAG, dataset
				.getAttr(PaginationManager.SORT_FLAG));
		mapPageParam.put(PaginationManager.SORT_NAME, dataset
				.getAttr(PaginationManager.SORT_NAME));
		mapPageParam.put(PaginationManager.BIZ_PARAMS, dataset
				.getAttr(PaginationManager.BIZ_PARAMS));
		mapPageParam.put(PaginationManager.WIDGET_NAME, dataset
				.getAttr(PaginationManager.WIDGET_NAME));
	}

	/**
	 * 获取DTO中的数据模型
	 * 
	 * @return {@link SwordDataSet}
	 */
	public SwordDataSet getReqDataSet() {
		return reqDataSet;
	}

	/**
	 * 向DTO中存入数据模型
	 * 
	 * @param {@link SwordDataSet} swordDataSet
	 */
	public void setReqDataSet(SwordDataSet swordDataSet) {
		this.reqDataSet = swordDataSet;
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getAttr(java.lang.String)
	 */
	public Object getAttr(String wighetName) {
		return reqDataSet.getAttr(wighetName);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getDeleteTable(java.lang.String,
	 *      java.lang.Class)
	 */
	public List<?> getDeleteTable(String widgetName, Class<?> clz) {
		return reqDataSet.getDeleteTable(widgetName, clz);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getDeleteTable(java.lang.String)
	 */
	public List<?> getDeleteTable(String widgetName) {
		return reqDataSet.getDeleteTable(widgetName);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getDeleteTableData(java.lang.String)
	 */
	public List<Map<String, String>> getDeleteTableData(String widgetName) {
		return reqDataSet.getDeleteTableData(widgetName);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getForm(java.lang.String,
	 *      java.lang.Class)
	 */
	public Object getForm(String widgetName, Class<?> clz) {
		return reqDataSet.getForm(widgetName, clz);
	}

    public Object getForm(String widgetName,Object obj) {
		return reqDataSet.getForm(widgetName, obj);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getForm(java.lang.String)
	 */
	public Object getForm(String widgetName) {
		return reqDataSet.getForm(widgetName);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getFormData(java.lang.String)
	 */
	public Map<String, String> getFormData(String widgetName) {
		return reqDataSet.getFormData(widgetName);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getFormMetaData(java.lang.String)
	 */
	public FormBean getFormMetaData(String widgetName) {
		return reqDataSet.getFormMetaData(widgetName);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getInsertTable(java.lang.String,
	 *      java.lang.Class)
	 */
	public List<?> getInsertTable(String widgetName, Class<?> clz) {
		return reqDataSet.getInsertTable(widgetName, clz);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getInsertTable(java.lang.String)
	 */
	public List<?> getInsertTable(String widgetName) {
		return reqDataSet.getInsertTable(widgetName);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getInsertTableData(java.lang.String)
	 */
	public List<Map<String, String>> getInsertTableData(String widgetName) {
		return reqDataSet.getInsertTableData(widgetName);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getTable(java.lang.String,
	 *      java.lang.Class)
	 */
	public List<?> getTable(String widgetName, Class<?> clz) {
		return reqDataSet.getTable(widgetName, clz);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getTable(java.lang.String)
	 */
	public List<?> getTable(String widgetName) {
		return reqDataSet.getTable(widgetName);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getTableData(java.lang.String)
	 */
	public List<Map<String, String>> getTableData(String widgetName) {
		return reqDataSet.getTableData(widgetName);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getTableMetaData(java.lang.String)
	 */
	public TableBean getTableMetaData(String widgetName) {
		return reqDataSet.getTableMetaData(widgetName);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getTree(java.lang.String)
	 */
	public List<Map<String, Object>> getTree(String widgetName) {
		return reqDataSet.getTree(widgetName);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getTreeMataData(java.lang.String)
	 */
	public TreeBean getTreeMataData(String widgetName) {
		return reqDataSet.getTreeMataData(widgetName);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getUpdateTable(java.lang.String,
	 *      java.lang.Class)
	 */
	public List<?> getUpdateTable(String widgetName, Class<?> clz) {
		return reqDataSet.getUpdateTable(widgetName, clz);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getUpdateTable(java.lang.String)
	 */
	public List<?> getUpdateTable(String widgetName) {
		return reqDataSet.getUpdateTable(widgetName);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.web.event.IReqData#getUpdateTableData(java.lang.String)
	 */
	public List<Map<String, String>> getUpdateTableData(String widgetName) {
		return reqDataSet.getUpdateTableData(widgetName);
	}

	/**
	 * (non-Javadoc)
	 * 
	 * @see com.css.sword.platform.persistence.pagination.IPaginationReqEvent#getPaginationParams()
	 */
	public Map<String, Object> getPaginationParams() {
		return mapPageParam;// getReqDataSet().getPaginationParams();
	}

	private UploadTools ut;

	private void getUploadInstance() {
//		boolean uploadflag = (Boolean)reqDataSet.getReqDataObject().getViewData().get(Const.JSON_FILEUPLOAD);
//		if (uploadflag == false) {
//			throw new RuntimeException("此次提交的请求不是文件上传！");
//		}
        ut=(UploadTools)reqDataSet.getReqDataObject().getViewData().get("uploadOject");
		if (ut == null) {
			ut = new UploadTools();
		}
	}

	public List<FileItem> getUploadList() throws UnsupportedEncodingException,
			FileUploadException {
		HttpServletRequest request = ContextAPI.getReq();
		this.getUploadInstance();
		ut.upload(request);
		return ut.getFileList();
	}

	public InputStream getUploadStream() throws UnsupportedEncodingException,
			FileUploadException {
		HttpServletRequest request = ContextAPI.getReq();
		this.getUploadInstance();
		ut.upload(request);
		List<FileItem> fiList = ut.getFileList();
		FileItem fi = null;
		if (fiList.size() == 1) {
			fi = fiList.get(0);
			InputStream is;
			try {
				is = fi.getInputStream();
			} catch (IOException e) {
				throw new RuntimeException("获取上传文件输入流错误！");
			}
			return is;
		} else {
			return null;
		}
	}

	public void cleanUpload() {
		if (ut != null) {
			ut.clean();
		}
	}

	public List<FileItem> getUploadList(String tempFilePath, int bufferSize,
			int fileMaxSize, String encoding)
			throws UnsupportedEncodingException, FileUploadException {
		this.getUploadInstance();
		ut.setField(tempFilePath, bufferSize, fileMaxSize, encoding);
		this.getUploadList();
		return ut.getFileList();
	}

	public InputStream getUploadStream(String tempFilePath, int bufferSize,
			int fileMaxSize, String encoding)
			throws UnsupportedEncodingException, FileUploadException {
		this.getUploadInstance();
		ut.setField(tempFilePath, bufferSize, fileMaxSize, encoding);
		return this.getUploadStream();
	}
	
	public List<FileItem> getUploadList(String tempFilePath, int bufferSize,
			int fileMaxSize, int uploadMaxSize, String encoding)
			throws UnsupportedEncodingException, FileUploadException {
		this.getUploadInstance();
		ut.setField(tempFilePath, bufferSize, fileMaxSize, uploadMaxSize, encoding);
		this.getUploadList();
		return ut.getFileList();
	}

	public InputStream getUploadStream(String tempFilePath, int bufferSize,
			int fileMaxSize, int uploadMaxSize, String encoding)
			throws UnsupportedEncodingException, FileUploadException {
		this.getUploadInstance();
		ut.setField(tempFilePath, bufferSize, fileMaxSize, uploadMaxSize, encoding);
		return this.getUploadStream();
	}


	public void downLoad(String fileName, String contentTypeName,
			HttpServletResponse response, String filePath) throws IOException {
		FileExport fe = new FileExport(fileName, contentTypeName);
		fe.exportFile(response, filePath);
	}

	public void setBizParams(String key, Object value) {
		bizParamMap.put(key, value);
	}

	public void setBizParams(Map<String, Object> bizMap) {
		bizParamMap = bizMap;
	}

	public List<?> getNonStatusTable(String widgetName, Class<?> clz) {
		return reqDataSet.getNonStatusTable(widgetName, clz);
	}

	public List<?> getNonStatusTable(String widgetName) {
		return reqDataSet.getNonStatusTable(widgetName);
	}

	public List<Map<String, String>> getNonStatusTableData(String widgetName) {
		return reqDataSet.getNonStatusTableData(widgetName);
	}

	public Object getBizParam(String key) {
		return bizParamMap.get(key);
	}

	public void setAttr(String name, Object obj) {
		reqDataSet.setAttr(name, obj);
	}
}
