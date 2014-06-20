package com.css.sword.platform.web.chart.ofc4j.util;

import com.css.sword.platform.web.chart.ofc4j.model.elements.ScatterChart;
import com.css.sword.platform.web.chart.ofc4j.model.elements.ScatterChart.ScatterPoint;
import com.thoughtworks.xstream.converters.MarshallingContext;
import com.thoughtworks.xstream.io.path.PathTrackingWriter;

public class ScatterChartPointConverter extends ConverterBase {
	@SuppressWarnings("rawtypes")
	public boolean canConvert(Class c) {
		return ScatterChart.ScatterPoint.class.isAssignableFrom(c);
	}

	public void convert(Object b, PathTrackingWriter writer,
			MarshallingContext mc) {
		ScatterPoint o = (ScatterPoint) b;
		writeNode(writer, "x", o.getX());
		writeNode(writer, "y", o.getY());
	}
}
