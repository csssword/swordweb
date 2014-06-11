package com.css.sword.platform.comm.util;


/**
 *
 * <p>Title: RefUtils</p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 中软网络技术股份有限公司</p>
 * @author 于英民
 * @version 1.0
 */
public class RefUtils {

    private RefUtils() {
    }

    /**
     * 得到传入参数的具体类型
     *
     * @param orb：Object
     * @return 参数的具体类型
     */
    public static String getDataType(Object obj) {
        if (obj == null) {
            return null;
        }

        String type = obj.getClass().getName();

        int pos = type.lastIndexOf(".");
        if (pos >= 0) {
            type = type.substring(pos + 1);
        }

        return type;

    }

}
