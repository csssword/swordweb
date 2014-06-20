package com.css.sword.platform.web.chart.ofc4j.model.elements;

import java.util.Arrays;
import java.util.List;

import com.css.sword.platform.web.chart.ofc4j.model.metadata.Element;

/**
 * 折线图基本构造修饰类
 * 
 * @author dengjl@css.com.cn
 * 
 */
public class LineChart extends Element {
	private static transient final Integer DEFAULT_FONTSIZE = new Integer(10);
	/**
	 * 宽度
	 */
	private Integer width;
	/**
	 * 点的大小(直径)
	 */
	private Integer dotSize;
	private Integer haloSize;
	/**
	 * 颜色
	 */
	private String colour;
	/**
	 * 点的样式
	 */
	private DotStyle dotstyle;
	/**
	 * 线的样式
	 */
	private LineStyle linestyle;
	/**
	 * y坐标的显示左边或者右边
	 */
	private String axis;
	/**
	 * 线的类型包括：默认line、line_dot、line_hollow
	 */
	public static final String TYPE_LINE = "line";
	public static final String TYPE_DOT = "line_dot";
	public static final String TYPE_HOLLOW = "line_hollow";

	public LineStyle getLinestyle() {
		if (null == linestyle)
			return null;
		return linestyle;
	}

	public LineChart setLinestyle(LineStyle linestyle) {
		this.linestyle = linestyle;
		return this;
	}

	public DotStyle getDotstyle() {
		if (null == dotstyle)
			return null;
		return dotstyle;
	}

	public LineChart setDotstyle(DotStyle dotstyle) {
		this.dotstyle = dotstyle;
		return this;
	}

	public LineChart() {
		this(TYPE_LINE);
	}

	/**
	 * 设置类型 包括:line、line_dot、line_hollow
	 * 
	 * @param type
	 */
	public void setType(String type) {
		super.setType(type);
	}

	protected LineChart(String type) {
		super(type);
		setFontSize(DEFAULT_FONTSIZE);
	}

	public Integer getWidth() {
		return width;
	}

	public LineChart setWidth(Integer width) {
		this.width = width;
		return this;
	}

	public Integer getDotSize() {
		return dotSize;
	}

	public LineChart setDotSize(Integer dotSize) {
		this.dotSize = dotSize;
		return this;
	}

	public String getColour() {
		return colour;
	}

	public LineChart setColour(String colour) {
		this.colour = colour;
		return this;
	}

	public String getAxis() {
		return axis;
	}

	/**
	 * 设置坐标 参数：left、right
	 * 
	 * @param axis
	 */
	public void setAxis(String axis) {
		this.axis = axis;
	}

	/**
	 * 添加折线图每个折点的数据
	 * 
	 * @param values
	 * @return
	 */
	public LineChart addValues(String[] values) {
		return addValues(Arrays.asList(values));
	}

	/**
	 * 添加折线图每个折点的数据
	 * 
	 * @param values
	 * @return
	 */
	public LineChart addValues(Integer[] values) {
		return addValues(Arrays.asList(values));
	}

	/**
	 * 添加折线图每个折点的数据
	 * 
	 * @param values
	 * @return
	 */
	public LineChart addValues(Float[] values) {
		return addValues(Arrays.asList(values));
	}

	/**
	 * 添加折线图每个折点的数据
	 * 
	 * @param values
	 * @return
	 */
	public LineChart addValues(Double[] values) {
		return addValues(Arrays.asList(values));
	}

	/**
	 * 更多的用于测试
	 * 
	 * @param value
	 * @return
	 */
	public LineChart addValues(String value) {
		String[] values = value.split(";");
		Float[] values1 = new Float[values.length];
		for (int i = 0; i < values.length; ++i) {
			values1[i] = new Float(values[i]);
		}
		return addValues(Arrays.asList(values1));
	}

	/**
	 * 添加折线图每个折点的数据
	 * 
	 * @param values
	 * @return
	 */
	public LineChart addValues(List<?> values) {
		getValues().addAll(values);
		return this;
	}

	/**
	 * 添加点(线由点组成)
	 * 
	 * @param dots
	 * @return
	 */
	public LineChart addDots(Dot[] dots) {
		return addDots(Arrays.asList(dots));
	}

	/**
	 * 添加点(线由点组成)
	 * 
	 * @param dots
	 * @return
	 */
	public LineChart addDots(List<Dot> dots) {
		getValues().addAll(dots);
		return this;
	}

	public Integer getHaloSize() {
		return haloSize;
	}

	public LineChart setHaloSize(Integer haloSize) {
		this.haloSize = haloSize;
		return this;
	}

	/**
	 * 折线图点的修饰描述类
	 * 
	 * @author dengjl@css.com.cn
	 * 
	 */
	public static class Dot {
		private Integer haloSize;
		/**
		 * 点大小
		 */
		private Integer dotSize;
		/**
		 * 数值
		 */
		private Float value;
		/**
		 * 颜色
		 */
		private String colour;
		/**
		 * 鼠标移上提示语
		 */
		private String tip;

		public Dot(Float value) {
			this(value, null, null, null);
		}

		public Dot(Float value, String colour) {
			this(value, colour, null, null);
		}

		public Dot(Float value, String colour, Integer dotSize, Integer haloSize) {
			setValue(value);
			setColour(colour);
			setDotSize(dotSize);
			setHaloSize(haloSize);
		}

		public Dot() {
			// TODO Auto-generated constructor stub
		}

		public Integer getHaloSize() {
			return haloSize;
		}

		public void setHaloSize(Integer haloSize) {
			this.haloSize = haloSize;
		}

		public Integer getDotSize() {
			return dotSize;
		}

		public void setDotSize(Integer dotSize) {
			this.dotSize = dotSize;
		}

		public Float getValue() {
			return value;
		}

		public void setValue(Float value) {
			this.value = value;
		}

		public String getColour() {
			return colour;
		}

		public void setColour(String colour) {
			this.colour = colour;
		}

		public String getTip() {
			return tip;
		}

		public void setTip(String tip) {
			this.tip = tip;
		}
	}

	/**
	 * 折线图样式修饰描述类
	 * 
	 * @author dengjl@css.com.cn
	 * 
	 */
	public static class LineStyle {
		private Integer on;
		private Integer off;
		/**
		 * 样式
		 */
		private String style;
		/**
		 * 样式类型
		 */
		public static final String STYLE_DASH = "dash";

		/**
		 * 设置样式 包括:dash
		 * 
		 * @param type
		 */
		public void setStyle(String style) {
			this.style = style;
		}

		public Integer getOn() {
			return on;
		}

		public void setOn(Integer on) {
			this.on = on;
		}

		public Integer getOff() {
			return off;
		}

		public void setOff(Integer off) {
			this.off = off;
		}

		public String getStyle() {
			return style;
		}
	}

	/**
	 * 折线图点样式修饰描述类
	 * 
	 * @author dengjl@css.com.cn
	 */
	public static class DotStyle {
		/**
		 * 点样式类型
		 */
		private String type;
		/**
		 * 透明度
		 */
		private Float alpha;
		private Integer sides;
		/**
		 * 背景透明度
		 */
		private String backgroundalpha;
		/**
		 * 背景颜色
		 */
		private String backgroundcolour;
		/**
		 * 提示语
		 */
		private String tip;
		/**
		 * 宽度
		 */
		private Integer width;
		/**
		 * 点击事件
		 */
		private String onclick;
		/**
		 * 点大小
		 */
		private Integer dotsize;
		private Integer halosize;
		/**
		 * 颜色
		 */
		private String colour;
		/**
		 * 大小
		 */
		private Integer size;
		/**
		 * 类型
		 */
		public static final String TYPE_ANCHOR = "anchor";
		public static final String TYPE_BOW = "bow";
		public static final String TYPE_HOLLOW_DOT = "hollow-dot";
		public static final String TYPE_SOLID_DOT = "solid-dot";

		// 类型
		// public enum DotType{
		// ANCHOR{
		// public String toString(){
		// return "anchor";
		// }},
		// BOW{
		// public String toString(){
		// return "bow";
		// }};
		// }

		public String getType() {
			return type;
		}

		/**
		 * 设置类型 包括:anchor、bow、hollow-dot、solid-dot
		 * 
		 * @param type
		 */

		public void setType(String type) {
			this.type = type;
		}

		public Float getAlpha() {
			return alpha;
		}

		/**
		 * 设置透明度
		 * 
		 * @param alpha
		 */
		public void setAlpha(Float alpha) {
			this.alpha = alpha;
		}

		public Integer getSides() {
			return sides;
		}

		public void setSides(Integer sides) {
			this.sides = sides;
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

		public Integer getSize() {
			return size;
		}

		/**
		 * 设置大小
		 * 
		 * @param size
		 */
		public void setSize(Integer size) {
			this.size = size;
		}

		public String getBackgroundalpha() {
			return backgroundalpha;
		}

		/**
		 * 设置背景透明度
		 * 
		 * @param backgroundAlpha
		 */
		public void setBackgroundalpha(String backgroundAlpha) {
			backgroundalpha = backgroundAlpha;
		}

		public String getBackgroundcolour() {
			return backgroundcolour;
		}

		/**
		 * 设置背景颜色
		 * 
		 * @param backgroundColour
		 */
		public void setBackgroundcolour(String backgroundColour) {
			backgroundcolour = backgroundColour;
		}

		public String getTip() {
			return tip;
		}

		/**
		 * 设置提示文字
		 * 
		 * @param tip
		 */
		public void setTip(String tip) {
			this.tip = tip;
		}

		public Integer getWidth() {
			return width;
		}

		/**
		 * 设置宽度
		 * 
		 * @param width
		 */
		public void setWidth(Integer width) {
			this.width = width;
		}

		public Integer getDotsize() {
			return dotsize;
		}

		/**
		 * 设置点大小
		 * 
		 * @param dotsize
		 */
		public void setDotsize(Integer dotsize) {
			this.dotsize = dotsize;
		}

		public Integer getHalosize() {
			return halosize;
		}

		public void setHalosize(Integer halosize) {
			this.halosize = halosize;
		}

		public String getOnclick() {
			return onclick;
		}

		/**
		 * 设置单击事件
		 * 
		 * @param onclick
		 */
		public void setOnclick(String onclick) {
			this.onclick = onclick;
		}
	}

}
