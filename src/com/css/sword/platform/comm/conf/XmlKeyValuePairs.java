package com.css.sword.platform.comm.conf;


/**
 * <p>Title: XmlKeyValuePairs</p>
 * <p>Description: 属性键值对对象，针对于xml文件的</p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 中软网络技术股份有限公司</p>
 * @author 于英民
 * @version 1.0
 */

public class XmlKeyValuePairs extends AbsKeyValuePairs {

    /**
     * 属性
     */
    private String key;

    /**
     * 属性对应的键值
     */
    private Object content;

    public XmlKeyValuePairs(String key, Object content) {
        this.key = key;
        this.content = content;
    }

    public void setContent(Object content) {
        this.content = content;
    }

    public Object getContent() {
        return content;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getKey() {
        return key;
    }

}
