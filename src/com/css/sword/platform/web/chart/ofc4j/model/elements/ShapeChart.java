package com.css.sword.platform.web.chart.ofc4j.model.elements;

import java.util.Arrays;
import java.util.List;

import com.css.sword.platform.web.chart.ofc4j.model.metadata.Element;

/**
 * share图修饰描述类
 * 
 * @author dengjl@css.com.cn
 * 
 */
public class ShapeChart extends Element {

	private String colour;

	public static final String TYPE_SHAPE = "shape";

	public ShapeChart() {
		this(TYPE_SHAPE);
	}

	public ShapeChart(String colour) {
		super(TYPE_SHAPE);
		setColour(colour);
	}

	/**
	 * 添加点
	 * 
	 * @param points
	 * @return
	 */
	public ShapeChart addPoints(ShapeChartPoint... points) {
		getValues().addAll(Arrays.asList(points));
		return this;
	}

	/**
	 * 添加点
	 * 
	 * @param points
	 * @return
	 */
	public ShapeChart addPoints(List<ShapeChartPoint> points) {
		getValues().addAll(points);
		return this;
	}

	public String getColour() {
		return colour;
	}

	/**
	 * 设置颜色
	 * 
	 * @param colour
	 * @return
	 */
	public ShapeChart setColour(String colour) {
		this.colour = colour;
		return this;
	}

	/**
	 * share图的点修饰描述类
	 * 
	 * @author dengjl@css.com.cn
	 * 
	 */
	public static class ShapeChartPoint {

		private final Integer x;// x轴坐标
		private final Integer y;

		public ShapeChartPoint(Integer x, Integer y) {
			this.x = x;
			this.y = y;
		}

		/**
		 * 获得X轴坐标
		 * 
		 * @return
		 */
		public Integer getX() {
			return x;
		}

		/**
		 * 获得Y轴坐标
		 * 
		 * @return
		 */
		public Integer getY() {
			return y;
		}
	}
}