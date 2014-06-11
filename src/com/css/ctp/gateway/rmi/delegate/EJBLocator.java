package com.css.ctp.gateway.rmi.delegate;

import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.StringTokenizer;

import javax.ejb.EJBHome;
import javax.naming.Context;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.rmi.PortableRemoteObject;

import com.css.sword.platform.comm.conf.ConfManager;

/**
 * 
 * <p>
 * Title:EJBLocator
 * </p>
 * <p>
 * Description: SWORD 企业应用基础平台
 * </p>
 * <p>
 * Copyright: Copyright (c) 2007 中国软件与技术服务股份有限公司
 * </p>
 * <p>
 * Company: CS&S
 * </p>
 * 
 * @author 刘福伟 dengjl
 * @version 1.0 Created on 2009-3-16 下午12:34:04
 * 
 */
public class EJBLocator {
	private Map<String, GateWayFacadeHome> home = new HashMap<String, GateWayFacadeHome>();

	private static EJBLocator ejbLocator = new EJBLocator();

	private EJBLocator() {
	}

	/**
	 * 返回ejbLocator属性。
	 * 
	 * @return
	 */
	public static EJBLocator singleton() {
		return ejbLocator;
	}

	public GateWayFacade getDomainFacade(String key) throws Exception {
		Object obj = null;
		if (home.containsKey(key)) {
			GateWayFacadeHome ejbHome = (GateWayFacadeHome) home.get(key); // 如果缓存中有此对象，则返回此对象
			try {
				obj = ejbHome.create();
			} catch (Exception ex) { // 当缓存中的实例过期时，重新生成缓存。
				clear(key);
				try {
					GateWayFacadeHome ejbHomeBak = (GateWayFacadeHome) lookup(key);
					obj = ejbHome.create();
					home.put(key, ejbHomeBak);
				} catch (Exception ex1) { // 封装异常
					throw ex1;
				}
			}
		} else { // 缓存中无此实例，重新查找得到
			GateWayFacadeHome ejbHome = null;
			try {
				ejbHome = (GateWayFacadeHome) lookup(key);
				obj = ejbHome.create();
				home.put(key, ejbHome);
			} catch (Exception ex2) { // 封装异常
				throw ex2;
			}
		}

		return (GateWayFacade) obj;
	}

	private Object lookup(String name) throws Exception {

		Map<?, ?> map = (Map<?, ?>) ConfManager.getValueByKey("ejb");

		Properties props = (Properties) map.get(name);

		Properties env = new Properties();

		String jndi_factory = props.getProperty("factory");
		env.setProperty(Context.INITIAL_CONTEXT_FACTORY, jndi_factory);

		if (props.getProperty("url") != null) {
			String jndi_url = props.getProperty("url");
			String[] urlsplits = new String[3];
			int i = 0;
			StringTokenizer st = new StringTokenizer(jndi_url, ":/");
			while (st.hasMoreTokens()) {
				urlsplits[i++] = st.nextToken();
			}
			if (jndi_factory.indexOf("com.tongweb") > -1) {
				env.setProperty("java.naming.factory.url.pkgs", "com.tongweb.naming");
				env.setProperty("java.naming.factory.state",
						"com.sun.corba.ee.impl.presentation.rmi.JNDIStateFactoryImpl");
				env.setProperty("org.omg.CORBA.ORBInitialHost", urlsplits[1].trim());
				env.setProperty("org.omg.CORBA.ORBInitialPort", urlsplits[2].trim());
			} else {
				env.setProperty(Context.PROVIDER_URL, jndi_url);
			}
		}

		Context ctx = new InitialContext(env);
		Object obj = ctx.lookup(name);
		EJBHome home = (EJBHome) PortableRemoteObject.narrow(obj, EJBHome.class);
		closeContext(ctx);

		return home;
	}

	/**
	 * 实现方法。用来关闭Context类的实例。
	 * 
	 * @param context
	 *            :Context 被关闭的Context类的实例
	 * @throws NamingException
	 */
	private void closeContext(Context context) throws NamingException {
		if (context != null) {
			context.close();
		}
	}

	/**
	 * 清空home属性中的所用缓存实例。然后调用LogWritter的静态方<br>
	 * 法sysInfo,在日志中记录缓存已经清空的信息。
	 */
	private void clear(String key) {
		if (home.containsKey(key)) {
			home.remove(key);
		}
	}

}