/* Generated by Together */

package com.css.sword.platform.comm.filetemplet.tempfile;

import java.util.Iterator;

/**
 *
 * <p>Title: </p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */
public class StringTempFile
    extends AbsTempFile {
    public Object getTempContent() {
        String result = "";
        for (Iterator<?> iter = this.getContentList().iterator(); iter.hasNext(); ) {
            result += iter.next();
        }
        return result;
    }
}