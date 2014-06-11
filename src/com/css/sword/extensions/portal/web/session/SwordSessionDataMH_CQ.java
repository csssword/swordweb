package com.css.sword.extensions.portal.web.session;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.css.sword.kernel.platform.SwordSession;
import com.css.sword.kernel.utils.SwordSessionUtils;
import com.css.sword.platform.web.session.ISwordSessionDataCreater;

/**
 * 放入session信息
 * 
 * @author 郭明
 * 
 */
public class SwordSessionDataMH_CQ implements ISwordSessionDataCreater {
	public void createSessionData(HttpServletRequest request,
			SwordSession swordSession) {
		HttpSession hs = request.getSession();
		String nsrDm = (String) hs.getAttribute("nsrDm");
		String nsrsbh = (String) hs.getAttribute("nsrsbh");
		String nsrmc = (String) hs.getAttribute("nsrmc");
		String zgswjgDm = (String) hs.getAttribute("zgswjgDm");
		String gwssswjg = (String) hs.getAttribute("gwssswjg");
		String wbbz = (String) hs.getAttribute("wbbz");
		String swrydm = (String) hs.getAttribute("swrydm");
		String zndm = (String) hs.getAttribute("zndm");
		String gwxh = (String) hs.getAttribute("gwxh");
		String djxh = (String) hs.getAttribute("djxh");
		if ((djxh != null) && (djxh.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("djxh", djxh);
		}
		if ((zndm != null) && (zndm.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("zndm", zndm);
		}
		if ((gwxh != null) && (gwxh.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("gwxh", gwxh);
		}
		if ((swrydm != null) && (swrydm.length() > 0)) {
			SwordSessionUtils.setUserID(swrydm);
		}
		if ((gwssswjg != null) && (gwssswjg.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("gwssswjg",
					gwssswjg);
			SwordSessionUtils.setOrgID(gwssswjg);
		}
		if ((nsrsbh != null) && (nsrsbh.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("nsrsbh",
					nsrsbh);
		}
		if ((wbbz != null) && (wbbz.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("wbbz", wbbz);
		}
		if ((nsrDm != null) && (nsrDm.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("nsrDm", nsrDm);
		}
		if ((nsrmc != null) && (nsrmc.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("nsrmc", nsrmc);
		}
		if ((zgswjgDm != null) && (zgswjgDm.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("zgswjgDm",
					zgswjgDm);
		}
	}
}
