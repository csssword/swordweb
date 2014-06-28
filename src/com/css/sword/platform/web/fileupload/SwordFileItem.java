package com.css.sword.platform.web.fileupload;


import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.util.Map;

import org.apache.commons.fileupload.FileItem;

/**
 * Created by IntelliJ IDEA. User: CSS Date: 11-5-18 Time: 下午2:25 To change this
 * template use File | Settings | File Templates.
 */
public class SwordFileItem implements FileItem {
	private String fileId = null;
	private String name = null;
	private Integer status = null;
	private Map dataMap=null;
	
	public String getPath(){
		return FileHandleUtil.getParentDir().getPath()+"\\"+this.fileId;
	}
	
	
	/*
	 * 判断当前的fileItem是否是页面新增加的文件
	 * 是的话返回true,反之返回flase,
	 */
	public boolean isNewFile(){
		return this.status!=null;
	}
	
	public Map getDataMap() {
		return dataMap;
	}

	public void setDataMap(Map dataMap) {
		this.dataMap = dataMap;
	}

	public SwordFileItem(String name, String fileId,Integer status) {
		this.fileId = fileId;
		this.name = name;
		this.status=status;
	}

	public Integer getStatus() {
		return status;
	}

	public void setStatus(Integer status) {
		this.status = status;
	}

	public InputStream getInputStream() throws IOException {
		return FileHandleUtil.load(fileId);
	}

	public String getContentType() {
		System.out
				.println("FileItem：此接口尚未实现，实现的接口只有【getInputStream，getFieldName】");
		return null; // To change body of implemented methods use File |
						// Settings | File Templates.
	}

	public String getName() {
		return name; // To change body of implemented methods use File |
						// Settings | File Templates.
	}

	public boolean isInMemory() {
		System.out
				.println("FileItem：此接口尚未实现，实现的接口只有【getInputStream，getFieldName】");
		return false; // To change body of implemented methods use File |
						// Settings | File Templates.
	}

	public long getSize() {
		System.out
				.println("FileItem：此接口尚未实现，实现的接口只有【getInputStream，getFieldName】");
		return 0; // To change body of implemented methods use File | Settings |
					// File Templates.
	}

	public byte[] get() {
		System.out
				.println("FileItem：此接口尚未实现，实现的接口只有【getInputStream，getFieldName】");
		return new byte[0]; // To change body of implemented methods use File |
							// Settings | File Templates.
	}

	public String getString(String s) throws UnsupportedEncodingException {
		System.out
				.println("FileItem：此接口尚未实现，实现的接口只有【getInputStream，getFieldName】");
		return null; // To change body of implemented methods use File |
						// Settings | File Templates.
	}

	public String getString() {
		System.out
				.println("FileItem：此接口尚未实现，实现的接口只有【getInputStream，getFieldName】");
		return null; // To change body of implemented methods use File |
						// Settings | File Templates.
	}

	public void write(File file) throws Exception {

		FileOutputStream o=new FileOutputStream(file);
		InputStream is=this.getInputStream();
		byte[]tt=new byte[is.available()];
		int z;
		while((z=is.read(tt, 0, tt.length))!=-1){
			  	o.write(tt);
		}
		o.close();
	}

	public void delete() {
		System.out
				.println("FileItem：此接口尚未实现，实现的接口只有【getInputStream，getFieldName,write】");
		// To change body of implemented methods use File | Settings | File
		// Templates.
	}

	public String getFieldName() {
		return name; // To change body of implemented methods use File |
						// Settings | File Templates.
	}

	public void setFieldName(String s) {
		System.out
				.println("FileItem：此接口尚未实现，实现的接口只有【getInputStream，getFieldName,write】");
		// To change body of implemented methods use File | Settings | File
		// Templates.
	}

	public boolean isFormField() {
		System.out
				.println("FileItem：此接口尚未实现，实现的接口只有【getInputStream，getFieldName,write】");
		return false; // To change body of implemented methods use File |
						// Settings | File Templates.
	}

	public void setFormField(boolean b) {
		System.out
				.println("FileItem：此接口尚未实现，实现的接口只有【getInputStream，getFieldName,write】");
		// To change body of implemented methods use File | Settings | File
		// Templates.
	}

	public OutputStream getOutputStream() throws IOException {
		System.out
				.println("FileItem：此接口尚未实现，实现的接口只有【getInputStream，getFieldName,write】");
		return null; // To change body of implemented methods use File |
						// Settings | File Templates.
	}

	public String getFileId() {
		return fileId;
	}

	public void setFileId(String fileId) {
		this.fileId = fileId;
	}

	public void setName(String name) {
		this.name = name;
	}

}
