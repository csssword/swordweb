package com.css.sword.platform.web.mvc.util;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.comm.pool.ThreadLocalManager;
import com.css.sword.platform.persistence.pagination.PaginationManager;
import com.css.sword.platform.web.mvc.beans.AttrBean;
import com.css.sword.platform.web.mvc.beans.FormBean;
import com.css.sword.platform.web.mvc.beans.FormDataBean;
import com.css.sword.platform.web.mvc.beans.SelectBean;
import com.css.sword.platform.web.mvc.beans.TDBean;
import com.css.sword.platform.web.mvc.beans.TRBean;
import com.css.sword.platform.web.mvc.beans.TableBean;
import com.css.sword.platform.web.mvc.beans.TreeBean;
import com.css.sword.platform.web.mvc.dataobjects.ReqDataObject;
import com.css.sword.platform.web.mvc.dataobjects.ResDataObject;
import com.css.sword.platform.web.mvc.util.json.JSON;

/**
 * 数据处理类 <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc.util<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> DataBuilder.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 *
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */
public class DataBuilder {
    protected static final LogWritter log = LogFactory
            .getLogger(DataBuilder.class);

    public static ReqDataObject build(String jsonString,
                                      ReqDataObject dataObject) {
        log.debug("DataBuilder:" + jsonString);
        Map<String, Object> dataObjectMap = new HashMap<String, Object>();
        Map<String, Object> inputJson = JSON.getJsonObject(jsonString);
        for(Iterator<Entry<String, Object>> it = inputJson.entrySet().iterator(); it.hasNext();) {
            Entry<String, Object> entry = (Entry<String, Object>) it.next();
            String key = entry.getKey().toString();
            if(key.equals(Const.SUBMIT_ARG_DATA_KEY_NAME)) {
                // for JUnit logger 20100204 WJL
                log.debug("Data Object:" + ("{'data':" + entry.getValue() + "}").replaceAll("\\\"", "\\'"));
                getDataMap(dataObjectMap, entry.getValue());
                continue;
            }
            buildParams(dataObjectMap, key, entry.getValue());
        }
        dataObjectMap.put(PaginationManager.BIZ_PARAMS, jsonString);// 缓存业务数据
        dataObject.setViewData(dataObjectMap);
        return dataObject;
    }

    //xg
    private static void buildParams(Map<String, Object> dataObjectMap,
                                    String key, Object value) {
        if(value == null)
            value = "";
        if(("tid".equals(key) || "ctrl".equals(key)) && key != null && !"".equals(key)) {
            if(value.toString().indexOf("?") != -1) {
                String[] valueStrs = value.toString().split("\\?");
                dataObjectMap.put(key, valueStrs[0]);
                String[] valueParams = valueStrs[1].toString().split("\\&");
                for(int i = 0; i < valueParams.length; i++) {
                    //处理多个=号的参数  lining
                    int index = valueParams[i].indexOf("=");
                    dataObjectMap.put(valueParams[i].substring(0, index), valueParams[i].substring(index + 1));
                    // String[] params=(valueParams[i].split("\\="));
                    // dataObjectMap.put(params[0], params.length>1?params[1]:"");
                }
            } else {
                dataObjectMap.put(key, value);
            }
        } else {
            dataObjectMap.put(key, value);
        }
    }

    private static void getDataMap(Map<String, Object> dataObjectMap, Object jo) {
        /*if (JSON.getJsonArray(jo) == null || JSON.getJsonArray(jo).equals("")) {
              return;
          }*/
        if(jo == null && !(jo instanceof ArrayList)) {
            return;
        }
        List<?> jsonObject = (List<?>) jo;
        for(int i = 0; i < jsonObject.size(); i++) {
            String submitTypeName = (JSON.getJsonObjectValue(jsonObject.get(i),
                    Const.SUBMIT_TYPE_KEY_NAME)).toString();
            if(submitTypeName.equals(Const.SUBMIT_TYPE_ATTR)) {
                fillAttrBean(jsonObject.get(i), dataObjectMap);
            } else if(submitTypeName.equals(Const.SUBMIT_TYPE_FORM)) {
                fillFormBean(jsonObject.get(i), dataObjectMap);
            } else if(submitTypeName.equals(Const.SUBMIT_TYPE_TABLE)) {
                fillTableBean(jsonObject.get(i), dataObjectMap);
            } else if(submitTypeName.equals(Const.SUBMIT_TYPE_TREE)) {
                fillTreeBean(jsonObject.get(i), dataObjectMap);
            } else {
                throw new RuntimeException(
                        "No Correct Data(s)!!Your data's type is:"
                                + submitTypeName);
            }
        }
    }

    private static void fillTreeBean(Object jsonObject,
                                     Map<String, Object> dataObjectMap) {
        log.debug("DataBuilder.fillTreeBean:" + jsonObject.toString());
        TreeBean tb = new TreeBean();
        Map<String, Object> viewData = new HashMap<String, Object>();
        List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
        Map<?, ?> jo = (Map<?, ?>) jsonObject;
        String treeId = "";
        for(Iterator<?> itJo = jo.entrySet().iterator(); itJo.hasNext();) {
            Entry<?, ?> entry = (Entry<?, ?>) itJo.next();
            String joKey = (String) entry.getKey();
            if(joKey.equals("data")) {
                /*Object[] obj = JSON.getJSONObjectArray(JSON.getJsonArray(entry
                            .getValue()));*/
                ArrayList<?> obj = (ArrayList<?>) entry.getValue();
                for(int i = 0; i < obj.size(); i++) {
                    Map<?, ?> joData = (Map<?, ?>) obj.get(i);
                    Map<String, Object> dataMap = new HashMap<String, Object>();
                    if(joData != null) {
                        for(Iterator<?> itData = joData.entrySet().iterator(); itData
                                .hasNext();) {
                            Entry<?, ?> dataEntry = (Entry<?, ?>) itData.next();
                            dataMap.put(dataEntry.getKey().toString(), dataEntry
                                    .getValue());
                        }
                    }
                    dataList.add(dataMap);
                }
            } else if(joKey.equals("name")) {
                treeId = entry.getValue().toString();
            } else {
                viewData.put(joKey, entry.getValue());
            }
        }
        tb.setViewData(viewData);
        tb.setDataList(dataList);
        dataObjectMap.put(treeId, tb);
    }

    private static void fillAttrBean(Object jsonObject,
                                     Map<String, Object> dataObjectMap) {
        log.debug("DataBuilder.fillAttrBean:" + jsonObject.toString());
        AttrBean attrBean = new AttrBean();
        Map<String, String> attrMap = new HashMap<String, String>();
        String attrKey = (String) JSON.getJsonObjectValue(jsonObject,
                Const.JSON_STRING_ATTR_KEY_NAME);
        String attrValue = (String) JSON.getJsonObjectValue(jsonObject,
                Const.JSON_STRING_ATTR_VALUE_NAME);
        attrMap.put(attrKey, attrValue);
        attrBean.setAttrMap(attrMap);
        dataObjectMap.put(attrKey, attrBean);
    }

    @SuppressWarnings("unchecked")
    private static void fillTableBean(Object jsonObject,
                                      Map<String, Object> dataObjectMap) {
        log.debug("DataBuilder.fillTableBean:" + jsonObject);
        TableBean tb = new TableBean();
        Map<?, ?> jo = (Map<?, ?>) jsonObject;
        String tableID = null;
        for(Iterator<?> itJo = jo.entrySet().iterator(); itJo.hasNext();) {
            Entry<?, ?> entry = (Entry<?, ?>) itJo.next();
            String joKey = entry.getKey().toString();
            if(joKey.equalsIgnoreCase(Const.JSON_STRING_TABLE_ID_KEY_NAME)) {
                tableID = JSON.getJsonObjectValue(jsonObject, joKey).toString();
            } else if(joKey
                    .equalsIgnoreCase(Const.JSON_STRING_TABLE_TR_KEY_NAME)) {
                /*Object[] obj = JSON.getJSONObjectArray(JSON.getJsonArray(JSON
                            .getJsonObjectValue(jsonObject,
                                    Const.JSON_STRING_TABLE_TR_KEY_NAME)));*/
                ArrayList<?> obj = (ArrayList<?>) JSON.getJsonObjectValue(jsonObject, Const.JSON_STRING_TABLE_TR_KEY_NAME);
                // 填充TR
                List<TRBean> trList = new ArrayList<TRBean>();
                for(int i = 0; i < obj.size(); i++) {
                    TRBean trb = new TRBean();
                    List<TDBean> tdList = new ArrayList<TDBean>();
                    Object objectOpt = JSON.getJsonObjectValue(obj.get(i),
                            Const.JSON_COMMON_OPRATION_KEY_NAME);
                    if(objectOpt == null)
                        objectOpt = "";
                    String stringOpt = objectOpt.toString();
                    trb.setOptFlag(stringOpt);
                    Map<String, Object> tdMap = (Map<String, Object>) JSON.getJsonObjectValue(obj.get(i),
                            Const.JSON_STRING_TABLE_TD_KEY_NAME);
                    // 填充TD
                    for(Iterator<String> it = tdMap.keySet().iterator(); it.hasNext();) {
                        TDBean td = new TDBean();
                        String key = (String) it.next();
                        td.setKey(key);
                        Object objValue = (JSON.getJsonObjectValue(tdMap.get(key),
                                Const.JSON_STRING_TABLE_TD_VALUE_KEY_NAME));
                        if(objValue == null) {
                            objValue = "";
                        }
                        Object objCode = (JSON.getJsonObjectValue(tdMap.get(key),
                                Const.JSON_STRING_TABLE_TD_CODE_KEY_NAME));
                        td.setCode(objCode == null ? "" : objCode.toString());
                        td.setValue(objValue.toString());
                        td.setValueType((String) JSON.getJsonObjectValue(tdMap.get(key),
                                Const.JSON_COMMON_TYPE_KEY_NAME));
                        tdList.add(td);
                    }
                    trb.setTdList(tdList);
                    trList.add(trb);
                }
                tb.setTrList(trList);
            } else {
                tb.putParam(joKey, entry.getValue() == null ? "" : entry.getValue().toString());
            }
        }
        dataObjectMap.put(tableID, tb);
    }

    @SuppressWarnings("unchecked")
    private static void fillFormBean(Object jsonObject,
                                     Map<String, Object> dataObjectMap) {
        log.debug("DataBuilder.fillFormBean:" + jsonObject);
        FormBean fb = new FormBean();
        String formId = null;
        for(Iterator<?> it = ((Map<?, ?>) jsonObject).entrySet().iterator(); it
                .hasNext();) {
            Entry<?, ?> entry = (Entry<?, ?>) it.next();
            if(entry.getKey().toString().equals(
                    Const.JSON_STRING_FORM_ID_KEY_NAME)) {
                // form id
                formId = (String) JSON.getJsonObjectValue(jsonObject,
                        Const.JSON_STRING_FORM_ID_KEY_NAME);
            } else if(entry.getKey().toString().equalsIgnoreCase(
                    Const.JSON_STRING_FORM_DATA_KEY_NAME)) {
                Map<String, Object> formMap = (Map<String, Object>) JSON.getJsonObjectValue(jsonObject,
                        Const.JSON_STRING_FORM_DATA_KEY_NAME);
                Map<String, FormDataBean> params = new HashMap<String, FormDataBean>();
                for(Iterator<String> itFormMap = formMap.keySet().iterator(); itFormMap
                        .hasNext();) {
                    FormDataBean fdb = new FormDataBean();
                    String key = (String) itFormMap.next();
                    fdb.setValue(""
                            + JSON.getJsonObjectValue(formMap.get(key),
                            Const.JSON_STRING_FORM_DATA_VALUE_KEY_NAME));
                    fdb.setDataType(""
                            + JSON.getJsonObjectValue(formMap.get(key),
                            Const.JSON_STRING_FORM_DATA_TYPE_KEY_NAME));
                    params.put(key, fdb);
                }
                fb.setViewData(params);
                dataObjectMap.put(formId, fb);
            } else {
                fb.putParam(entry.getKey().toString(), entry.getValue() == null ? "" : entry.getValue()
                        .toString());
            }
        }
    }

    public static ResDataObject tableBeanToJson(ResDataObject resData) {
        log.debug("DataBuilder.tableBeanToJson:" + resData);
        TableBean bean = (TableBean) resData.getObjectBean();
        Map<String, Object> tableMap = new HashMap<String, Object>();
        List<TRBean> trsList = new ArrayList<TRBean>();
        List<Object> trList = new ArrayList<Object>();
        trsList = bean.getViewData().get(bean.getTableName());
        // 遍历TR bean
        for(int i = 0; i < trsList.size(); i++) {
            Map<String, Object> trMap = new HashMap<String, Object>();
            Map<String, Object> tdMap = new HashMap<String, Object>();
            // 遍历Td Bean
            for(int j = 0; j < trsList.get(i).getTdList().size(); j++) {
                String key = trsList.get(i).getTdList().get(j).getKey();
                if(key.equals("ROWNUM_")) {
                    // 过滤oracle分页查询出无用的字段信息。
                    continue;
                }
                String value = trsList.get(i).getTdList().get(j).getValue();
                String code = trsList.get(i).getTdList().get(j).getCode();
                Map<String, String> tdValueMap = new HashMap<String, String>();
                tdValueMap.put(Const.JSON_STRING_TABLE_TD_VALUE_KEY_NAME, value);
                if(code != null) {
                    tdValueMap.put("code", code);
                }
                tdMap.put(key, tdValueMap);
                trMap.put(Const.JSON_STRING_TABLE_TD_KEY_NAME, tdMap);
            }
            trMap.put(Const.JSON_COMMON_OPRATION_KEY_NAME, trsList.get(i)
                    .getOptFlag());
            trList.add(trMap);
        }
        checkPaginationConfig(tableMap, bean.getTableName());
        tableMap.put(Const.JSON_STRING_TABLE_TR_KEY_NAME, trList);
        tableMap.put(Const.SUBMIT_TYPE_KEY_NAME, Const.SUBMIT_TYPE_TABLE);
        tableMap.put(Const.JSON_STRING_TABLE_ID_KEY_NAME, bean.getTableName());
        log.debug("Table Data:" + tableMap);
        resData.addJsonDatas(tableMap);
        return resData;
    }

    @SuppressWarnings("unchecked")
    private static void checkPaginationConfig(Map<String, Object> tableMap,
                                              String tableName) {
        if(ThreadLocalManager.get(PaginationManager.PAGINATION_CONFIG) != null) {
            Map<String, Map<String, Object>> paginationConfigMap = (Map<String, Map<String, Object>>) ThreadLocalManager
                    .get(PaginationManager.PAGINATION_CONFIG);
            Map<String, Object> widgetConfig = paginationConfigMap
                    .get(tableName);
            if(widgetConfig == null) {
                return;
                // throw new RuntimeException("无法获取" + tableName
                // + "组件的分页参数，请不要将一次查询的数据集填充到多个SwordGrid组件中。");
                // PaginationManager.load(tableName);
                // checkPaginationConfig(tableMap, tableName);
            } else {
                tableMap.putAll(widgetConfig);
            }
        }
    }

    public static ResDataObject formBeanToJson(ResDataObject resData) {
        FormBean fb = (FormBean) resData.getObjectBean();
        Map<String, String> params = fb.getParams();
        Map<String, Object> formMap = new HashMap<String, Object>();
        String formId = params.get(Const.JSON_STRING_FORM_ID_KEY_NAME);
        Map<String, Object> dataMap = new HashMap<String, Object>();
        Map<String, FormDataBean> fdbMap = fb.getViewData();
        for(Iterator<Entry<String, FormDataBean>> it = fdbMap.entrySet()
                .iterator(); it.hasNext();) {
            Entry<String, FormDataBean> entry = (Entry<String, FormDataBean>) it
                    .next();
            String key = entry.getKey();
            Map<String, String> value = entry.getValue().getParams();// fdb
            String code = entry.getValue().getCode();
            if(code != null) {
                value.put("code", code);
            }
            dataMap.put(key, value);
        }
        formMap.put(Const.SUBMIT_TYPE_KEY_NAME, Const.SUBMIT_TYPE_FORM);
        formMap.put(Const.JSON_STRING_FORM_ID_KEY_NAME, formId);
        formMap.put(Const.JSON_STRING_FORM_DATA_KEY_NAME, dataMap);
        log.debug("Form Data:" + formMap);
        resData.addJsonDatas(formMap);
        return resData;
    }

    public static ResDataObject attrBeanToJson(ResDataObject resData) {
        AttrBean ab = (AttrBean) resData.getObjectBean();
        Map<String, String> attrMap = ab.getAttrMap();
        Map<String, String> resMap = new HashMap<String, String>();
        for(Iterator<Entry<String, String>> it = attrMap.entrySet().iterator(); it
                .hasNext();) {
            Entry<String, String> entry = (Entry<String, String>) it.next();
            String key = entry.getKey();
            String value = entry.getValue();
            resMap.put(Const.JSON_STRING_ATTR_KEY_NAME, key);
            resMap.put(Const.JSON_STRING_ATTR_VALUE_NAME, value);
            resMap.put(Const.JSON_STRING_ATTR_TYPE_NAME, "");
        }
        attrMap.put(Const.SUBMIT_TYPE_KEY_NAME, Const.SUBMIT_TYPE_ATTR);
        //log.debug("Attr Datas:" + resMap);
        resData.addJsonDatas(resMap);
        return resData;
    }

    public static ResDataObject selectBeanToJson(ResDataObject resData) {
        SelectBean sb = (SelectBean) resData.getObjectBean();
        List<Map<String, ?>> selectDatas = sb.getDataList();
        Map<String, Object> resMap = sb.viewData();
        resMap.put("data", selectDatas);
        log.debug("Select Datas:" + resMap);
        resData.addJsonDatas(resMap);
        return resData;
    }

    public static ResDataObject treeBeanToJson(ResDataObject resData) {
        TreeBean tb = (TreeBean) resData.getObjectBean();
        List<Map<String, Object>> treeDatas = tb.getDataList();
        Map<String, Object> resMap = tb.viewData();
        resMap.put("data", treeDatas);
        log.debug("Tree Datas:" + resMap);
        resData.addJsonDatas(resMap);
        return resData;
    }

    public static String resJsonData(ResDataObject rdo) {
        rdo.putToJson(Const.SUBMIT_ARG_DATA_KEY_NAME, rdo.getJsonDatas());
        String jsonString = JSON.mapToJson(rdo.getJsonStringMap());
        log.debug("JsonString:" + jsonString);
        return jsonString;
    }

    public static String resCusJsonData(ResDataObject rdo) {
        String jsonString = JSON.getJsonObject((String) rdo.getObject()).toString();
        return jsonString;
    }

    //add
//	根据字段名获取set方法名
    public static String getSetterName(String fieldName) {
        StringBuffer sb = new StringBuffer();
        sb.append("set");
        String fieldNameFirstUpperCase = (fieldName.substring(0, 1)).toUpperCase();
        sb.append(fieldNameFirstUpperCase);
        String fieldNameLast = fieldName.substring(1);
        sb.append(fieldNameLast);
        return sb.toString();
    }

    //add
//	根据字段名获取get方法名
    public static String getGetterName(String fieldName) {
        StringBuffer sb = new StringBuffer();
        sb.append("get");
        String fieldNameFirstUpperCase = (fieldName.substring(0, 1)).toUpperCase();
        sb.append(fieldNameFirstUpperCase);
        String fieldNameLast = fieldName.substring(1);
        sb.append(fieldNameLast);
        return sb.toString();
    }

}
