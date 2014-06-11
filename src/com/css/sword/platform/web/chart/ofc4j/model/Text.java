package com.css.sword.platform.web.chart.ofc4j.model;

public class Text {
    private String text;
    private String style;
    
    public Text() {
        this(null, null);
    }
    
    public Text(String text) {
        this(text, null);
    }
    
    public Text(String text, String style) {
        setText(text);
        setStyle(style);
    }
    
    public String getText() {
        return text;
    }
    public Text setText(String text) {
        this.text = text;
        return this;
    }
    public String getStyle() {
        return style;
    }
    public Text setStyle(String style) {
        this.style = style;
        return this;
    }
}
