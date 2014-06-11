package com.css.sword.platform.web.mvc.cachecode;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;
import java.util.StringTokenizer;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.css.sword.kernel.platform.SwordComponentRef;
import com.css.sword.kernel.utils.SwordCacheUtils;
import com.css.sword.platform.comm.conf.ConfManager;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

/**
 * 
 * @since 4.0 2009-04-09
 * 
 */
public class WebCodeCacheServlet extends HttpServlet {

	private static final long serialVersionUID = 2939941538288993044L;

	private static String CACHE_DATA_BOUNDARY = "----------CacheDataBoundary";

	/**
	 * 日志记录对象
	 */
	private final static LogWritter logger = LogFactory.getLogger(WebCodeCacheServlet.class);

	public void init() throws ServletException {
		// try {
		// logger.debug("开始加载web端缓存数据 .................................");
		// ConfManager.load();
		// CacheManager.getInstance();
		// logger.debug("web端缓存数据加载完毕!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
		// } catch (Exception e) {
		// logger.error("web端缓存加载出现异常！", e);
		// }
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		doGet(request, response);
	}

	public void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		logger.debug("在WEB服务器加载缓存代码表！");
		String method = request.getParameter("method");
		logger.debug("method = " + method);
		// CacheQuery cq = new CacheQuery();

		if ("get_web_cache".equalsIgnoreCase(method)) {
			this.getWebCache(request, response);
			return;
		}
		logger.debug("在WEB服务器的服务器文件中加载 ...................");
		String tablenames = request.getParameter("tablenames");
		String versions = request.getParameter("versions");

		ServletOutputStream out = response.getOutputStream();
		response.setContentType("text/plan");
		response.setHeader("Content-Disposition", "data.txt");

		StringTokenizer stTable = new StringTokenizer(tablenames, ",");
		StringTokenizer stVersion = new StringTokenizer(versions, ",");
		long datalength = 0;
		while (stTable.hasMoreElements()) {
			String tablename = "" + stTable.nextElement();
			String version = "" + stVersion.nextElement();

			try {
				SwordCacheUtils.getAllDataFromKV(tablename);
				// cq.getData(tablename, null);
			} catch (Exception e) {
				throw new ServletException("获取数据失败！" + e);
			}

			int ver = Integer.parseInt(version);

			try {
				if (ver >= Integer.valueOf(SwordComponentRef.cacheMasterManager.getCacheManagerByPoolName(tablename)
						.getCachePool(tablename).getVersion())) {
					// if (ver >= cq.getVersion(tablename)) {
					continue;
				}
			} catch (Exception ex) {
				throw new ServletException("获取版本数据失败！" + ex);
			}

			long filesize = getFileSize(tablename);
			datalength += 20; // 表名
			datalength += 5; // 版本信息长度
			datalength += filesize; // 数据本体长度
			datalength += CACHE_DATA_BOUNDARY.length(); // 边界字符串长度
		}

		response.setHeader("Content-Length", "" + datalength);

		stTable = new StringTokenizer(tablenames, ",");
		stVersion = new StringTokenizer(versions, ",");

		while (stTable.hasMoreElements()) {
			String tablename = "" + stTable.nextElement();
			String version = "" + stVersion.nextElement();
			int ver = Integer.parseInt(version);

			try {
				if (ver >= Integer.valueOf(SwordComponentRef.cacheMasterManager.getCacheManagerByPoolName(tablename)
						.getCachePool(tablename).getVersion())) {
					// if (ver >= cq.getVersion(tablename.toUpperCase())) {
					continue;
				}
			} catch (Exception ex) {
				throw new ServletException("获取版本数据失败！" + ex);
			}

			byte[] bname = new byte[20];
			for (int i = 0; i < bname.length; i++) {
				bname[i] = ' ';
			}
			byte[] tmp = tablename.toUpperCase().getBytes();
			System.arraycopy(tmp, 0, bname, 0, tmp.length);

			byte[] data = this.getdata(tablename);
			byte[] bver = this.getversion(tablename);

			out.write(bname);
			out.write(bver);
			out.write(data);
			out.write(CACHE_DATA_BOUNDARY.getBytes());
		}

		out.flush();
		out.close();
	}

	private void getWebCache(HttpServletRequest request, HttpServletResponse response) throws ServletException,
			IOException {

		String tablename = request.getParameter("tablename");
		logger.debug("浏览器直接从服务器端获取代码表缓存文件： tablename = " + tablename + ".xml");

		ServletOutputStream out = response.getOutputStream();
		response.setContentType("text/plan");
		response.setHeader("Content-Disposition", tablename + ".xml");

//		try {
			// new CacheQuery().getData(tablename, null);
			//SwordCacheUtils.getFromKV(tablename, null);//null产生编译警告
//		} catch (Exception e) {
//			throw new ServletException("获取数据失败！" + e);
//		}

		long filesize = getFileSize(tablename);

		response.setHeader("Content-Length", "" + filesize);

		byte[] data = this.getdata(tablename);
		out.write(data);
		out.flush();
		out.close();
	}

	private byte[] getdata(String tablename) {
		try {
			byte[] data = new byte[0];
			Properties props = (Properties) ConfManager.getValueByKey("codecache");
			String strLocalXMLCacheDir = props.getProperty("local-xml-cache-dir");
			File file = new File(strLocalXMLCacheDir, tablename.toUpperCase() + ".xml");
			logger.debug("读取本地缓存文件： " + file.getAbsolutePath());
			FileInputStream in = new FileInputStream(file);
			byte[] buffer = new byte[10240];
			int len = in.read(buffer);
			while (len > 0) {
				byte[] tmp = new byte[data.length + len];
				System.arraycopy(data, 0, tmp, 0, data.length);
				System.arraycopy(buffer, 0, tmp, data.length, len);
				data = tmp;

				len = in.read(buffer);
			}
			return data;

		} catch (Exception e) {
			logger.error("读取服务器端本地缓存代码表文件时出现异常！", e);
			return new byte[0];
		}
	}

	private long getFileSize(String tablename) {
		Properties props = (Properties) ConfManager.getValueByKey("codecache");
		String strLocalXMLCacheDir = props.getProperty("local-xml-cache-dir");
		File file = new File(strLocalXMLCacheDir, tablename.toUpperCase() + ".xml");
		return file.length();
	}

	private byte[] getversion(String tablename) {
		// CacheQuery cq = new CacheQuery();

		byte[] ver = new byte[5];
		for (int i = 0; i < ver.length; i++) {
			ver[i] = ' ';
		}

		String version = null;
		try {
			// version = "" + cq.getVersion(tablename);
			version = SwordComponentRef.cacheMasterManager.getCacheManagerByPoolName(tablename).getCachePool(tablename)
					.getVersion();
		} catch (Exception ex) {
			logger.error("获取数据失败！", ex);
		}
		byte[] bversion = version.getBytes();
		System.arraycopy(bversion, 0, ver, 0, bversion.length);

		return ver;
	}
}
