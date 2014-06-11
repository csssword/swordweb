package com.css.ctp.web.comm;

import java.io.File;

import org.apache.catalina.startup.Tomcat;

import com.css.sword.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.kernel.platform.SwordPlatformManager;
import com.css.sword.kernel.utils.SwordFileUtils;

/**
 * Tomcat加载器
 * 
 * @author 张久旭
 * 
 */
public class DeveloperServer {
	private String javaLibraryPath = System.getProperty("java.library.path");
	private String baseDir = System.getProperty("user.dir") + File.separatorChar + "hxzg" + File.separatorChar + "webapp";
	private String contextPath = "/";
	private String port = "8080";
	private String urlEncoding = "UTF-8";
	private String welcomeUrl;
	private String welcomePage;

	private static Tomcat server;

	/**
	 * 初始化环境变量
	 * 
	 * @throws SwordBaseCheckedException
	 */
	private void init() throws SwordBaseCheckedException {
		if (System.getProperty("base.dir") != null) {
			this.baseDir = System.getProperty("base.dir");
		}

		if (System.getProperty("context.path") != null) {
			this.contextPath = System.getProperty("context.path");
		}

		if (System.getProperty("port") != null) {
			this.port = System.getProperty("port");
		}

		if (System.getProperty("url.encoding") != null) {
			this.urlEncoding = System.getProperty("url.encoding");
		}

		this.javaLibraryPath = SwordFileUtils.getSwordRootPath() + ";" + System.getProperty("user.dir") + File.separatorChar + "lib"
				+ File.separatorChar + "tomcatlib;" + this.javaLibraryPath;
		System.setProperty("java.library.path", this.javaLibraryPath);

		this.welcomeUrl = "http://127.0.0.1:" + this.port + "/login.jsp";
		if (System.getProperty("welcome.url") != null) {
			this.welcomeUrl = "http://127.0.0.1:" + this.port + System.getProperty("welcome.url");
		}

		welcomePage = "login.jsp";
		if (System.getProperty("welcome.page") != null) {
			this.welcomePage = System.getProperty("welcome.page");
		}

	}

	/**
	 * 服务器启动方法
	 * 
	 * @param keepRun
	 * @throws Exception
	 */
	synchronized public void start(boolean keepRun) throws Exception {
		if (server != null) {
			return;
		}

		init();

		System.out.println("开始启动本地开发服务器......");

		server = new Tomcat();
		server.setBaseDir(System.getProperty("user.dir"));
		server.setPort(Integer.parseInt(this.port));
		server.getConnector().setURIEncoding(urlEncoding);
		server.getConnector().setAsyncTimeout(1800 * 1000);
		server.getConnector().setAllowTrace(true);
		server.addWebapp(this.contextPath, this.baseDir).addWelcomeFile(welcomePage);

		server.start();

		System.out.println("本地开发服务器已启动......");
		System.out.println("默认WEB域：" + this.baseDir);
		System.out.println("登陆页面：" + welcomeUrl);

		if (keepRun) {
			Runtime.getRuntime().exec("rundll32 url.dll,FileProtocolHandler " + welcomeUrl);
			server.getServer().await();
		}
	}

	public void stop() throws Exception {
		server.stop();
	}

	public static void main(String[] args) throws Exception {
		if (args.length == 1) {
			if ("-h".equals(args[0]) || "-help".equals(args[0])) {
				System.out.println("支持的VM参数如下:");
				System.out.println("-Djava.library.path=动态链接库目录");
				System.out.println("-Dbase.dir=Web域目录");
				System.out.println("-Dcontext.path=根目录");
				System.out.println("-Dport=端口号");
				System.out.println("-Durl.encoding=URL编码");
				System.out.println("-Dwelcome.url=服务器启动后自动打开的链接地址");
				System.out.println("-Dwelcome.page=默认页面");

				return;
			}
		}

		SwordPlatformManager.startPlatform();
		new DeveloperServer().start(true);
	}
}