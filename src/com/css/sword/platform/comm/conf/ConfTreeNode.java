package com.css.sword.platform.comm.conf;


/**
 *
 * <p>Title: ConfTreeNode</p>
 * <p>Description: 配置信息的最小单元，配置树中的节点对象。<br>
 * 不管配置信息的存储格式是那种，通过对应的加载器，我们最终得到的属性对象就是<br>
 * ConfTreeNode的一个ArrayList集合</p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 中软网络技术股份有限公司</p>
 * @author 于英民
 * @version 1.0
 */
public class ConfTreeNode {

    /**
     * 当前节点的父节点。通过该节点属性实现链式链接。
     */
    private ConfTreeNode parentNode;

    /**
     * 本节点对应的关键字
     */
    private String nodeName;

    /**
     * 当前节点是否是叶节点, 节点类型有两种：<br><br>
     * &nbsp;&nbsp;&nbsp;&nbsp;中间节点<br>
     * &nbsp;&nbsp;&nbsp;&nbsp;叶节点
     */
    private boolean isLeaf;

    /**
     * 节点内容：仅仅当nodeType = 2时，给字段保存了具体的属性值。这里之所以<br>
     * 要保存了内容对象，我们可以要求解析其内部实现该对象的数据结构类型。<br>
     * ConfTreeNode并不用于表示属性文件或xml文件中的节点内容），所以<br>
     * nodeContent的取值情况为：
     * 1. 当为中间节点时，不保存内容
     * 2. 当为信息库中叶节点时，或保存节点值，或保存属性文件/XML文件的路径
     */
    private String nodeContent;

    /**
     * 保存了加载器的类名
     */
    private String loaderClassName;

    private String language;

    private String applied;

    /**
     * 默认构造器
     */
    public ConfTreeNode() {
    }

    /**
     * 属性节点构造器
     *
     * @param parent String ?
     * @param nodeType String
     * @param nodeContent String
     * @param nodeIndex Integer ?
     */
    public ConfTreeNode(String parent, String nodeType, String nodeContent,
                        Integer nodeIndex) {
        
    }

    /**
     * 一个替责任链调用的方法实现
     *
     * @return String
     */
    public String getPrimaryKey() {
        if (parentNode != null) {
            return parentNode.getPrimaryKey() + "." + this.nodeName;
        } else {
            return this.nodeName;
        }
    }

    public void setLoaderClassName(String loaderClassName) {
        this.loaderClassName = loaderClassName;
    }

    public String getLoaderClassName() {
        return loaderClassName;
    }

    public void setNodeContent(String nodeContent) {
        this.nodeContent = nodeContent;
    }

    public String getNodeContent() {
        return nodeContent;
    }

    public void setNodeName(String nodeName) {
        this.nodeName = nodeName;
    }

    public String getNodeName() {
        return nodeName;
    }

    public void setParentNode(ConfTreeNode parentNode) {
        this.parentNode = parentNode;
    }

    public ConfTreeNode getParentNode() {
        return parentNode;
    }

    public void setApplied(String applied) {
        this.applied = applied;
    }

    public String getApplied() {
        return applied;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getLanguage() {
        return language;
    }

    public boolean isLeaf() {
        return isLeaf;
    }
    public void setLeaf(boolean isLeaf) {
        this.isLeaf = isLeaf;
    }
}
