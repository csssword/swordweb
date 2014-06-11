package com.css.sword.platform.comm.lc;

import java.util.List;

import com.css.sword.platform.comm.exception.CSSBaseRuntimeException;

/**
 * @author lfw
 * @since 4.0 2009-04-09
 */
public class CSSLcException extends CSSBaseRuntimeException {

	private static final long serialVersionUID = -117958943503127630L;

	public CSSLcException(String code) {
        super(code);
    }

    public CSSLcException(String code, Throwable ex) {
        super(code, ex);
    }

    public CSSLcException(String code, List<String> params) {
        super(code, params);
    }

    public CSSLcException(String code, List<String> params, Throwable ex) {
        super(code, params, ex);
    }

}
