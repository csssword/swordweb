package com.css.sword.platform.web.chart.ofc4j.model.axis;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class YAxis extends Axis {
    private Integer tick_length;
    private List<String> labels;
    private boolean grid_visible;
    /**
     *  设置指示线长度
     */
    public YAxis setTickLength(Integer tick_length) {
        this.tick_length = tick_length;
        return this;
    }

     /**
     *  获取指示线长度
     */
    public Integer getTickLength() {
        return tick_length;
    }

     /**
     *  设置文字
     */
    public YAxis setLabels(String[] labels) {
        checkLabels();
        this.labels.clear();
        return addLabels(labels);
    }

     public boolean isGrid_visible() {
		return grid_visible;
	}

	public void setGrid_visible(boolean gridVisible) {
		grid_visible = gridVisible;
	}

	/**
     *  添加文字
     */
    public YAxis addLabels(String[] labels) {
        checkLabels();
        this.labels.addAll(Arrays.asList(labels));
        return this;
    }

     /**
     *  添加文字
     */
    public YAxis addLabels(List<String> labels) {
        checkLabels();
        this.labels.addAll(labels);
        return this;
    }
    
    public List<String> getLabels() {
        return labels;
    }
    
    private synchronized void checkLabels() {
        if (labels == null) labels = new ArrayList<String>();
    }    
}
