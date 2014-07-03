package com.css.sword.platform.web.comm;

import com.css.sword.kernel.base.exception.SwordBaseCheckedException;
import com.css.sword.kernel.utils.SwordServiceUtils;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.comm.pool.ThreadLocalManager;
import com.css.sword.platform.web.event.SwordReq;
import com.css.sword.platform.web.event.SwordRes;
import com.css.sword.platform.web.mvc.SwordDataSet;
import com.css.sword.platform.web.mvc.beans.AttrBean;
import com.css.sword.platform.web.mvc.beans.FormBean;
import com.css.sword.platform.web.mvc.beans.TableBean;
import com.css.sword.platform.web.mvc.beans.TreeBean;
import com.css.sword.platform.web.mvc.util.json.JSON;

import java.util.*;

/**
 * <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.comm<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> ViewDataHelper.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 *
 * @since Sword 4.0.0<br>
 */
public class ViewDataHelper {

    private static final List<String> noDeal = Arrays.asList("tid", "ctrl", "page", "bizParams", "jsdelegate");
    private static final List<String> PageDeal = Arrays.asList("rows", "pageNum");
    private static final String tableInsert = "_insert".toUpperCase();
    private static final String tableUpdate = "_update".toUpperCase();
    private static final String tableDelete = "_delete".toUpperCase();
    private static final String tableNoStatus = "_noStatus".toUpperCase();

    /**
     * 前台控件的代码
     */
    private static final String compcode = "CODE";
    /**
     * 前台控件的名称
     */
    private static final String compcaption = "CAPTION";
    /**
     * 前台控件的类型
     */
    private static final String comptype = "TYPE";
    /**
     * 前台控件所属的表单
     */
    private static final String formName = "FORMNAME";

    /**
     * 返回的页面
     */
    private static final String page = "PAGE";

    /**
     * 返回的页面的信息
     */
    private static final String message = "MESSAGE";

    protected static final LogWritter log = LogFactory
            .getLogger(ViewDataHelper.class);

    public static Map<String, Object> getReqMap(SwordDataSet resView) {
        Map<String, Object> allData = resView.getReqDataObject().getViewData();
        SwordReq req = new SwordReq(resView.getTid(), resView);
        Map<String, Object> reqMap = new HashMap<String, Object>();
        String jsdelegate = (String) req.getAttr("jsdelegate");
        if (jsdelegate != null && !"".equals(jsdelegate)&&!"null".equals(jsdelegate)) {
            reqMap = JSON.getJsonObject(jsdelegate);
        }
        for (Iterator<String> iterator = allData.keySet().iterator(); iterator.hasNext(); ) {
            String key = (String) iterator.next();
            if (noDeal.contains(key)) {
                continue;
            }
            Object value = allData.get(key);
            if (value instanceof FormBean) {
                reqMap.put(key, req.getFormData(key));
            } else if (value instanceof TableBean) {
                reqMap.put(key, req.getTableData(key));
                reqMap.put(key + tableInsert, req.getInsertTableData(key));
                reqMap.put(key + tableUpdate, req.getUpdateTableData(key));
                reqMap.put(key + tableDelete, req.getDeleteTableData(key));
                reqMap.put(key + tableNoStatus, req.getNonStatusTableData(key));
            } else if (value instanceof AttrBean) {
                reqMap.put(key, ((AttrBean) value).getAttrMap().get(key));
            } else if (value instanceof TreeBean) {
                reqMap.put(key, req.getTree(key));
            } else if (value instanceof String) {
                reqMap.put(key, value);
            } else {
                if (PageDeal.contains(key))
                    reqMap.put(key, value);
            }
        }
        return reqMap;
    }

    @SuppressWarnings("unchecked")
    public static SwordRes getRes(Map<String, Object> resMap, SwordDataSet resView) {
        SwordRes res = new SwordRes();
        Iterator<String> iterator = null;
        Map<String, Object> pageParam = null;
//        if ("true".equals(resView.getAttr("s5_widgetloaddata"))) {
//
//            String s = JSON.mapToJson(resMap);
//            res.addAttr("s5_datamap", s);
//            return res;
//        }

        if (resMap != null) {
            iterator = resMap.keySet().iterator();
            Object m = resMap.get("SWORD_PAGE_PARAM");
            if (m != null)
                pageParam = (HashMap<String, Object>) m;
            else
                pageParam = new HashMap<String, Object>();
        }
        while (resMap != null && iterator.hasNext()) {
            String key = (String) iterator.next();
            Object value = resMap.get(key);
            if (key.indexOf("jstl_") > -1)
                res.addJSTL(key.split("jstl_")[1], value);
            else {
                if (page.equals(key)) {
                    res.addPage((String) value);
                } else if (message.equals(key)) {
                    res.addMessage(value);
                } else if (value instanceof Map) {
                    Map<String, String> m = (Map<String, String>) value;
                    Iterator<String> it = m.keySet().iterator();
                    while (it.hasNext()) {
                        String k = (String) it.next();
                        Object v = m.get(k);
                        if (v instanceof Map) {
                            m.put(k, JSON.mapToJson((Map<String, Object>) v));

                        } else if (v instanceof List) {
                            m.put(k, JSON.listToJson((List<?>) v));
                        }
                    }

                    res.addForm(key, (Map<String, String>) value);

                } else if (value instanceof List) {
                    List<Map<String, Object>> valueList = (List<Map<String, Object>>) value;
                    Map<String, Object> comMap = null;
                    String type = null;
                    Map<String, Object> rowMap = null;
                    for (int i = 0; i < valueList.size(); i++) {
                        rowMap = (Map<String, Object>) valueList.get(i);
                        if (type == null)
                            type = (String) rowMap.get(comptype);
                        if (!"".equals(type) && type != null) {
                            if (comMap == null)comMap = new LinkedHashMap<String, Object>();
                            comMap.put((String) rowMap.get(compcode),rowMap.get(compcaption));
                        } else {
                            break;
                        }
                    }
                    if (!"".equals(type) && type != null) {
                        if ("select".equalsIgnoreCase(type)) {
                            res.addSelectWithDataName(key, valueList);
                        }
//                        else if ("multiselect".equalsIgnoreCase(type)) {
//                            res.addListWithWidgetName(rowMap.get(formName)+ "." + key, comMap);
//                        } 
                        else if ("checkbox".equalsIgnoreCase(type)) {
                            res.addCheckBoxWithWidgetName(rowMap.get(formName)+ "." + key, comMap);
                        } else if ("radio".equalsIgnoreCase(type)) {
                            res.addRadioWithWidgetName(rowMap.get(formName)+ "." + key, comMap);
                        } else if ("tree".equalsIgnoreCase(type)) {
                            res.addTree(key, valueList);
                        }
                    } else {
                        //list为空也要赋值,lzy 总是拼上分页参数
                        res.addTableMap(key, valueList, pageParam.get(key));
                    }
                } else if (value instanceof String) {
                    if (key.indexOf("chart_") > -1)
                        res.addChart(key.split("chart_")[1], (String) value);
                    else
                        res.addAttr(key, value);
                } else
                    log.debug("getRes :没有处理key=【" + key + "】，value=【" + value+ "】");
            }
        }
        return res;
    }

    public static void dealViewData(SwordDataSet resView) throws Exception {
        // 发送请求map
        SwordRes res = getRes(callApp(resView), resView);
        // 处理返回map
        ThreadLocalManager.add(CommParas.resDataSet, res.getResDataSet());

    }

    private static Map<String, Object> callApp(SwordDataSet resView)throws SwordBaseCheckedException {
        String bizService = resView.getTid();
        Map<String, Object> reqmap = ViewDataHelper.getReqMap(resView);
        @SuppressWarnings("unchecked")
        Map<String, Object> resmap = (Map<String, Object>) SwordServiceUtils.callService(bizService, new Object[]{reqmap});
        return resmap;
    }
}
