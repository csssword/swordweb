package com.css.sword.platform.web.chart.ofc4j.model.metadata;

import java.util.ArrayList;
import java.util.List;

public abstract class Element {
    private  String type;
//透明度
    private Float alpha;
    private String text;
    private Integer fontSize;
//  鼠标移动过时浮起的字
//    #top# 不定义时的默认字样
//    #val# 数值
//    #bottom# 底值
//    #total# 总数值
//    #percent# 占总数百分比
//    #radius# 半径 todo
//    	#left# - the left value 
//    	#right# - the right value 
//    	#val# - the width of the bar 

    private String tooltip;
    @SuppressWarnings("unused")
	private String bgColour;
    private List<Object> values = new ArrayList<Object>();
    
    protected Element(String type) {
        this.type = type;
    }
    /**
     * 设置类型
     * @param type
     */
    public void setType(String type) {
		this.type = type;
	}
    public String getType() {
        return type;
    }

    public Float getAlpha() {
        return alpha;
    }

	/**
	 * 设置透明度
	 * @param alpha
	 * @return
	 */
    public Element setAlpha(Float alpha) {
        this.alpha = alpha;
        return this;
    }

    public String getText() {
        return text;
    }
/**
 *  设置文字
 * @param text
 * @return
 */
    public Element setText(String text) {
        this.text = text;
        return this;
    }

    public Integer getFontSize() {
        return fontSize;
    }

    public Element setFontSize(Integer fontSize) {
        this.fontSize = fontSize;
        return this;
    }
    
    public List<Object> getValues() {
        return values;
    }
    /**
     * 设置鼠标移上时显示文字
     * 鼠标移动过时浮起的字
     * #top# 不定义时的默认字样
     * #val# 数值
     * #bottom# 底值
     * #total# 总数值
     * #percent# 占总数百分比
     * #radius# 半径 todo
     * #left# - the left value 
     * #right# - the right value 
     * #val# - the width of the bar 
     * @param tooltip
     * @return
     */
    public Element setTooltip(String tooltip) {
        this.tooltip = tooltip;
        return this;
    }
    
    public String getTooltip() {
        return tooltip;
    }
    
}
