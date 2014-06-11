package com.css.sword.platform.web.fileupload;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadBase;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.css.sword.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.kernel.utils.SwordFileUtils;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

/**
 * 
 * <p>
 * Title: 文件上传组件
 * </p>
 * <p>
 * Description:<br>
 * 默认上传文件大小小于4M，4kB缓存，字符编码UTF-8。<br>
 * e.g.<br>
 * <code>
 * 默认情况：<br>
 * 		UploadTools ut = new UploadTools();<br>
 * 		ut.upload(request);<br>
 * 自定义设置：
 * 		UploadTools ut = new UploadTools();<br>
 * 		<br>
 * 		setField方法<br>
 * 		{setField(tempFilePath, bufferSize, fileMaxSize, encoding)}<br><br>
 * 		ut.setField("d:/uploads/temp/", 1024, -1, null);<br>
 * </code>
 * </p>
 * <p>
 * Copyright: 中国软件与技术服务股份有限公司 Copyright (c) 2008
 * </p>
 * <p>
 * Company: 中国软件与技术服务股份有限公司
 * </p>
 * 
 * 
 * @author 王景龙
 * @version 1.0
 * 
 */
public class UploadTools {
	private String tempFilePath;
	private int bufferSize;
	private int fileMaxSize;
	private int uploadMaxSize;
	private String encoding;
	private boolean UserSetting = false;
	private List<FileItem> fileItem = new ArrayList<FileItem>();
	private Map<String, String> param = new HashMap<String, String>();
	private FileItem fi;

	protected static final LogWritter logger = LogFactory
	.getLogger(UploadTools.class);

	/**
	 * 文件上传构造方法 <br>
	 * 页面需要使用上传控件 <br>
	 * form中需要加入属性： <code>enctype="multipart/form-data</code> <br>
	 * 加入Input，type类型为file： <code>type="file"</code>
	 * 
	 * @param request-HttpServletRequest
	 * @author 王景龙
	 * @throws FileUploadException
	 * @throws UnsupportedEncodingException
	 * @throws SwordBaseCheckedException 
	 * 
	 */
	public void upload(HttpServletRequest request) throws FileUploadException,
			UnsupportedEncodingException{
		// 初始化属性
		if (!UserSetting) {
			this.initField();
		}
		// 建立Disk File Factory
		DiskFileItemFactory factory = new DiskFileItemFactory();
		// 设置缓冲区大小，默认是100K
		factory.setSizeThreshold(bufferSize);
		try {
			this.tempFilePath = SwordFileUtils.getSwordRootPath()+UploadConstants.TEMP_FILE_PATH;
			// 初始化目录
			this.initDirs();
		// 设置缓冲区临时路径
		factory.setRepository(new File(tempFilePath));
		}catch (SwordBaseCheckedException ex){
			throw new FileUploadException(ex.getMessage());
		}
		// 创建upload handler
		ServletFileUpload upload = new ServletFileUpload(factory);
		// 设置文件编码格式，默认为UTF-8
		upload.setHeaderEncoding(encoding);
		// 设置一次上传文件大小最大值，默认为4M
		upload.setSizeMax(uploadMaxSize);
		// 设置文件大小最大值，默认为2M
		upload.setFileSizeMax(fileMaxSize);
		try{
			// 从File表单中获得file列表
			List<?> fileItems = upload.parseRequest(request);
			Iterator<?> it = fileItems.iterator();
			while (it.hasNext()) {
				fi = (FileItem) it.next();
				if (!fi.isFormField()) {
					this.fileItem.add(fi);
				} else {
					param.put(fi.getFieldName(), fi.getString(encoding));
				}
			}
		} catch (FileUploadBase.SizeLimitExceededException e) {
			long requestSize = request.getContentLength() / 1024;
			long maxSize = upload.getSizeMax() / 1024;
			throw new FileUploadBase.SizeLimitExceededException("请求被拒绝，因为它的大小("
					+ requestSize + "KB) 超过配置的最大值(" + maxSize + "KB)", request
					.getContentLength(), upload.getSizeMax());
		}catch (FileUploadBase.FileSizeLimitExceededException e){
			long requestSize = request.getContentLength() / 1024;
			long maxSize = upload.getFileSizeMax()/ 1024;
			throw new FileUploadBase.FileSizeLimitExceededException("请求被拒绝，因为它的大小("
					+ requestSize + "KB) 超过配置的最大值(" + maxSize + "KB)", request
					.getContentLength(), upload.getSizeMax());
		}
	}

	/**
	 * 
	 * 初始化属性
	 * 
	 * @author 王景龙
	 * @throws SwordBaseCheckedException 
	 * 
	 */
	private void initField() {
		this.tempFilePath = UploadConstants.TEMP_FILE_PATH;
		this.bufferSize = UploadConstants.BUFFER_SIZE;
		this.fileMaxSize = UploadConstants.FILE_MAX_SIZE;
		this.encoding = UploadConstants.ENCODING;
		this.uploadMaxSize = UploadConstants.UPLOAD_MAX_SIZE;
	}

	/**
	 * 
	 * 初始化目录
	 * 
	 * @author 王景龙
	 * 
	 */
	private void initDirs() {
		logger.debug("初始化目录，检查目录是否存在。\nTempFilePath：" + tempFilePath);
		File tempFile = new File(tempFilePath);
		if (!tempFile.exists()) {
			tempFile.mkdirs();
		}
	}
	public void setField(String tempFilePath, int bufferSize,
			int fileMaxSize, int uploadMaxSize, String encoding) {
		if (tempFilePath == null || tempFilePath.equals("")) {
			this.tempFilePath = UploadConstants.TEMP_FILE_PATH;
		} else {
			this.tempFilePath = tempFilePath;
		}
		if (bufferSize <= 0) {
			this.bufferSize = UploadConstants.BUFFER_SIZE;
		} else {
			this.bufferSize = bufferSize;
		}
		if (fileMaxSize <= 0) {
			this.fileMaxSize = UploadConstants.FILE_MAX_SIZE;
		} else {
			this.fileMaxSize = fileMaxSize;
		}
		if(uploadMaxSize <= 0) {
			this.uploadMaxSize = UploadConstants.UPLOAD_MAX_SIZE;
		} else {
			this.uploadMaxSize = uploadMaxSize;
		}
		if (encoding == null || encoding.equals("")) {
			this.encoding = UploadConstants.ENCODING;
		} else {
			this.encoding = encoding;
		}
		this.UserSetting = true;
	}
	
	public void setField(String tempFilePath, int bufferSize,
			int fileMaxSize, String encoding) {
		if (tempFilePath == null || tempFilePath.equals("")) {
			this.tempFilePath = UploadConstants.TEMP_FILE_PATH;
		} else {
			this.tempFilePath = tempFilePath;
		}
		if (bufferSize <= 0) {
			this.bufferSize = UploadConstants.BUFFER_SIZE;
		} else {
			this.bufferSize = bufferSize;
		}
		if (fileMaxSize <= 0) {
			this.fileMaxSize = UploadConstants.FILE_MAX_SIZE;
		} else {
			this.fileMaxSize = fileMaxSize;
		}
		if (encoding == null || encoding.equals("")) {
			this.encoding = UploadConstants.ENCODING;
		} else {
			this.encoding = encoding;
		}
		this.UserSetting = true;
	}

	public List<FileItem> getFileList() {
		return this.fileItem;
	}

	public String getParam(String name) {
		return (String) this.param.get(name);
	}

	public void clean() {
		if (fi.isInMemory()) {
			fi.delete();
		}
	}
	
	/**
	 * 清理所有临时文件
	 * @return
	 */
	public synchronized  static boolean  clearAllFile(File file) {
			if(file.isDirectory()){
				for (File item : file.listFiles()) {
						item.delete();
				}
			}
			return true;
		
	}
}
