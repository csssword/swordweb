package com.css.ctp.web.file;


/**
 * Title: 系统组件 文件管理器 Description: 中国税务税收征管信息系统 Copyright: Copyright (c) 2006
 * Company: 中国软件与技术服务股份有限公司
 * 
 * @author 康水明
 * @version 1.0
 */
public class FileManager {

	/**
	 * 默认构造器
	 */
	public FileManager() {
	}

	/**
	 * 获取上传文件的目录
	 * 
	 * @param filePath
	 *            文件全路径
	 * @return String
	 */
	public static String getDirectory(String filePath) {
		String dir = FileConstants.FILE_DIR_SPLIT_DIAGONAL_STR;
		if (filePath != null) {
			filePath = replaceAll(filePath, FileConstants.FILE_DIR_SPLIT_BACKLASH,
					FileConstants.FILE_DIR_SPLIT_DIAGONAL);
			int len = filePath.lastIndexOf(FileConstants.FILE_DIR_SPLIT_DIAGONAL_STR);
			if (len > 0) {
				dir = filePath.substring(0, len + 1);
			}
		}
		return dir;
	}

	/**
	 * replaceAll 字符替换函数,支持"\\","/"替换 <br>
	 * 比如 String a = "c:\\test\\"; replace(a,"\\","/") 将返回 c:/test/
	 * 
	 * @param str
	 *            需要替换的原始字符串
	 * @param pattern
	 *            需要被替换掉的字符串
	 * @param replace
	 *            希望被替换成的字符串
	 * @return 返回替换后的字符串
	 */
	public static String replaceAll(String str, char pattern, char replace) {
		if (str != null && pattern != replace) {
			while (str.lastIndexOf(pattern) > 0) {
				str = str.replace(pattern, replace);
			}
		}
		return str; // 替换后的结果
	}

	/**
	 * replaceAll 字符替换函数,支持"(",")"替换 <br>
	 * 比如 String a = "cc(dd)aa"; replace(a,"(dd)","xx") 将返回 ccxxaa
	 * 
	 * @param str
	 *            需要替换的原始字符串
	 * @param pattern
	 *            需要被替换掉的字符串
	 * @param replace
	 *            希望被替换成的字符串
	 * @return 返回替换后的字符串
	 */
	public static String replaceAll(String str, String pattern, String replace) {
		String lbracket = "("; // 左括号
		String rbracket = ")"; // 右括号
		String escStr = FileConstants.FILE_DIR_SPLIT_BACKLASH_STR; // 转义字符串
		String result = null; // 返回结果,初始化
		if (str != null && pattern != null && !pattern.equals(replace)) {
			// 格式化pattern,如果有"(",")",转换为"\\(","\\)"
			String pattern_fmt = parsePattern(pattern, lbracket, rbracket, escStr);
			// 全部替换
			result = str.replaceAll(pattern_fmt, replace);
		}
		return result; // 替换后的结果
	}

	/**
	 * parsePattern 解析需要被替换掉的字符串
	 * 
	 * @param pattern
	 *            需要被替换掉的字符串
	 * @param lbracket
	 *            左括号
	 * @param rbracket
	 *            右括号
	 * @param escStr
	 *            转义字符串
	 * @return 解析后的需要被替换掉的字符串
	 */
	private static String parsePattern(String pattern, String lbracket, String rbracket, String escStr) {

		// 如果需要被替换掉的字符串为null,//返回空字符串
		if (pattern == null) {
			return "";
		}

		int size = 0; // 进行字符串匹配的起始位置
		int index = 0; // 字符串匹配位置
		StringBuffer sbStr = null;
		// 格式化pattern,如果有"(",")",转换为"\\(","\\)"
		if (pattern.indexOf(lbracket) >= 0 || pattern.indexOf(rbracket) >= 0) {
			sbStr = new StringBuffer();
			while ((index = pattern.indexOf(lbracket, size)) >= 0 || (index = pattern.indexOf(rbracket, size)) >= 0) {
				sbStr.append(pattern.substring(size, index));
				sbStr.append(escStr);
				sbStr.append(pattern.substring(index, index + 1));
				size = index + escStr.length();
			}
		} else {
			sbStr = new StringBuffer(pattern);
		}
		return sbStr.toString();
	}

	/**
	 * getDefaultResourcePath 获取默认资源路径，不包含文件名
	 * 
	 * @return 默认资源路径,不包含文件名
	 */
	public static String getDefaultResourcePath() {
		return getResourcePath(FileConstants.DEFAULT_RESOURCE_LOG4J_FILE);
	}

	/**
	 * getResourcePath 获取资源路径,不包含文件名
	 * 
	 * @param resource
	 *            资源文件相对路径，该资源文件必须在classes目录下
	 * @return 资源路径,不包含文件名
	 */
	public static String getResourcePath(String resource) {
		return replaceAll(FileManager.class.getResource(resource).getPath(), resource, "");
	}
}
