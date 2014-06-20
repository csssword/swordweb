package com.css.sword.platform.comm.util.sequence;

/**
 * 使用org.jdom的Java类包??
 * org.jdom.Document;
 * org.jdom.Element;
 * org.jdom.input.SAXBuilder;
 * 通过使用SAX的接口实现从XML文件读取XML文件的元素和属???的值等内容，并对XML文件中的格式定义信息进行解析??
 *
 *---------------------------------------------
 *  编码: 刘付?? 20030520
 * --------------------------------------------
 */

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;

/**
 *
 * <p>Title: XMLBuilder</p>
 * <p>Description: 广东地税大集中项目新??代税收征管信息系??</p>
 * <p>Copyright: Copyright (c) 2003 广东省地方税务局, 中软网络??术股份有限公??</p>
 * <p>Company: 中软网络??术股份有限公??</p>
 * @author 刘付??
 * @version 1.0
 */
public class XMLBuilder {
	
	private final static LogWritter logger = LogFactory.getLogger(XMLBuilder.class);
	
    /**
     * 解析sequence.xml文件，并将解析的结果存储在一个Map中???
     * @param fileName:String - sequence.xml文件的存放路??
     * @return Map - 生成的结??
     * @author 杨文??
     * @since 2003.10.27
     */
    public Map<String, SequenceMapping> parseSequenceFile(String fileName){
      HashMap<String, SequenceMapping> hmap = new HashMap<String, SequenceMapping>();

      try{
          SAXBuilder builder = new SAXBuilder();
          Document doc =
              builder.build(getClass().getResourceAsStream("/" + fileName));

          //1.得到根元??
          Element root = doc.getRootElement();
          List<?> list = root.getChildren();

          for(int i=0;i<list.size();i++){
              Element elm = (Element)list.get(i);
              String name = elm.getChild("name").getText().trim();
              String sequenceName =
                  elm.getChild("sequence-name").getText().trim();
              String formatName = elm.getChild("format-name").getText().trim();
              //将信息保存到SequenceMapping对象??
              SequenceMapping sm =
                  new SequenceMapping(name,sequenceName,formatName);
              //将信息保存到缓存??
              hmap.put(name,sm);
              logger.info("初始化配置信??(" + fileName + "): " +
                                 sm.toString());
          }
      }
      catch(Exception e){
          logger.error("解析文件 " + fileName + " 时发生错??",e);
          hmap.clear();
      }
      return hmap;
    }
}
