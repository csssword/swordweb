
package com.css.sword.platform.core.event;

import java.io.Serializable;

/**
 * <p>Title: IResponseEvent</p> 
 * <p>Description: 所有返回时间的接口</p> 
 * <p>Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司</p>
 * <p>Company: 应用产品研发中心</p>
 *
 * @author wwq
 * @version 1.0
 * @since 4.0
 */
public interface IResponseEvent extends Cloneable , Serializable {

    /**
     * 表明是否是一个ResponseEvent
     *
     * @return
     */
    boolean isOne ();
    
    void setCostTime(long costTime);
    
    long getCostTime();
    
    boolean isSuccess();
}
