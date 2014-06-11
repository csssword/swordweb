package com.css.sword.platform.comm.exception;

import java.util.List;

/**
 * <p>Title: CSSFrameworkCheckedException</p>
 * <p>Description: 系统已检查异常父类（必须捕捉进行处理）</p>
 * <p>Copyright: Copyright (c) 2009</p>
 * <p>Company: 中国软件与技术服务股份有限公司</p>
 * @author wwq
 * @version 4.0
 * @since 4.0
 */

public class CSSFrameworkCheckedException extends CSSBaseCheckedException {

	private static final long serialVersionUID = -3181613337965136931L;

	public CSSFrameworkCheckedException(String code) {
        super(code);
    }

    public CSSFrameworkCheckedException(String code, Throwable ex) {
        super(code, ex);
    }

    public CSSFrameworkCheckedException(String code, List<String> params) {
        super(code, params);
    }

    public CSSFrameworkCheckedException(String code, List<String> params, Throwable ex) {
        super(code, params, ex);
    }
}