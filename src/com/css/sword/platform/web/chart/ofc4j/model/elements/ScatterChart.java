package com.css.sword.platform.web.chart.ofc4j.model.elements;

import java.util.Arrays;
import java.util.Collection;

import com.css.sword.platform.web.chart.ofc4j.model.metadata.Element;

/**
 * scatter图修饰描述类
 * 
 * @author dengjl@css.com.cn
 * 
 */
public class ScatterChart extends Element {

	private String colour;
	private Integer dotSize;
	private ScatterDot dotstyle;
	public static final String SCATTER = "scatter";
	public static final String SCATTER_LINE = "scatter_line";

	public ScatterChart() {
		super(SCATTER);
	}

	// public void setScatterChartType_Scatter(){
	// super.setType(SCATTER);
	// }
	// public void setScatterChartType_Scatter_line(){
	// super.setType(Scatter_line);
	// }
	/**
	 * 设置类型 包括:scatter、scatter_line
	 */
	public void setScatterChartType(String type) {
		super.setType(type);
	}

	/**
	 * 添加点到集合中
	 * 
	 * @param points
	 * @return
	 */
	public ScatterChart addPoints(ScatterPoint[] points) {
		getValues().addAll(Arrays.asList(points));
		return this;
	}

	/**
	 * 添加点到集合中
	 * 
	 * @param x
	 *            、y
	 * @return
	 */
	public ScatterChart addPoint(Float x, Float y) {
		ScatterPoint[] points = new ScatterPoint[1];
		points[0] = new ScatterPoint(x, y);
		return addPoints(points);
	}

	/**
	 * 添加点到集合中
	 * 
	 * @param points
	 * @return
	 */
	public ScatterChart addPoints(Collection<?> points) {
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
	 */
	public void setColour(String colour) {
		this.colour = colour;
	}

	public Integer getDotSize() {
		return dotSize;
	}

	/**
	 * 设置数据焦点大小
	 * 
	 * @param dotsize
	 */
	public void setDotSize(Integer dotSize) {
		this.dotSize = dotSize;
	}

	public ScatterDot getDotstyle() {
		return dotstyle;
	}

	/**
	 * 设置样式
	 * 
	 * @param dotstyle
	 */
	public void setDotstyle(ScatterDot dotstyle) {
		this.dotstyle = dotstyle;
	}

	/**
	 * scatterchart图的点修饰描述类
	 * 
	 * @author dengjl@css.com.cn
	 * 
	 */
	public static class ScatterPoint {
		private Float x;// x轴
		private Float y;
		private String tip;// 提示文字
		private String colour;
		private Integer dotsize;// dot-size
		private String onclick;// on-click
		private String type;
		public static final String TYPE_HOLLOW_DOT = "hollow-dot";

		public ScatterPoint(Float x, Float y) {
			this.x = x;
			this.y = y;
		}

		public Float getX() {
			return x;
		}

		/**
		 * 设置X轴坐标
		 * 
		 * @param x
		 */
		public void setX(Float x) {
			this.x = x;
		}

		public Float getY() {
			return y;
		}

		/**
		 * 设置Y轴坐标
		 * 
		 * @param x
		 */
		public void setY(Float y) {
			this.y = y;
		}

		public String getTip() {
			return tip;
		}

		/**
		 * 设置鼠标移上文字提示
		 * 
		 * @param x
		 */
		public void setTip(String tip) {
			this.tip = tip;
		}

		public String getColour() {
			return colour;
		}

		/**
		 * 设置颜色
		 * 
		 * @param x
		 */
		public void setColour(String colour) {
			this.colour = colour;
		}

		public Integer getDotsize() {
			return dotsize;
		}

		/**
		 * 设置数据焦点大小
		 * 
		 * @param dotsize
		 */
		public void setDotsize(Integer dotsize) {
			this.dotsize = dotsize;
		}

		public String getOnclick() {
			return onclick;
		}

		/**
		 * 设置单击事件
		 * 
		 * @param x
		 */
		public void setOnclick(String onclick) {
			this.onclick = onclick;
		}

		public String getType() {
			return type;
		}

		/**
		 * 设置 类型 包括:hollow-dot
		 * 
		 * @param
		 */
		public void setType(String type) {
			this.type = type;
		}

	}

	/**
	 * scatter图的数据描述焦点修饰描述类
	 * 
	 * @author dengjl@css.com.cn
	 * 
	 */
	public static class ScatterDot {
		private String type;
		public static final String TYPE_SOLID_DOT = "solid-dot";

		public String getType() {
			return type;
		}

		/**
		 * 设置类型 包括:solid-dot
		 */
		public void setType(String type) {
			this.type = type;
		}
	}
}
