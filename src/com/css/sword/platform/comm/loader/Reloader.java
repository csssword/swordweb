package com.css.sword.platform.comm.loader;



/**
 * 用于类加载器自动加载的接口
 * 
 * <p>Title: Reloader</p>
 * <p>Description: SWORD 企业应用基础平台</p>
 * <p>Copyright: Copyright (c) 2005 中国软件与技术服务股份有限公司</p>
 * <p>Company: CS&S </p>
 * @author 刘付伟
 * @version 1.0  Created on 2005-1-6
 */
public interface Reloader {


    /**
     * 为当前类加载器添加新的类库
     *
     * @param repository 类库资源名称, 如目录/jar文件/zip文件等
     */
    public void addRepository(String repository);


    /**
     * 返回相关类加载器关联的类库列表信息, 如果没有,返回一个长度为0的数组
     */
    public String[] findRepositories();


    /**
     * 检查类库中的资源是否被更新
     */
    public boolean modified();


}
