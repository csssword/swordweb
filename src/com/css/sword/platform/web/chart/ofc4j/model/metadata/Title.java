package com.css.sword.platform.web.chart.ofc4j.model.metadata;
/**
 * 标题元素
 * @author dengjl@css.com.cn
 *
 */
public class Title {
    private String text;
    private String style;
    
    public Title() {
        this(null, null);
    }
    
    public Title(String text) {
        this(text, null);
    }
    
    public Title(String text, String style) {
        setText(text);
        setStyle(style);
    }
    
    public String getText() {
        return text;
    }
    public Title setText(String text) {
        this.text = text;
        return this;
    }
    public String getStyle() {
        return style;
    }
    public Title setStyle(String style) {
        this.style = style;
        return this;
    }
}
