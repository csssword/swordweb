package com.css.sword.platform.comm.util;

import java.io.ByteArrayInputStream;
import java.io.FileReader;
import java.io.LineNumberReader;

import com.css.sword.platform.comm.util.io.InputStreamResource;

/**
 * <p>Title: </p>
 * <p>Description: </p>
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 * @author wwq
 * @version 1.0
 */

public class TakeOutDTDCheckUtils {
    private TakeOutDTDCheckUtils() {
    }

    static public InputStreamResource getFileAsInputStream(String path) {
		//List al = new ArrayList();
        StringBuffer sb = new StringBuffer();
        try {
            LineNumberReader lnr = new LineNumberReader(new FileReader(getAbsolutePath()+path));
            while (lnr.ready()) {
                String line = lnr.readLine();
                if (!checkDTDLine(line)) {
                    sb.append(line + "\r\n");
                }
            }
            lnr.close();
        }
        catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }

        String utf8str = StringUtils.isoToUTF8(sb.toString());
        //System.out.println("新文件是：" + sb);
        ByteArrayInputStream is = new ByteArrayInputStream(utf8str.getBytes());

        InputStreamResource isr = new InputStreamResource(is,"",sb.length());
        return isr;

    }

    static private boolean checkDTDLine(String line) {
        if (line.startsWith("<!DOCTYPE"))
            return true;
        else
            return false;
    }

    static public String getAbsolutePath(){
        return Thread.currentThread().getContextClassLoader().getResource("").getPath();
    }
    public static void main(String[] args) {
        System.out.println(TakeOutDTDCheckUtils.getAbsolutePath());
    }
}