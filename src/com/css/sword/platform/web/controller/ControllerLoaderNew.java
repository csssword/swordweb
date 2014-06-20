package com.css.sword.platform.web.controller;

import java.io.File;
import java.io.FileFilter;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.JarURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.Arrays;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;

import com.css.sword.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.kernel.utils.SwordFileUtils;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.web.controller.annotations.CTRL;

public class ControllerLoaderNew {

	private final static LogWritter logger = LogFactory.getLogger(ControllerLoaderNew.class);

	private static final String CTRL_CLASS_SUFFIX = "ctrl.class";

	public static Map<String, String> ctrlMap = null;

	private void controllerScan(ClassLoader loader) {
		List<String> classAndJar = getClassFolderAndJars();
		ctrlMap = new HashMap<String, String>();

		try {
			// 扫描目录中的class文件
			for (String floaderOrJar : classAndJar) {
				if (!floaderOrJar.endsWith(".jar")) {
					// 1. 首先扫描classes目录下的class文件
					scanFolders(floaderOrJar, loader);
				} else {
					// 2. 再扫描lib目录下的jar和zip文件
					scanJar(floaderOrJar, loader);
				}
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new RuntimeException(e.getMessage());
		}
	}

	/**
	 * @name 获取扫描类路径和Jar文件
	 * @Description 从classpath和应用服务的classes、lib中获取扫描信息
	 * @Time 创建时间:2011-8-25下午7:14:23
	 * @return
	 * @history 修订历史（历次修订内容、修订人、修订时间等）
	 */
	private static List<String> getClassFolderAndJars() {
		LinkedList<String> classAndJar = new LinkedList<String>(Arrays.asList(System.getProperty("java.class.path").split(";")));
		String appServerClassesDir = null;
		try {
			appServerClassesDir = SwordFileUtils.getSwordRootPath();
		} catch (SwordBaseCheckedException ex) {
			logger.error("获取sword.xml文件所在目录失败", ex);
		}
		String appServerLibDir = appServerClassesDir.substring(0, appServerClassesDir.lastIndexOf(File.separatorChar) + 1) + "lib";

		boolean find = false;
		File f = null;

		// 增加Sword.xml文件所在目录
		for (int i = classAndJar.size() - 1; i >= 0; i--) {
			if (new File(classAndJar.get(i)).getAbsolutePath().equals(new File(appServerClassesDir).getAbsolutePath())) {
				find = true;
				break;
			}

			// 清除掉Eclipse在进行Junit测试时自动加上的路径
			if (!classAndJar.get(i).endsWith(".jar") && classAndJar.get(i).contains("org.eclipse")) {
				classAndJar.remove(i);
			}
		}
		if (!find) {
			f = new File(appServerClassesDir);
			if (f.exists() && f.isDirectory()) {
				classAndJar.addFirst(appServerClassesDir);
			}
		}

		// 增加应用服务器的lib目录中的jar文件
		f = new File(appServerLibDir);
		if (f.exists() && f.isDirectory()) {
			for (File jarFile : f.listFiles(new FileFilter() {
				public boolean accept(File pathname) {
					if (pathname.getName().endsWith(".jar")) {
						return true;
					} else {
						return false;
					}
				}
			})) {
				find = false;
				for (int i = classAndJar.size() - 1; i >= 0; i--) {
					if (classAndJar.get(i).endsWith(jarFile.getName())) {
						find = true;
						break;
					}
				}
				if (!find) {
					classAndJar.add(jarFile.getAbsolutePath());
				}
			}
		}

		return classAndJar;
	}

	/**
	 * @name 中文名称
	 * @Description 相关说明
	 * @Time 创建时间:2011-8-25下午4:34:02
	 * @param appPath
	 * @param loader
	 * @return
	 * @throws UnsupportedEncodingException
	 * @throws Exception
	 * @throws IOException
	 * @history 修订历史（历次修订内容、修订人、修订时间等）
	 */
	private void scanFolders(String appPath, ClassLoader loader) throws UnsupportedEncodingException, Exception, IOException {
		appPath = java.net.URLDecoder.decode(appPath, "UTF-8");// 解决路径中含空格、中文问题
		File classDir = new File(appPath);
		File[] classDirFiles = classDir.listFiles();
		if (classDirFiles == null) {
			if (appPath.startsWith("/")) {
				appPath = appPath.substring(1);
				classDir = new File(appPath);
				classDirFiles = classDir.listFiles();
			}
		}
		if (classDirFiles != null) {
			for (File file : classDirFiles) {
				if (file.isDirectory()) {
					scanClassInDirectory(file, appPath, loader);
				} else if (file.getCanonicalPath().toLowerCase().endsWith(CTRL_CLASS_SUFFIX)) {
					addDomainInfoFromAnnotation(file, appPath, loader);
				}
			}
		}
	}

	private void scanJar(String jarF, ClassLoader loader) throws Exception {
		File jar = new File(jarF);

		// 过滤掉sword.xml配置之外的jar文件
		if (!jar.getName().startsWith("sword")) {
			return;
		}

		// if (jar.getName().toLowerCase().endsWith("-ctrl.jar")// 目前扫描的内容只包含blh结尾的jar后面可以定义规范
		// || jar.getName().toLowerCase().endsWith("-ctrl.zip")
		// || jar.getName().toLowerCase().endsWith("-blh.jar")) {// 添加blh类说明 只有一个blh的jar包
		URL jarURL = new URL("jar:file:" + jar.getCanonicalPath().replace('\\', '/') + "!/");
		URLConnection con = jarURL.openConnection();
		JarFile jarFile = null;
		if (con instanceof JarURLConnection) {
			JarURLConnection jarCon = (JarURLConnection) con;
			jarCon.setUseCaches(false);
			jarFile = jarCon.getJarFile();
			for (Enumeration<JarEntry> entries = jarFile.entries(); entries.hasMoreElements();) {
				JarEntry entry = (JarEntry) entries.nextElement();
				String entryPath = entry.getName();
				if (entryPath.toLowerCase().endsWith(CTRL_CLASS_SUFFIX) && entryPath.indexOf("$") == -1) {
					String className = entryPath.substring(0, entryPath.lastIndexOf('.')).replace('/', '.');
					addDomainInfoFromJar(className, loader);
				}
			}
		}//
	}

	private void scanClassInDirectory(File subDir, String appPath, ClassLoader loader) throws Exception {
		File[] files = subDir.listFiles();
		if (files != null) {
			for (File file : files) {
				if (file.isDirectory()) {
					scanClassInDirectory(file, appPath, loader);
				} else if (file.getCanonicalPath().toLowerCase().endsWith(CTRL_CLASS_SUFFIX)) {
					addDomainInfoFromAnnotation(file, appPath, loader);
				}
			}
		}
	}

	private void addDomainInfoFromAnnotation(File classFile, String appPath, ClassLoader loader) throws Exception {
		String fullPath = classFile.getCanonicalPath().replace('\\', '/');
		// 兼容linux系统下文件名带有/的情况
		if (fullPath.charAt(0) != appPath.charAt(0) && appPath.startsWith("/")) {
			// 2010 4 29 wjl修改，为了兼容不同服务器的appPath路径
			appPath = appPath.substring(1).replace("./", "");
		}
		String className = fullPath.substring((appPath).length() + (appPath.endsWith("/") ? 0 : 1), fullPath.lastIndexOf('.')).replace('/',
				'.');
		Class<?> clz = loader.loadClass(className);
		// 首先判断该类是否为Ctrl
		if (clz.isAnnotationPresent(CTRL.class) && BaseDomainCtrl.class.isAssignableFrom(clz)) {
			CTRL ctrl = clz.getAnnotation(CTRL.class);
			String name = ctrl.value();
			ctrlMap.put(name, clz.getName());
			logger.debug("扫描到CTRL=[" + clz.getName() + "]");
		}
	}

	private void addDomainInfoFromJar(String className, ClassLoader loader) throws Exception {
		Class<?> clz = loader.loadClass(className);
		// 首先判断该类是否为CTRL
		if (clz.isAnnotationPresent(CTRL.class) && BaseDomainCtrl.class.isAssignableFrom(clz)) {
			CTRL ctrl = clz.getAnnotation(CTRL.class);
			String name = ctrl.value();
			ctrlMap.put(name, clz.getName());
			logger.debug("扫描到CTRL=[" + clz.getName() + "]");
		}
	}

	public Map<String, String> ctrlMap() {
		if (ctrlMap == null) {
			logger.debug("==========开始扫描Ctrl==========");
			logger.debug("++++++++++++++++++++++++++++" + this.getClass().getClassLoader());
			controllerScan(this.getClass().getClassLoader());
			logger.debug("==========扫描ctrl结束==========");
		}
		return ctrlMap;
	}

}
