package com.css.sword.platform.web.comm;

/**
 * 验证信息工具类
 * <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.comm<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> ValidateHelper.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 * 
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class ValidateHelper {

    public static boolean judegString(String s) {
        if (s == null || "".equals(s)) return false;
        else return true;
    }

    public static void judegString(String name, String s) {
        if (s == null || "".equals(s)) {
            throw new RuntimeException(name + " can not be null or '' !");
        }
    }


}