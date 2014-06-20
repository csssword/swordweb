package com.css.sword.platform.comm.util.sequence;


/**
 * 这是??个抽象常量类，记录Sequence的所有可能的格式种类
 *
 * <p>Title: SequenceFormats</p>
 * <p>Description: 广东地税大集中项目新??代税收征管信息系??</p>
 * <p>Copyright: Copyright (c) 2003  广东省地方税务局、中软网络技术股份有限公??</p>
 * <p>Company: 中软网络??术股份有限公??</p>
 * @author 朱宇??
 * @version 1.0
 *
 * History:
 *   author   Date        Description
 *   朱宇??   2003-09-01  增加了几个格??
 *   朱宇??   2003-10-03  增加了formatToString16Bit
 */
public abstract class SequenceFormats {
    /**
     * 格式化为String (8??)
     * sequence值转化为字符串前面补??0??
     */
    public static final String STR_8SEQ_L0 = "STR_8SEQ_L0";


    /**
     * 将sequence值转化为16位字符串，不??16位前面补??0??
     */
    public static final String STR_16SEQ_L0 = "STR_16SEQ_L0";


    /**
     * 格式化为String(3)
     * sequence值转化为字符串前面补??0??
     */
    public static final String STR_3SEQ_L0 = "STR_3SEQ_L0";

    /**
     * 格式化为long
     * （年??4位）＋月??2位））??10000000000＋sequence??
     */
    public static final String LONG_YYYYMM_10SEQ_L0 = "LONG_YYYYMM_10SEQ_L0";

    /**
     * 格式化为number
     * 1000000000+sequence??(0->999999999)
     */
    public static final String LONG_1_9SEQ_L0 = "LONG_1_9SEQ_L0";

    /**
     * 跟FORMAT_LONG相同，但前加多一位辨别码
     * ??'1'+年（4位）＋月??2位））??1000000000＋sequence??
     */
    public static final String LONG_1YYYYMM_9SEQ_L0 = "LONG_1YYYYMM_9SEQ_L0";
    /**
     * 跟FORMAT_LONG相同，但前加多一位辨别码
     * ??'2'+年（4位）＋月??2位））??1000000000＋sequence??
     */
    public static final String LONG_2YYYYMM_9SEQ_L0 = "LONG_2YYYYMM_9SEQ_L0";

    /**
     * 跟FORMAT_LONG相同，但前加多一位辨别码
     * ??'3'+年（4位）＋月??2位））??1000000000＋sequence??
     */
    public static final String LONG_3YYYYMM_9SEQ_L0 = "LONG_3YYYYMM_9SEQ_L0";

    /**
     * 跟FORMAT_LONG相同，但前加多一位辨别码
     * ??'4'+年（4位）＋月??2位））??1000000000＋sequence??
     */
    public static final String LONG_4YYYYMM_9SEQ_L0 = "LONG_4YYYYMM_9SEQ_L0";

    /**
     * 格式化为String
     * 发票仓库代码??13位）加上sequence的???（8位，转为字符串）
     */
    public static final String STR_8SEQ_LO = "STR_8SEQ_L0";

    /**
     *直接返回LONG型的Sequence??
     */
    public static final String LONG_SEQ = "LONG_SEQ";

    /**
     * 直接把Sequence转化成字符串返回
     */
    public static final String STR_SEQ = "STR_SEQ";


    /**
     * （年??4位）??+加上sequence的???（16位，转为字符串补??0”）
     */
    public static final String STR_YYYY_16SEQ_L0 = "STR_YYYY_16SEQ_L0";

    public static final String STR_1_4SEQ_L0 = "STR_1_4SEQ_L0";

    public static final String STR_1_10SEQ_L0 = "STR_1_10SEQ_L0";
	public static final String STR_1_9SEQ_L0 = "STR_1_9SEQ_L0";
}