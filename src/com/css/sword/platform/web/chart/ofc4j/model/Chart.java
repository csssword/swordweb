package com.css.sword.platform.web.chart.ofc4j.model;

import java.util.Arrays;
import java.util.Collection;
import java.util.Iterator;
import java.util.LinkedHashSet;

import com.css.sword.platform.web.chart.ofc4j.OFC;
import com.css.sword.platform.web.chart.ofc4j.model.axis.RadarXAxis;
import com.css.sword.platform.web.chart.ofc4j.model.axis.XAxis;
import com.css.sword.platform.web.chart.ofc4j.model.axis.YAxis;
import com.css.sword.platform.web.chart.ofc4j.model.metadata.Element;
import com.css.sword.platform.web.chart.ofc4j.model.metadata.Title;
import com.css.sword.platform.web.chart.ofc4j.model.metadata.Tooltip;

/**
 * RequestEvent用户接口DTO <br>
 * 此接口根据{@link SwordDataSet}数据模型的实现获得用户接口。<br>
 * <br>
 * Information:
 * <p>
 * <b>Package Name&nbsp;:</b> com.css.sword.platform.web.event<br>
 * <b>File Name&nbsp;&nbsp;&nbsp;&nbsp;:</b> IReqData.java<br>
 * Generate : 2009-7-1<br>
 * Copyright &copy; 2009 CS&S All Rights Reserved.<br>
 * </p>
 *
 * @author WJL <br>
 * @since Sword 4.0.0<br>
 */

/**
 * This is the most important class in the Java OFC library.
 * Start here, configuring the title, axes, legends, labels,
 * and draw-able elements in your chart.  Coerce the
 * object to a String with the toString() method to get the
 * chart data back out
 *
 * 最重要的类，配置标题、轴、    把object转成String
 * title, axes, legends, labels, and draw-able elements
 */
public class Chart {
    private Title title;
    private XAxis x_axis;
    private YAxis y_axis;
    private YAxis y_axis_right;
    private Title y_legend;
    private Title x_legend;
    private String bg_colour;
    private Collection<Object> elements = new LinkedHashSet<Object>();
    private Title tip;
    private Tooltip tooltip;
    private RadarXAxis radar_axis;

	/**
     * 获取x轴
     * @return x_axis
     *         x轴
     */
    public XAxis getXAxis() {
        return x_axis;
    }
    
    public Chart() {
        //nothing...
    }

    /**
     * 构造器
     * @param titleText
     *      标题
     */
    public Chart(String titleText) {
        this(titleText, null);
    }

    /**
     * 构造器
     * @param titleText
     *      标题
     * @param style
     *      样式
     */
    public Chart(String titleText, String style) {
        this.setTitle(new Title(titleText, style));
    }

    /**
     * 设置x轴
     * @param x_axis
     *         x轴e
     */
    public Chart setXAxis(XAxis x_axis) {
        this.x_axis = x_axis;
        return this;
    }

     public RadarXAxis getRadarAxis() {
		return radar_axis;
	}

	public Chart setRadarAxis(RadarXAxis radarAxis) {
		radar_axis = radarAxis;
		return this;
	}

	/**
     * 获取y轴
     * @return y_axis
     *         y轴
     */
    public YAxis getYAxis() {
        return y_axis;
    }

    /**
     * 设置y轴
     * @param y_axis
     *         y轴
     */
    public Chart setYAxis(YAxis y_axis) {
        this.y_axis = y_axis;
        return this;
    }

    /**
     * 设置右y轴
     * @param y_axis_right
     *         右y轴
     */
    public Chart setYAxisRight(YAxis y_axis_right) {
        this.y_axis_right = y_axis_right;
        return this;
    }

     /**
     * 获取右y轴
     * @return y_axis_right
     *         右y轴
     */
    public YAxis getYAxisRight() {
        return y_axis_right;
    }

     /**
     * 获取标题
     * @return title
     *         标题
     */
    public Title getTitle() {
        return title;
    }

    /**
     * 设置标题
     */
    public Chart setTitle(Title title) {
        this.title = title;
        return this;
    }

    public Title getTip() {
		return tip;
	}

	public Chart setTip(Title tip) {
		this.tip = tip;
		 return this;
	}

	public Tooltip getTooltip() {
		return tooltip;
	}

	public Chart setTooltip(Tooltip tooltip) {
		this.tooltip = tooltip;
		return this;
	}

	/**
     * 获取x图例
     */
    public Title getXLegend() {
        return x_legend;
    }

    /**
     * 设置x图例
     */
    public Chart setXLegend(Title x_legend) {
        this.x_legend = x_legend;
        return this;
    }

    /**
     * 获取y图例
     */
    public Title getYLegend() {
        return y_legend;
    }

    /**
     * 设置y图例
     */
    public Chart setYLegend(Title y_legend) {
        this.y_legend = y_legend;
        return this;
    }

    /**
     * 获取背景颜色
     */
    public String getBackgroundColour() {
        return bg_colour;
    }

    /**
     * 设置背景颜色
     */
    public Chart setBackgroundColour(String bg_colour) {
        this.bg_colour = bg_colour;
        return this;
    }

    /**
     * 获取元素
     */
    public Collection<Object> getElements() {
        return elements;
    }

    /**
     * 设置元素
     */
    public Chart setElements(Collection<Object> elements) {
        this.elements.clear();
        this.elements.addAll(elements);
        return this;
    }

    /**
     * 添加元素
     */
    public Chart addElements(Object e1) {
    	Object[] e = new Object[1];
    	e[0] = e1;
        elements.addAll(Arrays.asList(e));
        return this;
    }

    /**
     * 添加元素
     */
    public Chart addElements(Object[] e) {
        elements.addAll(Arrays.asList(e));
        return this;
    }

    /**
     * 添加元素
     */
    public Chart addElements(Collection<Object> coll) {
        elements.addAll(coll);
        return this;
    }

    /**
     * 删除元素
     */
    public boolean removeElement(Element e) {
        return elements.remove(e);
    }

    /**
     * 按标题查找元素
     */
    public Element getElementByText(String text) {
        Iterator<Object> it = getElements().iterator();
        while(it.hasNext() == true){
        	Element e = (Element)it.next();
        	if(e.getText().equals(text) == true){
        		return e;
        	}
        }
        return null;
    }

    /**
     * <b>重要&nbsp;:</b>将图转化为字符串，addChart()所需参数，传给页面组件 
     */
    public String toString() {
        return OFC.instance.render(this);
    }
}
