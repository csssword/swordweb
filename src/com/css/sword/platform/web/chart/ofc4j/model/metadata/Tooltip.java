
package com.css.sword.platform.web.chart.ofc4j.model.metadata;

import java.io.Serializable;

public class Tooltip implements Serializable
{
/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	//	mouse
    @SuppressWarnings("unused")
	private Integer type = null;
    private Boolean shadow;
    private Integer stroke;
    private String colour;
    private String backgroundColour;
    private String titleStyle;
    private String bodyStyle;
    private String text;
    public Tooltip() { }


    public Tooltip setType_Hover()
    {
        this.type = 1;
        return this;
    }

    public Tooltip setType_Proximity()
    {
        this.type = 2;
        return this;
    }

    public Boolean getShadow()
    {
        return shadow;
    }

    public Tooltip setShadow(Boolean shadow)
    {
        this.shadow = shadow;
        return this;
    }

    public Integer getStroke()
    {
        return stroke;
    }

    public Tooltip setStroke(Integer stroke)
    {
        this.stroke = stroke;
        return this;
    }

    public String getColour()
    {
        return colour;
    }

    public Tooltip setColour(String colour)
    {
        this.colour = colour;
        return this;
    }

    public String getBackgroundColour()
    {
        return backgroundColour;
    }

    public Tooltip setBackgroundColour(String backgroundColour)
    {
        this.backgroundColour = backgroundColour;
        return this;
    }

    public String getTitleStyle()
    {
        return titleStyle;
    }

    public Tooltip setTitleStyle(String titleStyle)
    {
        this.titleStyle = titleStyle;
        return this;
    }

    public String getBodyStyle()
    {
        return bodyStyle;
    }

    public Tooltip setBodyStyle(String bodyStyle)
    {
        this.bodyStyle = bodyStyle;
        return this;
    }


	public String getText() {
		return text;
	}


	public void setText(String text) {
		this.text = text;
	}

}
