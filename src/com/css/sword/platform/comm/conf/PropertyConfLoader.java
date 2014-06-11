package com.css.sword.platform.comm.conf;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.Properties;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.comm.util.FileUtils;

/**
 * <p>Title: PropertyConfLoader</p>
 * <p>Description: 属性文件的加载分析器：取得属性文件中的每个键值对，其中关键字符串需要处理为：
 *     key = confTreeNode.getPraimaryKey() + key;
 * 将处理后的键值对添加到Arraylist中去。</p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 中软网络技术股份有限公司</p>
 * @author 于英民
 * @version 1.0
 */
public class PropertyConfLoader implements IConfLoader {
	
	private final static LogWritter logger = LogFactory.getLogger(PropertyConfLoader.class);

    /**
     * ?需要返回值吗?,需要返回值的话,那么getPairs方法和pairs属性是否可以去掉?
     * properties的形式:
     *     prop1=value1
     *     prop2=value2
     *
     * @param confTreeNode ConfTreeNode
     * @return ArrayList
     */
    public ArrayList<PropertyKeyValuePairs> analyse(ConfTreeNode confTreeNode) {
        
        ArrayList<PropertyKeyValuePairs> pairs = new ArrayList<PropertyKeyValuePairs>();
        
        //这里是properties文件名
        String propFile = confTreeNode.getNodeContent();
        String primaryKey = confTreeNode.getPrimaryKey();

        InputStream is = null;
        Properties props = new Properties();
        FileUtils fileUtils = new FileUtils(propFile);
        try {
            is = fileUtils.getInputStream();
            props.load(is);
        } catch (Exception e) {
            props = null;
            logger.error("读取系统配置文件["+propFile+"]时发生错误");

        } finally {
            try {
                if (is != null) {
                    is.close();
                }
            } catch (Exception e) {
                logger.error("无法关闭系统配置文件["+propFile+"].");    
            }            
        }

        Iterator<Object> iter = props.keySet().iterator();
        while (iter != null && iter.hasNext()) {
            String key = (String) iter.next();
            String value = props.getProperty(key);
            key = primaryKey + "." + key;
            PropertyKeyValuePairs propPairs = new PropertyKeyValuePairs(key,
                value);
            pairs.add(propPairs);
        }
        return pairs;
    }
}
