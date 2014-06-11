package com.css.ctp.web.delegate;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import com.css.sword.kernel.platform.SwordPlatformManager;

/**
 * S5远程调用框架WEB加载器
 * 
 * @author 张久旭
 * 
 */
public class SwordPlatformWebtLoader extends HttpServlet {
	private static final long serialVersionUID = 8128049375666886960L;

	// private static final LogWritter logger = LogFactory.getLogger(SwordPlatformWebtLoader.class);

	/**
	 * 网关服务框架初始化方法
	 */
	public void init() throws ServletException {
		super.init();

		if (!"".equals(this.getServletContext().getContextPath().trim()) && !"/".equals(this.getServletContext().getContextPath())) {
			System.setProperty("sword.server.name", this.getServletContext().getContextPath().substring(1));
		}
		//
		// if ("true".equalsIgnoreCase(this.getInitParameter("startEJB"))) {
		// // 配置了EJB初始化，则需要向EJB容器发送指令以启动EJB初始化平台
		// try {
		// logger.info("开始调用服务，启动远程的应用服务器");
		// DefaultMediationRequest req = new DefaultMediationRequest();
		// req.setServiceName("SwordInitEJB4PlatformStart");
		// new MessageSender().send(req);
		// } catch (SwordBaseCheckedException e) {
		// logger.error(e.getMessage(), e);
		// throw new ServletException(e.getMessage(), e);
		// }
		// }

		// 启动WEB服务器上部属的平台
		SwordPlatformManager.startPlatform();
	}
}
