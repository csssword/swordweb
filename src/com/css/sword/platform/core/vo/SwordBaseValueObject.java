package com.css.sword.platform.core.vo;

import java.lang.reflect.Constructor;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.HashMap;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

/**
 * Title: VO基类，重写了toString、equals方法,增加了toHashMap方法
 * Description: 中国税务税收征管信息系统
 * Copyright: Copyright (c) 2006
 * Company: 中国软件与技术服务股份有限公司
 * @version 1.0
 */
public abstract class SwordBaseValueObject implements ISwordValueObject {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private final static LogWritter logger = LogFactory.getLogger(SwordBaseValueObject.class);
	
	/**
	 * 返回类的基本信息, 包括类的名称和类的基本属性值信息
	 * @return
	 */
	public String toString() {
		Method[] methods = this.getClass().getMethods();
		StringBuffer ret = new StringBuffer(super.toString());
		ret.append(" = {\r\n");
		for (int i = 0; i < methods.length; i++) {
			try {
				String methodName = methods[i].getName();
				if (methodName.startsWith("get")) { // 只处理get方法

					// 过滤掉getClass和有参数的方法
					Class<?> declarClass = methods[i].getDeclaringClass();
					Constructor<?>[] constructor = declarClass.getConstructors();
					if (constructor.length == 0 || declarClass.isInterface()) {
						continue; // 如果是接口或抽象类的话则自动跳过
					}

					// 过滤掉getClass和有参数的方法
					if (methodName.equals("getClass")
							|| methods[i].getParameterTypes().length > 0) {
						continue;
					}

					String tmp = methodName.trim().substring(3);
					tmp = tmp.substring(0, 1).toLowerCase() + tmp.substring(1);
					ret.append("\t").append(tmp).append(" = ").append(
							methods[i].invoke(this, new Object())).append("\r\n");
				}
			} catch (Exception ex) {
				logger.error("toString:" + ex);
				continue;
			}
		}
		ret.append("}\r\n");
		return ret.toString();
	}

	/**
	 * 重载Object的equals函数
	 * 
	 * @param obj
	 * @return
	 */
	public boolean equals(Object obj) {
		if (obj == null) {
			return false;
		}
		if (this == obj) {
			return true;
		}
		if (!obj.getClass().equals(getClass())) {
			return false;
		}

		Method[] methods = this.getClass().getMethods();
		Field[] fields = this.getClass().getFields();
		boolean flag = true;

		for (int i = 0; flag && i < methods.length; i++) {
			try {
				String methodName = methods[i].getName();
				if (methodName.startsWith("get")) { // 只处理get方法
					// 过滤掉getClass和有参数的方法
					Class<?> declarClass = methods[i].getDeclaringClass();
					Constructor<?> [] constructor = declarClass.getConstructors();
					if (constructor.length == 0 || declarClass.isInterface()) {
						continue; // 如果是接口或抽象类的话则自动跳过
					}					
					
					if (methodName.equals("getClass")
							|| methods[i].getParameterTypes().length > 0) {
						continue;
					}
					//String tmp = methodName.trim().substring(3);
					Object proObj1 = methods[i].invoke(this, new Object());
					Object proObj2 = methods[i].invoke(obj, new Object());
					if (proObj1 != null) {
						flag = (proObj1).equals(proObj2);
					} else if (proObj2 != null) {
						flag = (proObj2).equals(proObj1);
					}
				}
			} catch (Exception ex) {
				logger.error("equals:" + ex);
				continue;
			}
		}
		
		for (int i = 0; flag && i < fields.length; i++) {
			try {
				Object fields1 = fields[i].get(this);
				Object fields2 = fields[i].get(obj);
				if (fields1 != null) {
					flag = (fields1).equals(fields2);
				} else if (fields2 != null) {
					flag = (fields2).equals(fields1);
				}
			} catch (Exception ex) {
				logger.error("equals:" + ex);
				continue;
			}
		}

		return flag;
	}

	/**
	 * 把自己的对外属性封装成一个HashMap返回
	 * 键:小写的属性名称 值:该属性对应的值
	 * 这成为一种规范.
	 */
	public HashMap<String, Object> toHashmap() {
		HashMap<String, Object> hashMap = new HashMap<String, Object>();
		Method[] methods = this.getClass().getMethods();
		Field[] fields = this.getClass().getFields();
		boolean flag = true;
		for (int i = 0; flag && i < methods.length; i++) {
			try {
				String methodName = methods[i].getName();
				if (methodName.startsWith("get")) { // 只处理get方法
					// 过滤掉getClass和有参数的方法
					Class<?> declarClass = methods[i].getDeclaringClass();
					Constructor<?>[] constructor = declarClass.getConstructors();
					if (constructor.length == 0 || declarClass.isInterface()) {
						continue; // 如果是接口或抽象类的话则自动跳过
					}					
					
					if (methodName.equals("getClass")
							|| methods[i].getParameterTypes().length > 0) {
						continue;
					}
					String tmp = methodName.trim().substring(3).toLowerCase();
					Object obj = methods[i].invoke(this, new Object());
					hashMap.put(tmp, obj);
				}
			} catch (Exception ex) {
				logger.error("toHashmap:" + ex);
				continue;
			}
		}

		for (int i = 0; flag && i < fields.length; i++) {
			try {
				String tmp = fields[i].getName().toLowerCase();
				Object obj = fields[i].get(this);
				hashMap.put(tmp, obj);
			} catch (Exception ex) {
				logger.error("toHashmap:" + ex);
				continue;
			}
		}
		return hashMap;
	}
}