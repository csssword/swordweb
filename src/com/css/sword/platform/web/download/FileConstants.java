package com.css.sword.platform.web.download;

/**
 * <p>Title: </p>
 * <p>Description: </p>
 * <p>Copyright: 中国软件与技术服务股份有限公司 Copyright (c) 2006</p>
 * <p>Company: 中国软件与技术服务股份有限公司</p>
 *
 * @author 曹楠
 * @version 1.0
 */
public class FileConstants {
    	//文件扩展名
	public static final String FILE_EXT_NAME_TXT = ".txt";
	public static final String FILE_EXT_NAME_XML = ".xml";
	public static final String FILE_EXT_NAME_CSV = ".csv";
	public static final String FILE_EXT_NAME_ZIP = ".zip";
	public static final String FILE_EXT_NAME_DAT = ".dat";

	public static final String FILE_EXT_NAME_XLS = ".xls";
	public static final String FILE_EXT_NAME_DOC = ".doc";
	public static final String FILE_EXT_NAME_RAR = ".rar";

    //文件头类型
	public static final String CSV_CONTENT_TYPE = "text/comma-separated-values;";
	public static final String ZIP_CONTENT_TYPE = "application/x-zip-compressed;";
	public static final String XML_CONTENT_TYPE = "text/xml;";
	public static final String TXT_CONTENT_TYPE = "text/plain;";
	public static final String HTML_CONTENT_TYPE = "text/html;";
	public static final String DAT_CONTENT_TYPE = "application/octet-stream;";
	public static final String XLS_CONTENT_TYPE = "application/vnd.ms-excel;";

	//常用字符集
	public static final String CHARACTER_ENCODING_UTF8 = "UTF-8";
	public static final String CHARACTER_ENCODING_GBK = "GBK";
	public static final String CHARACTER_ENCODING_GB2312 = "GB2312";
	public static final String CHARACTER_ENCODING_ISO = "ISO-8859-1";

	public static final int FILE_MAX_SIZE = 102400; //最大上传文件为100M
	public static final String PROP_JAVA_IO_TMP = "java.io.tmpdir"; //java临时文件目录
	public static final String TEMP_FILE_START_STR = "ctais_app_temp_file"; //临时文件开头字符串

	//文本文件分割符
	public static final String TEXT_FILE_SPLIT_VERTICAL = "|"; //竖线
	public static final String TEXT_FILE_SPLIT_COMMA = ","; //逗号
	public static final String TEXT_FILE_SPLIT_BLANK = " "; //空格
	public static final String TEXT_FILE_SPLIT_UNDEE_ONE = "~"; //单波浪线
	public static final String TEXT_FILE_SPLIT_UNDEE = "~~"; //双波浪线
	public static final char TEXT_FILE_SPLIT_VERTICAL_CHAR = '|'; //竖线
	public static final char TEXT_FILE_SPLIT_COMMA_CHAR = ','; //逗号
	public static final char TEXT_FILE_SPLIT_BLANK_CHAR = ' '; //空格
	public static final char TEXT_FILE_SPLIT_UNDEE_CHAR = '~'; //单波浪线


	//文件目录分割符号
	public static final char FILE_DIR_SPLIT_BACKLASH = '\\'; //反斜扛，windows格式
	public static final char FILE_DIR_SPLIT_DIAGONAL = '/'; //斜扛，unix格式
	public static final String FILE_DIR_SPLIT_BACKLASH_STR = "\\"; //反斜扛，windows格式
	public static final String FILE_DIR_SPLIT_DIAGONAL_STR = "/"; //斜扛，unix格式

	//默认资源文件
	public static final String DEFAULT_RESOURCE_LOG4J_FILE = "/log4j.properties";

	//文件传输网络协议:http、ftp、nntp
	public static final String JAVA_NET_PROTOCOL_HTTP = "http";
	public static final String JAVA_NET_PROTOCOL_FTP = "ftp";
	public static final String JAVA_NET_PROTOCOL_NNTP = "nntp";

}
