package com.css.sword.extensions.portal.web.session;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.css.sword.kernel.platform.SwordSession;
import com.css.sword.kernel.utils.SwordSessionUtils;
import com.css.sword.platform.web.session.ISwordSessionDataCreater;

public class SwordSessionDataMH_CD implements ISwordSessionDataCreater {
	public void createSessionData(HttpServletRequest request,
			SwordSession swordSession) {
		HttpSession hs = request.getSession();
		//主子用户
		String uuid = (String) hs.getAttribute("uuid");
		String djxh = (String) hs.getAttribute("djxh");
		String nsrDm = (String) hs.getAttribute("nsrDm");
		String nsrmc = (String) hs.getAttribute("nsrmc");
		String zgswjDm = (String) hs.getAttribute("zgswjDm");
		String zgswksDm = (String) hs.getAttribute("zgswksDm");
		if ((uuid != null) && (uuid.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("uuid", uuid);
		}
		if ((djxh != null) && (djxh.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("djxh", djxh);
		}
		if ((nsrDm != null) && (nsrDm.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("nsrDm", nsrDm);
		}
		if ((nsrmc != null) && (nsrmc.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("nsrmc", nsrmc);
		}
		if ((zgswjDm != null) && (zgswjDm.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("zgswjDm", zgswjDm);
		}
		if ((zgswksDm != null) && (zgswksDm.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("zgswksDm", zgswksDm);
		}
		//代征人
		String dzrDm = (String) hs.getAttribute("dzrDm");
		String dzrmc = (String) hs.getAttribute("dzrmc");
		String jdDm = (String) hs.getAttribute("jdDm");
		String sqDm = (String) hs.getAttribute("sqDm");
		String ssbmDm = (String) hs.getAttribute("ssbmDm");
		String zzbmDm = (String) hs.getAttribute("zzbmDm");
		String czfwDm = (String) hs.getAttribute("czfwDm");
		if ((dzrDm != null) && (dzrDm.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("dzrDm", dzrDm);
		}
		if ((dzrmc != null) && (dzrmc.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("dzrmc", dzrmc);
		}
		if ((jdDm != null) && (jdDm.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("jdDm", jdDm);
		}
		if ((sqDm != null) && (sqDm.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("sqDm", sqDm);
		}
		if ((ssbmDm != null) && (ssbmDm.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("ssbmDm", ssbmDm);
		}
		if ((zzbmDm != null) && (zzbmDm.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("zzbmDm", zzbmDm);
		}
		if ((czfwDm != null) && (czfwDm.length() > 0)) {
			SwordSessionUtils.putTempDataIntoApplicationContext("czfwDm", czfwDm);
		}
	}
}
