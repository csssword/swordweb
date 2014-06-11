package com.css.ctp.web.comm;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

public class WebManageHelper {

	public static final String WEB_USER_SESSION = "CZRY_SESSIONID";

	public static void setPrincipalToSession(HttpServletRequest request,
			WebPrincipal principal) {
		HttpSession session = request.getSession();
		session.setAttribute(WEB_USER_SESSION, principal);
	}

	public static WebPrincipal getPrincipalByRequest(HttpServletRequest request) {

		HttpSession session = request.getSession(false);
		WebPrincipal webPrincipal = null;

		if (session != null) {
			webPrincipal = (WebPrincipal) session
					.getAttribute(WEB_USER_SESSION);
		}
		return webPrincipal;
	}

	/**
	 * 得到税务人员代码
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return String
	 */
	public static String getSwryDm(HttpServletRequest request) {
		WebPrincipal principal = getPrincipalByRequest(request);
		if (principal == null) {
			return null;
		} else {
			return principal.getSwryDm();
		}
	}

	/**
	 * 得到税务人员姓名
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return String
	 */
	public static String getSwryMc(HttpServletRequest request) {
		WebPrincipal principal = getPrincipalByRequest(request);
		if (principal == null) {
			return null;
		} else {
			return principal.getMc();
		}
	}

	/**
	 * 得到税务人员所在机关
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return String
	 */
	public static String getSwjgDm(HttpServletRequest request) {
		WebPrincipal principal = getPrincipalByRequest(request);
		if (principal == null) {
			return null;
		} else {
			return principal.getSwjgDm();
		}
	}

	/**
	 * 得到税务人员所在机关名称
	 * 
	 * @param request
	 *            HttpServletRequest
	 * @return String
	 */
	public static String getSwjgMc(HttpServletRequest request) {
		WebPrincipal principal = getPrincipalByRequest(request);
		if (principal == null) {
			return null;
		} else {
			return principal.getSwjgMc();
		}
	}

}
