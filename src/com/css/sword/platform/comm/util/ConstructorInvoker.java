package com.css.sword.platform.comm.util;


import java.lang.reflect.Constructor;
import java.lang.reflect.InvocationTargetException;


/**
 * <p>Title: </p>
 * <p>Description: 根据构???器实例类，要???虑构???器的参数???
 * 注意：在此只支持构???器参数为：“类对象”的参数，不支持基本类型(int,long,double??)</p>
 * <p>Copyright: Copyright (c) 2004 中软网络??术股份有限公??</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

public class ConstructorInvoker {
    //类名
    private String className;

    //参数
    private Object[] params;

    //要构造的??
    private Class<?> tagClass;

    //参数类???
    private Class<?>[] parameterTypes;

    public ConstructorInvoker(String className, Object[] params) {
        this.className = className;
        this.params = params;
        if (params != null) {
            parameterTypes = new Class[params.length];
        }
    }

    public ConstructorInvoker(String className) {
        this.className = className;
    }

    public Object getInstance() throws ClassNotFoundException,
        NoSuchMethodException, InvocationTargetException,
        IllegalAccessException,
        InstantiationException {
        prepare();
        Constructor<?> constructor = tagClass.getConstructor(parameterTypes);
        Object obj = constructor.newInstance(params);
        return obj;
    }

    protected void prepare() throws ClassNotFoundException {
        //1.
        tagClass = Class.forName(className);
        //2.
        if (params != null) {
            try {
                for (int i = 0; i < params.length; i++) {
                    parameterTypes[i] = params[i].getClass();
                }
            } catch (Exception ex) {
            }
        }
    }

    @SuppressWarnings("unused")
	private void translateType(Class<?> Type) {

    }
}