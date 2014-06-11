


package com.css.sword.platform.web.chart.ofc4j.model.elements;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

import com.css.sword.platform.web.chart.ofc4j.model.metadata.Element;
import com.css.sword.platform.web.chart.ofc4j.model.metadata.OnShow;

/**
 * 栈柱状图修饰描述类
 * @author dengjl@css.com.cn
 *
 */
public class StackedBarChart extends Element {
  
    private List<Key> keys = new ArrayList<Key>();
	// 模块颜色
	private Collection<String> colours;
	private String onclick;
//  出现动画
    private OnShow onshow;
    private static final String TYPE_BAR_STACK="bar_stack";
    
    public StackedBarChart() {
        super(TYPE_BAR_STACK);
    }
    
    /**
     * 获取出现动画类型
     */
    public OnShow getOnshow() {
        return onshow;
    }

    /**
     * 设置出现动画类型、延迟等
     * 类型包括：pop、grow-up、drop
     */
    public void setOnshowType(String type) {
    	checkOnshow();
        this.onshow.setType(type);
    }
//    public void setOnshowType_grow_up() {
//    	checkOnshow();
//        this.onshow.setType();
//    }
//    public void setOnshowType_pop() {
//    	checkOnshow();
//        this.onshow.setType_pop();
//    }
    public void setOnshowCascade(Float cascade) {
    	checkOnshow();
        this.onshow.setCascade(cascade);
    }
    /**
     * 设置延时
     * @param delay
     */
    public void setOnshowdelay(Float delay) {
    	checkOnshow();
        this.onshow.setDelay(delay);
    }
    public void setOnshow(String onShowType,Float cascade,Float delay) {
    	checkOnshow();
    	 this.onshow.setType(onShowType);
    	 this.onshow.setCascade(cascade);
    	 this.onshow.setDelay(delay);
    }
    
    public void checkOnshow(){
    	if(null==this.onshow)
    	this.onshow=new OnShow();
    }
    
    public List<Key> getKeys()
    {
        return keys;
    }

    /**
     * 添加key对象到图表中
     * @param keys the keys that have not yet been placed into the chart
     * @return the chart element object being operated on
     */
    public StackedBarChart addKeys(Key... keys) {
        return addKeys(Arrays.asList(keys));
    }

    /**
     * 添加key对象到图表中
     * @param keys the keys that have not yet been placed into the chart
     * @return the chart element object being operated on
     */
    public StackedBarChart addKeys(List<Key> keys) {
        getKeys().addAll(keys);
        return this;
    }

    /**
     * 添加stack对象到图表中
     * @param stacks the stacks that have not yet been placed into the chart
     * @return the chart element object being operated on
     */
    public StackedBarChart addStack(Stack... stacks) {
        return copy(Arrays.asList(stacks));
    }
    
    /**
     * 添加stack对象到图表中
     * @param stacks the stacks that have not yet been placed into the chart
     * @return the chart element object being operated on
     */
    public StackedBarChart addStack(List<Stack> stacks) {
        return copy(stacks);
    }
    
    /**
     * 新建新stack对象，并且添加到图表中
     * pass this Stack object to addStack.
     * @return the stack that has been created in the chart
     */
    public Stack newStack() {
        Stack s = new Stack();
        copy(Arrays.asList(s));
        return s;
    }
    
    /**
     * 获取最后一个statck对象
     * there are none.
     * @return the last stack in the chart
     */
    public Stack lastStack() {
        if (getValues().isEmpty()) {
            return newStack();
        } else {
            return stack(getStackCount() - 1);
        }
    }
    
    /**
     * 根据key获取stack对象
     * @param index the index of the stack, 0 to getStackCount() - 1.
     * @return the stack at the specified index
     */
    @SuppressWarnings("unchecked")
    public Stack stack(int index) {
        return new Stack((List<Object>) getValues().get(index));
    }
    
    /**
     * 获取图表中statck对象的个数
     * @return the number of stacks in the chart
     */
    public int getStackCount() {
        return getValues().size();
    }
    
    private StackedBarChart copy(List<Stack> stacks) {	
        for (Stack s : stacks) {
            getValues().add(s.getBackingList());
        }
        return this;
    }


    /**
    获取颜色
    * @return colours
    *         颜色
    */
   public Collection<String> getColours() {
       return colours;
   }

   /**
    * 设置颜色
    * @param colours Collection
    *         颜色
    */
   public StackedBarChart setColours(Collection<String> colours) {
       checkColours();
       this.colours = colours;
       return this;
   }

   /**
    * 设置颜色
    * @param colours String[]
    *         颜色
    */
   public StackedBarChart setColours(String[] colours) {
       checkColours();
       this.colours.clear();
       this.colours.addAll(Arrays.asList(colours));
       return this;
   }

    /**
    * 设置颜色
    * @param colours List
    *         颜色
    */
   public StackedBarChart setColours(List<String> colours) {
       checkColours();
       this.colours.clear();
       this.colours.addAll(colours);
       return this;
   }
   private synchronized void checkColours() {
       if (colours == null) colours = new ArrayList<String>();
   }
    
    public String getOnclick() {
	return onclick;
}
/**
 * 设置单击事件
 * @param onclick
 */
public void setOnclick(String onclick) {
	this.onclick = onclick;
}

/**
 * 栈图表中stack对象，用于创建复杂的数据格式。
 */
    public static class Stack {
        private transient List<Object> values;
        
        public Stack() {
            values = new ArrayList<Object>();
        }
        
        Stack(List<Object> values) {
            this.values = values;
        }
        /**
         * 添加stack到图表中
         * @param values
         * @return
         */
        public Stack addStackValues(StackValue... values) {
            return doAdd(Arrays.asList(values));
        }
        /**
         * 添加stack到图表中
         * @param values
         * @return
         */
        public Stack addStackValues(List<StackValue> values) {
            return doAdd(values);
        }
        /**
         * 添加数据到图表中
         * @param values
         * @return
         */
        public Stack addValues(Float... numbers) {
            return addValues(Arrays.asList(numbers));
        }
        /**
         * 添加数据到图表中
         * @param values
         * @return
         */
        public Stack addValues(List<Float> numbers) {
      	  for (Float number: numbers){
      		  if (number != null) {
      		  this.doAdd(Collections.singletonList(new StackValue(number)));
      		  }
      	  }
            return this;
        }
        /**
         * 添加对象到图表中
         * @param values
         * @return
         */
        private Stack doAdd(List<? extends Object> values) {
            this.values.addAll(values);
            return this;
        }
        
        /**
         * 获取图表中数据集合
         * @return
         */
        List<Object> getBackingList() {
            return this.values;
        }
        
    	@Override
    	public String toString() {
    		return null;
    	}
    }
    /**
     * 栈图表中的stack的值修饰类
     */
    public static class StackValue {
        private Float val;
        private String colour;
        private String tip;
        private String onclick;
        
        public StackValue(Float value) {
            this(value, null);
        }
        
        public StackValue(Float value, String colour) {
            setValue(value);
            setColour(colour);
        }
        public StackValue(Float value, String colour,String tip,String onclick) {
            setValue(value);
            setColour(colour);
            setTip(tip);
            setOnclick(onclick);
        }
        public Float getValue() {
            return val;
        }
        /**
         * 设置stack值
         * @param val
         */
        public void setValue(Float val) {
            this.val = val;
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

		public String getTip() {
			return tip;
		}
/**
 * 设置鼠标移上提示文字
 * @param tip
 */
		public void setTip(String tip) {
			this.tip = tip;
		}

		public String getOnclick() {
			return onclick;
		}
/**
 * 设置单击事件
 * @param onclick
 */
		public void setOnclick(String onclick) {
			this.onclick = onclick;
		}
    }

    /**
     * 栈图表中的key的值修饰类
     */
    public static class Key {
        private String colour;
        private String text;
        private Integer fontsize;

        public Key(String colour, String text, Integer fontsize)
        {
            this.colour = colour;
            this.text = text;
            this.fontsize = fontsize;
        }

        public Key(String colour, String text)
        {
            this.colour = colour;
            this.text = text;
        }
        public String getColour()
        {
            return colour;
        }
/**
 * 设置颜色
 * @param colour
 */
        public void setColour(String colour)
        {
            this.colour = colour;
        }

        public String getText()
        {
            return text;
        }
/**
 * 设置文字
 * @param text
 */
        public void setText(String text)
        {
            this.text = text;
        }

        public Integer getFontsize()
        {
            return fontsize;
        }

        /**
         * 设置字体大小
         * @param fontsize
         */
        public void setFontsize(Integer fontsize)
        {
            this.fontsize = fontsize;
        }
    }
}
