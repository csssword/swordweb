package com.css.sword.platform.web.chart.ofc4j.model.elements;

import java.util.Arrays;
import java.util.List;

/**
 * 实体平面填充柱状图修饰类
 * @author dengjl@css.com.cn
 *
 */
public class FilledBarChart extends BarChart {
	/**
	 * bar的实体填充类型bar_filled(二维平面)
	 */
    public static final transient String TYPE_BAR_FILLED="bar_filled";
    /**
     * 数据显示类型
     */
    public static final transient String TYPE_TGAGS="tags";
    /**
     *数据显示格式
     */
    public static final transient String ALIGN_COORDINATE_CENTER="center";
    public static final transient String ALIGN_COORDINATE_ABOVE="above";
	
    /**
     * 轮廓颜色
     */
    private String outlineColour;
    /**
     * 柱状图上数据(或标签)显示X坐标
     */
    private int pad_x;
    /**
     * 柱状图上数据(或标签)显示Y坐标
     */
    private int pad_y;
    /**
     * 旋转角度
     */
    private int rotate;
    /**
     * 柱状图上数据(或标签)X坐标显示格式(center、left、right)
     */
    private String align_x;
    /**
     * 柱状图上数据(或标签)Y坐标显示格式(center、above、below)
     */
    private String align_y;
    /**
     *  字体大小
     */
    private String font;
    /**
     * 默认构造函数
     */
    public FilledBarChart() {
        super(TYPE_BAR_FILLED);
    }
    
    public FilledBarChart(String colour, String outlineColour) {
        super(TYPE_BAR_FILLED);
        setColour(colour);
        setOutlineColour(outlineColour);
    }
    
    protected FilledBarChart(String type) {
        super(type);
    }
    
    public String getOutlineColour() {
        return outlineColour;
    }
	
	/**
	 * 添加柱状图的标签(或数据)
	 * @param points
	 * @return
	 */
	public FilledBarChart addPoints(TagsPoint... tags) {
		getValues().addAll(Arrays.asList(tags));
		return this;
	}
	/**
	 *  添加柱状图的标签(或数据)
	 * @param tags
	 * @return
	 */
	public FilledBarChart addPoints(List<TagsPoint> tags) {
		getValues().addAll(tags);
		return this;
	}
    
    public int getPad_x() {
		return pad_x;
	}

    /**
     * 设置x坐标
     * @param padX
     */
	public void setPad_x(int padX) {
		pad_x = padX;
	}

	public int getPad_y() {
		return pad_y;
	}

	/**
	 * 设置y坐标
	 * @param padY
	 */
	public void setPad_y(int padY) {
		pad_y = padY;
	}

	public int getRotate() {
		return rotate;
	}
	/**
	 * 设置旋转度
	 * @param rotate
	 */
	public void setRotate(int rotate) {
		this.rotate = rotate;
	}

	public String getAlign_x() {
		return align_x;
	}

	/**
	 * 设置基于X轴的显示格式
	 * @param alignX
	 */
	public void setAlign_x(String alignX) {
		align_x = alignX;
	}

	public String getAlign_y() {
		return align_y;
	}

	/**
	 * 设置基于Y轴的显示格式
	 * @param alignY
	 */
	public void setAlign_y(String alignY) {
		align_y = alignY;
	}

	public String getFont() {
		return font;
	}

	/**
	 * 设置字体大小
	 * @param font
	 */
	public void setFont(String font) {
		this.font = font;
	}

	/**
     * 设置轮廓颜色
     * @param outlineColour
     * @return
     */
    public BarChart setOutlineColour(String outlineColour) {
        this.outlineColour = outlineColour;
        return this;
    }
    
    /**
     * 状图的每个条的具体修饰类
     * @author dengjl@css.com.cn
     *
     */
    
    public static class FilledBar extends BarChart.Bar {
    	/**
    	 * 轮廓颜色
    	 */
        private String outlineColour;
        /**
         * 单击事件
         */
        private String onClick;
   
		public FilledBar(){}
        public FilledBar(Integer top, Integer bottom) {
            super(top, bottom);
        }
        
        public FilledBar(Integer top, Integer bottom, String colour, String outlineColour) {
            super(top, bottom);
            setColour(colour);
            setOutlineColour(outlineColour);
        }
        
        public FilledBar(Integer top) {
            super(top);
        }
        /**
         * 设置轮廓颜色
         * @param outlineColour
         */
        public void setOutlineColour(String outlineColour) {
            this.outlineColour = outlineColour;
        }
        public String getOutlineColour() {
            return outlineColour;
        }
        
        public String getOnClick() {
			return onClick;
		}
        /**
         * 设置单击事件
         * @param onClick
         */
		public void setOnClick(String onClick) {
			this.onClick = onClick;
		}
    }
    
    /**
     * 柱状图的标签(或数据)修饰描述类
     * @author dengjl@css.com.cn
     *
     */
	public static class TagsPoint {
		/**
		 * X轴坐标(序号)
		 */
		private final Integer x;
		/**
		 * Y轴坐标
		 */
		private final Float y;
		/**
		 * 柱状图的标签显示方式
		 */
		private String align_y;
		/**
		 *  字体大小
		 */
		private String font;
		/**
		 * 字体
		 */
		private String bold;
		/**
		 * 标签内容
		 */
		private String text;
		/**
		 * 单击事件
		 */
		private String on_click;
		/**
		 * 颜色
		 */
		private String colour;
		/**
		 * 下划线
		 */
		private boolean underline;
		/**
		 * 偏移量
		 */
		private int rotate;
		/**
		 * 标签内容显示格式
		 */
		public static final String ALIGN_Y_BELOW="below";
		public static final String ALIGN_Y_CENTER="center";
		public static final String ALIGN_Y_ABOVE="above";

		public TagsPoint(Integer x, Float y) {
			this.x = x;
			this.y = y;
		}

		/**
		 * 获得X轴坐标
		 * @return
		 */
		public Integer getX() {
			return x;
		}
		/**
		 * 获得Y轴坐标
		 * @return
		 */
		public Float getY() {
			return y;
		}

		public String getAlign_y() {
			return align_y;
		}

		/**
		 * 柱状图的标签显示方式(上面(默认不设置)、下面:below)
		 * @param alignY
		 */
		public void setAlign_y(String alignY) {
			align_y = alignY;
		}

		public String getFont() {
			return font;
		}

		/**
		 * 设置大小
		 * @param font
		 */
		public void setFont(String font) {
			this.font = font;
		}

		public String isBold() {
			return bold;
		}

		/**
		 * 设置字体
		 * @param bold
		 */
		public void setBold(String bold) {
			this.bold = bold;
		}

		public String getText() {
			return text;
		}
		/**
		 * 设置标签内容
		 * @param text
		 */
		public void setText(String text) {
			this.text = text;
		}

		public String getOn_click() {
			return on_click;
		}

		/**
		 * 设置单击链接地址
		 * @param onClick
		 */
		public void setOn_click(String onClick) {
			on_click = onClick;
		}

		public String getColour() {
			return colour;
		}

		/**
		 * 设置颜色
		 * @param colour
		 */
		public void setColour(String colour) {
			this.colour = colour;
		}

		public boolean isUnderline() {
			return underline;
		}

		/**
		 * 设置下划线
		 * @param underline
		 */
		public void setUnderline(boolean underline) {
			this.underline = underline;
		}

		public int getRotate() {
			return rotate;
		}

		/**
		 * 设置偏移量
		 * @param rotate
		 */
		public void setRotate(int rotate) {
			this.rotate = rotate;
		}
		
	}

	
}
