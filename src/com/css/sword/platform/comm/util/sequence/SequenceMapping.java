package com.css.sword.platform.comm.util.sequence;

/**
* <p>Title: SequenceMapping</p>
 * <p>Description:保存单个Sequence属???的对象</p>
 * <p>Copyright: Copyright (c) 2003 广东省地方税务局，中软网络技术股份有限公??</p>
 * <p>Company: 中软网络??术股份有限公??</p>
 * @author 杨文??
 * @version 1.0
 * @since 2003.10.27
 */


public class SequenceMapping {
  private String name = null;            //别名
  private String sequenceName = null;    //Sequence名称，对应数据库中的名称
  private String sequenceFormat = null;  //对应的格式的名称
  public SequenceMapping(String name,String seqName,String seqFormat) {
      this.name = name;
      this.sequenceName = seqName;
      this.sequenceFormat = seqFormat;
  }
  public String getName(){
      return this.name;
  }
  public void setName(String s){
      this.name = s;
  }

  public String getSeqName(){
      return this.sequenceName;
  }
  public String getSeqFormat(){
      return this.sequenceFormat;
  }
  public void setSeqName(String name){
      this.sequenceName = name;
  }
  public void setSeqFormat(String format){
      this.sequenceFormat = format;
  }
  public String toString(){
      return "name:" + name +
             " sequenceName:" + sequenceName +
             " sequenceFormat" + sequenceFormat;
  }



}