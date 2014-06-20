package com.css.sword.platform.web.chart.ofc4j.model.metadata;

/*
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import com.thoughtworks.xstream.converters.ConverterMatcher;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
public @interface Converter {
    Class<? extends ConverterMatcher> value();
}

*/
public interface Converter {
    Class<?> value();
}

