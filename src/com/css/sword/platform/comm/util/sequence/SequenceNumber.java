package com.css.sword.platform.comm.util.sequence;

import java.io.Serializable;
import java.util.Calendar;

/**
 * SequenceNumber封装类．它含两个属???:date和sequence. 其中date为当前日期和时间,
 * sequence为从数据库中获取的唯??的标识???．
 *
 * <p>Title: SequenceNumber</p>
 * <p>Description: 广东地税大集中项目新??代税收征管信息系??</P>
 * <p>Copyright: Copyright (c) 2003  广东省地方税务局、中软网络技术股份有限公??</p>
 * <p>Company: 中软网络??术股份有限公??</p>
 * @author 朱宇??
 * @version 1.0
 */

public class SequenceNumber implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	//modified by ywh 2003.10.23 begin
    //private long date;
    private Calendar date;
    //modified by ywh 2003.10.23 end
    private long sequence;

    public SequenceNumber(long seq) {
         sequence = seq;
        //modified by ywh 2003.10.23 begin
        //date = System.currentTimeMillis();
        date = Calendar.getInstance();
        //modified by ywh 2003.10.23 end
    }

    //modified by ywh 2003.10.23 begin
    //public long getDate() {
    public Calendar getDate(){
    //modified by ywh 2003.10.23 end
        return date;
    }


    public long getSequence() {
        return sequence;
    }

    public static void main(String[] args) {
        //SequenceNumber sequenceNumber1 = new SequenceNumber(1);
    }

    public String toString() {
        //modified by ywh 2003.10.23 begin
        //return "" + sequence;
        return String.valueOf(sequence);
        //modified by ywh 2003.10.23 end
    }
}