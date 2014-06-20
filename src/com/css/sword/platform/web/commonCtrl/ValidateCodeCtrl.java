package com.css.sword.platform.web.commonCtrl;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Random;

import javax.servlet.http.HttpServletRequest;

import com.css.sword.platform.web.context.ContextAPI;
import com.css.sword.platform.web.mvc.SwordDataSet;
import com.css.sword.platform.web.mvc.beans.AttrBean;
import com.css.sword.platform.web.mvc.dataobjects.ReqDataObject;

/**
 * 生成验证码公共类
 * <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.commonCtrl<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> ValidateCodeCtrl.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author zhangbin <br>
 * @since Sword 4.0.0<br>
 */
public class ValidateCodeCtrl {

    public static final String chose ="1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    /**
     * 生成验证码
     */
    public void genValidateCode() {

        String code = this.getCodeKey();
		Random random = new Random();
		int length = Integer.parseInt(ContextAPI.getReqDataSet().getAttr(code).toString());
		List<String> list = new ArrayList<String>(length);
        StringBuffer str = new StringBuffer("");
		for(int i=0;i<length;i++){
            char c = chose.charAt(random.nextInt(chose.length()));
			list.add("'"+c+"'");
            str.append(c);
		}
        HttpServletRequest request = ContextAPI.getReq();
        request.getSession().setAttribute(code,str.toString());
        ContextAPI.getResDataSet().addAttr(code, list);
    }

    /**
     * 验证 验证码
     */
    public void validateCode(){
        String code = this.getCodeKey();
        String validateCode = ContextAPI.getReqDataSet().getAttr(code).toString();
        HttpServletRequest request = ContextAPI.getReq();
        String vc = request.getSession().getAttribute(code)+"";
        ContextAPI.getResDataSet().addAttr(code, vc.equals(validateCode));
    }

    public String getCodeKey(){
        ReqDataObject dataObject = ((SwordDataSet) ContextAPI.getReqDataSet()).getReqDataObject();
        String code = "validateCode";
        if (dataObject != null) {
            for (Iterator<Map.Entry<String, Object>> it = dataObject.getViewData().entrySet()
                    .iterator(); it.hasNext();) {
                Map.Entry<String, Object> mp = it.next();
                if (mp.getValue() instanceof AttrBean) {
                    code = mp.getKey();
                    break;
                }
            }
        }
        return code;
    }

}
