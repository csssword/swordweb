package com.css.sword.platform.comm.pool;

/**
 * <p>Title: PoolException</p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

import java.util.List;

import com.css.sword.platform.comm.exception.CSSBaseRuntimeException;

public class PoolException extends CSSBaseRuntimeException {

	private static final long serialVersionUID = -5894178392384941082L;

	public PoolException(String resCode) {
		super(resCode);
	}

	public PoolException(String resCode, Throwable ex) {
		super(resCode, ex);
	}

	public PoolException(String resCode, List<String> params) {
		super(resCode, params);
	}

	public PoolException(String resCode, List<String> params, Throwable ex) {
		super(resCode, params, ex);
	}

	public PoolException(String resCode, String param1) {
		super(resCode, param1);
	}

	public PoolException(String resCode, String param1, Throwable ex) {
		super(resCode, param1, ex);
	}

	public PoolException(String resCode, String param1, String param2) {
		super(resCode, param1, param2);
	}

	public PoolException(String resCode, String param1, String param2,
			Throwable ex) {
		super(resCode, param1, param2, ex);
	}
}