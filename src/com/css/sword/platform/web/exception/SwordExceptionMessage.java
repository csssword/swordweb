package com.css.sword.platform.web.exception;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by IntelliJ IDEA. User: CSS Date: 2010-10-10 Time: 15:55:14 To change
 * this template use File | Settings | File Templates.
 */
public class SwordExceptionMessage {

	private String errorPage_redirect;
	private String errorPage_ajax;
	private String ajaxErrorPopupParam;

	private String name;
	private String message;

	private Map<String, String> dataMap = new HashMap<String, String>();

	public Map<String, String> getDataMap() {
		return dataMap;
	}

	public String getAjaxErrorPopupParam() {
		return ajaxErrorPopupParam;
	}

	public void setAjaxErrorPopupParam(String ajaxErrorPopupParam) {
		this.ajaxErrorPopupParam = ajaxErrorPopupParam;
	}

	public String getErrorPage_redirect() {

		return errorPage_redirect;
	}

	public void setErrorPage_redirect(String errorPage_redirect) {
		this.errorPage_redirect = errorPage_redirect;
	}

	public String getErrorPage_ajax() {
		return errorPage_ajax;
	}

	public void setErrorPage_ajax(String errorPage_ajax) {
		this.errorPage_ajax = errorPage_ajax;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
