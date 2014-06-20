package com.css.sword.platform.web.commonCtrl;

import java.io.File;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.web.context.ContextAPI;
import com.css.sword.platform.web.controller.BaseDomainCtrl;
import com.css.sword.platform.web.controller.annotations.CTRL;
import com.css.sword.platform.web.event.IReqData;
import com.css.sword.platform.web.event.IResData;
import com.css.sword.platform.web.event.SwordRes;

@CTRL("plugins")
public class PluginsCtrl extends BaseDomainCtrl {
	private static Map<String, List<String>> pluginMap;
	private final static LogWritter logger = LogFactory
			.getLogger(PluginsCtrl.class);

	public IResData getAllPlugins(IReqData req) throws UnsupportedEncodingException {
		SwordRes res = new SwordRes();
		// if (pluginMap == null) {
		logger.debug("初始化插件列表！");
		pluginMap = new HashMap<String, List<String>>();
//		String classPath = getClass().getClassLoader().getResource("/").getPath();
//		String webRoot = classPath.substring(0, classPath.indexOf("WEB-INF"));
//		System.out.println("classPath ContextAPI="+ContextAPI.getReq().getSession().getServletContext().getRealPath("/"));
		String webRoot = ContextAPI.getReq().getSession().getServletContext().getRealPath("/");
		logger.debug("webRoot="+webRoot);
		StringBuffer sb = new StringBuffer(webRoot);
		sb.append("swordweb/biz/plugins");
		String path = java.net.URLDecoder.decode(sb.toString(),"UTF-8");//解决路径中含空格、中文问题
		File pluginsPath = new File(path);
		File[] plugins = pluginsPath.listFiles();
		logger.debug("获取插件目录：" + sb.toString());
		if (plugins == null) {
			if (sb.toString().startsWith("/")) {
				String pluginPath = sb.toString().substring(1);
				logger.debug("获取特殊情况下时的插件目录：" + pluginPath);
				pluginsPath = new File(pluginPath);
				plugins = pluginsPath.listFiles();
			}
		}
		if (plugins != null) {
			logger.debug("遍历Plugin目录下所有文件！");
			for (File file : plugins) {
				if (file.isDirectory()) {
					List<String> fileList = new ArrayList<String>();
					String dirName = file.getName();
					scan(file, fileList);
					if (fileList.size() != 0) {
						pluginMap.put(dirName, fileList);
					}
				}
			}
		}
		// } else {
		// logger.debug("插件列表已经存在，使用缓存数据！");
		// }
		res.setCusJson(true);
		res.getResDataSet().getResDataObject().setObject(pluginMap);
		return res;
	}

	public IResData refreshPlugin(IReqData req)  throws UnsupportedEncodingException{
		pluginMap = null;
		return this.getAllPlugins(req);
	}

	private void scan(File dir, List<String> fileList) {
		File[] plugin = dir.listFiles();
		if (plugin != null) {
			for (File file : plugin) {
				if (!file.isDirectory()) {
					String fileName = file.getName();
					if (fileName.endsWith(".js")) {
						fileList.add(file.getName());
					}
				} else {
					scan(file, fileList);
				}
			}
		}
	}
}
