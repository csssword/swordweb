package com.css.sword.platform.web.context;

import javax.servlet.ServletConfig;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.css.sword.platform.comm.pool.ThreadLocalManager;
import com.css.sword.platform.web.comm.CommParas;
import com.css.sword.platform.web.comm.ViewDataHelper;
import com.css.sword.platform.web.mvc.SwordDataSet;

/**
 * 信息流转工具类
 * <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.context<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> ContextAPI.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class ContextAPI {

	public static HttpServletRequest getReq() {
		return (HttpServletRequest) ThreadLocalManager.get(CommParas.httpReq);
	}

	public static HttpServletResponse getRes() {
		return (HttpServletResponse) ThreadLocalManager.get(CommParas.httpRes);
	}
	
	public static ServletConfig getServletConfig() {
		return (ServletConfig) ThreadLocalManager.get(CommParas.servletConfig);
	}

	public static SwordDataSet getReqDataSet() {
		return (SwordDataSet) ThreadLocalManager.get(CommParas.reqDataSet);
	}

	public static void goProcess() throws Exception {
		ViewDataHelper.dealViewData((SwordDataSet) ContextAPI.getReqDataSet());
	}

	public static SwordDataSet getResDataSet() {

		SwordDataSet resDataSet = (SwordDataSet) ThreadLocalManager
				.get(CommParas.resDataSet);
		if (resDataSet == null) {
			resDataSet = new SwordDataSet();
			ThreadLocalManager.add(CommParas.resDataSet, resDataSet);
		}
		return resDataSet;
	}

}