/*
 * @(#)PropVO.java  2006-6-16 16:02:27
 * 
 * (c) 2004 中国软件与技术服务股份有限公司
 * 
 * $Id$
 */
package com.css.sword.platform.comm.util;


public class PropVO {
    String propName;
    String propType;
    Object PropValue;
    /**
     * @return 返回propName.
     */
    public String getPropName() {
        return this.propName;
    }
    /**
     * 设置propName的值
     * @param propName 需要设置的propName值
     */
    public void setPropName(String propName) {
        this.propName = propName;
    }
    /**
     * @return 返回propType.
     */
    public String getPropType() {
        return this.propType;
    }
    /**
     * 设置propType的值
     * @param propType 需要设置的propType值
     */
    public void setPropType(String propType) {
        this.propType = propType;
    }
    /**
     * @return 返回propValue.
     */
    public Object getPropValue() {
        return this.PropValue;
    }
    /**
     * 设置propValue的值
     * @param propValue 需要设置的propValue值
     */
    public void setPropValue(Object propValue) {
        this.PropValue = propValue;
    }
    
    public String toString(){
        return "[propName="+this.propName
        +" , PropValue="+this.PropValue+"]";

    }
}
