package com.css.sword.platform.web.chart.ofc4j.model.axis;

import java.util.List;


public class XAxis extends Axis {
    private Integer tick_height;
    private Integer height3d;

    private XAxisLabels labels = new XAxisLabels();

    /**
     *  获取3d高度
     */
    public Integer getHeight3d() {
        return height3d;
    }

    /**
     *  设置3d高度
     */
    public void setHeight3d(Integer height3d) {
        this.height3d = height3d;
    }

    /**
     *  设置指示线高度
     */
    public XAxis setTickHeight(Integer tick_height) {
        this.tick_height = tick_height;
        return this;
    }

     /**
     *  获取指示线高度
     */
    public Integer getTickHeight() {
        return tick_height;
    }

    /**
     *  获取文字
     */
    public XAxisLabels getLabels() {
        return labels;
    }

     /**
     *  设置文字
     */
    public XAxis setXAxisLabels(XAxisLabels labels) {
        this.labels = labels;
        return this;
    }

      /**
     *  设置文字
     */
    public XAxis setLabels(String[] labels) {
        this.labels = new XAxisLabels(labels);
        return this;
    }

    /**
     *  设置字的倾斜角度
     */
    public XAxis setRotation_vertical() {
    	 this.labels.setRotate_vertical();
        return this;
    }
    public XAxis setRotate_diagonal() {
   	 this.labels.setRotate_diagonal();
       return this;
   }
    public XAxis setRotate_horizontal() {
   	 this.labels.setRotate_horizontal();
       return this;
   }
     /**
     *  设置文字
     */
    public XAxis setLabels(List<?> labels) {
        this.labels = new XAxisLabels(labels);
        return this;
    }
    
    public XAxis addLabels(String[] labels) {
        this.labels.addLabels(labels);
        return this;
    }

     /**
     *  添加文字
     */
    public XAxis addLabels(Label[] labels) {
        this.labels.addLabels(labels);
        return this;
    }
    /**
     *  添加文字
     */
    public XAxis addLabels(List<?> labels) {
        this.labels.addLabels(labels);
        return this;
    }
}
