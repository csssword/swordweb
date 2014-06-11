package com.css.sword.platform.web.mvc.util.json;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.map.ObjectMapper;

/**
 * JSON解析工具类 <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.util.json<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> JSON.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 *
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class JSON {


    @SuppressWarnings("unchecked")
	public static Map<String, Object> getJsonObject(String obj) {
        ObjectMapper mapper = JacksonJsonMapper.getInstance();
        Map<String, Object> result = new HashMap<String, Object>();
        try {
            if(obj != null)
                result = mapper.readValue(obj, Map.class);
        } catch(IOException e) {
            throw new RuntimeException("getJsonObject字符串解析出错！");
        }
        return result;

    }

    @SuppressWarnings("unchecked")
	public static List<Map<String, Object>> getJsonList(String obj) {
        ObjectMapper mapper = JacksonJsonMapper.getInstance();
        List<Map<String, Object>> result = null;
        try {
            if(obj != null)
                result = mapper.readValue(obj, List.class);
        } catch(IOException e) {
            throw new RuntimeException("getJsonObject字符串解析出错！");
        }
        return result;

    }

    public static Object getJsonObjectValue(Object jsonObject, Object key) {
        return ((Map<?, ?>) jsonObject).get(key);
    }

    public static String mapToJson(Map<String, Object> map) {
        try {
            return JacksonJsonMapper.getInstance().writeValueAsString(map);
        } catch(IOException e) {
            throw new RuntimeException("JSON字符串解析出错！");
        }
    }


    public static String listToJson(List<?> list) {
        try {
            return JacksonJsonMapper.getInstance().writeValueAsString(list);
        } catch(IOException e) {
            throw new RuntimeException("JSON字符串解析出错！");
        }
    }


}
