package com.css.sword.platform.comm.conf;


import java.util.ArrayList;


/**
 * <p>Title: AbsXmlConfLoader</p>
 * <p>Description: xml加载器的抽象类, 各个模块的XML解析器需要继承此类</p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 中软网络技术股份有限公司</p>
 * @author 于英民
 * @version 1.0
 */

public abstract class AbsXmlConfLoader implements IXmlConfLoader {

    /**
     * @see com.css.sword.platform.comm.conf.IXmlConfLoader#analyse
     */
    public abstract ArrayList<?> analyse(ConfTreeNode confTreeNode);

}
