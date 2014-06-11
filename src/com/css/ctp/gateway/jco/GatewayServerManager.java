package com.css.ctp.gateway.jco;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FilenameFilter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

import com.css.sword.platform.comm.conf.ConfManager;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.sap.conn.jco.server.DefaultServerHandlerFactory;
import com.sap.conn.jco.server.JCoServer;
import com.sap.conn.jco.server.JCoServerFactory;

/**
 * S5协议网关服务器
 * 
 * @author 史文帅
 * 
 */
public class GatewayServerManager {
	private final static LogWritter logger = LogFactory.getLogger(GatewayServerManager.class);

	public static void start(String configFileDir) {
		Properties gatewayServerConfig = (Properties) ConfManager.getValueByKey("JDelegate");
		if (gatewayServerConfig.getProperty("access-adapter") == null) {
			logger.debug("没有找到接入协议网关服务器的配置信息，停止加载！");
			return;
		}

		File handleConfigFile = new File(configFileDir + File.separatorChar
				+ gatewayServerConfig.getProperty("access-adapter"));

		// 如果没有配置文件则停止加载过程
		if (!handleConfigFile.exists()) {
			logger.error("没有找到接入协议网关服务器的配置文件" + handleConfigFile.getName() + " ，停止加载！", new FileNotFoundException(
					handleConfigFile.getName()));
			return;
		}

		new JcoServer(configFileDir, handleConfigFile).start();
	}
}

class JcoServer {
	private static final LogWritter logger = LogFactory.getLogger(JcoServer.class);

	private JCoServer server = null;
	private String configFileDir = null;
	private File handleConfigFile = null;

	public JcoServer(String configFileDir, File handleConfigFile) {
		this.configFileDir = configFileDir;
		this.handleConfigFile = handleConfigFile;
	}

	public void start() {
		File[] configFiles = new File(this.configFileDir).listFiles(new FilenameFilter() {
			public boolean accept(File dir, String name) {
				return name.endsWith(".jcoServer");
			}
		});

		for (File file : configFiles) {
			String f = file.getName();
			f = f.substring(0, f.length() - 10);
			logger.debug("开始初始化接入协议网关服务器:" + f);

			try {
				GatewayServerThrowableListener thorwableListener = new GatewayServerThrowableListener();
				server = JCoServerFactory.getServer(f);
				server.addServerErrorListener(thorwableListener);
				server.addServerExceptionListener(thorwableListener);
				server.addServerStateChangedListener(new GatewayServerStateListener());
				server.setCallHandlerFactory(getHandlerFactory(loadConfigFile()));
				server.start();
				logger.debug("接入协议网关服务器已经启动......");
			} catch (Exception ex) {
				logger.debug("接入协议网关服务器启动失败", ex);
			}

		}
	}

	/**
	 * 协议网关服务器配置文件加载方法
	 * 
	 * @return
	 * @throws Exception
	 */
	private Properties loadConfigFile() throws Exception {
		Properties adapterConfig = new Properties();
		FileInputStream file = new FileInputStream(handleConfigFile);
		adapterConfig.load(file);
		file.close();

		return adapterConfig;
	}

	/**
	 * 根据配置信息生成适配器工厂
	 * 
	 * @param adapterConfig
	 * @return
	 */
	private DefaultServerHandlerFactory.FunctionHandlerFactory getHandlerFactory(Properties adapterConfig) {
		DefaultServerHandlerFactory.FunctionHandlerFactory factory = new DefaultServerHandlerFactory.FunctionHandlerFactory();
		Iterator<Object> config = adapterConfig.keySet().iterator();
		List<Exception> error = new ArrayList<Exception>();
		while (config.hasNext()) {
			String key = config.next().toString();
			try {
				AbsProtocolAdapter obj = (AbsProtocolAdapter) Class.forName(adapterConfig.getProperty(key))
						.newInstance();
				factory.registerHandler(key, obj);
			} catch (Exception ex) {
				error.add(ex);
			}
		}

		if (!error.isEmpty()) {
			for (Exception ex : error) {
				logger.error("注册协议转换适配器失败 ", ex);
			}
			return null;
		}
		return factory;
	}

}