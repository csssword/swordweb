package com.css.sword.platform.comm.filetemplet;

import java.util.List;

import com.css.sword.platform.comm.exception.CSSBaseRuntimeException;
/**
 * <p>Title: </p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

public class FileTempletException extends CSSBaseRuntimeException{

	private static final long serialVersionUID = 4024118715801869710L;

	public FileTempletException(String resCode) {
        super(resCode);
    }

    public FileTempletException(String resCode, Throwable ex) {
        super(resCode, ex);
    }

    public FileTempletException(String resCode, List<String> params) {
        super(resCode, params);
    }

    public FileTempletException(String resCode, List<String> params, Throwable ex) {
        super(resCode, params, ex);
    }

    public FileTempletException(String resCode, String param1) {
        super(resCode, param1);
    }

    public FileTempletException(String resCode, String param1, Throwable ex) {
        super(resCode, param1, ex);
    }

    public FileTempletException(String resCode, String param1, String param2) {
        super(resCode, param1, param2);
    }

    public FileTempletException(String resCode, String param1, String param2,
                                Throwable ex) {
        super(resCode, param1, param2, ex);
    }
}