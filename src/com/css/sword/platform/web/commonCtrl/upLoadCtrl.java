package com.css.sword.platform.web.commonCtrl;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.imageio.ImageIO;

import org.apache.commons.fileupload.FileItem;

import com.css.sword.extensions.appendix.vo.AppendixVO;
import com.css.sword.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.kernel.utils.SwordServiceUtils;
import com.css.sword.platform.comm.exception.CSSBaseCheckedException;
import com.css.sword.platform.comm.pool.ThreadLocalManager;
import com.css.sword.platform.web.controller.BaseDomainCtrl;
import com.css.sword.platform.web.controller.annotations.CTRL;
import com.css.sword.platform.web.event.IReqData;
import com.css.sword.platform.web.event.IResData;
import com.css.sword.platform.web.event.SwordRes;

@CTRL("UploadCtrl")
public class upLoadCtrl extends BaseDomainCtrl{
	
	/**
	 * 上传文件并暂存
	 * @param req
	 * @return
	 * @throws Exception
	 */
	public IResData imgFileUpload(IReqData req) throws Exception {
		IResData res = new SwordRes();
		String ywzb = (String) req.getAttr("ywzb");
		String ywid = (String) req.getAttr("ywid");
		String sytag = (String) req.getAttr("sytag");
		String sjgsdq = (String) req.getAttr("sjgsdq");
//		String maxSize = (String) req.getAttr("maxSize");
		List<FileItem> list = req.getUploadList();
		String[] mcArray = new String[list.size()];
		String fileName = "";
		FileItem fileItem = list.get(0);
		fileName = fileItem.getName();
//		Long fileSize = fileItem.getSize();
//		if(Math.round(fileSize/1024.00/1024.00) >= Integer.parseInt(maxSize)){
//			res.addAttr("msg", "上传的文件不能超过" + maxSize + "，请重新选择");
//			res.addPage("swordweb/widgets/SwordFile/SwordFileTarget.jsp");
//			return res;
//		}
		int first = fileName.lastIndexOf("\\");
		if(first != -1){
			first = first + 1;
		}else{
			first = 0;
		}
//		int last = fileName.lastIndexOf(".");
		fileName = fileName.substring(first);
		byte[] is = fileItem.get();
		byte[][] isArray = new byte[1][];
		if (sytag.equals("img")) {
			ByteArrayInputStream ins = new ByteArrayInputStream(is);
			BufferedImage bimage = ImageIO.read(ins);
			int width = bimage.getWidth();
			int height = bimage.getHeight();
			res.addAttr("width", width);
			res.addAttr("height", height);
		}
		mcArray[0] = fileName;
		isArray[0] = is;
		String[] fjids = (String[]) SwordServiceUtils.callService(
				"zcAppendixToQz", ywzb, ywid, sjgsdq, mcArray, isArray);
		if (fjids.length > 0) {
			res.addAttr("fjid", fjids[0]);
		} else {
			res.addAttr("fjid", null);
		}
		res.addAttr("fileName", fileName);
		res.addAttr("ywid", ywid);
		res.addAttr("msg", "true");
		res.addPage("swordweb/widgets/SwordFile/SwordFileTarget.jsp");
		return res;
	}
	
	/**
	 * 上传文件并暂存
	 * @param req
	 * @return
	 * @throws Exception
	 */
	@SuppressWarnings("unchecked")
	public IResData gridUpload(IReqData req) throws Exception {
		IResData res = new SwordRes();
		String flzlDm = (String) req.getAttr("flzldm");
		List<FileItem> list = req.getUploadList();
		int size = list.size();
		List<Map> filesList = new ArrayList<Map>();
		String namesList = "";
		for(int index = 0; index < size;index++){
			Map<String, Object> fxx = new HashMap<String, Object>();
			FileItem fileItem = list.get(index);
			String fileName = fileItem.getName();
			int first = fileName.lastIndexOf("\\");
			if(first != -1){
				first = first + 1;
			}else{
				first = 0;
			}
			fileName = fileName.substring(first);
			namesList = fileName + "," + namesList;
			byte[] is = fileItem.get();
			fxx.put("filename", fileName);
			fxx.put("file", is);
			fxx.put("flzlDm", flzlDm);
			filesList.add(fxx);
		}
		String fjid ="";
		List<Map> fjids =  (List<Map>) SwordServiceUtils.callService(
				"C00.EL.Save.UploadFiles", new Object[]{filesList});
		if (fjids.size() > 0) {
			fjid = (String) fjids.get(0).get(flzlDm);
		} 
		res.addAttr("fjid", fjid);
		res.addAttr("fjmc", namesList.substring(0, namesList.length()-1));
		res.addPage("swordweb/widgets/SwordFile/SwordFileTarget.jsp");
		return res;
	}
	
	/**
	 * 根据业务主键查询获取附件信息
	 * @param req (ywzb 业务主键一 组别、jyid 业务主键二 两个业务主键确定唯一一条记录、isFromZj 是否从总局发起的业务查询)
	 * @throws CSSBaseCheckedException
	 * @throws SwordBaseCheckedException
	 * @throws IOException
	 */
	@SuppressWarnings("unchecked")
	public void getFile(IReqData req) throws CSSBaseCheckedException,
			SwordBaseCheckedException, IOException {
		String ywzb = (String)req.getAttr("ywzb");
		String ywid = (String)req.getAttr("jyid");
		String fjid = (String)req.getAttr("fjid");
		Boolean isFromZj = new Boolean(req.getAttr("isFromZj").toString());
		List<AppendixVO> appendixVoList = (List<AppendixVO>)SwordServiceUtils.callService("getAppendixInfo", ywzb, ywid,fjid, isFromZj);
		byte[] fjnrxx = null;
		String fjpostfix = "";
		if(appendixVoList.size() > 0){
			AppendixVO appendixVo = appendixVoList.get(0);
             fjnrxx = appendixVo.getFjnrxx();
             String fjmc = appendixVo.getFjmcxx();
             fjpostfix = fjmc.substring(fjmc.lastIndexOf(".")+1, fjmc.length());
		}
		
		this.getHttpRes().setContentType("image/"+fjpostfix);
		OutputStream os = this.getHttpRes().getOutputStream();
		os.write(fjnrxx);
		os.flush();
		os.close();
	}
	
	/**
	 * 清理表格中的文件
	 * @param req
	 * @throws SwordBaseCheckedException
	 */
	public IResData deleteFiles(IReqData req) throws SwordBaseCheckedException{
		IResData res = new SwordRes();
		String fjid = (String) req.getAttr("fjid");
		List<String> filesIndexList = new ArrayList<String>();
		if(fjid != null && !fjid.equals("")){
			filesIndexList.add(fjid);
		}
		if(filesIndexList.size() > 0){
			SwordServiceUtils.callService("C00.EL.Delete.DeleteFiles", new Object[]{filesIndexList});
		}
		return res;
	}
	
//	public byte[] scale(BufferedImage bimage, String suffix) throws IOException {
//		 byte[] newdata = null;
//            int width = bimage.getWidth(); // 得到源图宽
//            int height = bimage.getHeight(); // 得到源图长
//            int _width, _height;//TODO 此处是写相册专辑以及相册浏览的小图像
//            if (width >= height) {
//                _width = (width < Integer.parseInt("1000")) ? width : Integer.parseInt("1000");
//                _height = _width * height / width;
//            } else {
//                _height = (height < Integer.parseInt("800")) ? height : Integer.parseInt("800");
//                _width = _height * width / height;
//            }
//            ByteArrayOutputStream baos = new ByteArrayOutputStream();
//            Image image_small = bimage.getScaledInstance(_width, _height, Image.SCALE_DEFAULT);
//            BufferedImage tag_small = new BufferedImage(_width, _height, BufferedImage.TYPE_INT_RGB);
//            Graphics g_small = tag_small.getGraphics();
//            g_small.drawImage(image_small, 0, 0, null); // 绘制缩小后的图
//            g_small.dispose();
//            ImageIO.write(tag_small,suffix,baos);
//            newdata = baos.toByteArray();
//        return newdata;
//    }
	/**
	 * 清理暂存附件信息
	 * @param req
	 * @throws SwordBaseCheckedException
	 */
	@SuppressWarnings("unchecked")
	public IResData deleteTempAppendixByFjId(IReqData req) throws SwordBaseCheckedException{
		IResData res = new SwordRes();
		Object fjidList = req.getTableData("fjidList");
		ArrayList<Map<String,Object>> cxfjidList = (ArrayList<Map<String,Object>>)fjidList;
		String[] fjidArray = null;
		if(cxfjidList != null && cxfjidList.size() > 0){
			fjidArray = new String[cxfjidList.size()];
			for(int i = 0; i< cxfjidList.size(); i++){
			    Map<String,Object> fjidMap = cxfjidList.get(i);
				String fjid = (String) fjidMap.get("fjid");
				fjidArray[i] = fjid;
			}
		}else{
			String fjid = (String) req.getAttr("fjid");
			if(fjid != null && !fjid.equals("")){
				fjidArray = new String[1];
				fjidArray[0] = fjid;
			}
		}
		if(fjidArray != null && fjidArray.length > 0){
			SwordServiceUtils.callService("deleteTempAppendixByFjId", new Object[]{fjidArray});
		}
		return res;
	}
	
	public IResData openUploadPage(IReqData req) throws SwordBaseCheckedException
	{
		IResData res = new SwordRes();
		String tag = (String) req.getAttr("tag");
		res.addAttr("tag", tag);
		if(!tag.equals("gridNew")){
			res.addAttr("ywzb", req.getAttr("ywzb"));
			res.addAttr("ywid", req.getAttr("ywid"));
			res.addAttr("sjgsdq", req.getAttr("sjgsdq"));
			res.addAttr("sytag", req.getAttr("sytag"));
			res.addPage("gt3_public/html/formUploadFile.html");
		}else {
			res.addAttr("flzldm", req.getAttr("flzldm"));
			res.addPage("gt3_public/html/gridUploadFile.html");
		}
		
//		res.addAttr("maxSize", req.getAttr("maxSize"));
		
    	return res;
	}
	
	@SuppressWarnings("unchecked")
	public IResData download(IReqData req)
				throws CSSBaseCheckedException, FileNotFoundException, SwordBaseCheckedException {
			IResData res = new SwordRes();
			String ywzb = (String)req.getAttr("ywzb");
			String ywid = (String)req.getAttr("ywid");
			String fjid = (String)req.getAttr("fjid");
			Boolean isFromZj = new Boolean(req.getAttr("isFromZj").toString());
			List<AppendixVO> appendixVoList = (List<AppendixVO>)SwordServiceUtils.callService("getAppendixInfo", ywzb, ywid,fjid, isFromZj);
			byte[] fjnrxx = null;
			String fjmc = "";
			if(appendixVoList.size() > 0){
				AppendixVO appendixVo = appendixVoList.get(0);
	             fjnrxx = appendixVo.getFjnrxx();
	             fjmc = appendixVo.getFjmcxx();
			}
			 ThreadLocalManager.add("download",true);
				String agent = this.getHttpReq().getHeader("USER-AGENT");
				try {
					if (agent != null) {
						if (-1 != agent.indexOf("MSIE")) {
							fjmc = URLEncoder.encode(fjmc, "UTF-8");
						} else if (-1 != agent.indexOf("Mozilla")) {
							fjmc = new String(fjmc.getBytes("UTF-8"),
									"ISO8859-1");
						}
					}

				} catch (UnsupportedEncodingException e1) {
					e1.printStackTrace();
				}
				this.getHttpRes()
						.setContentType("application/x-download;charset=UTF-8");
				this.getHttpRes().setHeader("Content-Disposition",
						"attachment;fileName=\"" + fjmc + "\"");
				OutputStream os = null;
				try {
					os = this.getHttpRes().getOutputStream();
				} catch (Exception e) {
					e.printStackTrace();
				}
				try {
					os.write(fjnrxx);
					os.flush();
					os.close();
				} catch (Exception e) {
					e.printStackTrace();
				}
			return res;
		}
}
