package com.css.sword.platform.comm.filetemplet;


/**
 * <p>Title: </p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

public interface IRuler {
    /**
     * 配置文件中异常定义变量起始标志
     */
    public static final String KEY_FLAG_START = "{";

    /**
     * 配置文件中异常定义变量结束标志
     */
    public static final String KEY_FLAG_END = "}";

    /**
     * 用当前规则根据模板得到整合后内容
     * @param tempfile
     * @return
     */
    Object make(ITempFile tempfile);
    void setParams(Object params);
}