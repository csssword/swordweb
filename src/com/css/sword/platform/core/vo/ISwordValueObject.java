package com.css.sword.platform.core.vo;

import java.io.Serializable;

/**
 * 所有ValueObject类的接口。他没有方法，和IEvent<br>
 * 一样，他只是一个标识接口，用来表明他的实现类属于IValueObject。<br>
 * IValueObject的实现类是用来封装属性的，他的作用与javabean 相类似。<br>
 * 同时，他要为封装的属性提供setter和getter方法。<br>
 * 
 */
public interface ISwordValueObject extends Serializable {

}