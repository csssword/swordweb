package com.css.sword.platform.web.fileupload;

public class UploadConstants {
	public static String FILE_PATH = "E:/uploads/"; // 上传目录
	public static String TEMP_FILE_PATH = "/temp/"; // 缓冲区目录

	public static int BUFFER_SIZE = 4096; // 缓冲区大小，默认为4K
	public static int FILE_MAX_SIZE = 2097152;// 文件最大上传大小2M
	public static final int UPLOAD_MAX_SIZE = 4194304;//一次上传请求的总大小限制4M

	public static String ENCODING = "UTF-8";// 默认文件编码为UTF-8
	
	/*
	 * 表示每一个上传文件的大小限制
	 */
	public static final String KEY_UPLOAD_FILE_MAX_SIZE = "swordFileMaxSize";
	
	/**
	 * 表示一次上传总大小限制
	 */
	public static final String KEY_UPLOAD_MAX_SIZE = "swordUploadMaxSize";
	
	/**
	 * 表示上传文件的编码,默认是utf-8
	 */
	public static final String KET_UPLOAD_FILE_ENCODING = "swordFileEncoding";
	
	/**
	 * 表示上传文件的缓存
	 */
	public static final String KET_UPLOAD_BUFFER_SIZE = "swordUploadBufferSize";
	
	/**
	 * 表示上传文件的临时存放目录,一般不做设置
	 */
	public static final String KET_UPLOAD_TEMP_FILE_PATH = "swordUploadFileTempPath";
}
