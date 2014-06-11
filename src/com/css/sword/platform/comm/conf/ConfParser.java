package com.css.sword.platform.comm.conf;

import java.io.InputStream;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.jdom.Attribute;
import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.comm.pool.PoolManager;
import com.css.sword.platform.comm.util.FileUtils;

/**
 * <p>
 * ConfParser.java
 * </p>
 * <p>
 * Description:
 * </p>
 * 
 * Company: 中国软件与技术服务股份有限公司 2009 Department: 应用产品研发中心 Project: 中软睿剑业务基础平台
 * 
 * @author 于英民
 * @version 4.0
 * @since 4.0 date: 2009-6-3下午04:54:13
 */
public class ConfParser {

	private final static LogWritter logger = LogFactory
			.getLogger(ConfParser.class);

	/**
	 * ConfTreeNodeList的集合
	 */
	private Map<String, ConfTreeNode> confTreeNodeMap = new HashMap<String, ConfTreeNode>();

	/**
	 * 平台总配置文件的名称
	 */
	private final String sword_bootstrap = "sword.xml";

	/**
	 * 注意各个对象的父子关系
	 * 
	 * @param element
	 *            Element
	 */
	@SuppressWarnings("unchecked")
	public void parser() {
		// 得到配置文件的输入流
		FileUtils fileUtils = new FileUtils(sword_bootstrap);
		InputStream is = fileUtils.getInputStream();
		if (is == null) {
			logger.error("平台主配置文件" + sword_bootstrap + "读取错误！程序将终止！请检查运行环境！");
			// 无sword主配置文件web端与core端均无法正常启动,直接终止
			System.exit(-1);
		}

		Document doc = init(is);
		Element root = getRootElement(doc);

		// 1. 解析 property 配置
		List<Element> properties = root.getChildren("property");
		for (int i = 0; i < properties.size(); i++) {
			Element property = (Element) properties.get(i);
			String name = property.getAttributeValue("name");
			String value = property.getAttributeValue("value");
			addKey(name, value);
		}

		// 2. 解析集群配置
		Element cluster = root.getChild("cluster");
		if (cluster != null) {
			List<Attribute> attributes = cluster.getAttributes();
			Properties props = new Properties();
			for (int i = 0; i < attributes.size(); i++) {
				Attribute attribute = (Attribute) attributes.get(i);
				String name = attribute.getName();
				String value = attribute.getValue();
				props.setProperty(name, value);
			}
			addKey("cluster", props);
		}

		// 3. 解析代码表缓存配置
		Element codecache = root.getChild("codecache");
		if (codecache != null) {
			List<Attribute> attributes = codecache.getAttributes();
			Properties props = new Properties();
			for (int i = 0; i < attributes.size(); i++) {
				Attribute attribute = (Attribute) attributes.get(i);
				String name = attribute.getName();
				String value = attribute.getValue();
				props.setProperty(name, value);
			}
			addKey("codecache", props);
		}

		// 4. 解析启动类
		List<Element> startapps = root.getChildren("startapp");
		for (int i = 0; i < startapps.size(); i++) {
			Element startapp = (Element) startapps.get(i);
			String name = startapp.getAttributeValue("name");
			String value = startapp.getAttributeValue("value");
			addKey(name, value);
		}

		// 5. 解析定时任务
		Element scheduler = root.getChild("scheduler");
		if (scheduler != null) {
			List<Attribute> attributes = scheduler.getAttributes();
			Properties props = new Properties();
			for (int i = 0; i < attributes.size(); i++) {
				Attribute attribute = (Attribute) attributes.get(i);
				String name = attribute.getName();
				String value = attribute.getValue();
				props.setProperty(name, value);
			}
			addKey("scheduler", props);
		}

		// 6. EJB配置
		List<Element> ejbs = root.getChildren("ejb");
		HashMap<String, Properties> map = new HashMap<String, Properties>();
		for (int i = 0; i < ejbs.size(); i++) {
			Element ejb = (Element) ejbs.get(i);
			List<Attribute> attributes = ejb.getAttributes();

			Properties props = new Properties();
			for (int k = 0; k < attributes.size(); k++) {
				Attribute attribute = (Attribute) attributes.get(k);
				String name = attribute.getName();
				String value = attribute.getValue();
				props.setProperty(name, value);
			}
			String name = props.getProperty("jndi");
			map.put(name, props);
		}
		addKey("ejb", map);

		// 7. 获取服务器主机信息
		try {
			// 获取主机名
			String host = InetAddress.getLocalHost().getHostName();
			SystemInfo.setHost(host);
		} catch (UnknownHostException ex) {
			logger.error("获取本地主机名时发生错误..............", ex);
		}

		// 8. JDelegate配置信息
		Element jdelegateConfig = root.getChild("JDelegate");
		if (jdelegateConfig != null) {
			List<Attribute> attributes = jdelegateConfig.getAttributes();
			Properties props = new Properties();
			for (Attribute attribute : attributes) {
				String name = attribute.getName();
				String value = attribute.getValue();
				props.setProperty(name, value);
			}
			addKey("JDelegate", props);
		}

		// 8. JDelegate配置信息
		Element jcoServerConfig = root.getChild("GatewayServer");
		if (jcoServerConfig != null) {
			List<Attribute> attributes = jcoServerConfig.getAttributes();
			Properties props = new Properties();
			for (Attribute attribute : attributes) {
				String name = attribute.getName();
				String value = attribute.getValue();
				props.setProperty(name, value);
			}
			addKey("GatewayServer", props);
		}
	}

	private Document init(InputStream is) {
		Document doc = null;
		SAXBuilder builder = new SAXBuilder();
		try {
			doc = builder.build(is);
		} catch (Exception ex) {
			logger.error("配置文件加载失败！");
		}

		return doc;
	}

	/**
	 * 得到根元素
	 * 
	 * @param doc
	 *            Document
	 * @return Element
	 */
	private Element getRootElement(Document doc) {
		return doc.getRootElement();
	}

	/**
	 * 根据指定的元素，生成ConfTreeNode对象
	 * 
	 * @param confElement
	 * @return
	 */
	@SuppressWarnings("unused")
	private ConfTreeNode getConfTreeNode(Element confElement) {

		String name = confElement.getAttributeValue("name");
		String content = confElement.getAttributeValue("value");
		// lfw:20050914 删除该行
		// String leaf = confElement.getAttributeValue("leaf");
		String parent = confElement.getAttributeValue("parent");
		String loader = confElement.getAttributeValue("loader");
		String language = confElement.getAttributeValue("language");
		String applied = confElement.getAttributeValue("applied");

		ConfTreeNode confTreeNode = new ConfTreeNode();

		confTreeNode.setNodeName(name);
		confTreeNode.setNodeContent(content);
		confTreeNode.setLoaderClassName(loader);
		confTreeNode.setLanguage(language);
		confTreeNode.setApplied(applied);
		if (loader == null) { // 叶子节点
			confTreeNode.setLeaf(true);
		} else { // 非叶子节点
			confTreeNode.setLeaf(false);
		}

		if ((parent == null) || (parent.equals("root"))) {
			// 如果其父节点为root, 则其父ConfTreeNode为null
			confTreeNode.setParentNode(null);
		} else {
			// 从缓存中取得已经存在的ConfTreeNode
			confTreeNode.setParentNode((ConfTreeNode) confTreeNodeMap
					.get(parent));
		}
		confTreeNodeMap.put(name, confTreeNode);

		return confTreeNode;
	}

	/**
	 * 如果当前节点是配置文件对应的节点时，要调用加载器ConfLoaderFactory.getLoader()方法??<br>
	 * 并使用加载器进行分析解析Loader.Ayalyse()方法
	 * 
	 * @param myNode
	 *            ConfTreeNode
	 * @return ArrayList
	 */
	@SuppressWarnings("unused")
	private List<?> analyse(ConfTreeNode confTreeNode) {
		String loaderClassName = confTreeNode.getLoaderClassName();
		if ((loaderClassName != null) && (loaderClassName.length() > 0)) {
			IConfLoader confLoader = ConfLoaderFactory.getInstance().getLoader(
					loaderClassName);
			return confLoader.analyse(confTreeNode);
		}
		return new ArrayList<Object>();
	}

	/**
	 * 调用对象池相关的方法, 把key和value加入到池中
	 * 
	 * @param key
	 * @param value
	 */
	private void addKey(String key, Object value) {
		Object obj = PoolManager.getInstance().borrowObject(key);
		if (obj == null) {
			PoolManager.getInstance().addSingle(key, value);
			logger.debug("增加" + key + "[" + value + "]");
		} else {
			PoolManager.getInstance().refreshObject(key, value);
			logger.debug("更新" + key + "[" + value + "]");
		}
	}

	public static void main(String[] argvs) {
		ConfParser cp = new ConfParser();
		cp.parser();
	}
}
