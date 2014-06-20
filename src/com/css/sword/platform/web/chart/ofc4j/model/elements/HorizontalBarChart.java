package com.css.sword.platform.web.chart.ofc4j.model.elements;

import java.util.Arrays;
import java.util.List;

import com.css.sword.platform.web.chart.ofc4j.model.metadata.Element;

/**
 * 水平柱状图修饰描述类
 * 
 * @author dengjl@css.com.cn
 * 
 */
public class HorizontalBarChart extends Element {
	/**
	 * 颜色
	 */
	private String colour;
	/**
	 * 类型
	 */
	private static final String TYPE_HBAR = "hbar";

	public HorizontalBarChart() {
		super(TYPE_HBAR);
	}

	public String getColour() {
		return colour;
	}

	public HorizontalBarChart setColour(String colour) {
		this.colour = colour;
		return this;
	}

	/**
	 * 添加HorizontalBar对象到图表中
	 * 
	 * @param values
	 * @return
	 */
	public HorizontalBarChart addHorizontalBar(HorizontalBar[] values) {
		getValues().addAll(Arrays.asList(values));
		return this;
	}

	/**
	 * 添加HorizontalBar对象到图表中
	 * 
	 * @param values
	 * @return
	 */
	public HorizontalBarChart addHorizontalBar(List<?> values) {
		getValues().addAll(values);
		return this;
	}

	/**
	 * 添加HorizontalBar对象到图表中 其中参数是用";"来分隔的。默认是右坐标数据
	 * 
	 * @param values
	 * @return
	 */
	public HorizontalBarChart addValues(String value) {
		String[] oldvalues = value.split(";");
		HorizontalBar[] values = new HorizontalBar[oldvalues.length];
		for (int i = 0; i < oldvalues.length; ++i) {
			values[i] = new HorizontalBar(new Integer(oldvalues[i]));
		}
		return addHorizontalBar(values);
	}

	/**
	 * 添加HorizontalBar对象到图表中 默认是右坐标数据
	 * 
	 * @param values
	 * @return
	 */
	public HorizontalBarChart addValues(Integer[] rightValues) {
		HorizontalBar[] values = new HorizontalBar[rightValues.length];
		for (int i = 0; i < rightValues.length; ++i) {
			values[i] = new HorizontalBar(rightValues[i]);
		}
		return addHorizontalBar(values);
	}

	/**
	 * 添加HorizontalBar对象到图表中 默认是右坐标数据
	 * 
	 * @param values
	 * @return
	 */
	public HorizontalBarChart addValues(List<?> rightValues) {
		getValues().addAll(rightValues);
		return this;
	}

	/**
	 * 添加HorizontalBar对象到图表中
	 * 
	 * @param values
	 * @return
	 */
	public HorizontalBarChart addBar(Integer left, Integer right) {
		HorizontalBar[] array = new HorizontalBar[1];
		array[0] = new HorizontalBar(left, right);
		return addHorizontalBar(array);
	}

	public HorizontalBarChart addBar(String left, String right) {
		HorizontalBar[] array = new HorizontalBar[1];
		array[0] = new HorizontalBar(Integer.valueOf(left), Integer
				.valueOf(right));
		return addHorizontalBar(array);
	}

	public HorizontalBarChart addBar(Float left, Float right) {
		HorizontalBar[] array = new HorizontalBar[1];
		array[0] = new HorizontalBar(Float.floatToIntBits(left), Float
				.floatToIntBits(right));
		return addHorizontalBar(array);
	}

	/**
	 * 每个bar的修饰描述类
	 * 
	 * @author dengjl@css.com.cn
	 * 
	 */
	public static class HorizontalBar {
		private Integer right;
		private Integer left;

		public HorizontalBar(Integer right) {
			this(null, right);
		}

		public HorizontalBar(Integer left, Integer right) {
			if (right == null)
				throw new NullPointerException("Field is mandatory.");
			this.right = right;
			setLeft(left);
		}

		public Number getRight() {
			return right;
		}

		public Number getLeft() {
			return left;
		}

		public HorizontalBar setLeft(Integer left) {
			this.left = left;
			return this;
		}
	}
}
