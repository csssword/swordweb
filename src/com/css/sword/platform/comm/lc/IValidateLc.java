package com.css.sword.platform.comm.lc;

/**
 * Created by IntelliJ IDEA.
 * User: liuzhy
 * Date: 2008-7-25
 * Time: 14:52:44
 * To change this template use File | Settings | File Templates.
 */
public interface IValidateLc {
     public String msg = "\r\n"
        	+ "+----------------------------------------------------------+\r\n"
        	+ "+ 重要信息提示!!!!                                            \r\n"
            + "+ 系统中没有授权可以运行的模块,请和软件销售商联系            \r\n"
            + "+----------------------------------------------------------+\r\n";
     public String checkLicense() throws CSSLcException;


     public String getErrorMsg() throws CSSLcException;
}
