package com.css.sword.platform.web.chart.ofc4j.model.axis;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import com.css.sword.platform.web.chart.ofc4j.OFC;

public class XAxisLabels extends Label {
    private Integer steps;
    private List<Object> labels;
    private String rotate;
    public XAxisLabels() {
        //when no labels are needed
    }
    
    public XAxisLabels(String[] labels) {
        addLabels(labels);
    }
    
    public XAxisLabels(List<?> labels) {
        addLabels(OFC.toArray(labels, String.class));
    }
    
    public List<Object> getLabels() {
        return labels;
    }
    
    public String getRotate() {
		return rotate;
	}

	public void setRotate_vertical() {
		this.rotate = "vertical";
	}
	public void setRotate_diagonal() {
		this.rotate = "diagonal";
	}
	public void setRotate_horizontal() {
		this.rotate = "horizontal";
	}

	public XAxisLabels addLabels(Object[] labels) {
        checkLabels();
        this.labels.addAll(Arrays.asList(labels));
        return this;
    }
    
    public XAxisLabels addLabels(Label[] labels) {
        checkLabels();
        this.labels.addAll(Arrays.asList(labels));
        return this;
    }
    
    public XAxisLabels addLabels(List<?> labels) {
        checkLabels();
        this.labels.addAll(labels);
        return this;
    }
    
    public XAxisLabels setSteps(Integer steps) {
        this.steps = steps;
        return this;
    }
    
    public Integer getSteps() {
        return steps;
    }
    
    private synchronized void checkLabels() {
        if (labels == null) labels = new ArrayList<Object>();
    }
}
