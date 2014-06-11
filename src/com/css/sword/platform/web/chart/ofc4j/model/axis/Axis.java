package com.css.sword.platform.web.chart.ofc4j.model.axis;

public abstract class Axis {
//    轴线粗
    private Integer stroke;
//    没发现差别
    private String colour;
    private String grid_colour;
//    每刻度值
    private Float steps;
//    偏移差值
    private Integer offset;
//    3d的厚度
    private Integer threed;
    private Float min;
    private Float max;

    /**
     *  获取线粗细
     */
    public Integer getStroke() {
        return stroke;
    }

     /**
     *  设置线粗细
     */
    public Axis setStroke(Integer stroke) {
        this.stroke = stroke;
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
    public Axis setColour(String colour) {
        this.colour = colour;
        return this;
    }

     /**
     *  获取颜色
     */
    public String getGridColour() {
        return grid_colour;
    }

    /**
     *  设置颜色
     */
    public Axis setGridColour(String grid_colour) {
        this.grid_colour = grid_colour;
        return this;
    }

    /**
     *  获取刻度值
     */
    public Float getSteps() {
        return steps;
    }

    /**
     *  设置刻度值
     */
    public Axis setSteps(Float steps) {
        this.steps = steps;
        return this;
    }

    /**
     *  获取偏移值
     */
    public Integer getOffset() {
        return offset;
    }

    /**
     *  设置偏移
     */
    public Axis setOffset(Boolean offset) {
        if (offset == null) this.offset = null;
        this.offset = new Integer( offset.booleanValue() ? 1 : 0);
        return this;
    }

    /**
     *  获取3d厚度
     */
    public Integer get3D() {
        return threed;
    }

    /**
     *  设置3d厚度
     */
    public Axis set3D(Integer threed) {
        this.threed = threed;
        return this;
    }

    /**
     *  获取最小值
     */
    public Float getMin() {
        return min;
    }

    /**
     *  设置最小值
     */
    public Axis setMin(Float min) {
        this.min = min;
        return this;
    }

    /**
     *  获取最大值
     */
    public Float getMax() {
        return max;
    }

    /**
     *  设置最大值
     */
    public Axis setMax(Float max) {
        this.max = max;
        return this;
    }

    /**
     * 设置范围
     * @param min
     *      最小值
     * @param max
     *      最大值
     * @param step
     *      步长
     */
    public Axis setRange(Float min, Float max, Float step) {
        setMin(min);
        setMax(max);
        setSteps(step);
        return this;
    }

    /**
     * 设置范围
     * @param min
     *      最小值
     * @param max
     *      最大值
     */
    public Axis setRange(Float min, Float max) {
        return setRange(min, max, getSteps());
    }
}
