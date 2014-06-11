package com.css.ctp.web.comm;

import java.io.Serializable;
import java.security.Principal;

public class WebPrincipal implements Principal ,Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = -3572205239801006445L;

	private String name = "WEB-FRAME-PRINCIPAL";
	
	//	税务人员代码
	  private String swryDm;
	  //税务人员姓名
	  private String mc;
	  //后台返回的sessionid
	  private String sessionid;
	  //税务人员所在机关代码
	  private String swjgDm;
	  /*
	   * 税务机关名称
	   */
	  private String swjgMc;
	  
	  
	public String getMc() {
		return mc;
	}


	public void setMc(String mc) {
		this.mc = mc;
	}


	public String getSessionid() {
		return sessionid;
	}


	public void setSessionid(String sessionid) {
		this.sessionid = sessionid;
	}


	public String getSwjgDm() {
		return swjgDm;
	}


	public void setSwjgDm(String swjgDm) {
		this.swjgDm = swjgDm;
	}


	public String getSwjgMc() {
		return swjgMc;
	}


	public void setSwjgMc(String swjgMc) {
		this.swjgMc = swjgMc;
	}


	public String getSwryDm() {
		return swryDm;
	}


	public void setSwryDm(String swryDm) {
		this.swryDm = swryDm;
	}


	public void setName(String name) {
		this.name = name;
	}


	public String getName() {
		
		return name;
	}
	
	

}
