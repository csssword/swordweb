package com.css.sword.platform.web.chart.ofc4j.model.elements;

import java.util.Arrays;
import java.util.List;

import com.css.sword.platform.web.chart.ofc4j.model.metadata.Element;
import com.css.sword.platform.web.chart.ofc4j.model.metadata.OnShow;

/**
 * 蜡烛图修饰描述类
 * 
 * @author dengjl@css.com.cn
 * 
 */
public class CandleChart extends Element {
	public static final String NORMAL = "candle";
	// 出现动画
	private OnShow onshow;
	private String negativecolour;
	private String colour;

	/**
	 * 获取出现动画类型
	 */
	public OnShow getOnshow() {
		return onshow;
	}

	public void setOnshow(OnShow onshow) {
		this.onshow = onshow;
	}

	/**
	 * 设置出现动画类型、延迟等
	 */
	public void setOnShowType(String onShowType) {
		checkOnShow();
		this.onshow.setType(onShowType);
	}

	public void setOnShowCascade(Float cascade) {
		checkOnShow();
		this.onshow.setCascade(cascade);
	}

	public void setOnShowdelay(Float delay) {
		checkOnShow();
		this.onshow.setDelay(delay);
	}

	public void setOnShow(String onShowType, Float cascade, Float delay) {
		checkOnShow();
		this.onshow.setType(onShowType);
		this.onshow.setCascade(cascade);
		this.onshow.setDelay(delay);
	}

	public void checkOnShow() {
		if (null == this.onshow)
			this.onshow = new OnShow();
	}

	/**
	 * 构造器
	 */
	public CandleChart() {
		this(NORMAL);
	}

	/**
	 * 构造器
	 */
	public CandleChart(String style) {
		super(style);
	}

	/**
	 * 添加值 String类型
	 */
	public CandleChart addValues(String value) {
		String[] values = value.split(";");
		Integer[] values1 = new Integer[values.length];
		for (int i = 0; i < values.length; ++i) {
			values1[i] = new Integer(values[i]);
		}
		getValues().addAll(Arrays.asList(values1));
		return this;
	}

	/**
	 * 添加Number值
	 */
	public CandleChart addValues(Number[] values) {
		getValues().addAll(Arrays.asList(values));
		return this;
	}

	/**
	 * 添加String值
	 */
	public CandleChart addValues(String[] values) {
		getValues().addAll(Arrays.asList(values));
		return this;
	}

	/**
	 * 添加Double值
	 */
	public CandleChart addValues(Double[] values) {
		getValues().addAll(Arrays.asList(values));
		return this;
	}

	/**
	 * 添加Flat值
	 */
	public CandleChart addValues(Float[] values) {
		getValues().addAll(Arrays.asList(values));
		return this;
	}

	/**
	 * 添加值
	 */
	public CandleChart addValues(List<?> values) {
		getValues().addAll(values);
		return this;
	}

	/**
	 * 添加柱
	 */
	public CandleChart addCandles(Candle[] candles) {
		getValues().addAll(Arrays.asList(candles));
		return this;
	}

	/**
	 * 添加柱
	 */
	public CandleChart addCandles(List<?> candles) {
		getValues().addAll(candles);
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
	public CandleChart setColour(String colour) {
		this.colour = colour;
		return this;
	}

	public String getNegativecolour() {
		return negativecolour;
	}

	public CandleChart setNegativecolour(String negativecolour) {
		this.negativecolour = negativecolour;
		return this;
	}

	/**
	 * 单个蜡烛图的修饰描述类
	 * 
	 * @author dengjl@css.com.cn
	 * 
	 */
	public static class Candle {
		private Float top;
		private Float bottom;
		private Float low;
		private Float high;
		private String tip;// 提示文字

		public Float getTop() {
			return top;
		}

		/**
		 * 设置提示
		 * 
		 * @param top
		 */
		public void setTop(Float top) {
			this.top = top;
		}

		public Float getBottom() {
			return bottom;
		}

		/**
		 * 设置底部
		 * 
		 * @param bottom
		 */
		public void setBottom(Float bottom) {
			this.bottom = bottom;
		}

		public Float getLow() {
			return low;
		}

		/**
		 * 设置低度
		 * 
		 * @param bottom
		 */
		public void setLow(Float low) {
			this.low = low;
		}

		public Float getHigh() {
			return high;
		}

		/**
		 * 设置高度
		 * 
		 * @param bottom
		 */
		public void setHigh(Float high) {
			this.high = high;
		}

		public String getTip() {
			return tip;
		}

		/**
		 * 设置提示
		 * 
		 * @param tip
		 */
		public void setTip(String tip) {
			this.tip = tip;
		}

	}
}
