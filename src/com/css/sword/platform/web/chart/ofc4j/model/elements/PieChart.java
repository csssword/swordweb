package com.css.sword.platform.web.chart.ofc4j.model.elements;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import com.css.sword.platform.web.chart.ofc4j.model.metadata.Element;

/**
 * 饼图
 * 
 * @author dengjl@css.com.cn
 * 
 */
public class PieChart extends Element {
	/**
	 * 偏离角度
	 */
	private Integer startAngle;
	/**
	 * 块颜色
	 */
	private Collection<String> colours;
	/**
	 * 是否启动动画
	 */
	private Boolean animate;
	/**
	 * 边线粗细
	 */
	private Integer border;
	/**
	 * 标签色
	 */
	private String labelColour;
	/**
	 * 是否要标签 no-labe-ls
	 */
	private Boolean noLabels;
	private Boolean gradientFill;
	/**
	 * 半径
	 */
	private String radius;

	private List<String> animates = null;

	public List<String> getAnimates() {
		if (null == animates)
			return null;
		return animates;
	}

	/**
	 * 每个块添加动画
	 * 
	 * @param values
	 *            List
	 */
	public PieChart addAnimates(List<String> values) {
		if (null == animates)
			animates = new ArrayList<String>();
		getAnimates().addAll(values);
		return this;
	}

	/**
	 * 获取半径
	 * 
	 * @return String
	 */
	public String getRadius() {
		return radius;
	}

	/**
	 * 设置半径
	 * 
	 * @return PieChart
	 */
	public PieChart setRadius(String radius) {
		this.radius = radius;
		return this;
	}

	/**
	 * 获取标签颜色
	 * 
	 * @return 标签颜色
	 */
	public String getLabelColour() {
		return labelColour;
	}

	/**
	 * 设置标签颜色
	 * 
	 * @param labelColour
	 *            标签颜色
	 */
	public void setLabelColour(String labelColour) {
		this.labelColour = labelColour;
	}

	public PieChart() {
		super("pie");
	}

	public Boolean getNoLabels() {
		return noLabels;
	}

	/**
	 * 是否显示标签
	 * 
	 * @param noLabels
	 */
	public void setNoLabels(Boolean noLabels) {
		this.noLabels = noLabels;
	}

	/**
	 * 设置是否要动画效果
	 * 
	 * @param animate
	 *            true or false
	 */
	public PieChart setAnimate(boolean animate) {
		this.animate = new Boolean(animate);
		return this;
	}

	/**
	 * 获取动画效果
	 * 
	 * @return animate true or false
	 */
	public Boolean getAnimate() {
		return animate;
	}

	/**
	 * 获取偏转角度
	 * 
	 * @return startAngle 偏转角度
	 */
	public Integer getStartAngle() {
		return startAngle;
	}

	/**
	 * 设置偏转角度
	 * 
	 * @param startAngle
	 *            偏转角度
	 */
	public PieChart setStartAngle(Integer startAngle) {
		this.startAngle = startAngle;
		return this;
	}

	/**
	 * 获取颜色
	 * 
	 * @return colours 颜色
	 */
	public Collection<String> getColours() {
		return colours;
	}

	/**
	 * 设置颜色
	 * 
	 * @param colours
	 *            Collection 颜色
	 */
	public PieChart setColours(Collection<String> colours) {
		checkColours();
		this.colours = colours;
		return this;
	}

	/**
	 * 设置颜色
	 * 
	 * @param colours
	 *            String[] 颜色
	 */
	public PieChart setColours(String[] colours) {
		checkColours();
		this.colours.clear();
		this.colours.addAll(Arrays.asList(colours));
		return this;
	}

	/**
	 * 设置颜色
	 * 
	 * @param colours
	 *            List 颜色
	 */
	public PieChart setColours(List<String> colours) {
		checkColours();
		this.colours.clear();
		this.colours.addAll(colours);
		return this;
	}

	/**
	 * 获取边线值
	 * 
	 * @return border 边线值
	 */
	public Integer getBorder() {
		return border;
	}

	/**
	 * 设置边线值
	 * 
	 * @param border
	 *            边线值
	 */
	public PieChart setBorder(Integer border) {
		this.border = border;
		return this;
	}

	/**
	 * 添加值
	 * 
	 * @param values
	 *            Number[]
	 */
	public PieChart addValues(Number[] values) {
		getValues().addAll(Arrays.asList(values));
		return this;
	}

	/**
	 * 添加值
	 * 
	 * @param value
	 *            String
	 */
	public PieChart addValues(String value) {
		String[] values = value.split(";");
		Integer[] values1 = new Integer[values.length];
		for (int i = 0; i < values.length; ++i) {
			values1[i] = new Integer(values[i]);
		}
		getValues().addAll(Arrays.asList(values1));
		return this;
	}

	/**
	 * 添加值
	 * 
	 * @param values
	 *            List
	 */
	public PieChart addValues(List<?> values) {
		getValues().addAll(values);
		return this;
	}

	/**
	 * 添加块
	 * 
	 * @param value
	 *            值
	 * @param text
	 *            描述文字
	 */
	public PieChart addSlice(Integer value, String text) {
		Slice[] array = new Slice[1];
		if (text==null)
			array[0] = new Slice(value, text);
		else
			array[0] = new Slice(value);
		return addSlices(array);
	}

	/**
	 * 添加块
	 * 
	 * @param value
	 *            值
	 * @param text
	 *            描述文字
	 */
	public PieChart addSlice(Float value, String text) {
		Slice[] array = new Slice[1];
		if (!(text == null))
			array[0] = new Slice(value, text);
		else
			array[0] = new Slice(value);
		return addSlices(array);
	}

	/**
	 * 添加块
	 * 
	 * @param PieSlice块对象数组
	 */

	public PieChart addSlices(Slice[] s) {
		getValues().addAll(Arrays.asList(s));
		return this;
	}

	/**
	 * 添加块
	 * 
	 * @param PieSlice块对象
	 *            List
	 */

	public PieChart addSlices(List<?> values) {
		getValues().addAll(values);
		return this;
	}

	private synchronized void checkColours() {
		if (colours == null)
			colours = new ArrayList<String>();
	}

	public Boolean getGradientFill() {
		return gradientFill;
	}

	public void setGradientFill(Boolean gradientFill) {
		this.gradientFill = gradientFill;
	}

	/**
	 * 饼图的每个块定义描述类 对每个饼图的每个切片进行自定义
	 * 
	 * @author dengjl@css.com.cn
	 */
	public static class Slice {
		/**
		 * 标签
		 */
		private String label;
		/**
		 * 数值
		 */
		private Integer value;
		/**
		 * 单击事件
		 */
		private String onClick;
		/**
		 * 标签色
		 */
		private String labelColour;
		private List<String> animates = null;

		/**
		 * 获得块添加动画
		 * 
		 * @param values
		 *            List
		 */
		public List<String>  getAnimates() {
			if (null == animates)
				return null;
			return animates;
		}

		/**
		 * 每个块添加动画
		 * 
		 * @param values
		 *            List
		 */
		public Slice addAnimates(List<String> values) {
			if (null == animates)
				animates = new ArrayList<String>();
			getAnimates().addAll(values);
			return this;
		}

		/**
		 * 获取每个块的标签
		 * 
		 * @return
		 */
		public String getLabel() {
			return label;
		}

		/**
		 * 设置每个块的标签
		 * 
		 * @param label
		 */
		public void setLabel(String label) {
			this.label = label;
		}

		/**
		 * 获取每个块的标签颜色
		 * 
		 * @return
		 */
		public String getLabelColour() {
			return labelColour;
		}

		/**
		 * 设置标签颜色
		 * 
		 * @param labelColour
		 */
		public void setLabelColour(String labelColour) {
			this.labelColour = labelColour;
		}

		/**
		 * 获取单击事件
		 * 
		 * @return
		 */
		public String getOnClick() {
			return onClick;
		}

		/**
		 * 设置单击事件
		 * 
		 * @param onClick
		 */
		public void setOnClick(String onClick) {
			this.onClick = onClick;
		}

		public Slice(Float value) {
			this.label = String.valueOf(value);
			this.value = Float.floatToIntBits(value);
		}

		public Slice(Integer value) {
			this.label = String.valueOf(value);
			this.value = value;
		}

		public Slice(Float value, String text) {
			this.label = String.valueOf(value);
			this.value = Float.floatToIntBits(value);
		}

		public Slice(Integer value, String text) {
			this.label = text;
			this.value = value;
		}

		/**
		 * 设置显示文字
		 * 
		 * @param text
		 */
		public void setText(String text) {
			this.label = text;
		}

		public void setValue(Integer value) {
			this.value = value;
		}

		public Number getValue() {
			return value;
		}

		public String getText() {
			return label;
		}
	}

	/**
	 * 饼图每个块动作效果描述类
	 * 
	 * @author dengjl@css.com.cn
	 * 
	 */
	public static class Animate {
		/**
		 * 类型
		 */
		private String type;
		/**
		 * 偏移量
		 */
		private Integer distance;
		/**
		 *   类型
		 */
		public static final String TYPE_FADE = "fade";
		public static final String TYPE_BOUNCE = "bounce";

		/**
		 * 设置类型 类型包括:fade、bounce类型
		 */
		public void setType(String type) {
			this.type = type;
		}

		/**
		 * 设置偏移量
		 * 
		 * @param distance
		 */
		public void setDistance(Integer distance) {
			this.distance = distance;
		}

		public Animate() {
		}

		public Animate(String type) {
			this.type = type;
		}

		public Animate(String type, Integer distance) {
			this.type = type;
			this.distance = distance;
		}

		public String getType() {
			return type;
		}

		public Integer getDistance() {
			return distance;
		}
	}
}
