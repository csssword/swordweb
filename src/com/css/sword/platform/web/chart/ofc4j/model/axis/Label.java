package com.css.sword.platform.web.chart.ofc4j.model.axis;

public class Label {
    private String text;
    private String colour;
    private Integer size;
//    是否显示
    private Boolean visible;
//    字的倾斜角度
    private Rotation rotate;

    
    public static class Rotation {
    	public static final Rotation VERTICAL = new Rotation("vertical");
    	public static final Rotation DIAGONAL = new Rotation("diagonal");
	    public static final Rotation HORIZONTAL = new Rotation("horizontal");

	    private  String style;
	    public Rotation(String style) {
    		this.style = style;
    	}
	    
	    public static String valueOf(String s){
	    	String hhh = "";
	    	if(s.equals("VERTICAL")){
	    		hhh = "vertical";
	    	}else if(s.equals("DIAGONAL")){
	    		hhh = "diagonal";
	    	}else if(s.equals("HORIZONTAL")){
	    		hhh = "horizontal";
	    	}
			return hhh;
	    }
	    
	    public void setRotation(String style) {
    		this.style = style;
    	}

    	public  String getRotation() {
    		return style;
    	}
    	public String toString(){
    		return style;
    	}
    }

    /**
     *  构造器
     */
    public Label() {
        this(null);
    }

    /**
     *  构造器
     */
    public Label(String text) {
        setText(text);
    }

    /**
     *  获取文字
     */
    public String getText() {
        return text;
    }

    /**
     *  设置文字
     */
    public Label setText(String text) {
        this.text = text;
        return this;
    }

    /**
     *  获取颜色
     */
    public String getColour() {
        return colour;
    }

    /**
     *  设置颜色
     */
    public Label setColour(String colour) {
        this.colour = colour;
        return this;
    }

    /**
     *  获取字号
     */
    public Integer getSize() {
        return size;
    }

    /**
     *  设置字号
     */
    public Label setSize(Integer size) {
        this.size = size;
        return this;
    }

    /**
     *  获取字的倾斜角度
     */
    public Rotation getRotation() {
        return this.rotate;
    }

    /**
     *  设置字的倾斜角度
     */
    public Label setRotation(Rotation rotate) {
    	this.rotate = rotate;
        return this;
    }

    /**
     *  获取是否显示
     */
    public Boolean getVisible() {
        return visible;
    }

    /**
     *  设置是否显示
     */
    public Label setVisible(Boolean visible) {
        this.visible = visible;
        return this;
    }
}
