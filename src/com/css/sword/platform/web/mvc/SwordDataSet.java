package com.css.sword.platform.web.mvc;

import java.io.Serializable;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collection;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.http.HttpServletRequest;

import sun.jdbc.rowset.CachedRowSet;

import com.css.sword.kernel.utils.SwordCacheUtils;
import com.css.sword.kernel.utils.SwordLogUtils;
import com.css.sword.kernel.utils.SwordServiceUtils;
import com.css.sword.platform.web.comm.DateUtil;
import com.css.sword.platform.web.event.IReqData;
import com.css.sword.platform.web.event.IResData;
import com.css.sword.platform.web.mvc.annotations.CacheCode;
import com.css.sword.platform.web.mvc.beans.AttrBean;
import com.css.sword.platform.web.mvc.beans.FormBean;
import com.css.sword.platform.web.mvc.beans.FormDataBean;
import com.css.sword.platform.web.mvc.beans.SelectBean;
import com.css.sword.platform.web.mvc.beans.TDBean;
import com.css.sword.platform.web.mvc.beans.TRBean;
import com.css.sword.platform.web.mvc.beans.TableBean;
import com.css.sword.platform.web.mvc.beans.TreeBean;
import com.css.sword.platform.web.mvc.cachecode.ICacheCodeConfig;
import com.css.sword.platform.web.mvc.dataobjects.ReqDataObject;
import com.css.sword.platform.web.mvc.dataobjects.ResDataObject;
import com.css.sword.platform.web.mvc.util.Const;
import com.css.sword.platform.web.mvc.util.DataBuilder;

/**
 * 数据逻辑模型实现类 <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.mvc<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> SwordDataSet.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 *
 * @author WJL <br>
 * @see {@link IReqData}
 * @see {@link IResData}
 * @since Sword 4.0.0<br>
 */
public class SwordDataSet implements Serializable {
    private static final long serialVersionUID = 6205843046396208302L;
    private static final String AND_FLAG = "#*^@^*#";// &符号转译
    private ReqDataObject reqData = new ReqDataObject();
    private ResDataObject resData;
    private HashMap<String, String> context = new HashMap<String, String>();
    private String sessionID;
    protected static final SwordLogUtils log = SwordLogUtils.getLogger(SwordDataSet.class);

    private Map<String, Object> jstlDataMap = new HashMap<String, Object>();

    BuildSuperClass build = new BuildSuperClass();

    public String getContextValue(String key) {
        return this.context.get(key);
    }

    public void putContextValue(String key, String value) {
        this.context.put(key, value);
    }

    public Map<String, Object> getJstlDataMap() {
        return jstlDataMap;
    }

    public void setJstlDataMap(Map<String, Object> jstlDataMap) {
        this.jstlDataMap = jstlDataMap;
    }

    public SwordDataSet(String jsonString) {
        log.debug("初始化ReqDataObject。");
        reqData = new ReqDataObject();
        reqData = DataBuilder.build(jsonString, reqData);
    }

    public SwordDataSet(HttpServletRequest req) {
        log.debug("初始化ReqDataObject。");
        reqData = new ReqDataObject();
        String postJsonString = (String) req.getParameter("postData");
        postJsonString = postJsonString != null ? postJsonString.replace(AND_FLAG, "&") : postJsonString;
//        log.debug("Request Json String:" + postJsonString);
        reqData = DataBuilder.build(postJsonString, reqData);
        if(postJsonString == null) {
            String ctrl = (String) req.getParameter("ctrl");
            String tid = (String) req.getParameter("tid");
            if(ctrl != null) {
                reqData.getViewData().put("ctrl", ctrl);
            }
            if(tid != null) {
                reqData.getViewData().put("tid", tid);
            }
            if(ctrl == null && tid == null) {
                throw new RuntimeException("解析提交参数是无法获得有效的ctrl或tid，请检查提交参数中是否存在ctrl或tid！\n 对应postJsonString为："+postJsonString+"\n对应reqData数据为"+reqData.getViewData().toString()+"\n完整请求地址为"+req.getRequestURL()+"?" + req.getQueryString());
            }
        }
    }

    public SwordDataSet() {
        log.debug("初始化ResDataObject。");
        resData = new ResDataObject();
    }

    public ResDataObject getResDataObject() {
        return resData;
    }

    public void setResDataObject(ResDataObject resDataObject) {
        this.resData = resDataObject;
    }

    public ReqDataObject getReqDataObject() {
        return reqData;
    }

    public void setReqDataObject(ReqDataObject reqDataObject) {
        this.reqData = reqDataObject;
    }

    public String getCtrl() {
        Object ctrlAll = reqData.getViewData().get("ctrl");
        if(ctrlAll != null && !"".equals(ctrlAll)) {
            int i = ctrlAll.toString().indexOf("_");
            if(i > 0) {
                return ctrlAll.toString().split("_")[0];
            } else {
                log.error("Ctrl类的格式不正确,正确的格式应为{注释名}_{方法名},注释和方法中间用'_'分割!");
                throw new RuntimeException("Ctrl类的格式不正确,正确的格式应为{注释名}_{方法名},注释和方法中间用'_'分割!");
            }
        }
        return null;
    }

    public String getCtrl_method() {
        String ctrlAll = reqData.getViewData().get("ctrl").toString();
        if(ctrlAll != null && ctrlAll.indexOf("_") != -1) {
            return ctrlAll.split("_")[1];
        }
        return "";
    }

    public String getTid() {
        String tid = (String) reqData.getViewData().get("tid");
        return tid;
    }

    /**
     * 获取会话ID
     *
     * @return
     */
    public String getSessionID() {
        return this.sessionID;
    }

    public void setSessionID(String sessionID) {
        this.sessionID = sessionID;
    }

    public Object getAttr(String widgetName) {
        Object obj = reqData.getViewData().get(widgetName);
        if(obj instanceof AttrBean) {
            AttrBean ab = (AttrBean) obj;
            return ab.getAttrMap().get(widgetName);
        }
        return obj;
    }

    public void setAttr(String widgetName, Object obj) {
        reqData.getViewData().put(widgetName, obj);
    }

    public Map<String, String> getFormData(String widgetName) {
        Map<String, String> formDatas = new HashMap<String, String>();
        Object obj = reqData.getViewData().get(widgetName);
        Map<String, FormDataBean> formDataBean = new HashMap<String, FormDataBean>();
        if(obj instanceof FormBean) {
            FormBean fb = (FormBean) obj;
            formDataBean = fb.viewData();
            for(Iterator<Entry<String, FormDataBean>> it = formDataBean.entrySet().iterator(); it.hasNext(); ) {
                Entry<String, FormDataBean> entry = it.next();
                formDatas.put(entry.getKey(), (entry.getValue()).getValue());
            }
            return formDatas;
        }
        return null;
    }

    public Object getForm(String widgetName, Object obj) {
        try {
            Class<? extends Object> clz = obj.getClass();
            Map<String, String> formDataList = getFormData(widgetName);
            if(formDataList == null) {
                return null;
            }
            for(Iterator<Entry<String, String>> it = formDataList.entrySet().iterator(); it.hasNext(); ) {
                Entry<String, String> entry = it.next();
                Field clzField = null;

                clzField = build.getDeclaredField(entry.getKey(), clz);
                if(clzField == null) {
                    log.debug("类【" + clz.getName() + "】中字段【" + entry.getKey() + "】不存在！");
                    continue;
                }
                Method clzFieldMethod = build.getMethod(getSetterName(clzField.getName()), clz, clzField.getType());
                if(clzFieldMethod == null) {
                    continue;
                }
                Object data = getDataType(clzField.getType(), entry.getValue());
                /*
                     * if (data == null) { continue; }
                     */
                clzFieldMethod.invoke(obj, new Object[]{data});
            }
            return obj;
        } catch(IllegalAccessException e) {
            throw new RuntimeException(e);
        } catch(SecurityException e) {
            throw new RuntimeException(e);
        } catch(IllegalArgumentException e) {
            throw new RuntimeException(e);
        } catch(InvocationTargetException e) {
            throw new RuntimeException(e);
        }
    }

    public Object getForm(String widgetName, Class<?> clz) {
        try {
            Object obj = clz.newInstance();
            Map<String, String> formDataList = getFormData(widgetName);
            if(formDataList == null) {
                return null;
            }
            for(Iterator<Entry<String, String>> it = formDataList.entrySet().iterator(); it.hasNext(); ) {
                Entry<String, String> entry = it.next();
                Field clzField = null;

                clzField = build.getDeclaredField(entry.getKey(), clz);
                if(clzField == null) {
                    log.debug("类【" + clz.getName() + "】中字段【" + entry.getKey() + "】不存在！");
                    continue;
                }
                Method clzFieldMethod = build.getMethod(getSetterName(clzField.getName()), clz, clzField.getType());
                if(clzFieldMethod == null) {
                    continue;
                }
                Object data = getDataType(clzField.getType(), entry.getValue());
                /*
                     * if (data == null) { continue; }
                     */
                clzFieldMethod.invoke(obj, new Object[]{data});
            }
            return obj;
        } catch(InstantiationException e) {
            throw new RuntimeException(e);
        } catch(IllegalAccessException e) {
            throw new RuntimeException(e);
        } catch(SecurityException e) {
            throw new RuntimeException(e);
        } catch(IllegalArgumentException e) {
            throw new RuntimeException(e);
        } catch(InvocationTargetException e) {
            throw new RuntimeException(e);
        }
    }

    public Object getForm(String widgetName) {
        FormBean fb = getFormMetaData(widgetName);
        if(fb == null) {
            return null;
        }
        String beanName = fb.getParams().get(Const.JSON_COMMON_BEANNAME_KEY_NAME);
        if(beanName == null || "".equals(beanName)) {
            throw new RuntimeException("未获得有效的BeanName，请检查是否将BeanName传入。\n" + reqData.getViewData());
        } else {
            try {
                Class<?> clz = Class.forName(beanName);
                return getForm(widgetName, clz);
            } catch(ClassNotFoundException e) {
                throw new RuntimeException(e);
            }
        }
    }

    /**
     * 获得form列表中formBean<br>
     * 获取具体属性： formBean.viewData().get("sex").getValue()
     *
     * @param widgetName
     * @return
     */
    public FormBean getFormMetaData(String widgetName) {
        Object obj = reqData.getViewData().get(widgetName);
        if(obj instanceof FormBean) {
            return (FormBean) obj;
        } else {
            log.debug("提交的数据中，未能获取有效的Form数据。FormName=" + widgetName + "，请检查名称是否有误！\n" + reqData.getViewData());
            return null;
        }
    }

    public List<Map<String, String>> getTableData(String widgetName) {
        Object obj = reqData.getViewData().get(widgetName);
        // 2010 4 16 wjl修改，对空数据进行判断。
        if(obj == null) {
            log.debug("为获取到有效的SwordGrid数据！请检查SwordGrid名称！TableName=" + widgetName);
            return new ArrayList<Map<String, String>>();
        }
        List<Map<String, String>> dataList = new ArrayList<Map<String, String>>();
        if(obj instanceof TableBean) {
            TableBean tb = (TableBean) obj;
            List<TRBean> trList = tb.getTrList();
            for(int i = 0; i < trList.size(); i++) {
                TRBean trBean = trList.get(i);
                Map<String, String> tableDatas = new HashMap<String, String>();
                List<TDBean> tdList = trBean.getTdList();
                for(int j = 0; j < tdList.size(); j++) {
                    TDBean tdBean = tdList.get(j);
                    String value = tdBean.getValue();
                    if(value == null) {
                        value = "";
                    }
                    if(tdBean.getCode() != null && !tdBean.getCode().equals("")) {
                        tableDatas.put(tdBean.getKey(), tdBean.getCode());
                    } else {
                        tableDatas.put(tdBean.getKey(), value);
                    }
                }
                dataList.add(tableDatas);
            }
            return dataList;
        }
        return new ArrayList<Map<String, String>>();
    }

    public List<?> getTable(String widgetName, Class<?> clz) {
        List<Object> classes = new ArrayList<Object>();
        try {
            List<Map<String, String>> tableDataList = getTableData(widgetName);
            for(int i = 0; i < tableDataList.size(); i++) {
                Object obj = clz.newInstance();
                Map<String, String> tableDataMap = tableDataList.get(i);
                for(Iterator<Entry<String, String>> it = tableDataMap.entrySet().iterator(); it.hasNext(); ) {
                    Entry<String, String> entry = it.next();
                    Field clzField = null;
                    clzField = build.getDeclaredField(entry.getKey(), clz);
                    if(clzField == null) {
                        log.debug("类【" + clz.getName() + "】中字段【" + entry.getKey() + "】不存在！");
                        continue;
                    }
                    Method clzFieldMethod = build.getMethod(getSetterName(clzField.getName()), clz, clzField.getType());
                    if(clzFieldMethod == null) {
                        continue;
                    }
                    Object data = getDataType(clzField.getType(), entry.getValue());
                    if(data == null) {
                        continue;
                    }
                    clzFieldMethod.invoke(obj, new Object[]{data});
                }
                classes.add(obj);
            }
            return classes;
        } catch(InstantiationException e) {
            throw new RuntimeException(e);
        } catch(IllegalAccessException e) {
            throw new RuntimeException(e);
        } catch(SecurityException e) {
            throw new RuntimeException(e);
        } catch(IllegalArgumentException e) {
            throw new RuntimeException(e);
        } catch(InvocationTargetException e) {
            throw new RuntimeException(e);
        }
    }

    public List<?> getTable(String widgetName) {
        TableBean tb = getTableMetaData(widgetName);
        String beanName = tb.getParams().get(Const.JSON_COMMON_BEANNAME_KEY_NAME);
        if(beanName == null || "".equals(beanName)) {
            throw new RuntimeException("未获得有效的BeanName，请检查是否将BeanName传入。\n" + reqData.getViewData());
        } else {
            try {
                Class<?> clz = Class.forName(beanName);
                return getTable(widgetName, clz);
            } catch(ClassNotFoundException e) {
                throw new RuntimeException(e);
            }
        }
    }

    public TableBean getTableMetaData(String widgetName) {
        Object obj = reqData.getViewData().get(widgetName);
        if(obj instanceof TableBean) {
            return (TableBean) obj;
        } else {
            log.debug("提交的数据中，未能获取有效的Table数据。TableName=" + widgetName + "，请检查名称是否无误！\n");
            return new TableBean();
            // throw new RuntimeException("提交的数据中，未能获取有效的Table数据。TableName="
            // + widgetName + "，请检查名称是否无误！\n" + reqData.getViewData());
        }
    }

    private List<Map<String, String>> getTrListMapForStatus(List<TRBean> trList) {
        List<Map<String, String>> dataList = new ArrayList<Map<String, String>>();
        for(int i = 0; i < trList.size(); i++) {
            TRBean trBean = trList.get(i);
            Map<String, String> tableDatas = new HashMap<String, String>();
            List<TDBean> tdList = trBean.getTdList();
            for(int j = 0; j < tdList.size(); j++) {
                TDBean tdBean = tdList.get(j);
                String value = tdBean.getValue();
                if(value == null) {
                    value = "";
                }
                if(tdBean.getCode() != null && !tdBean.getCode().equals("")) {
                    tableDatas.put(tdBean.getKey(), tdBean.getCode());
                } else {
                    tableDatas.put(tdBean.getKey(), value);
                }
            }
            dataList.add(tableDatas);
        }
        return dataList;
    }

    public List<Map<String, String>> getInsertTableData(String widgetName) {
        return getTrListMapForStatus(getInsertTRBean(widgetName));
    }

    private List<TRBean> getInsertTRBean(String widgetName) {
        TableBean tb = this.getTableMetaData(widgetName);
        List<TRBean> trList = tb.getTrList();
        List<TRBean> insertTrList = new ArrayList<TRBean>();
        for(int i = 0; i < trList.size(); i++) {
            TRBean trb = trList.get(i);
            if(trb.getOptFlag().equals(Const.JSON_STRING_OPRATION_INSERT_VALUE)) {
                insertTrList.add(trb);
            }
        }
        return insertTrList;
    }

    public List<?> getInsertTable(String widgetName, Class<?> clz) {
        List<Object> objList = new ArrayList<Object>();
        try {
            List<TRBean> trList = getInsertTRBean(widgetName);
            for(int i = 0; i < trList.size(); i++) {
                TRBean tr = trList.get(i);
                List<TDBean> tdList = tr.getTdList();
                // 2010 4 28 wjl修改
                Object obj = this.fillTable(clz, tdList);
                objList.add(obj);
            }
            return objList;
        } catch(SecurityException e) {
            throw new RuntimeException(e);
        } catch(NoSuchMethodException e) {
            throw new RuntimeException(e);
        } catch(IllegalArgumentException e) {
            throw new RuntimeException(e);
        } catch(IllegalAccessException e) {
            throw new RuntimeException(e);
        } catch(InvocationTargetException e) {
            throw new RuntimeException(e);
        } catch(InstantiationException e) {
            throw new RuntimeException(e);
        }
    }

    public List<?> getInsertTable(String widgetName) {
        TableBean tb = getTableMetaData(widgetName);
        String beanName = tb.getParams().get("beanname");
        if(beanName == null || "".equals(beanName)) {
            // throw new RuntimeException("BeanName为空，请确认是否传入beanname属性。");
            log.debug("BeanName为空，请确认是否传入beanname属性。");
            return new ArrayList<Object>();
        }
        try {
            return getInsertTable(widgetName, Class.forName(beanName));
        } catch(ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Map<String, String>> getNonStatusTableData(String widgetName) {
        return getTrListMapForStatus(getNonStatusTRBean(widgetName));
    }

    private List<TRBean> getNonStatusTRBean(String widgetName) {
        TableBean tb = this.getTableMetaData(widgetName);
        List<TRBean> trList = tb.getTrList();
        List<TRBean> nonStatusTrList = new ArrayList<TRBean>();
        for(int i = 0; i < trList.size(); i++) {
            TRBean trb = trList.get(i);
            if(trb.getOptFlag().equals("null") || trb.getOptFlag().equals("") || trb.getOptFlag() == null) {
                nonStatusTrList.add(trb);
            }
        }
        return nonStatusTrList;
    }

    public List<?> getNonStatusTable(String widgetName, Class<?> clz) {
        List<Object> objList = new ArrayList<Object>();
        try {
            List<TRBean> trList = getNonStatusTRBean(widgetName);
            for(int i = 0; i < trList.size(); i++) {
                TRBean tr = trList.get(i);
                List<TDBean> tdList = tr.getTdList();
                // 2010 4 28 wjl修改
                Object obj = this.fillTable(clz, tdList);
                objList.add(obj);
            }
            return objList;
        } catch(SecurityException e) {
            throw new RuntimeException(e);
        } catch(NoSuchMethodException e) {
            throw new RuntimeException(e);
        } catch(IllegalArgumentException e) {
            throw new RuntimeException(e);
        } catch(IllegalAccessException e) {
            throw new RuntimeException(e);
        } catch(InvocationTargetException e) {
            throw new RuntimeException(e);
        } catch(InstantiationException e) {
            throw new RuntimeException(e);
        }
    }

    public List<?> getNonStatusTable(String widgetName) {
        TableBean tb = getTableMetaData(widgetName);
        String beanName = tb.getParams().get("beanname");
        if(beanName == null || "".equals(beanName)) {
            throw new RuntimeException("BeanName为空，请确认是否传入beanname属性。");
        }
        try {
            return getNonStatusTable(widgetName, Class.forName(beanName));
        } catch(ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Map<String, String>> getDeleteTableData(String widgetName) {
        return getTrListMapForStatus(getDeleteTRBeans(widgetName));
    }

    private List<TRBean> getDeleteTRBeans(String widgetName) {
        TableBean tb = this.getTableMetaData(widgetName);
        List<TRBean> trList = tb.getTrList();
        List<TRBean> insertTrList = new ArrayList<TRBean>();
        for(int i = 0; i < trList.size(); i++) {
            TRBean trb = trList.get(i);
            if(trb.getOptFlag().equals(Const.JSON_STRING_OPRATION_DELETE_VALUE)) {
                insertTrList.add(trb);
            }
        }
        return insertTrList;
    }

    private Object fillTable(Class<?> clz, List<TDBean> tdList) throws SecurityException, NoSuchMethodException, IllegalArgumentException,
            IllegalAccessException, InvocationTargetException, InstantiationException {
        Object obj = clz.newInstance();
        for(int j = 0; j < tdList.size(); j++) {

            TDBean td = tdList.get(j);
            Field field;
            // 此处临时修改，待完善，应以bo为单位
            field = build.getDeclaredField(td.getKey(), clz);
            if(field == null) {
                continue;
            }
            String fieldName = field.getName();
            String fieldSetterName = getSetterName(fieldName);
            Class<?> dataType = field.getType();
            Method fieldSetterMethod = build.getMethod(fieldSetterName, clz, dataType);
            if(fieldSetterMethod == null) {
                continue;
            }
            // 修改此处，以适应当代码转名称后，将代码填充到BO中，而不是将值填充到BO中
            // 2010 4 28 wjl
            Object data = null;
            if(td.getCode() != null && !"".equals(td.getCode())) {
                data = getDataType(dataType, td.getCode());
            } else {
                data = getDataType(dataType, td.getValue());
            }

            if(data == null) {
                continue;
            }
            fieldSetterMethod.invoke(obj, new Object[]{data});
        }
        return obj;
    }

    public List<?> getDeleteTable(String widgetName, Class<?> clz) {
        List<Object> objList = new ArrayList<Object>();
        try {
            List<TRBean> trList = getDeleteTRBeans(widgetName);
            for(int i = 0; i < trList.size(); i++) {
                TRBean tr = trList.get(i);
                List<TDBean> tdList = tr.getTdList();
                // 2010 4 28 wjl修改
                Object obj = this.fillTable(clz, tdList);
                objList.add(obj);
            }
            return objList;
        } catch(SecurityException e) {
            throw new RuntimeException(e);
        } catch(NoSuchMethodException e) {
            throw new RuntimeException(e);
        } catch(IllegalArgumentException e) {
            throw new RuntimeException(e);
        } catch(IllegalAccessException e) {
            throw new RuntimeException(e);
        } catch(InvocationTargetException e) {
            throw new RuntimeException(e);
        } catch(InstantiationException e) {
            throw new RuntimeException(e);
        }
    }

    public List<?> getDeleteTable(String widgetName) {
        TableBean tb = getTableMetaData(widgetName);
        String beanName = tb.getParams().get("beanname");
        if(beanName == null || "".equals(beanName)) {
            log.debug("BeanName为空，请确认是否传入beanname属性。");
            return new ArrayList<Object>();
        }
        try {
            return getDeleteTable(widgetName, Class.forName(beanName));
        } catch(ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Map<String, String>> getUpdateTableData(String widgetName) {
        return getTrListMapForStatus(getUpdateTRBeans(widgetName));
    }

    private List<TRBean> getUpdateTRBeans(String widgetName) {
        TableBean tb = this.getTableMetaData(widgetName);
        List<TRBean> trList = tb.getTrList();
        List<TRBean> insertTrList = new ArrayList<TRBean>();
        for(int i = 0; i < trList.size(); i++) {
            TRBean trb = trList.get(i);
            if(trb.getOptFlag().equals(Const.JSON_STRING_OPRATION_UPDATE_VALUE)) {
                insertTrList.add(trb);
            }
        }
        return insertTrList;
    }

    public List<?> getUpdateTable(String widgetName, Class<?> clz) {
        List<Object> objList = new ArrayList<Object>();
        try {
            List<TRBean> trList = getUpdateTRBeans(widgetName);
            for(int i = 0; i < trList.size(); i++) {
                TRBean tr = trList.get(i);
                List<TDBean> tdList = tr.getTdList();
                // 2010 4 28 wjl修改
                Object obj = this.fillTable(clz, tdList);
                objList.add(obj);
            }
            return objList;
        } catch(SecurityException e) {
            throw new RuntimeException(e);
        } catch(NoSuchMethodException e) {
            throw new RuntimeException(e);
        } catch(IllegalArgumentException e) {
            throw new RuntimeException(e);
        } catch(IllegalAccessException e) {
            throw new RuntimeException(e);
        } catch(InvocationTargetException e) {
            throw new RuntimeException(e);
        } catch(InstantiationException e) {
            throw new RuntimeException(e);
        }
    }

    public List<?> getUpdateTable(String widgetName) {
        TableBean tb = getTableMetaData(widgetName);
        String beanName = tb.getParams().get("beanname");
        if(beanName == null || "".equals(beanName)) {
            // throw new RuntimeException("BeanName为空，请确认是否传入beanname属性。");
            log.debug("BeanName为空，请确认是否传入beanname属性。");
            return new ArrayList<Object>();
        }
        try {
            return getUpdateTable(widgetName, Class.forName(beanName));
        } catch(ClassNotFoundException e) {
            throw new RuntimeException(e);
        }
    }

    public TreeBean getTreeMataData(String widgetName) {
        Object obj = reqData.getViewData().get(widgetName);
        if(obj instanceof TreeBean) {
            return (TreeBean) obj;
        }
        return null;
    }

    public List<Map<String, Object>> getTree(String widgetName) {
        TreeBean tb = getTreeMataData(widgetName);
        return tb.getDataList();
    }

    public void addTableMap(String widgetName, List<Map<String, Object>> list) {
        Map<String, List<TRBean>> paramsMap = new HashMap<String, List<TRBean>>();
        TableBean tBean = new TableBean();
        tBean.setTableName(widgetName);
        List<TRBean> trList = new ArrayList<TRBean>();
        if(list != null && list.size() > 0) {
            for(Iterator<Map<String, Object>> iter = list.iterator(); iter.hasNext(); ) {
                TRBean trBean = new TRBean();
                Map<String, ?> map = iter.next();
                List<TDBean> tdList = new ArrayList<TDBean>();
                for(Iterator<?> it = map.entrySet().iterator(); it.hasNext(); ) {
                    @SuppressWarnings("unchecked")
					Entry<String, Object> entry = (Entry<String, Object>) it.next();
                    TDBean tdBean = new TDBean();
                    tdBean.setKey(entry.getKey());
                    tdBean.setValue(entry.getValue() == null ? "" : DateUtil.dateToStr(entry.getValue()));
                    tdList.add(tdBean);
                }
                trBean.setTdList(tdList);
                trList.add(trBean);
            }
        }
        tBean.setTrList(trList);
        paramsMap.put(widgetName, trList);
        tBean.setViewData(paramsMap);
        resData.setObjectBean(tBean);
        resData = DataBuilder.tableBeanToJson(resData);
    }

    public void addTable(String widgetName, CachedRowSet crs) {
        log.debug("共" + crs.size() + "条数据需要处理！");

        try {
            if(!crs.isBeforeFirst()) {
                crs.beforeFirst();// 将游标指向最开始，为了一次查询多次处理。
            }
            Map<String, List<TRBean>> paramsMap = new HashMap<String, List<TRBean>>();
            TableBean tBean = new TableBean();
            tBean.setTableName(widgetName);
            List<TRBean> trList = new ArrayList<TRBean>();
            int colNum = crs.getMetaData().getColumnCount();
            while(crs.next()) {
                TRBean trBean = new TRBean();
                List<TDBean> tdList = new ArrayList<TDBean>();
                for(int i = 0; i < colNum; i++) {
                    TDBean tdBean = new TDBean();
                    tdBean.setKey(crs.getMetaData().getColumnLabel(i + 1)); // todo
                    // mysql用原来取出来的是不对的，是列名不是别名
                    String value = DateUtil.dateToStr(crs.getObject(i + 1));
                    if(value == null) {
                        value = "";
                    }
                    tdBean.setValue(value);
                    tdList.add(tdBean);
                }
                trBean.setTdList(tdList);
                trList.add(trBean);
            }
            tBean.setTrList(trList);
            paramsMap.put(widgetName, trList);
            tBean.setViewData(paramsMap);
            resData.setObjectBean(tBean);
            resData = DataBuilder.tableBeanToJson(resData);
        } catch(SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void addTable(String widgetName, CachedRowSet crs, ICacheCodeConfig config) {
        log.debug("共" + crs.size() + "条数据需要处理！");
        try {
            Map<String, List<TRBean>> paramsMap = new HashMap<String, List<TRBean>>();
            TableBean tBean = new TableBean();
            tBean.setTableName(widgetName);
            List<TRBean> trList = new ArrayList<TRBean>();
            int colNum = crs.getMetaData().getColumnCount();
            while(crs.next()) {
                TRBean trBean = new TRBean();
                List<TDBean> tdList = new ArrayList<TDBean>();
                for(int i = 0; i < colNum; i++) {
                    TDBean tdBean = new TDBean();
                    // 201100205 wjl 修改，将ColumnName转为ColumnLabel以兼容别名
                    tdBean.setKey(crs.getMetaData().getColumnLabel(i + 1));
                    String value = DateUtil.dateToStr(crs.getObject(i + 1));
                    CacheCode cc = this.getCacheCode(config, "set");
                    String codeRowName = "";
                    if(cc != null) {
                        codeRowName = cc.codeRowName();
                        if(codeRowName.equalsIgnoreCase(crs.getMetaData().getColumnLabel(i + 1))) {
                            tdBean.setValue(this.getCacheCode(value, cc));
                            tdBean.setCode(value);
                        } else {
                            tdBean.setValue(value + "");
                        }
                    } else {
                        List<Map<String, String>> configMap = config.getAllSet();
                        if(configMap == null || configMap.size() <= 0) {
                            tdBean.setValue(value + "");// 防止空指针异常
                        } else {
                            for(int j = 0; j < configMap.size(); j++) {
                                Map<String, String> codeMap = configMap.get(j);
                                if(codeMap.get(ICacheCodeConfig.codeRowName).equalsIgnoreCase(crs.getMetaData().getColumnLabel(i + 1))) {
                                    tdBean.setCode(value);
                                    value = this.getCacheCodeFromMap(codeMap, value);
                                }
                            }
                            tdBean.setValue(value);
                        }
                    }
                    tdList.add(tdBean);
                }
                trBean.setTdList(tdList);
                trList.add(trBean);
            }
            tBean.setTrList(trList);
            paramsMap.put(widgetName, trList);
            tBean.setViewData(paramsMap);
            resData.setObjectBean(tBean);
            resData = DataBuilder.tableBeanToJson(resData);
        } catch(SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // xg
    public void addTable(String widgetName, CachedRowSet crs, String... config) {
        log.debug("共" + crs.size() + "条数据需要处理！");
        try {
            Map<String, List<TRBean>> paramsMap = new HashMap<String, List<TRBean>>();
            TableBean tBean = new TableBean();
            tBean.setTableName(widgetName);
            List<TRBean> trList = new ArrayList<TRBean>();
            int colNum = crs.getMetaData().getColumnCount();
            List<Map<String, String>> configMap = getCacheCodeConfig(config);

            while(crs.next()) {
                TRBean trBean = new TRBean();
                List<TDBean> tdList = new ArrayList<TDBean>();
                for(int i = 0; i < colNum; i++) {
                    TDBean tdBean = new TDBean();
                    tdBean.setKey(crs.getMetaData().getColumnLabel(i + 1));
                    String value = DateUtil.dateToStr(crs.getObject(i + 1));

                    if(configMap == null || configMap.size() <= 0) {
                        tdBean.setValue(value + "");// 防止空指针异常
                    } else {
                        for(int j = 0; j < configMap.size(); j++) {
                            Map<String, String> codeMap = configMap.get(j);
                            if(codeMap.get(ICacheCodeConfig.codeRowName).equalsIgnoreCase(crs.getMetaData().getColumnLabel(i + 1))) {
                                tdBean.setCode(value);
                                value = this.getCacheCodeFromMap(codeMap, value);
                            }
                        }
                        tdBean.setValue(value);
                    }

                    tdList.add(tdBean);
                }
                trBean.setTdList(tdList);
                trList.add(trBean);
            }
            tBean.setTrList(trList);
            paramsMap.put(widgetName, trList);
            tBean.setViewData(paramsMap);
            resData.setObjectBean(tBean);
            resData = DataBuilder.tableBeanToJson(resData);
        } catch(SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // xg
    public void addTable(String widgetName, List<?> objList, String... config) {
        try {

            Map<String, List<TRBean>> paramsMap = new HashMap<String, List<TRBean>>();
            TableBean tBean = new TableBean();
            tBean.setTableName(widgetName);
            List<TRBean> trList = new ArrayList<TRBean>();

            List<Map<String, String>> configListMap = config.length == 0 ? new ArrayList<Map<String, String>>()
                    : getCacheCodeConfig(config); // 配置参数

            for(int i = 0; i < objList.size(); i++) {
                List<TDBean> tdList = new ArrayList<TDBean>();
                Object obj = objList.get(i);
                TRBean trBean = new TRBean();
                Field[] field = build.getAllFields(obj);
                for(int j = 0; j < field.length; j++) {
                    String fieldName = field[j].getName();
                    String fieldGetterName = this.getGetterName(fieldName);
                    Method beanGetterMethod = build.getMethod(fieldGetterName, obj);
                    if(beanGetterMethod!=null){
                      TDBean tdBean = new TDBean();
                      tdBean.setKey(fieldName);
                      Object returnValue = beanGetterMethod.invoke(obj, new Object[]{});
                      if(returnValue == null) {
                          returnValue = new String("");
                      } else {
                          if(field[j].getType().getName().equals(Calendar.class.getName())) {
                              returnValue = DateUtil.dateToStr(new Timestamp(((Calendar) returnValue).getTimeInMillis()));
                          }else if(field[j].getType().getName().equals(java.util.Date.class.getName())){
                              returnValue = DateUtil.dateToStr((java.util.Date) returnValue);
                          }

                      }
                      // 代码转名称
                      CacheCode cc = this.getCacheCode(obj, fieldGetterName);
                      if(cc != null) {
                          String codeRowName = cc.codeRowName();
                          if(codeRowName.equalsIgnoreCase(fieldName)) {
                              tdBean.setCode("" + returnValue);
                              returnValue = this.getCacheCode(returnValue, cc);
                          }
                      }
  
                      for(Map<String, String> map : configListMap) {
                          if(map.get(ICacheCodeConfig.codeRowName).equalsIgnoreCase(fieldName)) {
                              String returnString = "" + returnValue;
                              tdBean.setCode(returnString);
                              returnValue = this.getCacheCodeFromMap(map, returnString);
                          }
                      }
                      // 代码转名称结束
  
                      tdBean.setValue(returnValue + "");// 防止空指针异常
  
                      tdList.add(tdBean);  
                    }
                }
                trBean.setTdList(tdList);
                trList.add(trBean);
            }
            tBean.setTrList(trList);
            paramsMap.put(widgetName, trList);
            tBean.setViewData(paramsMap);
            resData.setObjectBean(tBean);
            resData = DataBuilder.tableBeanToJson(resData);
        } catch(SecurityException e) {
            throw new RuntimeException(e);
        } catch(IllegalArgumentException e) {
            throw new RuntimeException(e);
        } catch(IllegalAccessException e) {
            throw new RuntimeException(e);
        } catch(InvocationTargetException e) {
            throw new RuntimeException(e);
        }
    }

    public void addForm(String widgetName, CachedRowSet crs, ICacheCodeConfig config) {
        try {
            FormBean fb = new FormBean();
            int colNum = crs.getMetaData().getColumnCount();
            Map<String, String> params = new HashMap<String, String>();
            params.put(Const.JSON_STRING_FORM_ID_KEY_NAME, widgetName);
            Map<String, FormDataBean> fdbMap = new HashMap<String, FormDataBean>();
            CacheCode cc = this.getCacheCode(config, "set");
            while(crs.next()) {
                for(int i = 0; i < colNum; i++) {
                    FormDataBean fdb = new FormDataBean();
                    String value = DateUtil.dateToStr(crs.getObject(i + 1));
                    Map<String, String> dataMap = new HashMap<String, String>();
                    if(cc != null) {
                        String codeRowName = cc.codeRowName();
                        // 201100205 wjl 修改，将ColumnName转为ColumnLabel以兼容别名
                        if(codeRowName.equalsIgnoreCase(crs.getMetaData().getColumnLabel(i + 1))) {
                            fdb.setValue(getCacheCode(value, cc));
                            fdb.setCode(value);
                        } else {
                            fdb.setValue(value);
                        }
                    } else {
                        List<Map<String, String>> configMap = config.getAllSet();
                        if(configMap == null || configMap.size() <= 0) {
                            if(value == null) {// 防止空指针异常
                                value = "";
                            }
                            fdb.setValue(value);
                        } else {
                            for(int j = 0; j < configMap.size(); j++) {
                                Map<String, String> codeMap = configMap.get(j);
                                if(codeMap.get(ICacheCodeConfig.codeRowName).equalsIgnoreCase(crs.getMetaData().getColumnLabel(i + 1))) {
                                    fdb.setCode(value);
                                    value = this.getCacheCodeFromMap(codeMap, value);
                                }
                            }
                            fdb.setValue(value);
                        }
                    }
                    dataMap.put(Const.JSON_STRING_FORM_DATA_VALUE_KEY_NAME, fdb.getValue());
                    fdb.setParams(dataMap);
                    fdbMap.put(crs.getMetaData().getColumnLabel(i + 1), fdb);
                }
            }
            fb.setParams(params);
            fb.setViewData(fdbMap);
            resData.setObjectBean(fb);
            resData = DataBuilder.formBeanToJson(resData);
        } catch(SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void addForm(String widgetName, CachedRowSet crs, String... config) {
        try {
            FormBean fb = new FormBean();
            int colNum = crs.getMetaData().getColumnCount();
            Map<String, String> params = new HashMap<String, String>();
            params.put(Const.JSON_STRING_FORM_ID_KEY_NAME, widgetName);
            Map<String, FormDataBean> fdbMap = new HashMap<String, FormDataBean>();
            // CacheCode cc = this.getCacheCode(config, "set");
            while(crs.next()) {
                for(int i = 0; i < colNum; i++) {
                    FormDataBean fdb = new FormDataBean();
                    String value = DateUtil.dateToStr(crs.getObject(i + 1));
                    Map<String, String> dataMap = new HashMap<String, String>();
                    List<Map<String, String>> configMap = this.getCacheCodeConfig(config);
                    if(configMap == null || configMap.size() <= 0) {
                        if(value == null) {// 防止空指针异常
                            value = "";
                        }
                        fdb.setValue(value);
                    } else {
                        for(int j = 0; j < configMap.size(); j++) {
                            Map<String, String> codeMap = configMap.get(j);
                            // 201100205 wjl 修改，将ColumnName转为ColumnLabel以兼容别名
                            if(codeMap.get(ICacheCodeConfig.codeRowName).equalsIgnoreCase(crs.getMetaData().getColumnLabel(i + 1))) {
                                fdb.setCode(value);
                                value = this.getCacheCodeFromMap(codeMap, value);
                            }
                        }
                        fdb.setValue(value);
                    }
                    dataMap.put(Const.JSON_STRING_FORM_DATA_VALUE_KEY_NAME, fdb.getValue());
                    fdb.setParams(dataMap);
                    fdbMap.put(crs.getMetaData().getColumnLabel(i + 1), fdb);
                }
            }
            fb.setParams(params);
            fb.setViewData(fdbMap);
            resData.setObjectBean(fb);
            resData = DataBuilder.formBeanToJson(resData);
        } catch(SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void addForm(String widgetName, CachedRowSet crs) {
        try {
            FormBean fb = new FormBean();
            int colNum = crs.getMetaData().getColumnCount();
            Map<String, String> params = new HashMap<String, String>();
            params.put(Const.JSON_STRING_FORM_ID_KEY_NAME, widgetName);
            Map<String, FormDataBean> fdbMap = new HashMap<String, FormDataBean>();
            while(crs.next()) {
                for(int i = 0; i < colNum; i++) {
                    FormDataBean fdb = new FormDataBean();
                    Map<String, String> dataMap = new HashMap<String, String>();
                    fdb.setValue(crs.getString(i + 1));
                    dataMap.put(Const.JSON_STRING_FORM_DATA_VALUE_KEY_NAME, crs.getString(i + 1));
                    fdb.setParams(dataMap);
                    // 201100205 wjl 修改，将ColumnName转为ColumnLabel以兼容别名
                    fdbMap.put(crs.getMetaData().getColumnLabel(i + 1), fdb);
                }
            }
            fb.setParams(params);
            fb.setViewData(fdbMap);
            resData.setObjectBean(fb);
            resData = DataBuilder.formBeanToJson(resData);
        } catch(SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public void addForm(String widgetName, Map<String, String> map) {
        FormBean fb = new FormBean();
        Map<String, String> params = new HashMap<String, String>();
        params.put(Const.JSON_STRING_FORM_ID_KEY_NAME, widgetName);
        Map<String, FormDataBean> fdbMap = new HashMap<String, FormDataBean>();

        for(Iterator<Entry<String, String>> it = map.entrySet().iterator(); it.hasNext(); ) {
            Entry<?, ?> entry = it.next();
            String value = DateUtil.dateToStr(entry.getValue());
            FormDataBean fdb = new FormDataBean();
            Map<String, String> dataMap = new HashMap<String, String>();
            fdb.setValue(value);
            dataMap.put(Const.JSON_STRING_FORM_DATA_VALUE_KEY_NAME, "" + value);
            fdb.setParams(dataMap);
            fdbMap.put("" + entry.getKey(), fdb);
        }
        fb.setParams(params);
        fb.setViewData(fdbMap);
        resData.setObjectBean(fb);
        resData = DataBuilder.formBeanToJson(resData);
    }

    public void addForm(String widgetName, Object obj) {
        try {
            FormBean fb = new FormBean();
            Map<String, String> params = new HashMap<String, String>();
            params.put(Const.JSON_STRING_FORM_ID_KEY_NAME, widgetName);
            Map<String, FormDataBean> fdbMap = new HashMap<String, FormDataBean>();
            Field[] field = build.getAllFields(obj);

            for(int i = 0; i < field.length; i++) {
                String fieldName = field[i].getName();
                String fieldGetterName = this.getGetterName(fieldName);
                Method getterMethod = build.getMethod(fieldGetterName, obj);
                if(getterMethod!=null){
                  Object returnValue = getterMethod.invoke(obj, new Object[]{});
                  if(returnValue == null) {
                      returnValue = new String("");
                  } else {
                      if(field[i].getType().getName().equals(Calendar.class.getName())) {
                          returnValue = DateUtil.dateToStr(new Timestamp(((Calendar) returnValue).getTimeInMillis()));
                      }else if(field[i].getType().getName().equals(java.util.Date.class.getName())){
                          returnValue = DateUtil.dateToStr((java.util.Date) returnValue);
                      }

                  }
                  // 代码转名称
                  CacheCode cc = this.getCacheCode(obj, fieldGetterName);
                  FormDataBean fdb = new FormDataBean();
                  Map<String, String> dataMap = new HashMap<String, String>();
                  if(cc != null) {
                      String codeRowName = cc.codeRowName();
                      if(codeRowName.equalsIgnoreCase(fieldName)) {
                          fdb.setValue(getCacheCode(returnValue, cc));
                          fdb.setCode(returnValue.toString());
                      } else {
                          fdb.setValue(returnValue.toString());
                      }
                  } else {
                      fdb.setValue(returnValue.toString());
                  }
                  dataMap.put(Const.JSON_STRING_FORM_DATA_VALUE_KEY_NAME, fdb.getValue());
                  fdb.setParams(dataMap);
                  fdbMap.put(fieldName, fdb);
                }
            }
            fb.setParams(params);
            fb.setViewData(fdbMap);
            resData.setObjectBean(fb);
            resData = DataBuilder.formBeanToJson(resData);
        } catch(SecurityException e) {
            throw new RuntimeException(e);
        } catch(IllegalArgumentException e) {
            throw new RuntimeException(e);
        } catch(IllegalAccessException e) {
            throw new RuntimeException(e);
        } catch(InvocationTargetException e) {
            throw new RuntimeException(e);
        }
    }

    public void addAttr(String key, Object value) {
        AttrBean ab = new AttrBean();
        Map<String, String> attrMap = new HashMap<String, String>();
        attrMap.put(key, value.toString());
        ab.setAttrMap(attrMap);
        resData.setObjectBean(ab);
        resData = DataBuilder.attrBeanToJson(resData);
    }

    private void addSelect(Map<String, Object> viewData, CachedRowSet crs, String swordName) {
        try {
            viewData.put("sword", swordName);
            int colNum = crs.getMetaData().getColumnCount();
            SelectBean sb = new SelectBean();
            while(crs.next()) {
                Map<String, String> dataMap = new HashMap<String, String>();
                for(int i = 0; i < colNum; i++) {
                    dataMap.put(crs.getMetaData().getColumnLabel(i + 1).toLowerCase(), crs.getString(i + 1));
                }
                sb.add(dataMap);
            }
            sb.setViewData(viewData);
            resData.setObjectBean(sb);
            resData = DataBuilder.selectBeanToJson(resData);
        } catch(SQLException e) {
            throw new RuntimeException(e);
        }
    }

    // add
    private void addSelect(Map<String, Object> viewData, List<Map<String, Object>> list, String swordName, String... mapping) {
        viewData.put("sword", swordName);
        SelectBean sb = new SelectBean();

        List<Map<String, String>> mappingMap = getConfigListMap(mapping);

        for(Iterator<Map<String, Object>> iterator = list.iterator(); iterator.hasNext(); ) {
            @SuppressWarnings("unchecked")
			Map<String, Object> itemMap = (Map<String, Object>) iterator.next();
            Map<String, Object> dataMap = new HashMap<String, Object>();
            for(Iterator<Entry<String, Object>> it = itemMap.entrySet().iterator(); it.hasNext(); ) {
                Entry<String, Object> entry = (Entry<String, Object>) it.next();
                String key = entry.getKey();
                if(!mappingMap.isEmpty()){
                	key = key.toLowerCase();
                	for(Map<String, String> configMap : mappingMap) {
                        if(configMap.containsKey(key)) {
                            key = configMap.get(key);
                        }
                    }
                }

                Object v = entry.getValue();
                if(v == null)
                    v = "";
                else
                    v = "" + v;
                dataMap.put(key, v);
            }
            sb.add(dataMap);
        }

        sb.setViewData(viewData);
        resData.setObjectBean(sb);
        resData = DataBuilder.selectBeanToJson(resData);
    }
    
    private void addSelectVO(Map<String, Object> viewData, List<?> list, String swordName, String... mapping) {
        viewData.put("sword", swordName);
        SelectBean sb = new SelectBean();
        for(int i = 0; i < list.size(); i++) {
            Object obj = list.get(i);
            try {
                Field[] fields = build.getAllFields(obj);
                Map<String, Object> dataMap = new HashMap<String, Object>();
                for(int j = 0; j < fields.length; j++) {
                    String fieldName = fields[j].getName();
                    String fieldGetterName = getGetterName(fieldName);
                    Method getterMethod = build.getMethod(fieldGetterName, obj);
                    if(getterMethod!=null){
    	                Object value = getterMethod.invoke(obj, new Object[]{});
    	                dataMap.put(fieldName, value);
                    }
                }
                sb.add(dataMap);
            } catch(SecurityException e) {
                throw new RuntimeException(e);
            } catch(IllegalArgumentException e) {
                throw new RuntimeException(e);
            } catch(IllegalAccessException e) {
                throw new RuntimeException(e);
            } catch(InvocationTargetException e) {
                throw new RuntimeException(e);
            }
        }
        sb.setViewData(viewData);
        resData.setObjectBean(sb);
        resData = DataBuilder.selectBeanToJson(resData);
    }

    private void addSelect(Map<String, Object> viewData, Map<String, Object> map, String swordName) {
        viewData.put("sword", swordName);
        SelectBean sb = new SelectBean();
        for(Iterator<Entry<String, Object>> it = map.entrySet().iterator(); it.hasNext(); ) {
            Map<String, Object> dataMap = new HashMap<String, Object>();
            Entry<String, Object> entry = (Entry<String, Object>) it.next();
            dataMap.put("code", entry.getKey());
            dataMap.put("caption", entry.getValue());
            sb.add(dataMap);
        }
        sb.setViewData(viewData);
        resData.setObjectBean(sb);
        resData = DataBuilder.selectBeanToJson(resData);
    }

    private void addSelect(Map<String, Object> viewData, Object obj, String swordName) {
        viewData.put("sword", swordName);
        SelectBean sb = new SelectBean();
        try {
            Field[] fields = build.getAllFields(obj);
            for(int i = 0; i < fields.length; i++) {
                Map<String, Object> dataMap = new HashMap<String, Object>();
                String fieldName = fields[i].getName();
                String fieldGetterName = getGetterName(fieldName);
                Method getterMethod = build.getMethod(fieldGetterName, obj);
                if(getterMethod!=null){
	                Object value = getterMethod.invoke(obj, new Object[]{});
	                dataMap.put("code", fieldName);
	                dataMap.put("caption", value);
	                sb.add(dataMap);
                }
            }
            sb.setViewData(viewData);
        } catch(SecurityException e) {
            throw new RuntimeException(e);
        } catch(IllegalArgumentException e) {
            throw new RuntimeException(e);
        } catch(IllegalAccessException e) {
            throw new RuntimeException(e);
        } catch(InvocationTargetException e) {
            throw new RuntimeException(e);
        }
        resData.setObjectBean(sb);
        resData = DataBuilder.selectBeanToJson(resData);
    }

    @SuppressWarnings("unchecked")
    public void addCacheSelect(Map<String, Object> viewData, String swordName, String tableName, String... mapping) {
        viewData.put("sword", swordName);
        SelectBean sb = new SelectBean();

        List<Map<String, String>> mappingMap = getConfigListMap(mapping);

        try {
            // List<Map<String, Object>> ret = new CacheQuery().getData(tableName, null);
            Collection<Map<String, Object>> ret = (Collection<Map<String, Object>>) SwordCacheUtils.getAllDataFromKV(tableName);
            if(ret == null) {
                log.debug("表" + tableName + "没有缓存数据");
                return;
            }

            for(Map<String, ?> internalMap : ret) {
                Map<String, Object> dataMap = new HashMap<String, Object>();
                for(Entry<String, ?> entry : internalMap.entrySet()) {
                    for(Map<String, String> map : mappingMap) {
                        if(map.containsKey(entry.getKey().toLowerCase())) {
                            dataMap.put(map.get(entry.getKey().toLowerCase()), entry.getValue());
                        }
                    }

                }
                if(dataMap.size() != 0)
                    sb.add(dataMap);
            }

            sb.setViewData(viewData);
        } catch(Exception e) {
            log.error("获取缓存数据失败", e);
        }
        resData.setObjectBean(sb);
        resData = DataBuilder.selectBeanToJson(resData);
    }

    // add
    // 配置参数转为ListMap
    private List<Map<String, String>> getConfigListMap(String... mapping) {
        List<Map<String, String>> configList = new ArrayList<Map<String, String>>();
        for(String string : mapping) {
            Map<String, String> configMap = new HashMap<String, String>();
            String[] param = string.split(",", 0);
            if(param.length != 2) {
                throw new RuntimeException("配置信息获取错误，必须为两个参数！传入的参数：" + param.length);
            } else {
                configMap.put(param[0], param[1]);
            }
            configList.add(configMap);
        }
        return configList;
    }

//    public void addSelectWithWidgetName(String widgetName, CachedRowSet crs) {
//        Map<String, Object> viewData = new HashMap<String, Object>();
//        viewData.put("name", widgetName);
//        addSelect(viewData, crs, "SwordSelect");
//    }

    public void addSelectWithCacheData(String widgetName, String tableName, String... mapping) {

        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("name", widgetName);
        addCacheSelect(viewData, "SwordSelect", tableName, mapping);
    }

    public void addSelectWithDataName(String dataName, CachedRowSet crs) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("dataName", dataName);
        addSelect(viewData, crs, "SwordSelect");
    }

    public void addSelectWithDataName(String dataName, Map<String, String> map) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("dataName", dataName);
        addSelect(viewData, map, "SwordSelect");
    }

//    public void addSelectWithWidgetName(String widgetName, Map<String, ?> map) {
//        Map<String, Object> viewData = new HashMap<String, Object>();
//        viewData.put("name", widgetName);
//        addSelect(viewData, map, "SwordSelect");
//    }

    // add
    public void addSelectWithDataName(String dataName, List<?> list, String... mapping) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("dataName", dataName);
        if(list != null && list.size() >0){
			Object obj = list.get(0);
			if (obj instanceof Map){
				List<Map<String, Object>> objMapList = (List<Map<String, Object>>)list;
				addSelect(viewData, objMapList, "SwordSelect", mapping);
			}else
				addSelectVO(viewData, list, "SwordSelect", mapping);
		}else{
			List<Map<String, Object>> objMapList = new ArrayList<Map<String, Object>>();
			addSelect(viewData, objMapList, "SwordSelect", mapping);
		}
    }

    // add
//    public void addSelectWithWidgetName(String widgetName, List<Map<String, Object>> list, String... mapping) {
//        Map<String, Object> viewData = new HashMap<String, Object>();
//        viewData.put("name", widgetName);
//        addSelect(viewData, list, "SwordSelect", mapping);
//    }

    public void addSelectWithDataName(String dataName, Object obj) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("dataName", dataName);
        addSelect(viewData, obj, "SwordSelect");
    }

//    public void addSelectWithWidgetName(String widgetName, Object obj) {
//        Map<String, Object> viewData = new HashMap<String, Object>();
//        viewData.put("name", widgetName);
//        addSelect(viewData, obj, "SwordSelect");
//    }

    public void addRadioWithWidgetName(String widgetName, CachedRowSet crs) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("name", widgetName);
        addSelect(viewData, crs, "SwordRadio");
    }

    public void addRadioWithDataName(String dataName, CachedRowSet crs) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("dataName", dataName);
        addSelect(viewData, crs, "SwordRadio");
    }

    public void addRadioWithDataName(String dataName, Map<String, String> map) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("dataName", dataName);
        addSelect(viewData, map, "SwordRadio");
    }

    public void addRadioWithWidgetName(String widgetName, Map<String, Object> map) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("name", widgetName);
        addSelect(viewData, map, "SwordRadio");
    }

    public void addRadioWithDataName(String dataName, Object obj) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("dataName", dataName);
        addSelect(viewData, obj, "SwordRadio");
    }

    public void addRadioWithWidgetName(String widgetName, Object obj) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("name", widgetName);
        addSelect(viewData, obj, "SwordRadio");
    }

    public void addCheckBoxWithWidgetName(String widgetName, CachedRowSet crs) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("name", widgetName);
        addSelect(viewData, crs, "SwordCheckBox");
    }

    public void addCheckBoxWithDataName(String dataName, CachedRowSet crs) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("dataName", dataName);
        addSelect(viewData, crs, "SwordCheckBox");
    }

    public void addCheckBoxWithDataName(String dataName, Map<String, String> map) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("dataName", dataName);
        addSelect(viewData, map, "SwordCheckBox");
    }

    public void addCheckBoxWithWidgetName(String widgetName, Map<String, Object> map) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("name", widgetName);
        addSelect(viewData, map, "SwordCheckBox");
    }

    public void addCheckBoxWithDataName(String dataName, Object obj) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("dataName", dataName);
        addSelect(viewData, obj, "SwordCheckBox");
    }

    public void addCheckBoxWithWidgetName(String widgetName, Object obj) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("name", widgetName);
        addSelect(viewData, obj, "SwordCheckBox");
    }

//    public void addListWithWidgetName(String widgetName, CachedRowSet crs) {
//        Map<String, Object> viewData = new HashMap<String, Object>();
//        viewData.put("name", widgetName);
//        addSelect(viewData, crs, "SwordList");
//    }

    public void addListWithDataName(String dataName, CachedRowSet crs) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("dataName", dataName);
        addSelect(viewData, crs, "SwordList");
    }

    public void addListWithDataName(String dataName, Map<String, String> map) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("dataName", dataName);
        addSelect(viewData, map, "SwordList");
    }

//    public void addListWithWidgetName(String widgetName, Map<String, Object> map) {
//        Map<String, Object> viewData = new HashMap<String, Object>();
//        viewData.put("name", widgetName);
//        addSelect(viewData, map, "SwordList");
//    }

    public void addListWithDataName(String dataName, Object obj) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("dataName", dataName);
        addSelect(viewData, obj, "SwordList");
    }

//    public void addListWithWidgetName(String widgetName, Object obj) {
//        Map<String, Object> viewData = new HashMap<String, Object>();
//        viewData.put("name", widgetName);
//        addSelect(viewData, obj, "SwordList");
//    }

    public void addTree(String widgetName, CachedRowSet crs) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("name", widgetName);
        buildTreeType(viewData, "SwordTree", widgetName, crs);
    }

    public void addTree(String widgetName, CachedRowSet crs, boolean loadData) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        if(loadData) {
            viewData.put("loaddata", "widget");
        }
        viewData.put("name", widgetName);
        buildTreeType(viewData, "SwordTree", widgetName, crs);
    }

    public void addTree(String widgetName, List<?> treeDatas) {
        TreeBean tb = new TreeBean();
        Map<String, Object> viewData = new HashMap<String, Object>();
        if(treeDatas != null && treeDatas.size() >0){
			Object obj = treeDatas.get(0);
			if (obj instanceof Map){
				List<Map<String, Object>> objMapList = (List<Map<String, Object>>)treeDatas;
				tb.setDataList(objMapList);
			}else{
				try {
					for (int i = 0; i < treeDatas.size(); i++) {
						Object treeobj = treeDatas.get(i);
						Field[] fields = build.getAllFields(treeobj);
						Map<String, Object> dataMap = new HashMap<String, Object>();
						for (int j = 0; j < fields.length; j++) {
							String fieldName = fields[j].getName();
							String fieldGetterName = getGetterName(fieldName);
							Method getterMethod = build.getMethod(fieldGetterName, treeobj);
							if (getterMethod != null) {
								Object value = getterMethod
										.invoke(treeobj, new Object[] {});
								dataMap.put(fieldName, value);
							}
						}
						tb.add(dataMap);
					}
				} catch (SecurityException e) {
					throw new RuntimeException(e);
				} catch (IllegalArgumentException e) {
					throw new RuntimeException(e);
				} catch (IllegalAccessException e) {
					throw new RuntimeException(e);
				} catch (InvocationTargetException e) {
					throw new RuntimeException(e);
				}
			}
		}else{
			List<Map<String, Object>> objMapList = new ArrayList<Map<String, Object>>();
			tb.setDataList(objMapList);
		}
        viewData.put("sword", "SwordTree");
        viewData.put("name", widgetName);
        tb.setViewData(viewData);
        resData.setObjectBean(tb);
        resData = DataBuilder.treeBeanToJson(resData);
    }

    public void addMultiSelectWithName(String widgetName, CachedRowSet crs) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("name", widgetName);
        buildTreeType(viewData, "SwordSelect", widgetName, crs);
    }

    public void addMultiSelectWithDataName(String widgetName, CachedRowSet crs) {
        Map<String, Object> viewData = new HashMap<String, Object>();
        viewData.put("dataName", widgetName);
        buildTreeType(viewData, "SwordSelect", widgetName, crs);
    }

    private void buildTreeType(Map<String, Object> viewData, String type, String widgetName, CachedRowSet crs) {
        viewData.put("sword", type);
        if(null != crs) {
            try {
                ResultSetMetaData metaData = crs.getMetaData();
                crs.beforeFirst();
                SelectBean sb = new SelectBean();
                int columnCount = metaData.getColumnCount();
                while(crs.next()) {
                    Map<String, Object> dataMap = new HashMap<String, Object>();
                    for(int i = 1; i <= columnCount; i++) {
                        // TODO 为三一暂改为columnName,需要再解决此问题
                        Object value = crs.getObject(metaData.getColumnName(i));
                        if(value instanceof Date) {
                            value = value.toString();
                        }
                        dataMap.put(metaData.getColumnLabel(i).toLowerCase(), value);
                    }
                    sb.add(dataMap);
                }
                sb.setViewData(viewData);
                resData.setObjectBean(sb);
                DataBuilder.selectBeanToJson(resData);
            } catch(SQLException e) {
                throw new RuntimeException(e);
            } finally {
                if(crs != null) {
                    try {
                        crs.close();
                        crs = null;
                    } catch(SQLException e) {
                        throw new RuntimeException(e);
                    }
                }
            }
        }
    }

    // ////////////////////////Util/////////////////////////////
    // private void useForBLH() {
    // try {
    // log.debug("调用类：" + StackTraceUtil.where(4));
    // Class<?> clz = Class.forName(StackTraceUtil.where(4));
    // Class<?> sClz = clz.getSuperclass();
    // if (!(sClz.newInstance() instanceof BaseDomainBLH)) {
    // throw new RuntimeException("此方法只能在BLH端调用！");
    // }
    // } catch (ClassNotFoundException e1) {
    // e1.printStackTrace();
    // } catch (InstantiationException e) {
    // e.printStackTrace();
    // } catch (IllegalAccessException e) {
    // e.printStackTrace();
    // }
    // }

    private String getSetterName(String fieldName) {
        StringBuffer sb = new StringBuffer();
        sb.append("set");
        String fieldNameFirstUpperCase = (fieldName.substring(0, 1)).toUpperCase();
        sb.append(fieldNameFirstUpperCase);
        String fieldNameLast = fieldName.substring(1);
        sb.append(fieldNameLast);
        return sb.toString();
    }

    private String getGetterName(String fieldName) {
        StringBuffer sb = new StringBuffer();
        sb.append("get");
        if(fieldName.length()>1){
          char  indexofOne = fieldName.charAt(0);
          char  indexofTwo = fieldName.charAt(1);
          String fieldNameLast = fieldName.substring(1);
          if (Character.isLowerCase(indexofOne) && Character.isUpperCase(indexofTwo)){
            sb.append(indexofOne);
            sb.append(fieldNameLast);
          }else{
            sb.append(Character.toUpperCase(indexofOne));
                  sb.append(fieldNameLast);
          }
          
        }
        return sb.toString();
    }

    public Object _getDataType(Class<?> type, String value) {
        return getDataType(type, value);
    }

    private Object getDataType(Class<?> type, String value) {
        String typeName = type.getName();
        if(value == null || "null".equalsIgnoreCase(value) || "".equals(value)) {
            return null;
        }
        if(typeName.equals("java.lang.String")) {
            return value;
        } else if(typeName.equals("java.lang.Integer")) {
            return Integer.parseInt(value);
        } else if(typeName.equals("java.lang.Float")) {
            return Float.valueOf(value);
        } else if(typeName.equals("java.lang.Long")) {
            return Long.valueOf(value);
        } else if(typeName.equals("java.lang.Double")) {
            return Double.valueOf(value);
        } else if(typeName.equals("java.sql.Date")) {
            return DateUtil.parseToDate(value);
        } else if(typeName.equals("java.sql.Timestamp")) {
            return DateUtil.parseToTimestamp(value);
        } else if(typeName.equals("java.util.Calendar")) {
            return DateUtil.parseToCalendar(value);
        }else if(typeName.equals("java.util.Date")) {
            return DateUtil.parseToDate(value);
        } else if(typeName.equals("java.math.BigDecimal")) {
            BigDecimal db = new BigDecimal(value);
            return db;
        } else if(typeName.equals("int")) {
            return Integer.parseInt(value);
        } else if(typeName.equals("float")) {
            return Float.parseFloat(value);
        } else if(typeName.equals("double")) {
            return Double.parseDouble(value);
        } else if(typeName.equals("char")) {
            return value.charAt(0);
        } else {
            return null;
        }
    }

    public String getJson() {
        if(this.getResDataObject() == null)
            return "";
        if(getResDataObject().isCustomJson()) {
            return DataBuilder.resCusJsonData(getResDataObject());
        }
        return DataBuilder.resJsonData(getResDataObject());
    }

    public void addPage(String pageName) {
        resData.putToJson("page", pageName);
    }

    public void addRootAttr(String name, Object value) {
        resData.putToJson(name, value);
    }

    public void addValidator(boolean success, String massage) {
        resData.putToJson(Const.JSON_VALIDATOR_SUCCESS, success);
        resData.putToJson(Const.JSON_VALIDATOR_MESSAGE, massage);
    }

    public void addValidator(boolean success) {
        resData.putToJson(Const.JSON_VALIDATOR_SUCCESS, success);
    }

    // 处理代码表，代码转名称
    @SuppressWarnings("unchecked")
    private String getCacheCode(Object value, CacheCode cc) {
        if(value == null || "".equals(value)) {
            return "";
        }
        String tableName;
        String codeName;
        String valueName;
        HashMap<Object, Object> map = new HashMap<Object, Object>();
        if(cc != null) {
            tableName = cc.tableName();
            codeName = cc.codeName().toUpperCase();
            valueName = cc.valueName().toUpperCase();
            if(codeName.equals("")) {
                codeName = (String) map.get("codeName".toUpperCase());
                // for oracle to upper case.
            }

            if(valueName.equals("")) {
                valueName = (String) map.get("valueName".toUpperCase());
                // for oracle to upper case.
            }
            try {
                Collection<Map<String, Object>> list = null;
                if(list == null) {
                    // list = new CacheQuery().getData(tableName, null);
                    list = (Collection<Map<String, Object>>) SwordCacheUtils.getAllDataFromKV(tableName);
                }
                if(codeName == null || valueName == null || "".equals(valueName) || "".equals(codeName)) {
                    throw new RuntimeException("codeName = " + codeName + ",valueName = " + valueName
                            + ",中codeName或者valueName为空！请检查源注释或者数据库中缓存表注册信息配置！");
                }
                for(Map<String, Object> tmp : list) {
                    Map<String, Object> codeMap = new HashMap<String, Object>();
                    codeMap = (Map<String, Object>) tmp;
                    if(codeMap.get(codeName.toUpperCase()).equals(value)) {
                        return codeMap.get(valueName.toUpperCase()).toString();
                    }
                }
            } catch(Exception e) {
                throw new RuntimeException(e);
            }
        } else {
            return value.toString();
        }
        return value.toString();
    }

    private CacheCode getCacheCode(Object obj, String getMethod) {

        CacheCode cc = null;
        try {
            Method method = build.getDeclaredMethod(obj, getMethod);
            if(method != null) {
                cc = method.getAnnotation(CacheCode.class);
            }
            return cc;
        } catch(SecurityException e) {
            throw new RuntimeException(e);
        } catch(Exception e) {
            throw new RuntimeException(e);
        }
    }

    private List<Map<String, String>> getCacheCodeConfig(String... config) {
        List<Map<String, String>> configList = new ArrayList<Map<String, String>>();
        if(config.length <= 0) {
            throw new RuntimeException("配置信息为空！");
        }
        for(String string : config) {
            Map<String, String> configMap = new HashMap<String, String>();
            String[] param = string.split(",", 0);
            if(param.length != 2) {
                throw new RuntimeException("配置信息获取错误，必须为两个参数！传入的参数：" + param.length);
            } else {
                configMap.put(ICacheCodeConfig.tableName, param[0]);
                configMap.put(ICacheCodeConfig.codeRowName, param[1]);
            }
            configList.add(configMap);
        }
        return configList;
    }

    List<?> cacheCodeList = null;

    private String getCacheCodeFromMap(Map<String, String> codeMap, String value) {
        if(value == null || "".equals(value)) {
            return "";
        }
        String tableName = codeMap.get(ICacheCodeConfig.tableName);
        // CacheQuery query = new CacheQuery();
        try {
            // cacheCodeList = new CacheQuery().getData(tableName, null);
            // for (int i = 0; i < cacheCodeList.size(); i++) {
            // Map<String, Object> codeMaps = new HashMap<String, Object>();
            // codeMaps = (Map<String, Object>) cacheCodeList.get(i);
            // if (codeName == null || valueName == null || "".equals(valueName) || "".equals(codeName)) {
            // throw new RuntimeException("codeName = " + codeName + ",valueName = " + valueName
            // + ",中codeName或者valueName为空！请检查源注释或者数据库中缓存表注册信息配置！");
            // }
            // if (codeMaps.get(codeName.toUpperCase()).toString().equals(value)) {
            // return codeMaps.get(valueName.toUpperCase()) + "";
            // }
            // }

            // ------张久旭修改--------
            // value = query.getDefaultValueByKey(tableName, new Object[] { value }).toString();

            // -------张久旭修改
            // value = (String) SwordCacheUtils.getDefaultValueFromKV(tableName, new Object[] { value });
            value = (String) SwordServiceUtils.callService("SwordCacheUtils_getDefaultValueFromKV",
                    new Object[]{tableName, new Object[]{value}}).toString();
        } catch(Exception e) {
            throw new RuntimeException(e);
        }
        return value;
    }

    // 处理代码表结束

    public Map<String, Object> getPaginationParams() {
        return this.reqData.getViewData();
    }

    public static List<Map<String, Object>> crsToList(CachedRowSet crs) throws SQLException {
        List<Map<String, Object>> dataList = new ArrayList<Map<String, Object>>();
        int colNum = crs.getMetaData().getColumnCount();
        crs.beforeFirst();
        while(crs.next()) {
            Map<String, Object> dataMap = new HashMap<String, Object>();
            for(int i = 0; i < colNum; i++) {
                dataMap.put(crs.getMetaData().getColumnLabel(i + 1), crs.getString(i + 1));
            }
            dataList.add(dataMap);
        }
        return dataList;
    }

    public void addJSTL(String name, Object data) {
        jstlDataMap = this.getJstlDataMap();
        if(data != null) {
            if(data instanceof CachedRowSet) {
                try {
                    jstlDataMap.put(name, crsToList((CachedRowSet) data));
                } catch(SQLException e) {
                    throw new RuntimeException(e);
                }
            } else {
                jstlDataMap.put(name, data);
            }
        }
    }

    // 2010 4 13日更新新接口 wjl
    public void addChart(String widgetName, String datas) {
        Map<String, String> chartsMap = new HashMap<String, String>();
        chartsMap.put("name", widgetName);
        chartsMap.put("charts", datas);
        chartsMap.put("sword", "SwordChart");
        resData.addJsonDatas(chartsMap);
    }
}
