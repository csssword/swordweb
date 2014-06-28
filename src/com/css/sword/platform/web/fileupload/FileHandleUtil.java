package com.css.sword.platform.web.fileupload;


import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.InputStream;

import org.apache.commons.fileupload.FileItem;

import com.css.sword.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.kernel.utils.SwordSequenceUtils;
import com.css.sword.platform.comm.conf.ConfManager;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

/**
 * @文件处理类
 * @author Lzz
 * 2011-5-17
 */
public class FileHandleUtil{
	private static File parentDir;
	private static boolean dir_valid=false;
	private static String  clear_time;
	private static final String  defclear_time="24";
	static{
		dir_valid= prepareDirs();
		if(!dir_valid){
			dir_valid=mkParentDir();
		}
		clearAllFileDirect();
		
	}
	
	
	protected static final LogWritter logger = LogFactory.getLogger(FileHandleUtil.class);
	
	/**
	 * 检查父目录
	 * 
	 * @return
	 */
	public static boolean prepareDirs() {
		if (null != parentDir && parentDir.exists()) {
			return true;
		} else {
			// 读取已加载的 sword.xml上传文件目录地址
			String upload_dest = (String) ConfManager
					.getValueByKey("upload-temp");
			 clear_time = (String) ConfManager
			.getValueByKey("upload-clear-time");
			if (null == upload_dest) {
				parentDir=initDefaultDir();
			} else {
				if (!upload_dest.endsWith(File.separator))
					upload_dest = upload_dest + File.separator;
				parentDir = new File(upload_dest);
				
			}
			return parentDir.exists();
		}
	}
	/**
	 * mkdir父目录
	 * 
	 * @return
	 */
	private static boolean mkParentDir() {
		synchronized(parentDir){
			if (!parentDir.exists()) {
				return parentDir.mkdirs();
			}
		}
			

		return false;
	}
	/**
	 * 初始化默认目录
	 * @return
	 */
	public static File initDefaultDir(){
		String path = FileHandleUtil.class.getClassLoader().getResource("sword.xml").getPath();
		int lastNum = path.lastIndexOf("WEB-INF");
		path = path.substring(0, lastNum - 1);
		File deployPath = new File(path).getAbsoluteFile();
		parentDir=new File(deployPath,"swordIntimeUpTmp");
		return parentDir;
	}
	/**
	 * 清理所有临时文件(判断修改时间)
	 * @return
	 */
	public synchronized  static boolean  clearAllFile() {
			if(dir_valid&&parentDir.isDirectory()){
				for (File item : parentDir.listFiles()) {
					long s1=item.lastModified();
					if(validateTime(s1)){
						item.delete();
					}				
				}
			}
			return true;
		
	}
	
	/**
	 * 清理所有临时文件(判断修改时间)
	 * @return
	 */
	public synchronized  static boolean  clearAllFileTimer(String deadline) {
			if(dir_valid&&parentDir.isDirectory()){
				for (File item : parentDir.listFiles()) {
					long s1=item.lastModified();
					long now=System.currentTimeMillis();
					long com=(now-s1)/(1000*60*60);
					if(com>=Long.valueOf(deadline)){
						item.delete();
					}
				}
			}
			return true;
		
	}
	/**
	 * 清理所有临时文件(不判断修改时间)
	 * @return
	 */
	public  synchronized static boolean  clearAllFileDirect() {
			if(dir_valid&&parentDir.isDirectory()){
				for (File item : parentDir.listFiles()) {
						item.delete();
				}
			}
			return true;
		
	}
	
	public static  boolean validateTime(long fileTime){
		if(null==clear_time){
			clear_time=defclear_time;
		}
		long now=System.currentTimeMillis();
		long com=(now-fileTime)/(1000*60*60);
		if(com>=Long.valueOf(clear_time)){
			return true;	
		}
		
		return false;
	}
	/**
	 * 清理指定文件
	 * @param fileId
	 * @return
	 */
	public  static boolean   clearOneFile(String fileId) {
			if(dir_valid&&parentDir.isDirectory()){
				File file = new File(parentDir, fileId);
				if(file.exists()){
					synchronized (file) {
						return file.delete();
					}
				}
				
				
			}
			
		return false;
	}
/**
 * 返回指定文件InputStream
 * @param fileId
 * @return
 * @throws FileNotFoundException
 */
    public static InputStream load(String fileId) throws FileNotFoundException {
    	if(dir_valid){
    		 File srcFile = new File(parentDir, fileId);
    		 if(srcFile.exists()){
    			 synchronized (srcFile) {
    				 BufferedInputStream bufferedInputStream;
    	     	        bufferedInputStream = new BufferedInputStream(new FileInputStream(srcFile));
    	     	        return bufferedInputStream; 
				}
    			
    		 }
    	       
    	}
       return null;

    }

    public static boolean existFile(String fileId) {
        if (dir_valid) {
            File srcFile = new File(parentDir, fileId);
            if (srcFile.exists()) return true;
        }
        return false;
    }

    
    /**
     * 保存临时文件
     * @param fitem
     * @return
     * @throws Exception
     */

	public synchronized static String   writeFile(FileItem fitem) throws Exception {
		String fileId=getFileId();
			if(dir_valid&&parentDir.isDirectory()){
				File childFile=new File(parentDir, fileId);
				synchronized (childFile) {
					fitem.write(childFile);
				}
				
			}
		return fileId;
	}
	
	public synchronized static File   createNewFile()  {
		if(dir_valid&&parentDir.isDirectory()){
				File childFile=new File(parentDir, getFileId());
				return childFile;
		}else{
				throw new RuntimeException("createNewFile出错！");
		}
	}

	public static String getFileId(){
		long time=System.currentTimeMillis();
		 String fileId = generateUUID();
		 fileId=time+"_"+fileId;
		 return fileId;
	}
	/**
	 * 生产18位UUID
	 * 
	 * @return
	 */
	public static String generateUUID() {
		try {
			return  SwordSequenceUtils.generateRandomString().substring(0,18);
		} catch (SwordBaseCheckedException e) {
			System.out.println("fileId获取出错");
			throw new RuntimeException(e);
		}
	}
	public static File getParentDir() {
		return parentDir;
	}
	public static void main(String[] args) {
		String t=generateUUID();
		System.out.println(t);
	}
}
