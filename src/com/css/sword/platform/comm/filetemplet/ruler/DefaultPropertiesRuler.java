package com.css.sword.platform.comm.filetemplet.ruler;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.css.sword.platform.comm.filetemplet.FileTempletException;
import com.css.sword.platform.comm.filetemplet.ITempFile;
import com.css.sword.platform.comm.filetemplet.tempfile.StringTempFile;

/**
 * <p>
 * Title: 当前参数应该是Map
 * </p>
 * <p>
 * Description:
 * </p>
 * <p>
 * Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司
 * </p>
 * <p>
 * Company: 应用产品研发中心
 * </p>
 * 
 * @author wwq
 * @version 1.0
 */
public class DefaultPropertiesRuler extends AbsRuler {

	/**
	 * 根据模板和参数返回客户端处理完的内容
	 * 
	 * @param tempfile
	 * @return
	 */
	public Object make(ITempFile tempfile) {
		Map<?, ?> templet = null;
		try {
			templet = (Map<?, ?>) tempfile.getTempContent();
		} catch (java.lang.ClassCastException ex) {
			throw new FileTempletException("703",
					DefaultPropertiesRuler.class.getName(), tempfile.getClass()
							.getName());
		}

		Map<String, Object> result = new HashMap<String, Object>();

		for (Iterator<?> iter = getMyParams().keySet().iterator(); iter
				.hasNext();) {
			String pname = (String) iter.next();
			if (templet.containsKey(pname)) {
				result.put(
						pname,
						dealWithStringRuler((String) templet.get(pname),
								getMyParams().get(pname)));
			}
		}
		return result;
	}

	public Object dealWithStringRuler(String templet, Object params) {
		if (List.class.isAssignableFrom(params.getClass())) {
			// debug("参数是List型");
			ITempFile tf = new StringTempFile();
			List<String> contents = new ArrayList<String>();
			contents.add(templet);
			tf.setContentList(contents);

			DefaultStringRulerList rlp = new DefaultStringRulerList();
			rlp.setParams((List<?>) params);
			return rlp.make(tf);

		} else if (Map.class.isAssignableFrom(params.getClass())) {
			ITempFile tf = new StringTempFile();
			List<String> contents = new ArrayList<String>();
			contents.add(templet);
			tf.setContentList(contents);

			DefaultStringRulerMap rmp = new DefaultStringRulerMap();
			rmp.setParams((Map<?, ?>) params);
			return rmp.make(tf);

		} else {
			throw new FileTempletException("702", params.getClass().getName());
		}

	}

	public Map<?, ?> getMyParams() {
		try {
			return (Map<?, ?>) getParams();
		} catch (java.lang.ClassCastException ex) {
			throw new FileTempletException("704",
					DefaultPropertiesRuler.class.getName(), getParams()
							.getClass().getName());
		}
	}

	public static void main(String[] args) {
		DefaultPropertiesRuler aaa = new DefaultPropertiesRuler();
		System.out.println("1---->传入LIst");
		aaa.dealWithStringRuler(null, new ArrayList<Object>());
		System.out.println("2---->传入Map");
		aaa.dealWithStringRuler(null, new HashMap<Object, Object>());
		System.out.println("3---->传入其他");
	}
}