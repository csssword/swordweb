package com.css.sword.platform.comm.lc;

//import com.css.sword.common.util.a.t;

/**
 * Created by IntelliJ IDEA. User: liuzhy Date: 2008-7-25 Time: 14:51:08 To
 * change this template use File | Settings | File Templates.
 */
public class ValidateLc implements IValidateLc {
	public String checkLicense() throws CSSLcException {
		String msg = null;
		LcInfo li = LcInfo.singleton();
		String productCode = li.getProductCode();
		String productVersion = li.getProductVersion();
		if (productCode == null || productVersion == null) {
			msg = "系统配置参数有误！";
		}
		/*
		 * else { t t = new t(); String rmsg = t.v(productCode, productVersion);
		 * if (rmsg != null) { msg = rmsg; } }
		 */
		return msg;
	}

	public String getErrorMsg() throws CSSLcException {
		return msg;
	}
}
