package com.css.sword.platform.comm.filetemplet.ruler;

import com.css.sword.platform.comm.filetemplet.IRuler;
/**
 * <p>Title: </p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

abstract public class AbsRuler
    implements IRuler {
private Object params;
    public Object getParams() {
        return params;
    }
    public void setParams(Object params) {
        this.params = params;
    }
}