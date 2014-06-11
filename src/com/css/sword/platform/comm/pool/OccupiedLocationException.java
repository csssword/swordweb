package com.css.sword.platform.comm.pool;

/**
 * <p>Title: </p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

public class OccupiedLocationException extends PoolException{

	private static final long serialVersionUID = -2558929808161001935L;

	public OccupiedLocationException(String resCode, String param1) {
        super(resCode, param1);
    }
}