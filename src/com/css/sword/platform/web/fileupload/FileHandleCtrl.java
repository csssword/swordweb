package com.css.sword.platform.web.fileupload;


import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;

import org.apache.commons.fileupload.FileItem;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.comm.pool.ThreadLocalManager;
import com.css.sword.platform.web.controller.BaseDomainCtrl;
import com.css.sword.platform.web.controller.annotations.CTRL;
import com.css.sword.platform.web.event.IReqData;
import com.css.sword.platform.web.event.IResData;
import com.css.sword.platform.web.event.SwordRes;

/**
 * @author Lzz 2011-5-17
 */
@CTRL("FileHandleCtrl")
public class FileHandleCtrl extends BaseDomainCtrl {
	protected static final LogWritter logger = LogFactory
			.getLogger(FileHandleCtrl.class);

	
	public IResData save(IReqData req) throws Exception {
		IResData res = new SwordRes();

		FileItem fitem = (FileItem) this.getUploadList().get(0);
		String fileId = FileHandleUtil.writeFile(fitem);
		res.addAttr("fileId", fileId);

		res.addPage("/swordweb/html/blank.html");
		return res;
	}

	public IResData initUp(IReqData req) throws Exception {
		IResData res = new SwordRes();
		res.addPage("uitest/form_up.html");
		return res;
	}

	public IResData clearOne(IReqData req) throws Exception {
		    IResData res = new SwordRes();
		
			String fileId = (String) req.getAttr("fileId");
			if (null == fileId || fileId.trim().length() == 0) {
				return res;
			}
			
		    boolean delFlag =  FileHandleUtil.clearOneFile(fileId);
			//res.addAttr("delFlag",""+delFlag);
			return res;
		}

	public IResData downloadOne(IReqData req) throws Exception {
		    IResData res = new SwordRes();

			String fileId = (String) req.getAttr("fileId");
			if (null == fileId || fileId.trim().length() == 0) {
				return res;
			}
			String fileName = (String) req.getAttr("fileName");
            this.downLoad(FileHandleUtil.load(fileId),fileName);
			return res;
		}
	

	public IResData clearAll(IReqData req) throws Exception {
		IResData res = new SwordRes();
		FileHandleUtil.clearAllFile();
		return res;
	}
	
	public IResData reDownload(IReqData req) throws Exception{
		String fileId = (String) req.getAttr("fileId");
		String uri =this.getHttpReq().getRequestURI();
		IResData res = new SwordRes();
		String fileName = (String) uri.substring(uri.lastIndexOf("/")+1);
		fileName=fileName.replaceAll("%20", "\\+");
		fileName = URLDecoder.decode(fileName, "UTF-8");
		String agent = this.getHttpReq().getHeader("USER-AGENT");
		try {
			if (agent != null) {
				if (-1 != agent.indexOf("MSIE")) {
					fileName = URLEncoder.encode(fileName, "UTF-8");
					fileName=fileName.replaceAll("\\+", "%20");//处理空格
				} else if (-1 != agent.indexOf("Mozilla")) {
					fileName = new String(fileName.getBytes("UTF-8"),
							"ISO8859-1");
				}
			}

		} catch (UnsupportedEncodingException e1) {
			throw new RuntimeException(e1);
		}
		
		ThreadLocalManager.add("download",true);
		this.getHttpRes()
				.setContentType("application/x-download;charset=UTF-8");
		this.getHttpRes().setHeader("Content-Disposition",
				"attachment;fileName=\"" + fileName + "\"");
		OutputStream os = null;
		try {
			os = this.getHttpRes().getOutputStream();
			byte[] b = new byte[1024];
			int size = 0;
			InputStream fileIs = FileHandleUtil.load(fileId);
			while ((size = fileIs.read(b)) > 0) {
				os.write(b, 0, size);
			}
			fileIs.close();
//			os.flush();
			os.close();
		} catch ( IOException e) {
			throw new RuntimeException(e);
		}
		return res;
	}

	/*
	 * public IResData loadFile(IReqData req) throws Exception { IResData res =
	 * new SwordRes();
	 * 
	 * try { String fileId=(String) req.getAttr("fileId"); BufferedInputStream
	 * bufferedInputStream=load(fileId);
	 * 
	 * byte[] data = new byte[1]; File desFile=new File("d:\\"+fileId);
	 * BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(new
	 * FileOutputStream(desFile)); while(bufferedInputStream.read(data) != -1) {
	 * bufferedOutputStream.write(data); } // 将缓冲区中的数据全部写出
	 * bufferedOutputStream.flush(); // 关闭串流 bufferedInputStream.close();
	 * bufferedOutputStream.close(); } catch (Exception e) { throw new
	 * Exception("读取指定文件失败!"); }
	 * 
	 * return res; }
	 */

}
