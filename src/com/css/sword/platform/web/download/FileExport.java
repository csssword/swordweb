package com.css.sword.platform.web.download;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import org.apache.tools.zip.ZipEntry;
import org.apache.tools.zip.ZipOutputStream;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

/**
 * <p>
 * Title:
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Copyright: 中国软件与技术服务股份有限公司 Copyright (c) 2006
 * </p>
 * <p>
 * Company: 中国软件与技术服务股份有限公司
 * </p>
 * 
 * @author 曹楠
 * @version 1.0
 */
public class FileExport {

	protected static final LogWritter logger = LogFactory
			.getLogger(FileExport.class);

	/**
	 * 默认构造器
	 * 
	 * @param fileName
	 *            文件名
	 * @param contentTypeName
	 *            文件类型
	 */
	public FileExport(String fileName, String contentTypeName) {
		initContentTypeMap();
		this.contentTypeName = contentTypeName;
		this.contentType = (String) contentTypeMap.get(contentTypeName);
		this.fileName = fileName;
	}

	/**
	 * 私有构造器
	 */
	@SuppressWarnings("unused")
	private FileExport() {
	}

	// ----------------------------公共接口----------------------------------------

	// 对外提供的方法1 byte[]
	public void exportFile(HttpServletResponse response, byte[] bytes)
			throws IOException {
		if (contentTypeName.equals(FileConstants.FILE_EXT_NAME_ZIP)) {
			logger
					.debug("执行doZippedExport(response, bytes, encodeType)方法，参数为fileName:"
							+ fileName
							+ "； contentTypeName:"
							+ contentTypeName
							+ "； contentType:" + contentType);
			doZippedExport(response, bytes, encodeType);
		} else {
			logger
					.debug("执行doExport(response, bytes, encodeType)方法，参数为fileName:"
							+ fileName
							+ "； contentTypeName:"
							+ contentTypeName
							+ "； contentType:" + contentType);
			doExport(response, bytes, encodeType);
		}
	}

	// 对外提供的方法2 InputStream
	public void exportFile(HttpServletResponse response, InputStream in)
			throws IOException {
		if (contentTypeName.equals(FileConstants.FILE_EXT_NAME_ZIP)) {
			logger
					.debug("执行doZippedExport(response, in, encodeType)方法，参数为fileName:"
							+ fileName
							+ "； contentTypeName:"
							+ contentTypeName
							+ "； contentType:" + contentType);
			doZippedExport(response, in, encodeType);
		} else {
			logger.debug("执行doExport(response, in, encodeType)方法，参数为fileName:"
					+ fileName + "； contentTypeName:" + contentTypeName
					+ "； contentType:" + contentType);
			doExport(response, in, encodeType);
		}
	}

	// 对外提供的方法3 File 如果file是目录的话，需使用zip方式
	public void exportFile(HttpServletResponse response, File file)
			throws IOException {
		if (contentTypeName.equals(FileConstants.FILE_EXT_NAME_ZIP)) {
			logger
					.debug("执行doZippedExport(response, file, encodeType)方法，参数为fileName:"
							+ fileName
							+ "； contentTypeName:"
							+ contentTypeName
							+ "； contentType:" + contentType);
			doZipExport(response, file, encodeType);
		} else {
			logger.debug("将file:" + file.getName() + " 转换成InputStream。。。。");
			FileInputStream in = new FileInputStream(file);
			logger.debug("执行doExport(response, in, encodeType)方法，参数为fileName:"
					+ fileName + "； contentTypeName:" + contentTypeName
					+ "； contentType:" + contentType);
			doExport(response, in, encodeType);
		}
	}

	// 对外提供的方法4 List files 此种情况只支持输出为zip
	public void exportFile(HttpServletResponse response, List<?> files)
			throws IOException {
		// 先将头信息设置为zip类型的
		this.contentTypeName = FileConstants.FILE_EXT_NAME_ZIP;
		this.contentType = (String) contentTypeMap.get(contentTypeName);

		logger
				.debug("执行 doExport4FileList(response, files, encodeType)方法，参数为fileName:"
						+ fileName
						+ "； contentTypeName:"
						+ contentTypeName
						+ "； contentType:" + contentType);
		doExport4FileList(response, files, encodeType);
	}
	
	// 对外提供的方法4 List map(key为文件名，value为文件流) 此种情况只支持输出为zip
	public void exportToZip(HttpServletResponse response, List<Map<String,Object>> stream)
			throws IOException {
		// 先将头信息设置为zip类型的
		this.contentTypeName = FileConstants.FILE_EXT_NAME_ZIP;
		this.contentType = (String) contentTypeMap.get(contentTypeName);
		exportZip4Stream(response, stream, encodeType);
	}

	// 对外提供的方法5 String path
	public void exportFile(HttpServletResponse response, String path)
			throws IOException {
		if (contentTypeName.equals(FileConstants.FILE_EXT_NAME_ZIP)) {
			FileInputStream in = new FileInputStream(path);
			doZippedExport(response, in, encodeType);
		} else {
			logger.debug("获得路径" + path + "上文件的InputStream.......");
			FileInputStream in = new FileInputStream(path);
			logger.debug("执行doExport(response, in, encodeType)方法，参数为fileName:"
					+ fileName + "； contentTypeName:" + contentTypeName
					+ "； contentType:" + contentType);
			doExport(response, in, encodeType);
		}
	}

	// ------------------------------私有方法---------------------------------
	/**
	 * 初始化头类型Map
	 */
	private void initContentTypeMap() {
		if (contentTypeMap.isEmpty()) {
			contentTypeMap.put(FileConstants.FILE_EXT_NAME_CSV,
					FileConstants.CSV_CONTENT_TYPE);
			contentTypeMap.put(FileConstants.FILE_EXT_NAME_ZIP,
					FileConstants.ZIP_CONTENT_TYPE);
			contentTypeMap.put(FileConstants.FILE_EXT_NAME_XML,
					FileConstants.XML_CONTENT_TYPE);
			contentTypeMap.put(FileConstants.FILE_EXT_NAME_TXT,
					FileConstants.TXT_CONTENT_TYPE);
			contentTypeMap.put(FileConstants.FILE_EXT_NAME_DAT,
					FileConstants.DAT_CONTENT_TYPE);
			contentTypeMap.put(FileConstants.FILE_EXT_NAME_XLS,
					FileConstants.XLS_CONTENT_TYPE);
		}
	}

	// 支持参数是file list 的export方法
	private void doExport4FileList(HttpServletResponse response, List<?> files,
			String encoding) throws IOException {
		// Set http response header
		response.reset();
		response.setContentType(contentType + " charset=" + encoding);
		response.setHeader("Content-disposition", "attachment;filename="
				+ fileName + contentTypeName);

		// Zip and export.
		ZipOutputStream os = null;
		try {
			// 取得zip输出流
			os = new ZipOutputStream(response.getOutputStream());
			// 循环处理每一个file，将其放入zip中
			int i = 0;
			File theFile;
			for (i = 0; i < files.size(); i++) {
				theFile = (File) files.get(i);
				zip(os, theFile, theFile.getName());
			}
			os.flush();
		} catch (Exception e) {
			logger.error("将fileList导出为zip文件时出现错误。 ", e);
			e.printStackTrace();
		} finally {
			closeStream(os);
		}
	}

	/**
	 * Export comma-separated-values file
	 * 
	 * @param response
	 *            HttpServletResponse
	 * @param bytes
	 *            byte[] Bytes from csv formatted string
	 * @param encoding
	 *            String Encoding for http content type.
	 * @throws IOException
	 */
	private void doExport(HttpServletResponse response, byte[] bytes,
			String encoding) throws IOException {
		// Set http response header
		response.reset();
		response.setContentType(contentType + " charset=" + encoding);
		response.setHeader("Content-disposition", "attachment;filename="
				+ fileName + contentTypeName);

		// Do export
		BufferedInputStream in = new BufferedInputStream(
				new ByteArrayInputStream(bytes));
		BufferedOutputStream bo = null;
		try {
			bo = new BufferedOutputStream(response.getOutputStream());
			byte[] buf = new byte[bufferSize];
			int b;
			while ((b = in.read(buf, 0, buf.length)) != -1) {
				bo.write(buf, 0, b);
			}
			bo.flush();
		} catch (IOException e) {
			logger.error("[doExport] Export csv file exception ", e);
			throw e;
		} finally {
			closeStream(bo, in);
		}
	}

	/**
	 * Export comma-separated-values file
	 * 
	 * @param response
	 *            HttpServletResponse
	 * @param
	 * @param encoding
	 *            String Encoding for http content type.
	 * @throws IOException
	 */
	private void doExport(HttpServletResponse response, InputStream in,
			String encoding) throws IOException {
		// Set http response header
		response.reset();
		response.setContentType(contentType + " charset=" + encoding);
		response.setHeader("Content-disposition", "attachment;filename="
				+ fileName + contentTypeName);

		// Do export
		BufferedInputStream bin = new BufferedInputStream(in);
		BufferedOutputStream bo = null;
		try {
			bo = new BufferedOutputStream(response.getOutputStream());
			byte[] buf = new byte[bufferSize];
			int b;
			while ((b = bin.read(buf, 0, buf.length)) != -1) {
				bo.write(buf, 0, b);
			}
			bo.flush();
		} catch (IOException e) {
			logger.error("[doExport] Export csv file exception ", e);
			throw e;
		} finally {
			closeStream(bo, in);
		}
	}

	/**
	 * Multi-file zip and export
	 * 
	 * @param response
	 *            HttpServletResponse
	 * @param encoding
	 *            Encoding for http content type.
	 * @throws IOException
	 */
	private synchronized void doZippedExport(HttpServletResponse response,
			InputStream in, String encoding) throws IOException {
		if (in == null) {
			logger.info("[doZippedExport] Nothing to be exported");
			return;
		}

		// Set http response header
		response.reset();
		response.setContentType(FileConstants.ZIP_CONTENT_TYPE + " charset="
				+ encoding);
		response.setHeader("Content-disposition", "filename=" + fileName
				+ FileConstants.FILE_EXT_NAME_ZIP);

		// Zip and export.
		ZipOutputStream os = null;
		BufferedInputStream is = null;
		try {
			os = new ZipOutputStream(response.getOutputStream());
			logger.info("fileName:" + fileName);
			os.putNextEntry(new ZipEntry(fileName));

				is = new BufferedInputStream(in);
				int b = 0;
				byte[] buf = new byte[bufferSize];
				while ((b = is.read(buf, 0, buf.length)) != -1) {
					os.write(buf, 0, b);
				}
			os.flush();
		} catch (Exception e) {
			logger.error("[doZippedExport] Exception ", e);
		} finally {
			closeStream(os, is);
		}
	}
	
	/**
	 * Multi-file zip and export
	 * 
	 * @param response
	 *            HttpServletResponse
	 * @param encoding
	 *            Encoding for http content type.
	 * @throws IOException
	 */
	private synchronized void exportZip4Stream(HttpServletResponse response,
			List<Map<String,Object>> list,String encoding) throws IOException {
		if (list == null) {
			logger.info("[doZippedExport] Nothing to be exported");
			return;
		}

		// Set http response header
		response.reset();
		response.setContentType(FileConstants.ZIP_CONTENT_TYPE + " charset="
				+ encoding);
		response.setHeader("Content-disposition", "filename=" + fileName
				+ FileConstants.FILE_EXT_NAME_ZIP);

		// Zip and export.
		ZipOutputStream os = null;
		BufferedInputStream is = null;
		os = new ZipOutputStream(response.getOutputStream());
		try {
			for(int i =0; i< list.size(); i++){
				Map<String, Object> streamxx = list.get(i);
				for (String key : streamxx.keySet()) {   
					os.putNextEntry(new ZipEntry(key));
					is = new BufferedInputStream((InputStream) streamxx.get(key));
					int b = 0;
					byte[] buf = new byte[bufferSize];
					while ((b = is.read(buf, 0, buf.length)) != -1) {
						os.write(buf, 0, b);
					}
				}
			}
			os.flush();
		} catch (Exception e) {
			logger.error("[doZippedExport] Exception ", e);
		} finally {
			closeStream(os, is);
		}
	}

	/**
	 * Multi-file zip and export
	 * 
	 * @param response
	 *            HttpServletResponse
	 * @param encoding
	 *            Encoding for http content type.
	 * @throws IOException
	 */
	private synchronized void doZipExport(HttpServletResponse response,
			File file, String encoding) throws IOException {
		// Set http response header
		response.reset();
		response.setContentType(FileConstants.ZIP_CONTENT_TYPE + " charset="
				+ encoding);
		response.setHeader("Content-disposition", "filename=" + fileName
				+ FileConstants.FILE_EXT_NAME_ZIP);

		// Zip and export.
		ZipOutputStream os = null;
		try {
			os = new ZipOutputStream(response.getOutputStream());
			zip(os, file, file.getName());
			os.flush();
		} catch (Exception e) {
			logger.error("[doZippedExport] Exception ", e);
			e.printStackTrace();
		} finally {
			closeStream(os);
		}
	}

	/**
	 * zip 文件压缩
	 * 
	 * @param out
	 *            zip输出流
	 * @param f
	 *            文件名
	 * @param base
	 *            文件目录路径
	 * @throws Exception
	 */
	private void zip(ZipOutputStream out, File f, String base) throws Exception {
		logger.debug("Zipping  " + f.getName());
		if (f.isDirectory()) {
			File[] fl = f.listFiles();
			out.putNextEntry(new ZipEntry(base
					+ FileConstants.FILE_DIR_SPLIT_DIAGONAL));
			base = base.length() == 0 ? "" : base
					+ FileConstants.FILE_DIR_SPLIT_DIAGONAL;
			for (int i = 0; i < fl.length; i++) {
				zip(out, fl[i], base + fl[i].getName());
			}
		} else {
			out.putNextEntry(new ZipEntry(base));
			FileInputStream in = new FileInputStream(f);
			int b;
			while ((b = in.read()) != -1)
				out.write(b);
			in.close();
		}
	}

	/**
	 * Export zipped comma-separated-values file
	 * 
	 * @param response
	 *            HttpServletResponse
	 * @param bytes
	 *            byte[] Bytes from csv formatted string
	 * @param encoding
	 *            String Encoding for http content type.
	 * @throws IOException
	 */
	private synchronized void doZippedExport(HttpServletResponse response,
			byte[] bytes, String encoding) throws IOException {
		// Set http response header
		response.reset();
		response.setContentType(FileConstants.ZIP_CONTENT_TYPE + " charset="
				+ encoding);
		response.setHeader("Content-disposition", "filename=" + fileName
				+ FileConstants.FILE_EXT_NAME_ZIP);

		// Zip and export.
		ZipOutputStream os = null;
		BufferedInputStream is = null;
		try {
			os = new ZipOutputStream(response.getOutputStream());
			os.putNextEntry(new ZipEntry(fileName));
			is = new BufferedInputStream(new ByteArrayInputStream(bytes));
			int b = 0;
			byte[] buf = new byte[bufferSize];
			while ((b = is.read(buf, 0, buf.length)) != -1) {
				os.write(buf, 0, b);
			}
			os.flush();
		} catch (IOException e) {
			logger.error("[doZippedExport] Exception ", e);
			throw e;
		} finally {
			closeStream(os, is);
		}
	}

	/**
	 * Close byte stream
	 * 
	 * @param os
	 *            OutputStream
	 * @param is
	 *            InputStream
	 * @throws IOException
	 */
	private void closeStream(OutputStream os, InputStream is) {
		try {
			if (os != null) {
				os.close();
				os = null;
			}
			if (is != null) {
				is.close();
				is = null;
			}
		} catch (IOException e) {
			logger.error("Exception while closing Stream", e);
			e.printStackTrace();
		}
	}

	/**
	 * 关闭输出流
	 * 
	 * @param os
	 */
	private void closeStream(OutputStream os) {
		try {
			if (os != null) {
				os.close();
				os = null;
			}
		} catch (IOException e) {
			logger.error("Exception while closing OutputStream", e);
			e.printStackTrace();
		}
	}

	// ------------------------------属性和setter和getter方法---------------------------------------------
	private String contentTypeName; // 向外提供的传入头类型名字 使用FileConstants中的类型
									// 例FileConstants.FILE_EXT_NAME_CSV
	private String encodeType = FileConstants.CHARACTER_ENCODING_UTF8; // enconding名字，默认为UTF8，若不指定
																		// 用默认
	private String fileName; // 文件名，不含后缀名
	private String contentType; // 导出文件的类型
	private static int bufferSize = 2048; // Stream buffer size
	private static Map<String, String> contentTypeMap = new HashMap<String, String>();

	// get set 方法
	public String getEncodeType() {
		return encodeType;
	}

	public void setEncodeType(String encodeType) {
		this.encodeType = encodeType;
	}

	public String getContentTypeName() {
		return contentTypeName;
	}

	public void setContentTypeName(String contentTypeName) {
		this.contentTypeName = contentTypeName;
		// 此处为映射
		this.contentType = (String) contentTypeMap.get(contentTypeName);
	}

	public String getContentType() {
		return contentType;
	}

	public void setContentType(String contentType) {
		this.contentType = contentType;
	}

	/**
	 * Set stream buffer size
	 * 
	 * @param bufferSize
	 *            int New stream buffer size
	 */
	public void setBufferSize(int bs) {
		bufferSize = bs;
	}

	public static int getBufferSize() {
		return bufferSize;
	}

	/**
	 * Set exported file name
	 * 
	 * @param fileName
	 *            The fileName to set.
	 */
	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFileName() {
		return fileName;
	}

}
