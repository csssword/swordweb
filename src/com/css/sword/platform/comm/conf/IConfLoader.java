package com.css.sword.platform.comm.conf;


import java.util.ArrayList;


/**
 * <p>Title: IConfLoader</p>
 * <p>Description: 配置文件加载器的公共接口</p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 中软网络技术股份有限公司</p>
 * @author 于英民
 * @version 1.0
 */

public interface IConfLoader {

    /**
     * 把ConfTreeNode的内容解析为键值对的集合
     *
     * @param confTreeNode ConfTreeNode
     * @return ArrayList 键值对的集合
     */
    public ArrayList<?> analyse(ConfTreeNode confTreeNode);

}
