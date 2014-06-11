package com.css.sword.platform.comm.conf;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FilenameFilter;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Properties;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;
import java.util.concurrent.Callable;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.FutureTask;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.comm.pool.PoolManager;

/**
 * <p>
 * ConfManager.java
 * </p>
 * <p>
 * Description:
 * </p>
 * 
 * Company: 中国软件与技术服务股份有限公司 2009 Department: 应用产品研发中心 Project: 中软睿剑业务基础平台
 * 
 * @author 于英民
 * @version 4.0
 * @since 4.0 date: 2009-6-3下午04:52:13
 */
public class ConfManager {

	private static boolean flag = false;

	private final static ConcurrentHashMap<Locale, Future<ResourceBundle>> cache = new ConcurrentHashMap<Locale, Future<ResourceBundle>>();

	private final static LogWritter logger = LogFactory
			.getLogger(ConfManager.class);

	/**
	 * 加载配置文件
	 */
	public static void load() {
		if (!flag) {
			ConfParser traverse = new ConfParser();
			traverse.parser();
			flag = true;
		}

		// String runningmodel = (String) ConfManager
		// .getValueByKey("running-model");
		// Server.runningmodel = runningmodel;

		// ValidateLc vl = new ValidateLc();
		// String license = vl.checkLicense();
		// if (license != null) {
		// System.out.println(vl.getErrorMsg());
		// System.exit(-1);
		// }
	}

	/**
	 * <p>
	 * 根据locale的值，获得国际化信息中key对应的值
	 * </p>
	 * 该方法使用的两处并发说明： <li>使用ConcurrentHashMap中的putIfAbsent主要针对cache实例字段的同步问题
	 * 虽然cache实现使用ConcurrentHashMap，但没法保证Map的contains和put操作具有原子性。</li> <li>
	 * 因为国际化针对多个模块，需要读取多个属性文件，并合并属性文件，是比较费时的操作，所以使用
	 * {@link java.util.concurrent.Future}来阻塞获取特定locale对应的bundle，避免在并发中重复获取和
	 * 合并bundle。</li> </br> TODO:
	 * <p>
	 * 在合并bundle时，使用的是PropertyResourceBundle，并在OuputStream与InputStream之间进行了转换
	 * 但必须有足够的内存缓存所有数据,这样可处理数据的大小会受到限制
	 * </p>
	 * 
	 * @param locale
	 *            对应地区的locale
	 * @param key
	 *            国际化文件对应的key
	 * @return key对应的值
	 * 
	 * @author panye
	 * 
	 * @since 2010-5-12
	 */
	public static String getMessage(final Locale locale, final String key) {

		// final String bundleName = "swordMessage";

		Future<ResourceBundle> f = cache.get(locale);
		if (f == null) {
			Callable<ResourceBundle> eval = new Callable<ResourceBundle>() {

				public ResourceBundle call() throws Exception {
					ResourceBundle bundle = null;
					ClassLoader cl = Thread.currentThread()
							.getContextClassLoader();
					if (cl == null) {
						cl = ConfManager.class.getClassLoader();
					}
					URL url = cl.getResource("/");
					File f = new File(url.toURI());
					File[] list = f.listFiles(new FilenameFilter() {
						public boolean accept(File dir, String name) {
							if (name.endsWith("properties")
									&& name.contains("swordMessage"))
								return true;
							return false;
						}
					});
					List<String> l = new ArrayList<String>();
					for (File file : list) {
						int index = file.getName().indexOf("-");
						if (index != -1
								&& !l.contains(file.getName().substring(0,
										file.getName().indexOf("_"))))
							if (file.getName().indexOf("core") != -1)
								l.add(0,
										file.getName().substring(0,
												file.getName().indexOf("_")));
							else
								l.add(file.getName().substring(0,
										file.getName().indexOf("_")));
					}
					LinkedHashMap<ResourceBundle, String> bundles = new LinkedHashMap<ResourceBundle, String>();
					ResourceBundle finalBundle;
					for (String baseName : l) {

						bundle = ResourceBundle.getBundle(baseName, locale, cl);
						bundles.put(bundle, baseName);
					}
					Properties properties = new Properties();
					for (Entry<ResourceBundle, String> entry : bundles
							.entrySet()) {
						ResourceBundle bu = entry.getKey();
						Enumeration<String> keys = bu.getKeys();
						while (keys.hasMoreElements()) {
							String key = keys.nextElement();
							if (properties.containsKey(key)) {
								logger.debug("资源文件 " + entry.getValue()
										+ "与框架核心资源文件有相同key:" + key);
								continue;
							}
							properties.put(key, bu.getString(key));
						}
					}
					ByteArrayOutputStream out = new ByteArrayOutputStream();
					properties.store(out, "");
					InputStream in = new ByteArrayInputStream(out.toByteArray());
					finalBundle = new PropertyResourceBundle(in);
					return finalBundle;
				}
			};
			FutureTask<ResourceBundle> ft = new FutureTask<ResourceBundle>(eval);
			f = cache.putIfAbsent(locale, ft);
			if (f == null) {
				f = ft;
				ft.run();
			}
		}
		try {
			ResourceBundle bundle = f.get();
			return bundle.getString(key);

		} catch (InterruptedException e) {
			e.printStackTrace();
		} catch (ExecutionException e) {
			e.printStackTrace();
		}
		return null;
	}

	/**
	 * 根据关键字读取对应的配置信息<br>
	 * 这里采用类似于java类路径的方式来进行读取，比如要查找
	 * exception-->system-->databaseerror-->exp1对应的内容，
	 * 那么参数中可以传"exception.system.databaseerror.exp1",即可精确定位<br>
	 * 如果关键字无法匹配到正确的时，返回为null
	 * 
	 * @param key
	 *            String
	 * @return Object
	 */
	public static Object getValueByKey(String key) {
		// 这里要从对象池中取得相应的value
		return PoolManager.getInstance().borrowObject(key);
	}

	/**
	 * lfw:20050919 添加! 动态添加缓存信息!
	 * 
	 * @param key
	 *            关键词
	 * @param obj
	 *            数据对象
	 */
	public static void setValue(String key, Object obj) {
		if (PoolManager.getInstance().borrowObject(key) == null) {
			PoolManager.getInstance().addSingle(key, obj);
		} else {
			PoolManager.getInstance().refreshObject(key, obj);
		}
	}

	/**
	 * lfw:20050919 添加! 动态添加缓存信息!
	 * 
	 * @param map
	 *            待缓存的数据key-value集合
	 */
	public static void setValues(Map<String, Object> map) {
		PoolManager.getInstance().addSingles(map);
	}
}
