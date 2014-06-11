package com.css.sword.platform.web.mvc;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

public class BuildSuperClass implements Serializable {

	private static final long serialVersionUID = 989252069386956400L;
	protected List<Class<?>> interfaceByClass = new CopyOnWriteArrayList<Class<?>>();
	protected transient List<Field> annotationFields = new CopyOnWriteArrayList<Field>();

	private void buildField(Object obj) throws IllegalArgumentException,
			IllegalAccessException {

		Class<?> clazz = obj.getClass();
		if (annotationFields == null)
			annotationFields = new CopyOnWriteArrayList<Field>();
		else
			annotationFields.clear();
//		Field[] itselfField = clazz.getDeclaredFields();

//		annotationFields.addAll(Arrays.asList(itselfField));

		traverseClass(clazz);
		for (Class<?> clz : interfaceByClass) {
			Field[] fields = clz.getDeclaredFields();
			annotationFields.addAll(Arrays.asList(fields));
			
//			for (Field field : fields) {
//				AddJson json = field.getAnnotation(AddJson.class);
//				if (json != null) {
//					annotationFields.add(field);
//				}
//			}
//
//			Annotation[] annotations = clz.getDeclaredAnnotations();
//			for (Annotation anno : annotations) {
//				if (AddJson.class.isAssignableFrom(anno.annotationType())) {
//					Field[] clazzFields = clz.getDeclaredFields();
//					annotationFields.addAll(Arrays.asList(clazzFields));
//				}
//			}
		}
	}

	public Method getMethod(String fieldGetterName, Object obj) {
		Class<?> clz = obj.getClass();
		interfaceByClass.clear();
		traverseClass(clz);
		Method method;
		try {
			method = clz.getMethod(fieldGetterName, new Class[0]);
			if (method == null) {
				for (Class<?> clazz : interfaceByClass) {
					method = clazz.getMethod(fieldGetterName, new Class[0]);
				}
			}
			return method;
		} catch (SecurityException e) {
			throw new RuntimeException(e);
		} catch (NoSuchMethodException e) {
//			throw new RuntimeException(e);
			return null;
		}
	}

	public Method getDeclaredMethod(Object obj, String getMethod) {
		interfaceByClass.clear();
		traverseClass(obj.getClass());
		Class<?> clz = obj.getClass();
		Method method = null;
		try {
			method = clz.getDeclaredMethod(getMethod, new Class[0]);
			return method;
		} catch (Exception e) {
			for (Class<?> clazz : interfaceByClass) {
				try {
					method = clazz.getDeclaredMethod(getMethod, new Class[0]);
				} catch (Exception e1) {
				}
			}
		}
		return method;
	}

	public Field getDeclaredField(String field, Class<?> clz) {
		interfaceByClass.clear();
		traverseClass(clz);
		Field clzField = null;
		try {
			clzField = clz.getDeclaredField(field);
		} catch (Exception e) {
			for (Class<?> clazz : interfaceByClass) {
				try {
					clzField = clazz.getDeclaredField(field);
				} catch (Exception e1) {
				}
			}
		}

		return clzField;
	}

	public Method getMethod(String name, Class<?> clz,
			Class<?>... parameterTypes) {
		interfaceByClass.clear();
		traverseClass(clz);
		Method method = null;

		try {
			method = clz.getMethod(name, parameterTypes);
			return method;
		} catch (Exception e) {
			for (Class<?> clazz : interfaceByClass) {
				try {
					method = clazz.getMethod(name, parameterTypes);
				} catch (Exception e1) {
				}
			}
		}
		return method;

	}

	public Field[] getAllFields(Object obj) throws IllegalArgumentException,
			IllegalAccessException {
		buildField(obj);
		return annotationFields.toArray(new Field[0]);
	}

	protected void traverseClass(Class<?> clazz) {
		if (clazz == null || clazz == Object.class) {
			return;
		}
		if (!interfaceByClass.contains(clazz)) {
			interfaceByClass.add(clazz);
		}
		// traverse superclass
		traverseClass(clazz.getSuperclass());
		Class<?>[] interfaces = clazz.getInterfaces();
		// traverse interfaces
		for (Class<?> intface : interfaces) {
			traverseClass(intface);
		}
	}

}
