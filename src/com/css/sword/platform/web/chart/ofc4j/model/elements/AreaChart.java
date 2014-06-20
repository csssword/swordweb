package com.css.sword.platform.web.chart.ofc4j.model.elements;

import com.css.sword.platform.web.chart.ofc4j.model.metadata.OnShow;

/**
 * 区域图修饰描述类
 * @author dengjl@css.com.cn
 *
 */
public class AreaChart extends LineChart {
	/**
	 * 默认透明度
	 */
    private static transient final Float DEFAULT_ALPHA = new Float(0.35f);
    /**
     * 区域显示类型area、area_hollow等
     */
    private static final transient String AREA = "area";
    private static final transient String HOLLOW = "area_hollow";
    /**
     * 填充透明度
     */
    private Float fillAlpha;
    /**
     * 填充
     */
    private String fill;
    /**
     * 动画
     */
    private OnShow onshow;
    /**
     * AreaHollowChart构造函数
     */
    public AreaChart() {
        super(AREA);
        setFillAlpha(DEFAULT_ALPHA);
    }

    public void setAreaChartType_Area() {
        super.setType(AREA);
        setFillAlpha(DEFAULT_ALPHA);
    }
    
    public void setAreaChartType_Area_hollow() {
        super.setType(HOLLOW);
        setFillAlpha(DEFAULT_ALPHA);
    }
    /**
     * AreaHollowChart构造函数
     * @param styleName
     *
     */
    public AreaChart(String styleName) {
        super(styleName);
        setFillAlpha(DEFAULT_ALPHA);
    }

    public OnShow getOnshow() {
		return onshow;
	}
/**
 * 设置显示效果
 * @param onshow
 */
	public void setOnshow(OnShow onshow) {
		this.onshow = onshow;
	}

	/**
     * 获取透明度
     * @return fillAlpha
     *     透明度
     */
    public Float getFillAlpha() {
        return fillAlpha;
    }

    /**
     * 设置透明度
     * @param fillAlpha
     *             透明度
     */
    public AreaChart setFillAlpha(Float fillAlpha) {
        this.fillAlpha = fillAlpha;
        return this;
    }

	public String getFill() {
		return fill;
	}
/**
 * 设置填充
 * @param fill
 * @return
 */
	public AreaChart setFill(String fill) {
		this.fill = fill;
		   return this;
	}

}
