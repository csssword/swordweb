
package com.css.sword.platform.comm.log.csvlog;


/**
 * <p/>
 * Title: PerformanceLogAdvice </p>
 * <p/>
 * Description: </p>
 * <p/>
 * Copyright: Copyright (c) 2009 中国软件与技术服务股份有限公司 </p>
 * <p/>
 * Company: 中软网络技术股份有限公司 </p>
 *
 * @author duanxx
 * @version 1.0
 * @since 2005-8-11
 */
public class PerformanceLogAdvice /*extends AbsAroundAdvice */{

    protected Object doAroundMethod ( Object result )
            throws Throwable {
        //Calendar beforeTime = new GregorianCalendar() ;
//        Object result = invocation.process () ;
//        PerformanceLogger.writeLog ( invocation.getMethod ().getName () ,
//            invocation.getClazz ().getName () , "" , beforeTime ,
//                new GregorianCalendar() );
        return result ;
    }

}
