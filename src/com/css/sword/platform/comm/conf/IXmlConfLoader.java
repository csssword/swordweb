package com.css.sword.platform.comm.conf;


import java.util.ArrayList;


/**
 * <p>Title: IXmlConfLoader</p>
 * <p>Description: xml加载器的接口</p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 中软网络技术股份有限公司</p>
 * @author 于英民
 * @version 1.0
 */

public interface IXmlConfLoader extends IConfLoader {
    public ArrayList<?> analyse(ConfTreeNode confTreeNode);
}
