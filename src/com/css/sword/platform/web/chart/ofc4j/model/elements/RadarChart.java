package com.css.sword.platform.web.chart.ofc4j.model.elements;

/**
 * 雷达图修饰描述类
 * 
 * @author dengjl@css.com.cn
 * 
 */
public class RadarChart extends LineChart {
	public static final String TYPE_LINE = "line";
	public static final String TYPE_AREA = "area";
	// 环数
	private boolean loop;

	public RadarChart() {
		super();
	}

	/**
	 * 设置类型 包括:line、area
	 */
	public void setType(String type) {
		super.setType(type);
	}

	public boolean isLoop() {
		return loop;
	}

	/**
	 * 设置环数
	 * 
	 * @param loop
	 * @return
	 */
	public RadarChart setLoop(boolean loop) {
		this.loop = loop;
		return this;
	}

}
