package com.css.sword.platform.web.controller;

import com.css.sword.kernel.utils.SwordIoCUtils;
import com.css.sword.platform.comm.log.LogFactory;
import com.css.sword.platform.comm.log.LogWritter;
import com.css.sword.platform.comm.pool.ThreadLocalManager;
import com.css.sword.platform.web.comm.CommParas;
import com.css.sword.platform.web.context.ContextAPI;
import com.css.sword.platform.web.event.IReqData;
import com.css.sword.platform.web.event.SwordReq;
import com.css.sword.platform.web.event.SwordRes;
import com.css.sword.platform.web.exception.BizRuntimeException;
import com.css.sword.platform.web.servlet.Sword;

import java.io.Serializable;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.Map;

/**
 * Controller Invoke类 <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.comm<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> ReflectHelper.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 *
 * @author YuanTong, wjl <br>
 * @since Sword 4.0.0<br>
 */
public class DoController implements Serializable {

    private static final long serialVersionUID = 6891117434018521184L;
    protected static final LogWritter log = LogFactory.getLogger(DoController.class);

    public static void execute(String className, String methodName) {
        try {
            Map<String, String> ctrlMap = CtrlClassScanner.ctrlMap;
            String cN = ctrlMap.get(className);
            if(cN == null) {
               log.error("系统中没有注释为" + className + "的Ctrl类!");
               throw new RuntimeException("系统中没有注释为" + className + "的Ctrl类!");
            }
            Class<?> ownerClass = Class.forName(cN);
            Method mm = ownerClass.getMethod(methodName, new Class[]{IReqData.class});
            if(mm == null) {
                log.error("类" + className + "中没有为空的" + methodName + "方法");
                throw new RuntimeException("类" + className + "中没有为空的" + methodName + "方法");
            } else {
            	Object objInstance;
            	if(Sword.useIoC){
            		objInstance = SwordIoCUtils.findBean(ownerClass);
            		if(objInstance  ==null){
            			objInstance = ownerClass.newInstance();
            		}
            	}else{
            		objInstance = ownerClass.newInstance();
            	}
                SwordRes res = (SwordRes) mm.invoke(objInstance, new Object[]{new SwordReq(null, ContextAPI.getReqDataSet())});
                if(res == null) {
                    ThreadLocalManager.add(CommParas.resDataSet, null);
                } else {
                    ThreadLocalManager.add(CommParas.resDataSet, res.getResDataSet());
                }
            }
        } catch(ClassNotFoundException e) {
            log.error("找不到类" + className);
            throw new RuntimeException(e);
        } catch(NoSuchMethodException e) {
            log.error("找不到类" + className + "的" + methodName + "方法");
            throw new RuntimeException(e);
        } catch(InstantiationException e) {
            log.error("类" + className + "实例化对象实例化失败");
            throw new RuntimeException(e);
        } catch(IllegalArgumentException e) {
            log.error(methodName + "方法执行时失败");
            throw new RuntimeException(e);
        } catch(IllegalAccessException e) {
            log.error(methodName + "方法执行时失败");
            throw new RuntimeException(e);
        } catch(InvocationTargetException e) {
            if(e.getCause() != null) {
                if(e.getCause() instanceof BizRuntimeException) {
                    return;
                }
            }
            log.error(methodName + "方法执行时失败");
            throw new RuntimeException(e);
        }
    }

    public static Object create(String className) {
        try {
            Class<?> ownerClass = Class.forName(className);
            Object objInstance = ownerClass.newInstance();
            return objInstance;
        } catch(ClassNotFoundException e) {
            log.error("找不到类" + className);
            throw new RuntimeException(e);
        } catch(InstantiationException e) {
            log.error("类" + className + "实例化对象实例化失败");
            throw new RuntimeException(e);
        } catch(IllegalAccessException e) {
            log.error("类" + className + "实例化对象实例化失败");
            throw new RuntimeException(e);
        }
    }

}