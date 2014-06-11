package com.css.sword.platform.comm.util;

import java.io.File;
import java.io.FileOutputStream;

/*
 * 
 * <p>Title: RetroguardScriptCreator</p>
 * <p>Description: SWORD 企业应用基础平台</p>
 * <p>Copyright: Copyright (c) 2004 中国软件与技术服务股份有限公司</p>
 * <p>Company: CS&S </p>
 * @author 刘付伟
 * @version 1.0  Created on 2004-12-1
 */

public class RetroguardScriptCreator {

	private String path = "";
	private String outFile = "";
	private StringBuffer buffer = new StringBuffer();
	public RetroguardScriptCreator(String path,String outFile){
		this.path = path;
		this.outFile = outFile;
	}
	
	private void dirIterator(String dirPath){
		File file1 = new File(dirPath);
		File[] files = file1.listFiles();
		for(int i=0; i<files.length; i++){
			@SuppressWarnings("unused")
			String fileName = files[i].getName();
			if(files[i].isDirectory()){
				createScriptLine(dirPath + "/" + files[i].getName());
				dirIterator(dirPath + "/" + files[i].getName());
			}
			else{
				//类
			}
		} 
	}
	
	private void createScriptLine(String dir){
		String line = "";
		int pos = this.path.length();
		line = dir.substring(pos + 1);

		buffer.append(".class com/cssnet/" + line + "/* public field" + "\r\n");
		buffer.append(".class com/cssnet/" + line + "/* protected" + "\r\n");
	}
	
	public void createScript(){
		dirIterator(path);
		try {
			FileOutputStream fos = new FileOutputStream(this.outFile);
			fos.write(buffer.toString().getBytes());
			fos.flush();
			fos.close();
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
	public static void main(String[] args) {
		if(args.length < 2){
			System.out.println("生成混淆脚本错误!, 参数不足!");
			System.exit(0);
		}
		String classDir = args[0];//"E:/studio/cvs-root/platform/build/classes";
		String outFile = args[1];
		
		classDir = classDir + "/com/cssnet";
		RetroguardScriptCreator rsc = new RetroguardScriptCreator(classDir,outFile);
		rsc.createScript();
		
	}
}
