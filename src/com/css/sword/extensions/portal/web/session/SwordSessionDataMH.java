package com.css.sword.extensions.portal.web.session;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import com.css.sword.kernel.platform.SwordSession;
import com.css.sword.kernel.utils.SwordSessionUtils;
import com.css.sword.platform.web.mvc.SwordDataSet;
import com.css.sword.platform.web.session.ISwordSessionDataCreater;

public class SwordSessionDataMH implements ISwordSessionDataCreater {

	@Override
	public void createSessionData(HttpServletRequest request,
			SwordSession swordSession) {
		HttpSession hs = request.getSession();
		String swrydm = (String) hs.getAttribute("swrydm");
		String swjgdm = (String) hs.getAttribute("swjgdm");
		String swrysfdm = (String) hs.getAttribute("identify_role");
		if (swrydm != null && swrydm.length() > 0) {
			swordSession.setUserID(swrydm);
		}
		if (swrysfdm != null && swrysfdm.length() > 0) {
				SwordSessionUtils.putTempDataIntoApplicationContext("swrysfdm",
					swrysfdm);
		}
		if (swjgdm != null && swjgdm.length() > 0) {
			swordSession.setOrgID(swjgdm);
			SwordSessionUtils.putTempDataIntoApplicationContext("gdslxdm",
					swjgdm.charAt(0));
		}
		String gwxh = getReqValue("gwxh", request);
		String gndm = getReqValue("gndm", request);
		String zndm = getReqValue("zndm", request);
		String gnjdm = getReqValue("gnjdm", request);
		String jsdm = getReqValue("jsdm", request);
        String gwssswjg = getReqValue("gwssswjg",request);
		if (gwxh != null && gwxh.length() > 0) {
			SwordSessionUtils.putTempDataIntoApplicationContext("gwxh", gwxh);
		}
		if (gndm != null && gndm.length() > 0) {
			SwordSessionUtils.putTempDataIntoApplicationContext("gndm", gndm);
		}
		if (zndm != null && zndm.length() > 0) {
			SwordSessionUtils.putTempDataIntoApplicationContext("zndm", zndm);
		}
		if (gnjdm != null && gnjdm.length() > 0) {
			SwordSessionUtils.putTempDataIntoApplicationContext("gnjdm", gnjdm);
		}
		if (jsdm != null && jsdm.length() > 0) {
			SwordSessionUtils.putTempDataIntoApplicationContext("jsdm", jsdm);
		}
        if(gwssswjg!=null&&gwssswjg.length()>0){
            SwordSessionUtils.putTempDataIntoApplicationContext("gwssswjg", gwssswjg);
        }
		// Map<String,String> map = new HashMap<String,String>();
		// map.put("test1", "11111111111");
		// map.put("test2", "22222222222");
		// //
		// 放入到tmpData中的数据会跟随远程调用dto传递，ISwordSessionDataCreater.DataFromSessionCreater为key，后面数据访问工具类需要使用此key来获取数据。
		// SwordSessionUtils.putTempDataInSession(ISwordSessionDataCreater.DataFromSessionCreater,
		// map);
	}

	private String getReqValue(String key, HttpServletRequest req) {
		String value = req.getParameter(key);
//		if (value == null || value.equals("")) {
//			SwordDataSet sds = new SwordDataSet(req);
//			value = (String) sds.getAttr(key);
//		}
		return value;
	}

}
