package com.css.sword.platform.web.exception;

/**
 * Created by IntelliJ IDEA.
 * User: CSS
 * Date: 2010-10-10
 * Time: 15:54:29
 * To change this template use File | Settings | File Templates.
 */
public interface ISwordExceptionResolver {


    public  SwordExceptionMessage deal(Throwable e);


}
