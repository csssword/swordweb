package com.css.ctp.web.delegate;

import java.io.File;
import java.util.Enumeration;
import java.util.Properties;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import com.css.ctp.gateway.jco.GatewayServerManager;
import com.css.ctp.gateway.rmi.proxy.ProxyManager;
import com.css.ctp.web.file.FileManager;
import com.css.sword.platform.comm.conf.ConfManager;
import com.css.sword.platform.comm.exception.CSSBaseCheckedException;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

/**
 * S5远程调用框架WEB加载器
 * 
 * @author 张久旭
 * 
 */
public class JDelegateWebtLoader extends HttpServlet {
	private static final long serialVersionUID = 8128049375666886960L;

	private static final LogWritter logger = LogFactory.getLogger(JDelegateWebtLoader.class);

	/**
	 * 网关服务框架初始化方法
	 */
	public void init() throws ServletException {
		// 加载系统配置文件
		ConfManager.load();

		Properties jdelegateConfig = (Properties) ConfManager.getValueByKey("JDelegate");
		Enumeration<?> parameterNames = jdelegateConfig.keys();
		String destinationPoolName = null;

		// 初始化JDeleaget连接池
		while (parameterNames.hasMoreElements()) {
			try {
				destinationPoolName = (String) parameterNames.nextElement();
				if (!destinationPoolName.endsWith("DestinationPool")) {
					continue;
				}

				String dir = FileManager.getDefaultResourcePath() + File.separatorChar
						+ jdelegateConfig.getProperty(destinationPoolName);

				// 设置JCO配置文件目录
				System.setProperty("jco.destinations.dir", dir);

				// 初始化连接池
				DestinationPoolManager.addDestination(dir, destinationPoolName);

				// 启动接出网关服务
				ProxyManager.start(dir);

				// 启动接入网关服务
				GatewayServerManager.start(dir);
//				try {
//		            ApplicationManager manager = new ApplicationManager();
//		            manager.startupSys();
//		            WorkflowServlet workflowServlet = new WorkflowServlet();
//		            //启动工作流引擎
//					workflowServlet.init(this.getServletConfig());
//		        } catch(Exception ex) {
//		        	 
//		            throw new ServletException(ex);
//		        }
			} catch (CSSBaseCheckedException ex) {
				logger.error("Init pool error........", ex);
			}
		}
	}
}
