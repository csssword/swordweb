package com.css.sword.platform.web.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.css.sword.platform.comm.exception.CSSBaseCheckedException;
import com.css.sword.platform.comm.pool.ThreadLocalManager;
import com.css.sword.platform.web.context.ContextAPI;
import com.css.sword.platform.web.event.IReqData;
import com.css.sword.platform.web.event.IResData;
import com.css.sword.platform.web.event.SwordRes;
import com.css.sword.platform.web.mvc.SwordDataSet;

/**
 * Controller Loader类 <br>
 * Information:
 * <Br>
 * controller基类
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.controller<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> ReflectHelper.java<br>
 * Generate : 2009-11-23<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author wjl <br>
 * @since Sword 4.0.0<br>
 */
public class BaseDomainCtrl {
	private IResData res;
	private SwordDataSet reqDataSet;

	public SwordDataSet getReqDataSet() {
		return reqDataSet;
	}

	public void setReqDataSet(SwordDataSet reqDataSet) {
		this.reqDataSet = reqDataSet;
	}

	protected IResData getRes() {
		if (res == null) {
			res = new SwordRes();
		}
		return res;
	}

	protected IResData delegate(String tid, IReqData req)
			throws CSSBaseCheckedException {
        return null;
		/*SwordReq sreq = (SwordReq) req;
		String[] t = tid.split("_");
		sreq.setTransactionID(t[0]);
		sreq.setMethod(t[1]);
		IRequestEvent reqEvent = (IRequestEvent) sreq;
		IResData resp = (IResData) BizDelegate.delegate(reqEvent);
		return resp;*/
	}

	public HttpServletRequest getHttpReq() {
		return ContextAPI.getReq();
	}

	public HttpServletResponse getHttpRes() {
		return ContextAPI.getRes();
	}

	
	//上传下载使用，说明文档
	public void downLoad(InputStream fileIs, String fileName) {
        ThreadLocalManager.add("download",true);
		// 为了解决多浏览器文件名乱码。
		String agent = this.getHttpReq().getHeader("USER-AGENT");
		try {
			if (agent != null) {
				if (-1 != agent.indexOf("MSIE")) {
					fileName = URLEncoder.encode(fileName, "UTF-8");
				} else if (-1 != agent.indexOf("Mozilla")) {
					fileName = new String(fileName.getBytes("UTF-8"),
							"ISO8859-1");
				}
			}

		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}
		this.getHttpRes()
				.setContentType("application/x-download;charset=UTF-8");
		this.getHttpRes().setHeader("Content-Disposition",
				"attachment;fileName=\"" + fileName + "\"");
		OutputStream os = null;
		try {
			os = this.getHttpRes().getOutputStream();
		} catch (Exception e) {
			e.printStackTrace();
		}
		try {
			byte[] b = new byte[1024];
			int size = 0;
			while ((size = fileIs.read(b)) > 0) {
				os.write(b, 0, size);
			}
			fileIs.close();
			os.flush();
			os.close();
		} catch (Exception e) {
			e.printStackTrace();
		}// try
	}

	public void downLoad(File file, String fileName)
			throws FileNotFoundException {
		this.downLoad(new FileInputStream(file), fileName);
	}
}
