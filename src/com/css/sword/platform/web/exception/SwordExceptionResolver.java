package com.css.sword.platform.web.exception;

import com.css.sword.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.platform.comm.exception.helper.CSSExceptionHelper;

/**
 * Created by IntelliJ IDEA. User: CSS Date: 2010-10-10 Time: 15:57:09 To change
 * this template use File | Settings | File Templates.
 */
public class SwordExceptionResolver implements ISwordExceptionResolver {

	private static final String AJAXPAGE = "swordweb/html/error/error_ajax.jsp"; // ajax出错时候的跳转页面
	private static final String REDIRECTPAGE = "swordweb/html/error/error_redirect.jsp"; // 页面跳转出错时候的跳转页面
	private static final String DEBUGMES = "debugMes";
	private static final String AJAXERRORPOP = "{titleName:'系统提示',width: 590,height:195,top:50,isMin:\"false\",isNormal:\"false\",isMax:\"false\"}";

	public SwordExceptionMessage deal(Throwable e) {
		String rootName = "";
		String rootMsg = "";
		String stackInfo = "";
		if (e instanceof SwordBaseCheckedException) {
			rootMsg = e.getMessage();
			rootName = (e.getCause() == null) ? e.getClass().getName() : e
					.getCause().getClass().getName();
			stackInfo = ((SwordBaseCheckedException) e).getExceptionStackInfo();
		} else {
			while (true) {
				if (e.getCause() == null) {
					break;
				} else {
					e = e.getCause();
                    if(e instanceof SwordBaseCheckedException)break;
				}
			}
			rootMsg = e.getMessage();
			rootName = e.getClass().getName();
			SwordBaseCheckedException ex = (e instanceof SwordBaseCheckedException) ? (SwordBaseCheckedException) e : new SwordBaseCheckedException(e.getMessage(), e);
			stackInfo = ex.getExceptionStackInfo();
		}

		SwordExceptionMessage res = new SwordExceptionMessage();
		res.setName(rootName);
		res.setMessage(rootMsg);
		res.setErrorPage_redirect(REDIRECTPAGE);
		res.setErrorPage_ajax(AJAXPAGE);
		res.setAjaxErrorPopupParam(AJAXERRORPOP);
		res.getDataMap().put(DEBUGMES, stackInfo);
		return res;
	}

	private String getDebugMessage(Throwable ex) {
		CSSExceptionHelper helper = new CSSExceptionHelper();
		helper.parseExceptionStackInfo(ex);
		return helper.getExceptionStackInfo();
	}

}
