package com.css.sword.platform.comm.lc;


/**
 * Created by IntelliJ IDEA.
 * User: liuzhy
 * Date: 2008-7-25
 * Time: 13:31:39
 * description:保存平台加密信息,一个产品编码，一个版本号
 * To change this template use File | Settings | File Templates.
 */
public class LcInfo {

    private String productCode = null;

    private String productVersion = null;

    private static LcInfo context = null;

    //产品的编码
    private static final char[] bm = {'S','w','o','r','d','S','P','I'};
    //产品的版本号
    private static final char[] version = {'v','4','.','0','.','0'};

    /**
     * 静态方法, 单例模式接口,返回 LicenseInfo 实例
     *
     * @return context
     */
    public static LcInfo singleton() {
        if (context == null) {
            context = new LcInfo();
            //String pc = (String) ConfManager.getValueByKey(new String(LicenseInfo.pc));
            //产品编码 在类内部定义，配置文件配置项失效。
            String pc = new String(LcInfo.bm);
            String pv = new String(LcInfo.version);
            if (pc != null && pv != null) {
                context.productCode = pc;
                context.productVersion = pv;
            }
        }
        return context;
    }

    public String getProductCode() {
        return this.productCode;
    }

    public String getProductVersion() {
        return this.productVersion;
    }

    /**
     * 私有构造器
     */
    private LcInfo() {

    }
}