package com.css.sword.platform.web.chart.ofc4j.util;

import com.css.sword.platform.web.chart.ofc4j.model.elements.BarChart;
import com.css.sword.platform.web.chart.ofc4j.model.elements.FilledBarChart;
import com.css.sword.platform.web.chart.ofc4j.model.elements.SketchBarChart;
import com.thoughtworks.xstream.converters.MarshallingContext;
import com.thoughtworks.xstream.io.path.PathTrackingWriter;

public class BarConverter extends ConverterBase {
    
	@SuppressWarnings("rawtypes")
	public boolean canConvert(Class clazz) {
		return BarChart.Bar.class.isAssignableFrom(clazz);
	}

	public void convert(Object o, PathTrackingWriter writer,MarshallingContext mc) {
		// TODO Auto-generated method stub
		BarChart.Bar b=(BarChart.Bar)o;
		writeNode(writer, "top", b.getTop());
        writeNode(writer, "bottom", b.getBottom());
        writeNode(writer, "colour", b.getColour());
        writeNode(writer, "tip", b.getTooltip());
        if (b instanceof FilledBarChart.Bar) {
            writeNode(writer, "outline-colour", ((FilledBarChart.FilledBar)b).getOutlineColour());
            writeNode(writer, "on-click", ((FilledBarChart.FilledBar)b).getOnClick());
        }
        if (b instanceof SketchBarChart.Bar) {
            writeNode(writer, "offset", ((SketchBarChart.Bar)b).getFunFactor());
        }
	}
}
