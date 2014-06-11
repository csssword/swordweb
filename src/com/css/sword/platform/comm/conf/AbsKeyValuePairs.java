package com.css.sword.platform.comm.conf;


/**
 * <p>Title: AbsKeyValuePairs</p>
 * <p>Description: 属性键值对对象抽象类</p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 中软网络技术股份有限公司</p>
 * @author 于英民
 * @version 1.0
 */

public abstract class AbsKeyValuePairs implements IKeyValuePairs {

    private String key;
    private Object content;

    public String getKey() {
        return key;
    }

    public Object getContent() {
        return content;
    }

    public void setContent(Object content) {
        this.content = content;
    }

    public void setKey(String key) {
        this.key = key;
    }

}
