package com.css.sword.platform.web.controller;

import java.lang.annotation.Annotation;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import com.css.sword.kernel.base.component.ISwordClassScannerListener;
import com.css.sword.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.kernel.utils.SwordLogUtils;
import com.css.sword.platform.web.controller.annotations.CTRL;

/**
 * 金税三期工程核心征管及应用总集成项目
 * <p>
 * com.css.sword.platform.web.controller
 * <p>
 * File: CtrlClassScanner.java 创建时间:2011-9-15下午1:39:46
 * </p>
 * <p>
 * Title: Ctrl类扫描器
 * </p>
 * <p>
 * Description: 使用新的Sword类扫描器框架，发现Ctrl
 * </p>
 * <p>
 * Copyright: Copyright (c) 2011 中国软件与技术服务股份有限公司
 * </p>
 * <p>
 * Company: 中国软件与技术服务股份有限公司
 * </p>
 * <p>
 * 模块: 平台架构
 * </p>
 * 
 * @author 张久旭
 * @version 1.0
 * @history 修订历史（历次修订内容、修订人、修订时间等）
 */
public class CtrlClassScanner implements ISwordClassScannerListener {
	private static final SwordLogUtils logger = SwordLogUtils.getLogger(CtrlClassScanner.class);
	public static Map<String, String> ctrlMap = new ConcurrentHashMap<String, String>();;

	public Class<? extends Annotation> registerAnnotation(Map<String,String> parameter) {
		return CTRL.class;
	}

	public void process(Class<?> clazz) throws SwordBaseCheckedException {
		CTRL ctrl = clazz.getAnnotation(CTRL.class);
		String name = ctrl.value();
		ctrlMap.put(name, clazz.getName());
		logger.info("扫描到CTRL=[" + clazz.getName() + "]");
	}

}
