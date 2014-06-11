package com.css.ctp.web.comm;

import junit.framework.TestCase;

/**
 * 测试框架基类
 * 
 * @author 张久旭
 * 
 */
public abstract class BaseTestCase extends TestCase {

	static {
		try {
			new DeveloperServer().start(false);
		} catch (Exception ex) {
			System.out.println("本地开发服务器启动失败");
			ex.printStackTrace();
			System.exit(-1);
		}
	}

}
