package com.css.sword.platform.web.chart.ofc4j.util;

import com.thoughtworks.xstream.converters.Converter;
import com.thoughtworks.xstream.converters.MarshallingContext;
import com.thoughtworks.xstream.converters.UnmarshallingContext;
import com.thoughtworks.xstream.io.HierarchicalStreamReader;
import com.thoughtworks.xstream.io.HierarchicalStreamWriter;
import com.thoughtworks.xstream.io.path.PathTrackingWriter;

public abstract class ConverterBase implements Converter {
    public final Object unmarshal(HierarchicalStreamReader arg0, UnmarshallingContext arg1) {
        return null;
    }
    
    public final void marshal(Object o, HierarchicalStreamWriter hsw, MarshallingContext mc) {
        convert(o, (PathTrackingWriter) hsw, mc);
    }
    
    public final void writeNode(PathTrackingWriter writer, String name, Object o) {
        if (o != null) {
            writer.startNode(name, o.getClass());
            writer.setValue(o.toString());
            writer.endNode();
        }
    }
    
    public abstract void convert(Object o, PathTrackingWriter writer, MarshallingContext mc);
}
