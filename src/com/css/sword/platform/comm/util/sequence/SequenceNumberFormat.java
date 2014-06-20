package com.css.sword.platform.comm.util.sequence;

import java.util.Calendar;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

/**
 * 把SequenceNumber实例变量格式化为某种格式返回??
 *
 * <p>Title: SequenceNumberFormat</p>
 * <p>Description: 广东地税大集中项目新??代税收征管信息系??</p>
 * <p>Copyright: Copyright (c) 2003  广东省地方税务局、中软网络技术股份有限公??</p>
 * <p>Company: 中软网络??术股份有限公??</p>
 * @author 朱宇??
 * @version 1.0
 *
 * History
 *   Author     Date         Description
 *   朱宇??     2003-09-01   增加了几个格??
 *   朱宇??     2003-10-03   增加formatToString16Bit()
 */

public class SequenceNumberFormat {
    @SuppressWarnings("unused")
	private static final String DATE_FORMAT = "yyyyMMdd";
    private static final long LONG_FORMAT = 10000000000L;
    private static final long NUMBER_FORMAT = 1000000000L;
    private static final long LONG2_FORMAT = 1000000000L;
    
    private final static LogWritter logger = LogFactory.getLogger(SequenceNumberFormat.class);

    private SequenceNumberFormat() {
    }

    /**
     * 把SequenceNumber类格式化成long的形??
     * 格式如下:
     *     （年??4位）＋月??2位））??10000000000＋sequence值，??16??
     *
     * @param seqNum ??要进行格式化的SequenceNumber??
     * @return Long 格式化返回的结果
     */
    //public static Long formatToLong(SequenceNumber seqNum) {
    public static Long formatToLONG_YYYYMM_10SEQ_L0(SequenceNumber seqNum) {
        //modified by ywh 2003.10.23 begin
        /*
        long result;
        StringBuffer temp;

        temp = new StringBuffer(new SimpleDateFormat(DATE_FORMAT).format(new
            Date(seqNum.getDate())));
        temp.delete(temp.length() - 2, temp.length());

        result = Long.valueOf(temp.toString()).longValue();
        result *= LONG_FORMAT;
        result += seqNum.getSequence();
        return new Long(result);
        */
        Calendar cal  = seqNum.getDate();
        int year = cal.get(Calendar.YEAR);    //取得年份
        int month = cal.get(Calendar.MONTH) + 1;  //取得月份，Calendar的月份以0????
        long seq = seqNum.getSequence();
        long rtn = ( year * 100 + month ) * LONG_FORMAT + seq;
        return new Long(rtn);
        //modified by ywh 2003.10.23 end
    }

    /**
     * 把SequenceNumber类格式化??8位的String的形??
     * 格式如下:
     *     sequence值转化为字符??(8??)前面补???0??
     *
     * @param seqNum ??要进行格式化的SequenceNumber??
     * @return String 格式化返回的结果
     */
    //public static String formatToString(SequenceNumber seqNum) {
    public static String formatToSTR_8SEQ_L0(SequenceNumber seqNum) {
        return formatToStringWithLength(seqNum, 8);
    }
    /**
     * 把SequenceNumber类格式化??4位的String的形??
     * 格式如下:首位??1，后跟sequence值转化为字符??(4??)前面补???0??
     * @param seqNum ??要进行格式化的SequenceNumber??
     * @return String 格式化返回的结果
     */
    public static String formatToSTR_1_4SEQ_L0(SequenceNumber seqNum) {
        return "1" + formatToStringWithLength(seqNum, 4);
    }

    /**
     * 把SequenceNumber类格式化??11位的String的形??
     * 格式如下:首位??1，后跟sequence值转化为字符??(10??)前面补???0??
     * @param seqNum ??要进行格式化的SequenceNumber??
     * @return String 格式化返回的结果
     */
    public static String formatToSTR_1_10SEQ_L0(SequenceNumber seqNum) {
        return "1" + formatToStringWithLength(seqNum, 10);
    }
    /**
     * 把SequenceNumber类格式化??10位的String的形??
     * 格式如下:首位??1，后跟sequence值转化为字符??(9??)前面补???0??
     * @param seqNum ??要进行格式化的SequenceNumber??
     * @return String 格式化返回的结果
     */
    public static String formatToSTR_1_9SEQ_L0(SequenceNumber seqNum) {
        return "1" + formatToStringWithLength(seqNum, 9);
    }

    /**
     * 把SequenceNumber类格式化??8位的String的形??
     * 格式如下:
     *     sequence值转化为字符??(8??)前面补???0??
     *
     * @param seqNum ??要进行格式化的SequenceNumber??
     * @return String 格式化返回的结果
     */
    //public static String formatToString3Bit(SequenceNumber seqNum) {
    public static String formatToSTR_3SEQ_L0(SequenceNumber seqNum) {
        return formatToStringWithLength(seqNum, 3);
    }

    /**
     * 直接把Sequence转化成字符串返回
     */
    //public static String formatToSeqString(SequenceNumber seqNum) {
    public static String formatToSTR_SEQ(SequenceNumber seqNum) {
        return "" + seqNum.getSequence();
    }

    /**
     * 把SequenceNumber类格式化??16位的String的形??
     * 格式如下:
     *     sequence值转化为字符??(16??)前面补???0??
     *
     * @param seqNum ??要进行格式化的SequenceNumber??
     * @return String 格式化返回的结果
     */
    //public static String formatToString16Bit(SequenceNumber seqNum) {
    public static String formatToSTR_16SEQ_L0(SequenceNumber seqNum) {
        return formatToStringWithLength(seqNum, 16);
    }

    /**
     * 把SequenceNumber类格式化成固定长度的字符串，长度不足前面补充??
     * @param seqNum ??要进行格式化的SequenceNumber??
     * @return String 格式化返回的结果
     */
    private static String formatToStringWithLength(SequenceNumber seqNum,
                                                   int length) {
        StringBuffer result = new StringBuffer("");
        //modified by ywh begin 2003.10.23
        long lNum = seqNum.getSequence();
        String strNum = String.valueOf(lNum);
        int zeroCount = length - strNum.length(); //计算??要补充的0的个数???
        if(zeroCount < 0 ){
            logger.error("Sequence号错误：超出最大范围 " +
                                (-zeroCount) + "最大范围");
            return null;
        }
        for (int i = 0; i < zeroCount; i++) {
            result.append("0");
        }
        result.append(strNum);
        return result.toString();

        //String tmp = "" + seqNum.getSequence();
        //for (int i = 0; i < (length - tmp.length()); i++) {
        //    result.append("0");
        //}

        //return new String(result.append(tmp));
        //modified by ywh 2003.10.23 end

    }

    /**
     * 把SequenceNumber类格式化成Long的形??
     * 格式如下:
     *     1000000000+sequence??(0->999999999)
     *
     * @param seqNum ??要进行格式化的SequenceNumber??
     * @return Long 格式化返回的结果
     */
    //public static Long formatToNumber(SequenceNumber seqNum) {
    public static Long formatToLONG_1_9SEQ_L0(SequenceNumber seqNum) {
        long result;
        result = seqNum.getSequence();
        result += NUMBER_FORMAT;
        return new Long(result);
    }

    /**
     * 发票仓库代码??13位）加上sequence的???（8位，转为字符串）
     */

    public static String formatToStringWith21Bit(SequenceNumber seqNum) {
       return formatToStringWithLength(seqNum, 8);
    }

    /**
     * ??'1'+年（4位）＋月??2位））??1000000000＋sequence??
     */
    //public static Long formatToLongBeginWith1(SequenceNumber seqNum) {
    public static Long formatToLONG_1YYYYMM_9SEQ_L0(SequenceNumber seqNum) {
        return formatToLongWithParm(seqNum, "1");
    }

    /**
     * ??'2'+年（4位）＋月??2位））??1000000000＋sequence??
     */
    //public static Long formatToLongBeginWith2(SequenceNumber seqNum) {
    public static Long formatToLONG_2YYYYMM_9SEQ_L0(SequenceNumber seqNum) {
        return formatToLongWithParm(seqNum, "2");
    }

    /**
     * ??'3'+年（4位）＋月??2位））??1000000000＋sequence??
     */
    //public static Long formatToLongBeginWith3(SequenceNumber seqNum) {
    public static Long formatToLONG_3YYYYMM_9SEQ_L0(SequenceNumber seqNum) {
        return formatToLongWithParm(seqNum, "3");
    }

    /**
     * ??'4'+年（4位）＋月??2位））??1000000000＋sequence??,??16??
     */
    //public static Long formatToLongBeginWith4(SequenceNumber seqNum) {
    public static Long formatToLONG_4YYYYMM_9SEQ_L0(SequenceNumber seqNum) {
        return formatToLongWithParm(seqNum, "4");
    }

    private static Long formatToLongWithParm(SequenceNumber seqNum,
                                             String begin) {
        //modified by ywh 2003.10.23 begin
        /*
        long result;
        StringBuffer temp;

        temp = new StringBuffer(begin);
        temp = temp.append(new StringBuffer(new SimpleDateFormat(DATE_FORMAT).
                                            format(new
            Date(seqNum.getDate()))));
        temp.delete(temp.length() - 2, temp.length());

        result = Long.valueOf(temp.toString()).longValue();
        result *= LONG2_FORMAT;
        result += seqNum.getSequence();
        return new Long(result);
        */
        int prefix = Integer.parseInt(begin);
        Calendar cal  = seqNum.getDate();
        int year = cal.get(Calendar.YEAR);       //取得年份
        int month = cal.get(Calendar.MONTH) + 1; //取得月份，Calendar的月份以0????
        long seq = seqNum.getSequence();
        long rtn = (prefix*1000000 + year*100 + month)*LONG2_FORMAT + seq;
        return new Long(rtn);
        //modified by ywh 2003.10.23 end
    }

    /**
     * 直接返回sequence??
     */
    //public static Long formatToSequence(SequenceNumber seqNum) {
    public static Long formatToLONG_SEQ(SequenceNumber seqNum) {
        return new Long(seqNum.getSequence());
    }

    /**
     *（年??4位）??+加上sequence的???（16位，转为字符串补??0”）
     */
    //public static String formatToYearSequence(SequenceNumber seqNum){
    public static String formatToSTR_YYYY_16SEQ_L0(SequenceNumber seqNum){
        //modified by ywh 2003.10.23 begin
        /*
        long result;
        StringBuffer temp;

        temp = new StringBuffer(new SimpleDateFormat(DATE_FORMAT).format(new
            Date(seqNum.getDate())));
        temp.delete(temp.length() - 4, temp.length());

        result = Long.valueOf(temp.toString()).longValue();
        result *= 10000000000000000L;
        result += seqNum.getSequence();
        return String.valueOf(result) ;
        */
        Calendar cal = seqNum.getDate();
        //从日期中获取年份
        int year = cal.get(Calendar.YEAR);
        //将Sequence转变成字符串
        long num = seqNum.getSequence();
        String strNum = Long.toString(num);
        //计算??要补充的0的个??
        int zeroCount = 16 - strNum.length();

        //生成字符??
        StringBuffer strBuf = new StringBuffer();
        strBuf.append(year);     //添加年份
        for(int i = 0; i < zeroCount; i++){
             strBuf.append("0"); //补充0
        }
        strBuf.append(strNum);   //添加Sequence??
        return strBuf.toString();
        //modified by ywh 2003.10.23 end
    }
}