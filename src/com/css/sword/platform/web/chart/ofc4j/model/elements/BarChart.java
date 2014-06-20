package com.css.sword.platform.web.chart.ofc4j.model.elements;

import java.util.Arrays;
import java.util.List;

import com.css.sword.platform.web.chart.ofc4j.model.metadata.Element;
import com.css.sword.platform.web.chart.ofc4j.model.metadata.OnShow;

/**
 * 柱状图的基本构造修饰类
 * 
 * @author dengjl@css.com.cn
 * 
 */
public class BarChart extends Element {
	/**
	 * 柱状图的类型bar、bar_3d、bar_glass
	 */
	public static final String TYPE_BAR = "bar";
	public static final transient String TYPE_BAR_3D = "bar_3d";
	public static final transient String TYPE_BAR_GLASS = "bar_glass";
	public static final transient String TYPE_BAR_CYLINDER = "bar_cylinder";
	public static final transient String TYPE_BAR_ROUND_GLASS = "bar_round_glass";
	public static final transient String TYPE_BAR_ROUND = "bar_round";
	public static final transient String TYPE_BAR_DOME = "bar_dome";
	
	private String colour;
	/**
	 * 显示动画
	 */
	private OnShow onShow;
	/**
	 * 设置纵坐标左边还是右边
	 */
	private String axis;

	/**
	 * 获取出现动画类型
	 */
	public OnShow getOnShow() {
		return onShow;
	}

	/**
	 * 设置出现动画类型、延迟等
	 */
	public void setOnShowType(String onShowType) {
		checkOnShow();
		this.onShow.setType(onShowType);
	}

	public void setOnShowCascade(Float cascade) {
		checkOnShow();
		this.onShow.setCascade(cascade);
	}
	/**
	 * 设置出现动画类型、延迟等
	 */
	public void setOnShowdelay(Float delay) {
		checkOnShow();
		this.onShow.setDelay(delay);
	}
	/**
	 * 设置出现动画类型、延迟等
	 */
	public void setOnShow(String onShowType, Float cascade, Float delay) {
		checkOnShow();
		this.onShow.setType(onShowType);
		this.onShow.setCascade(cascade);
		this.onShow.setDelay(delay);
	}

	public void checkOnShow() {
		if (null == this.onShow)
			this.onShow = new OnShow();
	}

	/**
	 * 构造器
	 */
	public BarChart() {
		this(TYPE_BAR);
	}

	/**
	 * 构造器
	 */
	public BarChart(String style) {
		super(style);
	}

	/**
	 * 添加值 String类型，更多的用于测试
	 */
	public BarChart addValues(String value) {
		String[] values = value.split(";");
		Integer[] values1 = new Integer[values.length];
		for (int i = 0; i < values.length; ++i) {
			values1[i] = new Integer(values[i]);
		}
		getValues().addAll(Arrays.asList(values1));
		return this;
	}

	/**
	 * 柱状图添加柱显示数据
	 * 
	 * @param values
	 * @return
	 */
	public BarChart addValues(Integer[] values) {
		getValues().addAll(Arrays.asList(values));
		return this;
	}

	/**
	 * 柱状图添加柱显示数据
	 * 
	 * @param values
	 * @return
	 */
	public BarChart addValues(String[] values) {
		getValues().addAll(Arrays.asList(values));
		return this;
	}

	/**
	 * 柱状图添加柱显示数据
	 * 
	 * @param values
	 * @return
	 */

	public BarChart addValues(Double[] values) {
		getValues().addAll(Arrays.asList(values));
		return this;
	}

	/**
	 * 柱状图添加柱显示数据
	 * 
	 * @param values
	 * @return
	 */
	public BarChart addValues(Float[] values) {
		getValues().addAll(Arrays.asList(values));
		return this;
	}

	/**
	 * 柱状图添加柱显示数据
	 * 
	 * @param values
	 * @return
	 */
	public BarChart addValues(List<?> values) {
		getValues().addAll(values);
		return this;
	}

	/**
	 * 添加柱
	 */
	public BarChart addBars(Bar[] bars) {
		getValues().addAll(Arrays.asList(bars));
		return this;
	}

	/**
	 * 添加柱
	 */
	public BarChart addBars(List<?> bars) {
		getValues().addAll(bars);
		return this;
	}

	/**
	 * 获取颜色
	 */
	public String getColour() {
		return colour;
	}

	/**
	 * 设置颜色
	 */
	public BarChart setColour(String colour) {
		this.colour = colour;
		return this;
	}

	public String getAxis() {
		return axis;
	}

	public void setAxis(String axis) {
		this.axis = axis;
	}

	/**
	 * 单个bar的修饰
	 * 
	 * @author dengjl@css.com.cn
	 * 
	 */
	public static class Bar {
		private Integer top;
		private Integer bottom;
		/**
		 * 颜色
		 */
		private String colour;
		/**
		 * 鼠标移动上的字
		 */
		private String tooltip;

		public Bar() {
		}

		public Bar(Integer top, Integer bottom, String colour) {
			setTop(top);
			setBottom(bottom);
			setColour(colour);
		}

		public Bar(Integer top, Integer bottom) {
			this(top, bottom, null);
		}

		public Bar(Integer top, String colour) {
			this(top, null, colour);
		}

		public Bar(Integer top) {
			this(top, null, null);
		}

		public Number getTop() {
			return top;
		}

		public void setTop(Integer top) {
			this.top = top;
		}

		public Number getBottom() {
			return bottom;
		}

		public void setBottom(Integer bottom) {
			this.bottom = bottom;
		}

		public String getColour() {
			return colour;
		}
		/**
		 *  设置颜色
		 * @param colour
		 */
		public void setColour(String colour) {
			this.colour = colour;
		}

		public String getTooltip() {
			return tooltip;
		}

		/**
		 * 
		 * @param tooltip
		 */
		public void setTooltip(String tooltip) {
			this.tooltip = tooltip;
		}
	}
}
