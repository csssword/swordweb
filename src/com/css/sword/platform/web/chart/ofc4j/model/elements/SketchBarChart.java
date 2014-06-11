package com.css.sword.platform.web.chart.ofc4j.model.elements;

/**
 * 素描柱状图修饰描述类
 * 
 * @author dengjl@css.com.cn
 * 
 */
public class SketchBarChart extends FilledBarChart {
	private static final transient String TYPE = "bar_sketch";
	private Integer funFactor;

	public SketchBarChart() {
		super(TYPE);
	}

	public SketchBarChart(String colour, String outlineColour, Integer funFactor) {
		super(TYPE);
		setColour(colour);
		setOutlineColour(outlineColour);
		setFunFactor(funFactor);
	}

	public Integer getFunFactor() {
		return funFactor;
	}

	/**
	 * 设置因子数
	 * 
	 * @return
	 */
	public BarChart setFunFactor(Integer funFactor) {
		this.funFactor = funFactor;
		return this;
	}

	/**
	 * 素描柱状图的每个块的修饰描述类
	 * 
	 * @author dengjl@css.com.cn
	 * 
	 */
	public static class Bar extends FilledBarChart.Bar {
		private Integer funFactor;// 因子数

		public Bar(Integer top) {
			super(top);
		}

		public Bar(Integer top, Integer funFactor) {
			super(top);
			setFunFactor(funFactor);
		}

		public Bar(Integer top, Integer bottom, Integer funFactor) {
			super(top, bottom);
			setFunFactor(funFactor);
		}

		/**
		 * 设置因子数
		 * 
		 * @return
		 */
		public Bar setFunFactor(Integer funFactor) {
			this.funFactor = funFactor;
			return this;
		}

		public Integer getFunFactor() {
			return funFactor;
		}
	}
}
