package com.css.sword.platform.web.controller;

import java.io.File;
import java.net.JarURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.web.controller.annotations.CTRL;

/**
 * Controller Loader类 <br>
 * Information: <Br>
 * 用于加载controller
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.controller<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> ReflectHelper.java<br>
 * Generate : 2009-11-23<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author YuanTong,wjl <br>
 * @since Sword 4.0.0<br>
 */
public class ControllerLoader {
	private final static LogWritter logger = LogFactory.getLogger(ControllerLoader.class);

	private static final String CTRL_CLASS_SUFFIX = "ctrl.class";

	public static Map<String, String> ctrlMap = null;

	private void controllerScan(String appPath, ClassLoader loader) {
		ctrlMap = new HashMap<String, String>();

		try {
			// 1. 首先扫描classes目录下的class文件
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

			// 2. 再扫描lib目录下的jar和zip文件
			String libPath = appPath;
			if (appPath.endsWith("/classes/")) {
				libPath = appPath.substring(0, appPath.lastIndexOf("classes/"));
			}
			File jarDir = new File(libPath + "lib");
			File[] jarDirFiles = jarDir.listFiles();
			// if (Server.runningmodel.equalsIgnoreCase("develop"))
			// jarDirFiles = null;// 开发时,去掉对lib目录下的扫描
			if (jarDirFiles != null) {
				for (File jar : jarDirFiles) {
					if (jar.getName().toLowerCase().endsWith("-ctrl.jar")// 目前扫描的内容只包含blh结尾的jar后面可以定义规范
							|| jar.getName().toLowerCase().endsWith("-ctrl.zip")
							|| jar.getName().toLowerCase().endsWith("-blh.jar")) {// 添加blh类说明 只有一个blh的jar包
						URL jarURL = new URL("jar:file:" + jar.getCanonicalPath().replace('\\', '/') + "!/");
						URLConnection con = jarURL.openConnection();
						JarFile jarFile = null;
						@SuppressWarnings("unused")
						String jarFileUrl = null;
						if (con instanceof JarURLConnection) {
							JarURLConnection jarCon = (JarURLConnection) con;
							jarCon.setUseCaches(false);
							jarFile = jarCon.getJarFile();
							jarFileUrl = jarCon.getJarFileURL().toExternalForm();
							for (Enumeration<JarEntry> entries = jarFile.entries(); entries.hasMoreElements();) {
								JarEntry entry = (JarEntry) entries.nextElement();
								String entryPath = entry.getName();
								if (entryPath.toLowerCase().endsWith(CTRL_CLASS_SUFFIX) && entryPath.indexOf("$") == -1) {
									String className = entryPath.substring(0, entryPath.lastIndexOf('.')).replace('/',
											'.');
									addDomainInfoFromJar(className, loader);
								}
							}
						}
					}
				}
			}
		} catch (Exception e) {
			logger.error(e.getMessage(), e);
			throw new RuntimeException(e.getMessage());
		}
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
		if (fullPath.charAt(0) != appPath.charAt(0) && appPath.startsWith("/"))
			// 2010 4 29 wjl修改，为了兼容不同服务器的appPath路径
			appPath = appPath.substring(1).replace("./", "");
		String className = fullPath.substring((appPath).length(), fullPath.lastIndexOf('.')).replace('/', '.');
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
			String appPath = this.getClass().getClassLoader().getResource("sword.xml").getPath();
			appPath = appPath.replaceFirst("/sword.xml", "") + "/";
			logger.debug("+++++++++Class Path+++++++++");
			logger.debug(appPath);
			logger.debug("++++++++++++++++++++++++++++");
			controllerScan(appPath, this.getClass().getClassLoader());
			logger.debug("==========扫描ctrl结束==========");
		}
		return ctrlMap;
	}
}
