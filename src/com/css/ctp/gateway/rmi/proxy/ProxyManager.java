package com.css.ctp.gateway.rmi.proxy;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.lang.reflect.Constructor;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Properties;

import com.css.ctp.web.delegate.JDelegate;
import com.css.sword.platform.comm.conf.ConfManager;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

/**
 * Proxy管理器
 * 
 * @author 史文帅
 */
public class ProxyManager {
	private final static LogWritter logger = LogFactory.getLogger(ProxyManager.class);

	private Map<String, BaseGatewayProxy> proxyCache = null;

	private static ProxyManager manager = new ProxyManager();

	private ProxyManager() {
	}

	public static ProxyManager getInstance() {
		return manager;
	}

	/**
	 * 启动接出网关服务器　
	 */
	public static void start(String dir) {
		manager.loadConfigFile(dir);
	}

	/**
	 * 业务逻辑加载类
	 * 
	 * @return
	 * @throws Exception
	 */
	private void loadConfigFile(String configFileDir) {
		logger.debug("开始初始化接出协议网关服务器");

		Properties gatewayServerConfig = (Properties) ConfManager.getValueByKey("JDelegate");
		if (gatewayServerConfig.getProperty("proxy-server") == null) {
			logger.debug("没有找到接出协议网关服务器的配置信息，停止加载！");
			return;
		}

		File proxyConfFile = new File(configFileDir + File.separatorChar
				+ gatewayServerConfig.getProperty("proxy-server"));

		// 如果没有配置文件则停止加载过程
		if (!proxyConfFile.exists()) {
			logger.error("没有找到接出协议网关服务器的配置文件" + proxyConfFile.getName() + " ，停止加载！", new FileNotFoundException(
					proxyConfFile.getName()));
			return;
		}

		Properties proxyConfig = new Properties();
		FileInputStream file;
		try {
			file = new FileInputStream(proxyConfFile);
			proxyConfig.load(file);
			file.close();
		} catch (Exception ex) {
			logger.error("加载s5gateway.proxy配置文件失败！" + ex);
			return;
		}

		Iterator<Object> config = proxyConfig.keySet().iterator();
		proxyCache = new HashMap<String, BaseGatewayProxy>();

		while (config.hasNext()) {
			String tid = config.next().toString();
			String[] info = proxyConfig.getProperty(tid).split("@");
			JDelegate delegate = null;

			if (info.length == 1) {
				delegate = new JDelegate();
			} else {
				delegate = new JDelegate(info[1]);
			}

			try {
				Class<?> c = Class.forName(info[0]);
				Constructor<?> con = c.getConstructor(JDelegate.class);
				BaseGatewayProxy proxy = (BaseGatewayProxy) con.newInstance(new Object[] { delegate });
				proxyCache.put(tid, proxy);
			} catch (Exception ex) {
				logger.error("无法实例化" + info[0], ex);
			}
		}

		logger.debug("接出协议网关服务器已启动");
	}

	/**
	 * 获取缓存的代理类实例
	 * 
	 * @param key
	 * @return
	 */
	public BaseGatewayProxy getProxy(String key) {
		return proxyCache.get(key);
	}
}
