package com.css.sword.platform.web.servlet;

import java.io.File;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.css.ctp.core.commutils.SessionUtils;
import com.css.sword.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.kernel.base.mediation.message.IMediationRequest;
import com.css.sword.kernel.base.mediation.message.IProtocolConf.ProtocolType;
import com.css.sword.kernel.platform.SwordServerContext;
import com.css.sword.kernel.platform.SwordSession;
import com.css.sword.kernel.utils.SwordFileUtils;
import com.css.sword.kernel.utils.SwordLogUtils;
import com.css.sword.kernel.utils.SwordServiceUtils;
import com.css.sword.kernel.utils.SwordSessionUtils;
import com.css.sword.kernel.utils.SwordTPMonitorUtils;
import com.css.sword.platform.comm.conf.ConfManager;
import com.css.sword.platform.comm.pool.ThreadLocalManager;
import com.css.sword.platform.web.comm.CommParas;
import com.css.sword.platform.web.context.ContextAPI;
import com.css.sword.platform.web.controller.DoController;
import com.css.sword.platform.web.exception.ISwordExceptionResolver;
import com.css.sword.platform.web.exception.SwordExceptionMessage;
import com.css.sword.platform.web.exception.SwordExceptionResolver;
import com.css.sword.platform.web.fileupload.UploadConstants;
import com.css.sword.platform.web.fileupload.UploadTools;
import com.css.sword.platform.web.mvc.SwordDataSet;
import com.css.sword.platform.web.session.ISwordOnFinish;
import com.css.sword.platform.web.session.ISwordSessionDataCreater;
import com.css.sword.platform.web.session.SwordOnFinish;
import com.css.sword.platform.web.session.SwordSessionDataCreater;

/**
 * Web端Facade <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.servlet<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> Sword.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author caonan, yuantong, WJL <br>
 * @since Sword 4.0.0<br>
 */
public class Sword extends HttpServlet {
	private static final long serialVersionUID = 2308838939791005248L;
	protected static final SwordLogUtils log = SwordLogUtils.getLogger(Sword.class);
	public static boolean  useIoC = false;
	private ISwordExceptionResolver exceptionResolver;
    @Override
    public void init() throws ServletException {
    	// TODO Auto-generated method stub
    	super.init();
    	useIoC = Boolean.parseBoolean(getInitParameter("useIoC"));
    }
	private ISwordExceptionResolver getExceptionResolver() {

		if (this.exceptionResolver == null) {
			ConfManager.load();
			String s = (String) ConfManager.getValueByKey("exceptionResolver");
			if (s == null) {
				this.exceptionResolver = new SwordExceptionResolver();
			} else {
				try {
					this.exceptionResolver = (ISwordExceptionResolver) Class.forName(s).newInstance();
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}

		return this.exceptionResolver;
	}

	private List<ISwordSessionDataCreater> swordSessionDataCreater;

	private List<ISwordSessionDataCreater> getSwordSessionDataCreater() {
		if (this.swordSessionDataCreater == null) {
			swordSessionDataCreater = new ArrayList<ISwordSessionDataCreater>();
			ConfManager.load();
			String s = (String) ConfManager.getValueByKey("swordSessionDataCreater");
			if (s == null) {
				this.swordSessionDataCreater.add(new SwordSessionDataCreater());
			} else {
				String[] vals = s.split(",");
				for(int i = 0; i<vals.length; i ++){
					try {
						this.swordSessionDataCreater.add((ISwordSessionDataCreater) Class.forName(vals[i]).newInstance());
					} catch (Exception e) {
						log.error("创建swordSessionDataCreater时候出错!");
						throw new RuntimeException(e);
					}
				}
			}
		}
		return this.swordSessionDataCreater;
	}
   
	private void createSwordSession(HttpServletRequest request) {
		SwordSession ss = SwordServerContext.getSession().clear();
		// Map<Object, Object> sessionData = this.getSwordSessionDataCreater().getSessionData(request);
		// ss.getTmpData().put(ISwordSessionDataCreater.DataFromSessionCreater, sessionData);
		List<ISwordSessionDataCreater> sessions = this.getSwordSessionDataCreater();
		for(ISwordSessionDataCreater session: sessions){
			session.createSessionData(request, ss);
		}
	}

	private void clearSwordSession() {
		SwordServerContext.getSession().clear();
	}

	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.debug("Begin for Sword Facade...");
		try {
			ConfManager.load();
			// 1 web
			ThreadLocalManager.add(CommParas.httpReq, request);
			ThreadLocalManager.add(CommParas.httpRes, response);
			String requestUri = request.getRequestURI();

			// 创建web端的sword session
			this.createSwordSession(request);

			// ajax.sword
			// download.sword
			// fileuplod.sword
			// sword
			doDelegate(requestUri, request, response);
			if (requestUri.endsWith("/upload.sword")) {
				UploadTools.clearAllFile(new File(SwordFileUtils.getSwordRootPath()+UploadConstants.TEMP_FILE_PATH));
			}
			// setJSTLData(request);
			// request.setAttribute("students2", "111111111");
		} catch (Throwable e) {
			log.error("0", e);
			errorProcess(e);
		} finally {
			// 清理 web 端的 swordsession
			this.clearSwordSession();
			// 清理 上下文
			ThreadLocalManager.clear();
		}
		log.debug("End for Sword Facade...");
	}

	/**
	 * 处理用户自定义与系统全局上传配置参数 key1=swordFileMaxSize key2=swordUploadMaxSize
	 * 
	 * @param request
	 * @param ut
	 */
	private void handleUploadParam(HttpServletRequest request, UploadTools ut) {
		int fileMaxSize = UploadConstants.FILE_MAX_SIZE;
		int uploadMaxSize = UploadConstants.UPLOAD_MAX_SIZE;

		if (getInitParameter("swordFileMaxSize") != null && getInitParameter("swordFileMaxSize").trim().length() > 0) {
			try {
				fileMaxSize = Integer.parseInt(getInitParameter("swordFileMaxSize"));
				if (fileMaxSize < 0) {// 均认为是不限制大小,设置fileupload为-1
					fileMaxSize = -1;
				} else {
					fileMaxSize = fileMaxSize * 1024;// 传入的为KB值,转换为B
				}
			} catch (NumberFormatException e) {
				log.error("全局上传文件最大尺寸值[" + getInitParameter("swordFileMaxSize") + "]格式错误!", e);
				throw new RuntimeException("全局上传文件最大尺寸值[" + getInitParameter("swordFileMaxSize") + "]格式错误!");
			}
		}
		if (getInitParameter("swordUploadMaxSize") != null && getInitParameter("swordUploadMaxSize").trim().length() > 0) {
			try {
				uploadMaxSize = Integer.parseInt(getInitParameter("swordUploadMaxSize"));
				if (uploadMaxSize < 0) {
					uploadMaxSize = -1;
				} else {
					uploadMaxSize = uploadMaxSize * 1024;
				}
			} catch (NumberFormatException e) {
				log.error("全局上传文件总大小大值[" + getInitParameter("swordUploadMaxSize") + "]格式错误!", e);
				throw new RuntimeException("全局上传文件总大小大值[" + getInitParameter("swordUploadMaxSize") + "]格式错误!");
			}
		}
		String fileMaxSizeStr = request.getParameter(UploadConstants.KEY_UPLOAD_FILE_MAX_SIZE);
		String uploadMaxSizeStr = request.getParameter(UploadConstants.KEY_UPLOAD_MAX_SIZE);
		if (fileMaxSizeStr != null && fileMaxSizeStr.trim().length() > 0) {
			try {
				fileMaxSize = Integer.parseInt(fileMaxSizeStr);
				if (fileMaxSize < 0) {// 均认为是不限制大小,设置fileupload为-1
					fileMaxSize = -1;
				} else {
					fileMaxSize = fileMaxSize * 1024;// 传入的为KB值,转换为B
				}
			} catch (NumberFormatException e) {
				log.error("上传文件最大尺寸值[" + fileMaxSizeStr + "]格式错误!", e);
				throw new RuntimeException("上传文件最大尺寸值[" + fileMaxSizeStr + "]格式错误!");
			}
		}
		if (uploadMaxSizeStr != null && uploadMaxSizeStr.trim().length() > 0) {
			try {
				uploadMaxSize = Integer.parseInt(uploadMaxSizeStr);
				if (uploadMaxSize < 0) {
					uploadMaxSize = -1;
				} else {
					uploadMaxSize = uploadMaxSize * 1024;
				}
			} catch (NumberFormatException e) {
				log.error("上传文件总大小大值[" + uploadMaxSizeStr + "]格式错误!", e);
				throw new RuntimeException("上传文件总大小大值[" + uploadMaxSizeStr + "]格式错误!");
			}
		}
		ut.setField(UploadConstants.TEMP_FILE_PATH, UploadConstants.BUFFER_SIZE, fileMaxSize, uploadMaxSize, UploadConstants.ENCODING);
	}

	private void doDelegate(String requestUri, HttpServletRequest request, HttpServletResponse response) throws Exception {

		SwordDataSet reqDataSet = null;
		String json = null;
		String charSet = request.getCharacterEncoding();
		if (charSet == null) {
			charSet = "utf-8";
		}
		boolean jsonTag = false;
		try {
			Map<String, String[]> paras = request.getParameterMap();
			if (requestUri.endsWith("/ajax.sword")) {
				log.debug("Request URI:" + requestUri + ",本次请求为ajax提交。");
				reqDataSet = new SwordDataSet(request);
			} else if (requestUri.endsWith("/sword") || requestUri.endsWith("/upload.sword") || requestUri.endsWith("/form.sword")) {
				if (requestUri.indexOf("upload") != -1) {
					log.debug("Request URI:" + requestUri + ",本次请求为文件上传请求。");
					UploadTools ut = new UploadTools();
					handleUploadParam(request, ut);
					ut.upload(request);
					json = ut.getParam("postData");
					reqDataSet = new SwordDataSet(json);
					reqDataSet.getReqDataObject().getViewData().put("uploadOject", ut);
				} else if (requestUri.indexOf("form.sword") != -1) {
					log.debug("Request URI:" + requestUri + ",本次提交为form提交......");
					json = request.getParameter("postData");
					reqDataSet = new SwordDataSet(json);
				} else {
					log.debug("Request URI:" + requestUri + ",本次请求为form提交。");
					if (paras != null && (paras.get("tid") != null || paras.get("ctrl") != null)) {
						json = buildJson(paras);
						reqDataSet = new SwordDataSet(json);
					} else {
						throw new RuntimeException("未获取到有效的Tid或者Ctrl");
					}
				}
				@SuppressWarnings("unused")
				HttpSession hs = request.getSession();
				ThreadLocalManager.add(CommParas.reqDataSet, reqDataSet);
				ThreadLocalManager.add(CommParas.servletConfig, this.getServletConfig());
				/*
				 * reqDataSet.putContextValue("SWJG_DM", WebManageHelper .getSwjgDm(request)); reqDataSet.putContextValue("SWRY_DM",
				 * WebManageHelper .getSwryDm(request)); reqDataSet.putContextValue("SWJG_MC", WebManageHelper .getSwjgMc(request));
				 * reqDataSet.putContextValue("SWRY_MC", WebManageHelper .getSwryMc(request));
				 */
				doCtrl(reqDataSet,request);
				processPage(charSet, request, response);
				return;
			} else if (requestUri.endsWith("/download.sword")) {
				log.debug("Request URI:" + requestUri + ",本次请求为文件下载请求。");
				if (paras != null && (paras.get("tid") != null || paras.get("ctrl") != null)) {
					json = buildJson(paras);
					reqDataSet = new SwordDataSet(json);
				} else {
					reqDataSet = new SwordDataSet(request);
				}
				ThreadLocalManager.add(CommParas.reqDataSet, reqDataSet);
				/*
				 * reqDataSet.putContextValue("SWJG_DM", WebManageHelper .getSwjgDm(request)); reqDataSet.putContextValue("SWJG_MC",
				 * WebManageHelper .getSwjgMc(request)); reqDataSet.putContextValue("SWRY_MC", WebManageHelper .getSwryMc(request));
				 * reqDataSet.putContextValue("SWRY_DM", WebManageHelper .getSwryDm(request));
				 */
				doCtrl(reqDataSet,request);

				if (!ThreadLocalManager.getMap().containsKey("download") || ((Boolean) ThreadLocalManager.get("download")) != true) {
					if (!response.isCommitted() && ThreadLocalManager.get(CommParas.resDataSet) != null)
						processPage(charSet, request, response);
				}
				return;
			}else if(requestUri.endsWith("/jsonp.sword")){
				json = buildJson(paras);
				reqDataSet = new SwordDataSet(json);
				jsonTag = true;
			}
		} catch (Throwable e) {
			log.error("0", e);
			if (requestUri.endsWith("/ajax.sword")) {
				errorProcess(e);
				return;
			}
			SwordExceptionMessage mes = this.getExceptionResolver().deal(e);
			String rootName = mes.getName();
			String rootMsg = mes.getMessage();
			boolean uploadRedirect = reqDataSet != null && "true".equals(reqDataSet.getAttr("uploadRedirect")); // 文件上传并跳转页面

			if (requestUri.endsWith("/sword") || requestUri.indexOf("form.sword") != -1 || uploadRedirect) {
				request.setAttribute("exceptionName", rootName);
				request.setAttribute("exceptionMes", rootMsg);
				request.setAttribute("exceptionDataMap", mes.getDataMap());

				Object errorPage = ConfManager.getValueByKey("errorPage");
				if (mes.getErrorPage_redirect() != null && !"".equals(mes.getErrorPage_redirect())) {// ExceptionResolver
					// 返回了错误页面地址
					request.getRequestDispatcher(mes.getErrorPage_redirect()).forward(request, response);
				} else if (errorPage != null && !"".equals(errorPage.toString())) { // sword.xml配置的错误页面地址
					request.getRequestDispatcher(errorPage.toString()).forward(request, response);
				} else {
					request.getRequestDispatcher("swordweb/html/error/error.jsp").forward(request, response);
				}
			} else if (requestUri.endsWith("/download.sword") || (requestUri.endsWith("/upload.sword") && !uploadRedirect)) {

				ajaxErrorProcess(mes, rootName, rootMsg);

				ContextAPI.getResDataSet().getResDataObject().getJsonStringMap()
						.put("page", "swordweb/widgets/SwordFile/SwordFileTarget.jsp");
				processPage(charSet, request, response);

			}

			return;
		}
		if (reqDataSet == null) {
			return;
		} else {
			HttpSession hs = request.getSession();
			// String swrydm = hs.getAttribute("swrydm") != null ? (String)hs.getAttribute("swrydm") : null;
			// String swjgdm = hs.getAttribute("swjgdm") != null ? (String)hs.getAttribute("swjgdm") : null;
			ThreadLocalManager.add(CommParas.reqDataSet, reqDataSet);
			ThreadLocalManager.add(CommParas.servletConfig, this.getServletConfig());
			reqDataSet.setSessionID(hs.getId());
			// reqDataSet.putContextValue("ORG_ID", swjgdm);
			// reqDataSet.putContextValue("USER_ID",swrydm);
			doCtrl(reqDataSet,request);
			jsonProcess(jsonTag);
		}
	}

	private void processPage(String charSet, HttpServletRequest request, HttpServletResponse response) throws IOException, ServletException {
		String page = (String) (ContextAPI.getResDataSet().getResDataObject().getJsonStringMap().get("page"));
		ContextAPI.getResDataSet().getResDataObject().getJsonStringMap().remove("page");
		if (page != null) {
			if (page.indexOf(".jsp") != -1) {
				response.setContentType("text/html;charset=" + charSet);
				// jstl支持
				setJSTLData(request);

				request.setAttribute("SwordPageData", ContextAPI.getResDataSet().getJson().replaceAll("'", "&apos;"));

				request.getRequestDispatcher(page).include(request, response);

				request.getRequestDispatcher("swordweb/html/SwordPageData.jsp").include(request, response);
			} else {
				response.setContentType("text/html;charset=" + charSet);
				// 单引 ' 转 &apos; 否则到前台解析错误，阻断流程 (临时使用，有空再研究)
				// by ZhangBin
				String dataAp = "<div id=\"SwordPageData\"  style='display:none;' data='"
						+ ContextAPI.getResDataSet().getJson().replaceAll("'", "&apos;") + "'></div>";
				PrintWriter out = new PrintWriter(new OutputStreamWriter(response.getOutputStream(), charSet));
				request.getRequestDispatcher(page).include(request, response);
				out.println(dataAp);
				out.flush();
				out.close();
			}
			return;
		} else {
			throw new RuntimeException("未获取到有效的跳转地址！");
		}
	}

	private String buildJson(Map<String, String[]> paras) {
		StringBuffer sb = new StringBuffer();
		sb.append("{");
		for (Iterator<Entry<String, String[]>> it = paras.entrySet().iterator(); it.hasNext();) {
			Entry<String, String[]> entry = it.next();
			sb.append("\"");
			sb.append(entry.getKey()).append("\"");
			sb.append(":").append("\"").append(entry.getValue()[0].replaceAll("\"", "'")).append("\"");
			if (it.hasNext()) {
				sb.append(",");
			}
		}
		sb.append("}");
		return sb.toString();
	}

	private void doCtrl(SwordDataSet view,HttpServletRequest request) throws Exception {
		String uuid = request.getParameter("rUUID");
		if(uuid!=null&&uuid.length()==32)SwordSessionUtils.putTempDataIntoSystemContext("web-requestID",uuid);
		view.setSessionID(SessionUtils.genSessionID());

		if (!"".equals(view.getCtrl()) && view.getCtrl() != null) {
			SwordServerContext.getSession().setProtocolType(ProtocolType.LOCAL);
			IMediationRequest req = SwordServiceUtils.createServiceRequest(true, "Sword_Do_Ctrl");
			try {
				SwordTPMonitorUtils.application(req, null);
				DoController.execute(view.getCtrl(), view.getCtrl_method());
				SwordTPMonitorUtils.release(null, null);//需要配合核心包发版
			} catch (Exception ex) {
				SwordTPMonitorUtils.cancel(req, null, (ex instanceof SwordBaseCheckedException) ? (SwordBaseCheckedException) ex
						: new SwordBaseCheckedException(ex.getMessage(), ex));
				throw ex;
			} finally {
				SwordServerContext.getSession().setProtocolType(null);
			}
		} else {
			ContextAPI.goProcess();
		}

		// 执行结束过滤器
		this.getSwordOnFinish().onFinish((SwordDataSet) ThreadLocalManager.get(CommParas.resDataSet));
	}

	private ISwordOnFinish swordOnFinish;

	private ISwordOnFinish getSwordOnFinish() {
		if (this.swordOnFinish == null) {
			ConfManager.load();
			String s = (String) ConfManager.getValueByKey("swordOnFinish");
			if (s == null) {
				this.swordOnFinish = new SwordOnFinish();
			} else {
				try {
					this.swordOnFinish = (ISwordOnFinish) Class.forName(s).newInstance();
				} catch (Exception e) {
					log.error("创建 swordOnFinish 时候出错!");
					throw new RuntimeException(e);
				}
			}
		}
		return this.swordOnFinish;
	}

	private void ajaxErrorProcess(SwordExceptionMessage mes, String rootName, String rootMsg) {
		ContextAPI.getResDataSet().addRootAttr("exception", true);
		ContextAPI.getResDataSet().addRootAttr("exceptionMes", rootMsg);
		ContextAPI.getResDataSet().addRootAttr("exceptionName", rootName);

		String ajaxPage = mes.getErrorPage_ajax();
		if (ajaxPage != null && !"".equals(ajaxPage)) {
			ContextAPI.getResDataSet().addRootAttr("ajaxErrorPage", ajaxPage);

			String ajaxErrorPopupParam = mes.getAjaxErrorPopupParam();
			if (ajaxErrorPopupParam != null && !"".equals(ajaxErrorPopupParam)) {
				ContextAPI.getResDataSet().addRootAttr("ajaxErrorPopupParam", ajaxErrorPopupParam);
			}

		}

		Map<?, ?> mesDataMap = mes.getDataMap();
		Iterator<?> it = mesDataMap.keySet().iterator();
		while (it.hasNext()) {
			String name = (String) it.next();
			String value = "" + mesDataMap.get(name);
			ContextAPI.getResDataSet().addRootAttr(name, value);
		}
	}

	private void errorProcess(Throwable e) {
		SwordExceptionMessage mes = this.getExceptionResolver().deal(e);

		String rootName = mes.getName();
		String rootMsg = mes.getMessage();

		ajaxErrorProcess(mes, rootName, rootMsg);

		if(ContextAPI.getReq().getRequestURI().endsWith("/jsonp.sword")){
			jsonProcess(true);
		}else{
			jsonProcess(false);
		}
		//
		// System.out.println("rootName = "+rootName);
		// System.out.println("rootMsg = "+rootMsg);
		// System.out.println("errorStackTrace = "+errorStackTrace);

	}

	private void jsonProcess(boolean tag) {
		String json = ContextAPI.getResDataSet().getJson();
		// log.debug("返回数据 = " + json);
		Object cr = ThreadLocalManager.get("customRes");
		boolean customRes;
		if (cr != null) {
			customRes = (Boolean) cr;
		} else {
			customRes = false;
		}
		if (!customRes) {
			try {
				if(tag){
					String callback = ContextAPI.getReq().getParameter("jsoncallback");//
					ContextAPI.getRes().setContentType("text/json;charset=UTF-8");   
				    PrintWriter out;   
				            out = ContextAPI.getRes().getWriter();   
				            out.print(callback+"("+json+")");
//				            out.flush();   
//				            out.close();   

				}else{
					String contentType = ContextAPI.getReq().getContentType();
					if (contentType != null && contentType.indexOf("multipart/form-data") != -1) {
						ContextAPI.getRes().setContentType("text/html;charset=" + ContextAPI.getReq().getCharacterEncoding());
					} else {
						ContextAPI.getRes().setContentType("text/json;charset=" + ContextAPI.getReq().getCharacterEncoding());
					}
					ContextAPI.getRes().getWriter().write(json);
				}
			} catch (IOException e) {
				e.printStackTrace();
			} finally {
				try {
					ContextAPI.getRes().getWriter().close();
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}

	private void setJSTLData(HttpServletRequest request) {
		if (ContextAPI.getResDataSet().getJstlDataMap() != null) {
			for (Iterator<Entry<String, Object>> it = ContextAPI.getResDataSet().getJstlDataMap().entrySet().iterator(); it.hasNext();) {
				Entry<String, Object> entry = (Entry<String, Object>) it.next();
				request.setAttribute(entry.getKey(), entry.getValue());
			}
		}
	}
}
