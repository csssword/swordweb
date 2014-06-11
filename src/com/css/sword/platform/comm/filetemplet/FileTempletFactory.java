package com.css.sword.platform.comm.filetemplet;

import java.io.IOException;
import java.io.InputStream;
import java.util.Map;
import java.util.Properties;
import java.util.StringTokenizer;

import com.css.sword.platform.comm.conf.ConfManager;
import com.css.sword.platform.comm.filetemplet.ruler.DefaultPropertiesRuler;
import com.css.sword.platform.comm.filetemplet.tempfile.PropertiesTempFile;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.comm.util.FileUtils;

/**
 * <p>Title: </p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

public class FileTempletFactory {
	/**
	 * 日志记录对象
	 */
	private final static LogWritter logger = LogFactory.getLogger(FileTempletFactory.class);
 	
    /**
     * 模板
     */
	PropertiesTempFile tempfile;
	
	/**
	 * 规则
	 */
	DefaultPropertiesRuler ruler;
    
    /**
     * 单例实例
     */
    private static FileTempletFactory instance = null;
    
    /**
     * 私有构造器
     *
     */
    private FileTempletFactory(){
    	this.ruler = new DefaultPropertiesRuler();
    	this.tempfile = new PropertiesTempFile();
    	
    	init();
    }
    
    private void init(){
    	String files = (String)ConfManager.getValueByKey("exception-properties");
    	if(files == null){
    		return;
    	}
    	
    	StringTokenizer st = new StringTokenizer(files, ",");
    	while(st.hasMoreElements()){
    		String propFile = (String)st.nextElement();
    		Properties props = this.getProperties(propFile);
    		this.addTempletProperties(props);
    	}
    	
    }

    /**
     * 根据文件名读取文件，产生一个Properties对象
     */
    private Properties getProperties(String fileName) {
        Properties props = new Properties();
        InputStream is = null;
        try {
            FileUtils ft = new FileUtils(fileName);
            is = ft.getInputStream();
            if(is!=null) {
            	props.load(is);
            } 
        }
        catch (IOException ex) {
            logger.error("加载异常描述文件" + fileName + "出现异常!", ex);
        }

        return props;
    }

    /**
     * 单例方法
     * @return
     */
    public static FileTempletFactory sigleton(){
    	if(instance == null){
    		instance = new FileTempletFactory();
    	}
    	
    	return instance;
    }
    
    /**
     * 返回加工后的数据信息
     * 
     * @param params  宏替换参数列表
     * @return 替换后的字符串
     */
    public Object getContent(Map<?, ?> params) {
        ruler.setParams(params);
        return ruler.make(tempfile);
    }

    /**
     * 添加新的模板信息
     * 
     * @param props
     */
    public void addTempletProperties(Properties props){
    	this.tempfile.processProperties(props);
    }
    
    public DefaultPropertiesRuler getRuler() {
        return ruler;
    }

    public void setRuler(DefaultPropertiesRuler ruler) {
        this.ruler = ruler;
    }

    public PropertiesTempFile getTempfile() {
        return tempfile;
    }
    public void setTempfile(PropertiesTempFile tempfile) {
        this.tempfile = tempfile;
    }

    ////////////////////////////////
//    public static void main(String[] args) {
//        FileTempletFactory fileTempletFactory1 = new FileTempletFactory();
//    }

}