package com.css.sword.platform.comm.exception;

import java.io.PrintStream;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import com.css.sword.platform.comm.exception.helper.CSSExceptionHelper;

/**
 * <p>Title:CSSBaseRuntimeException </p>
 * <p>Description:运行时异常的基础类,其封装了异常返回码resCode，和返回码相关的参数params
 * 实现接口ICSSBaseException，用于操作resCode和params</p>
 * <p>Copyright: Copyright (c) 2009</p>
 * <p>Company: 中国软件与技术服务股份有限公司</p>
 * @author wwq
 * @version 1.0
 * @since 4.0
 */

public class CSSBaseRuntimeException extends RuntimeException
    implements ICSSBaseException {

	private static final long serialVersionUID = 769267092244034084L;

	/**
     * 聚合了helper类，用于管理返回码和参数
     */
    private CSSExceptionHelper helper = new CSSExceptionHelper();

    String content = "";

    /**
     * Nested Exception to hold wrapped exception.
     */
    private Throwable rootCause;
  

    public CSSBaseRuntimeException(String code) {
        super(code);
        helper.setCode(code);
        this.content = helper.getContent();
    }

    public CSSBaseRuntimeException(String code, Throwable ex) {
        super(code, ex);
        helper.setCode(code);
        helper.parseExceptionStackInfo(ex);
        this.content = helper.getContent();
    }

    public CSSBaseRuntimeException(String code, List<String> params) {
        super(code);
        helper.setCode(code);
        helper.addParam(params);
        this.content = helper.getContent();
    }

    public CSSBaseRuntimeException(String code, List<String> params, Throwable ex) {
        super(code, ex);
        helper.setCode(code);
        helper.addParam(params);
        helper.parseExceptionStackInfo(ex);
        this.content = helper.getContent();
    }
    
    public CSSBaseRuntimeException(String code, String param1, Throwable ex) {
        super(code, ex);
        helper.setCode(code);
        helper.addParam(param1);
        helper.parseExceptionStackInfo(ex);
        this.content = helper.getContent();
    }
    
    public CSSBaseRuntimeException(String code, String param1, String param2, Throwable ex) {
        super(code, ex);
        helper.setCode(code);
        helper.addParam(param1);
        helper.addParam(param2);
        helper.parseExceptionStackInfo(ex);
        this.content = helper.getContent();
    }
    
    public CSSBaseRuntimeException(String code, String param1) {
        super(code);
        helper.setCode(code);
        helper.addParam(param1);
        this.content = helper.getContent();
    }
    
    public CSSBaseRuntimeException(String code, String param1, String param2) {
        super(code);
        helper.setCode(code);
        helper.addParam(param1);
        helper.addParam(param2);
        this.content = helper.getContent();
    }
    
    public Throwable getRootCause() {
        return rootCause;
    }

    public void setRootCause(Throwable newRootCause){
        this.rootCause = newRootCause ;
    }

    /**
     * Returns the detail message, including the message from the nested
     * exception if there is one.
     */
    public String getMessage() {
        if (rootCause == null) {
            return super.getMessage()+"\t\n参数是:"+getParam();
        } else {
            return super.getMessage() + "; --->嵌套异常: \n\t" +
                rootCause.getMessage() +"\t\n参数是:"+getParam();
        }
    }

    /**
     * Prints the composite message and the embedded stack trace to
     * the specified stream <code>ps</code>.
     * @param ps the print stream
     */
    public void printStackTrace(PrintStream ps) {
        if (rootCause == null) {
            super.printStackTrace(ps);
        } else {
            ps.println(this);
            rootCause.printStackTrace(ps);
        } 
    }

    /**
     * Prints the composite message and the embedded stack trace to
     * the specified print writer <code>pw</code>
     * @param pw the print writer
     */
    public void printStackTrace(PrintWriter pw) {
        if (rootCause == null) {
            super.printStackTrace(pw);
        } else {
            pw.println(this);
            rootCause.printStackTrace(pw);
        }
    }

    /**
     * Prints the composite message to <code>System.err</code>.
     */
    public void printStackTrace() {
        printStackTrace(System.err);
    }

    public ICSSBaseException addParam(String param) {
    	CSSExceptionHelper helperTmp = new CSSExceptionHelper();
    	helperTmp.setCode(helper.getCode());
    	List<String> params = this.helper.getParam();
    	if(params == null){
    		params = new ArrayList<String>();
    	}
    	params.add(param);
    	helperTmp.addParam(params);
    	
        String tmp = helper.getContent();
        this.helper = helperTmp;
        this.content = tmp;
        return this ;
    }

    public ICSSBaseException addParam(List<String> params) {
    	CSSExceptionHelper helperTmp = new CSSExceptionHelper();
    	helperTmp.setCode(helper.getCode());
    	helperTmp.addParam(params);
    	
        String tmp = helperTmp.getContent();
        this.helper = helperTmp;
        this.content = tmp;
        return this ;
    }
    
    public List<?> getParam() {
        return helper.getParam();
    }

    public void cleanParam() {
        helper.cleanParam();
    }

    public String getCode() {
        return helper.getCode();
    }

    public void setCode(String code) {
        helper.setCode(code);
    }

    public String getContent() {
        return helper.getContent();
    }

    public String getExceptionStackInfo(){
    	return this.helper.getExceptionStackInfo();
    }
}