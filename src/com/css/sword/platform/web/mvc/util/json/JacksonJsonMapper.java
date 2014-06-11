package com.css.sword.platform.web.mvc.util.json;

import org.codehaus.jackson.map.ObjectMapper;

/**
 * Created by chechw.
 * User: Administrator
 * Date: 2011-4-20
 * Time: 14:50:53
 * To change this template use File | Settings | File Templates.
 */
public class JacksonJsonMapper {
     static  ObjectMapper objectMapper = null;
     private JacksonJsonMapper(){}

    public static ObjectMapper getInstance(){
        if (objectMapper==null){
           synchronized (ObjectMapper.class) {
                if (objectMapper==null){
                    objectMapper = new ObjectMapper();
                }
            }
        }

        return objectMapper;
    }   
}
