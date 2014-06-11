package com.css.sword.platform.comm.filetemplet;

import java.util.Map;

/**
 * <p>Title: </p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

public class FileTempletManager {
    public static final String FILETEMPLET_NAME = "filetemplet";
    private FileTempletManager() {
    }

    public static Object getContent(String tfkey, Map<?,?> params) {
//        FileTempletFactory ftf = (FileTempletFactory) IocFactoryWrapper.
//            getInstance().getBean(FILETEMPLET_NAME, tfkey); //tfkey = "exception"
//        
//        return ftf.getContent(params);
        return FileTempletFactory.sigleton().getContent(params);
    }

}