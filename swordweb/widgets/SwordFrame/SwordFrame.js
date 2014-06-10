/**
 * 布局组件类
 * @class swordweb.widgets.SwordFrame.SwordFrame
 * @implements Events
 * @implements Options
 * @extends PageContainer
 */
var SwordFrame = new Class({
    Implements:[Options,Events],
    Extends:PageContainer,
    options:{
        pNode: null,
        name: 'SwordFrame',
        panelScrollSize: 22,
        dragDivSize: 5,
        el: null,
        width: 1400,
        height: 857,
        isScroll:"true",
        /**
         * layout的样式,详细请看FrameLayer.js(options)
         * @property {private string} layout
         */
        layout: null
    },
    dimensionOptions: frameLayer1,
    widthRate: 1.0,
    heightRate: 1.0,
    cloneDiv: null,
    /**
     * 构造函数
     * @constructor {protected options} initialize
     */
    initialize: function(options) {
        this.setOptions(options);
    },
    initParam: function(node) {
        this.htmlOptions(node);
        //这句话是为了解决css加载慢,js已经执行而造成的
        this.options.pNode = $(document.body).setStyles({
            'overflow':'hidden',
            'height':'100%',
            'width':'100%'
        });
        $(document.body).set('scroll', "no");//这句是解决没有滚动条
        if ($defined(this.options.layout)) {
            this.dimensionOptions = eval(this.options.layout);
        }
        this.parseNode(node);
        this.refresh();
        this.addRegionEvent();
    },
    initData: function() {

    },
    parseNode: function(node) {
        this.options.el = node;
        node.getChildren("div").each(function(item) {
            var region = item.get('region');
            if ($defined(region)) {
                this.buildRegion(item, region);
                if (region != "center") {
                    this.buildScrollBtn(item, region);
                    this.buildScrollDiv(item, region);
                    this.buildDragDiv(item, region);
                }
            }
        }.bind(this));
    },
    prepareRegionOptions: function(item, region) {
        for (var key in this.dimensionOptions.oldOptions[region].styles) {
            if ($defined(item.get(key)) && key != "position") {//position属性不允许输入,ie好像不认
                this.dimensionOptions.oldOptions[region].styles[key] = item.get(key);
                this.dimensionOptions.newOptions[region].styles[key] = item.get(key);
            }
            if($defined(item.get('isFix')) && item.get('isFix') == 'true' && $defined(item.get('fixLength'))){//准备区域的fix属性
                this.dimensionOptions.oldOptions[region]['isFix'] = 'true';
                this.dimensionOptions.oldOptions[region]['fixLength'] = item.get('fixLength');
            }
        }
    },
    buildRegion: function(item, region) {
        this.prepareRegionOptions(item, region);
        this.buildElSwordWidgetHash(item, region);
        item.setStyles({
            'position':this.dimensionOptions.oldOptions[region].styles.position,
            'left':this.dimensionOptions.oldOptions[region].styles.left,
            'top':this.dimensionOptions.oldOptions[region].styles.top,
            'width':this.dimensionOptions.oldOptions[region].styles.width,
            'height':this.dimensionOptions.oldOptions[region].styles.height,
//            'border': '1px solid red',
            'z-index':this.dimensionOptions.oldOptions[region].styles.zIndex
        });
        this.dimensionOptions.oldOptions[region].el = item;
        this.dimensionOptions.oldOptions[region].elTween = new Fx.Tween(this.dimensionOptions.oldOptions[region].el, {duration:200, transition: Fx.Transitions.linear});
    },
    buildElSwordWidgetHash: function(item, region) {
        //本方法是将所在区域中的sword组件转化为html元素,并引用起来的方法,这里难免有一些和其它组件的耦合性
        item.getChildren("div[swordType=SwordFramePanel]").each(function(item) {
            var tempSwordFramePanel = pageContainer.create("SwordFramePanel");
            tempSwordFramePanel.initParam(item);
            this.dimensionOptions.oldOptions[region].elSwordWidgetHash.set(item.get("id"), tempSwordFramePanel);
        }.bind(this));
        item.getChildren("div[swordType=SwordFrameTab]").each(function(item) {
            var tempSwordFrameTab = pageContainer.create("SwordFrameTab");
            tempSwordFrameTab.initParam(item);
            this.dimensionOptions.oldOptions[region].elSwordWidgetHash.set(item.get("id"), tempSwordFrameTab);
        }.bind(this));
    },
    buildScrollBtn: function(item, region) {
        if (this.options.isScroll != "false") {
        	var title_div = new Element('div', {
                'class': 'title_div',
                'styles':{
                    'z-index': 1
                }
            })
            if(region!="east"){
	            this.dimensionOptions.oldOptions[region].scrollBtn = new Element('div', {
	                'class': 'x-tool x-tool-collapse-' + region,
	                'styles':{
	                    'position': 'inherit',
	                    'z-index': 1
	                }
	            }).inject(title_div);
            }else{
            	  this.dimensionOptions.oldOptions[region].scrollBtn = new Element('div', {
	                'class': 'x-tool x-tool-collapse-' + region,
	                'styles':{
	                    'position': 'absolute',
	                    'z-index': 1
	                }
	            }).inject(title_div);
            }
            title_div.inject(item,"top");
            this.refreshScrollBtn(region);
          
            this.dimensionOptions.oldOptions[region].scrollBtn.addEvent('click', function(e) {
             if(this.dimensionOptions.oldOptions[region].el.get("collapse")=="true"){
            	 	this.scrollRegionInDiv(region);
            	 	
            	}else {
            		this.scrollRegionOutDiv(region);
            			
            	}
            }.bind(this));
        }
    },
    buildScrollDiv: function(item, region) {
    	
//        this.dimensionOptions.oldOptions[region].scrollDiv = new Element('div', {
//            'class': "x-layout-collapsed x-layout-collapsed-" + region,
//            'styles':{
//                'position': 'absolute',
//                'z-index': 1,
//                'visibility': 'visible',
//                'display': 'block'
//            }
//        }).inject(item.getParent());
      //  this.refreshScrollDiv(region);
       // this.dimensionOptions.oldOptions[region].scrollDivTween = new Fx.Tween(this.dimensionOptions.oldOptions[region].scrollDiv, {duration:500, transition: Fx.Transitions.linear});
//        this.dimensionOptions.oldOptions[region].scrollDiv.addEvent('click', function(e) {
//            if (!this.dimensionOptions.oldOptions[region].scrollRegionAboveFlag) {
//                this.scrollRegionInAboveDiv(region);
//            } else {
//                this.scrollRegionOutAboveDiv(region);
//            }
//        }.bind(this));
//        this.dimensionOptions.oldOptions[region].scrollDivBtn = new Element('div', {
//            'class': "x-tool x-tool-expand-" + region
//        }).inject(this.dimensionOptions.oldOptions[region].scrollDiv);
//        this.dimensionOptions.oldOptions[region].scrollDivBtn.addEvent('click', function(e) {
//            this.scrollRegionInDiv(region);
//            e.stopPropagation();
//        }.bind(this));
    },
    buildDragDiv: function(item, region) {
        if ($defined(this.dimensionOptions.oldOptions[region + 'DragDiv'])) {
            this.dimensionOptions.oldOptions[region + 'DragDiv'].el = new Element('div', {
                'class': 'x-layout-split',
                'styles':{
                    'position': this.dimensionOptions.oldOptions[region + 'DragDiv'].styles.position,
                    'width': this.dimensionOptions.oldOptions[region + 'DragDiv'].styles.width,
                    'height': this.dimensionOptions.oldOptions[region + 'DragDiv'].styles.height,
                    'top': this.dimensionOptions.oldOptions[region + 'DragDiv'].styles.top,
                    'left': this.dimensionOptions.oldOptions[region + 'DragDiv'].styles.left,
                    'z-index':10002
                },
                'events':{
                    'mousedown':function(e) {
                        if (!new Event(e).rightClick) {
                            this.cloneDiv = new Element('div', {
                                'id':"yuantongaaaaaa",
                                'styles':{
                                    'position': "absolute",
                                    'width': document.body.getScrollSize().x,
                                    'height': document.body.getScrollSize().y,
                                    'top': 0,
                                    'left': 0,
                                    'background':"white",
                                    'z-index': 5555,
                                    'filter': 'Alpha(opacity=0)',
                                    'opacity': 0.5
                                }
                            }).inject(document.body);
                            this.cloneDiv.addEvent('mouseup', function() {
                                this.dimensionOptions.oldOptions[region + 'DragDiv'].el.fireEvent('mouseup', this);
                            }.bind(this));
                        }
                    }.bind(this),
                    'mouseup':function() {
//                        logger.error("mouseup---jinru");
                        if ($defined(this.cloneDiv)) {
//                            logger.error("mouseup---zhixingshanchu");
                            this.cloneDiv.destroy();
                            //this.cloneDiv = null;
                        }
                    }.bind(this)
                }
            }).inject(this.options.el);
            new Drag(this.dimensionOptions.oldOptions[region + 'DragDiv'].el, {
                handle: this.dimensionOptions.oldOptions[region + 'DragDiv'].el,
               // limit : {x: [0, 100000]},
                onStart: function() {

                }.bind(this),
                onDrag: function() {
                    this.dimensionOptions.oldOptions[region + 'DragDiv'].el.setStyle('background-color', "gray");
                    this.onJudgeDragDiv(region);
                }.bind(this),
                onComplete: function() {
                    this.dimensionOptions.oldOptions[region + 'DragDiv'].el.setStyle('background-color', "");
                    this.completeDragDiv(region);
//                    logger.error("onComplete---jinru");

                    //这个问题是单独使用destroy删除不掉this.cloneDiv,所以才使用getElementById
                    var yuantongaaaaaa = document.getElementById("yuantongaaaaaa");
                    if (yuantongaaaaaa != null) {
                        yuantongaaaaaa.parentNode.removeChild(yuantongaaaaaa);
                    }
                    var cloneDivP = this.cloneDiv.getParent();
                    if ($defined(cloneDivP)) {
                        if ($defined(cloneDivP.get("tag"))) {
                            this.cloneDiv.destroy();
                            this.cloneDiv = null;
                            //alert("onComplete:"+this.cloneDiv);
                        }
                    }
                }.bind(this)
            });


            if (region == "north" || region == "south") {
                this.dimensionOptions.oldOptions[region + 'DragDiv'].el.addClass("x-splitbar-v");
            } else if (region == "west" || region == "east") {
                this.dimensionOptions.oldOptions[region + 'DragDiv'].el.addClass("x-splitbar-h");
            }
        }
    },
    onJudgeDragDiv: function(region) {
        switch (region) {
            case 'west':
                this.dimensionOptions.oldOptions[region + "DragDiv"].el.setStyles({
                    'top': this.dimensionOptions.oldOptions[region].el.getStyle("top").toFloat()//这里的dragDiv也是按照动态计算的,因为有scrollDiv的关系,所以不可能是静态的值,这里根据region的el去动态计算,让它的高度不变
                });
                break;
            case 'east':
                this.dimensionOptions.oldOptions[region + "DragDiv"].el.setStyles({
                    'top': this.dimensionOptions.oldOptions[region].el.getStyle("top").toFloat()
                });
                break;
            case 'north':
                this.dimensionOptions.oldOptions[region + "DragDiv"].el.setStyles({
                    'left': this.dimensionOptions.oldOptions[region].el.getStyle("left").toFloat()
                });
                break;
            case 'south':
                this.dimensionOptions.oldOptions[region + "DragDiv"].el.setStyles({
                    'left': this.dimensionOptions.oldOptions[region].el.getStyle("left").toFloat()
                });
                break;
            default:
                break;
        }
    },
    completeDragDiv: function(region) {
        switch (region) {
            case 'west':
                var minusLeft = this.dimensionOptions.newOptions[region + "DragDiv"].styles['left'] - this.dimensionOptions.oldOptions[region + "DragDiv"].el.getStyle('left').toFloat();
                this.dimensionOptions.newOptions[region + "DragDiv"].styles['left'] = this.dimensionOptions.oldOptions[region + "DragDiv"].el.getStyle('left').toFloat();
                var w= this.dimensionOptions.newOptions['west'].styles['width'];
                this.dimensionOptions.newOptions['west'].styles['width'] = w - minusLeft<0?0:w - minusLeft;
                this.dimensionOptions.oldOptions['west'].el.setStyle('width', this.dimensionOptions.newOptions['west'].styles['width']);
                this.refreshScrollBtn('west');
                this.dimensionOptions.newOptions['center'].styles['left'] = this.dimensionOptions.newOptions['center'].styles['left'] - minusLeft;
                this.dimensionOptions.newOptions['center'].styles['width'] = this.dimensionOptions.newOptions['center'].styles['width'] + minusLeft;
                this.dimensionOptions.oldOptions['center'].el.setStyles({
                    'left': this.dimensionOptions.newOptions['center'].styles['left'],
                    'width': this.dimensionOptions.newOptions['center'].styles['width']
                });
                break;
            case 'east':
                var minusLeft = this.dimensionOptions.newOptions[region + "DragDiv"].styles['left'] - this.dimensionOptions.oldOptions[region + "DragDiv"].el.getStyle('left').toFloat();
                this.dimensionOptions.newOptions[region + "DragDiv"].styles['left'] = this.dimensionOptions.oldOptions[region + "DragDiv"].el.getStyle('left').toFloat();
                this.dimensionOptions.newOptions['east'].styles['width'] = this.dimensionOptions.newOptions['east'].styles['width'] + minusLeft;
                this.dimensionOptions.oldOptions['east'].el.setStyle('width', this.dimensionOptions.newOptions['east'].styles['width']);
                this.dimensionOptions.newOptions['east'].styles['left'] = this.dimensionOptions.newOptions['east'].styles['left'] - minusLeft;
                this.dimensionOptions.oldOptions['east'].el.setStyle('left', this.dimensionOptions.newOptions['east'].styles['left']);
                this.refreshScrollBtn('east');
                this.dimensionOptions.newOptions['center'].styles['width'] = this.dimensionOptions.newOptions['center'].styles['width'] - minusLeft;
                this.dimensionOptions.oldOptions['center'].el.setStyles({
                    'width': this.dimensionOptions.newOptions['center'].styles['width']
                });
                break;
            case 'north':
                var minusTop = this.dimensionOptions.newOptions[region + "DragDiv"].styles['top'] - this.dimensionOptions.oldOptions[region + "DragDiv"].el.getStyle('top').toFloat();
                this.dimensionOptions.newOptions[region + "DragDiv"].styles['top'] = this.dimensionOptions.oldOptions[region + "DragDiv"].el.getStyle('top').toFloat();
                if ($defined(this.dimensionOptions.oldOptions['center'].el)) {
                    this.dimensionOptions.newOptions['center'].styles['height'] = this.dimensionOptions.newOptions['center'].styles['height'] + minusTop;
                    this.dimensionOptions.oldOptions['center'].el.setStyle('height', this.dimensionOptions.newOptions['center'].styles['height']);
                    this.dimensionOptions.newOptions['center'].styles['top'] = this.dimensionOptions.newOptions['center'].styles['top'] - minusTop;
                    this.dimensionOptions.oldOptions['center'].el.setStyle('top', this.dimensionOptions.newOptions['center'].styles['top']);

                    this.refreshOtherRefHeight('center', -minusTop);
                }
                if ($defined(this.dimensionOptions.oldOptions['west'].el)) {
                    this.dimensionOptions.newOptions['west'].styles['height'] = this.dimensionOptions.newOptions['west'].styles['height'] + minusTop;
                    this.dimensionOptions.oldOptions['west'].el.setStyle('height', this.dimensionOptions.newOptions['west'].styles['height']);
                    //this.dimensionOptions.oldOptions['west'].scrollDiv.setStyle('height', this.dimensionOptions.newOptions['west'].styles['height']);
                    this.dimensionOptions.oldOptions['westDragDiv'].el.setStyle('height', this.dimensionOptions.newOptions['west'].styles['height']);

                    this.dimensionOptions.newOptions['west'].styles['top'] = this.dimensionOptions.newOptions['west'].styles['top'] - minusTop;
                    this.dimensionOptions.oldOptions['west'].el.setStyle('top', this.dimensionOptions.newOptions['west'].styles['top']);
                  //  this.dimensionOptions.oldOptions['west'].scrollDiv.setStyle('top', this.dimensionOptions.newOptions['west'].styles['top']);
                    this.dimensionOptions.oldOptions['westDragDiv'].el.setStyle('top', this.dimensionOptions.newOptions['west'].styles['top']);

                    this.refreshOtherRefHeight('west', -minusTop);
                }
                if ($defined(this.dimensionOptions.oldOptions['east'].el)) {
                    this.dimensionOptions.newOptions['east'].styles['height'] = this.dimensionOptions.newOptions['east'].styles['height'] + minusTop;
                    this.dimensionOptions.oldOptions['east'].el.setStyle('height', this.dimensionOptions.newOptions['east'].styles['height']);
                   // this.dimensionOptions.oldOptions['east'].scrollDiv.setStyle('height', this.dimensionOptions.newOptions['east'].styles['height']);
                    this.dimensionOptions.oldOptions['eastDragDiv'].el.setStyle('height', this.dimensionOptions.newOptions['east'].styles['height']);

                    this.dimensionOptions.newOptions['east'].styles['top'] = this.dimensionOptions.newOptions['east'].styles['top'] - minusTop;
                    this.dimensionOptions.oldOptions['east'].el.setStyle('top', this.dimensionOptions.newOptions['east'].styles['top']);
                 //   this.dimensionOptions.oldOptions['east'].scrollDiv.setStyle('top', this.dimensionOptions.newOptions['east'].styles['top']);
                    this.dimensionOptions.oldOptions['eastDragDiv'].el.setStyle('top', this.dimensionOptions.newOptions['east'].styles['top']);

                    this.refreshOtherRefHeight('east', -minusTop);
                }
                if ($defined(this.dimensionOptions.oldOptions['north'].el)) {
                    this.dimensionOptions.newOptions['north'].styles['height'] = this.dimensionOptions.newOptions['north'].styles['height'] - minusTop;
                    this.dimensionOptions.oldOptions['north'].el.setStyle('height', this.dimensionOptions.newOptions['north'].styles['height']);

                    this.refreshOtherRefHeight('north', minusTop);
                }
                this.refreshScrollBtn('west');
                this.refreshScrollBtn('east');
                this.refreshScrollBtn('north');
                break;
            case 'south':
                var minusTop = this.dimensionOptions.newOptions[region + "DragDiv"].styles['top'] - this.dimensionOptions.oldOptions[region + "DragDiv"].el.getStyle('top').toFloat();
                this.dimensionOptions.newOptions[region + "DragDiv"].styles['top'] = this.dimensionOptions.oldOptions[region + "DragDiv"].el.getStyle('top').toFloat();
                if ($defined(this.dimensionOptions.oldOptions['center'].el)) {
                    this.dimensionOptions.newOptions['center'].styles['height'] = this.dimensionOptions.newOptions['center'].styles['height'] - minusTop;
                    this.dimensionOptions.oldOptions['center'].el.setStyle('height', this.dimensionOptions.newOptions['center'].styles['height']);

                    this.refreshOtherRefHeight('center', minusTop);
                }
                if ($defined(this.dimensionOptions.oldOptions['west'].el)) {
                    this.dimensionOptions.newOptions['west'].styles['height'] = this.dimensionOptions.newOptions['west'].styles['height'] - minusTop;
                    this.dimensionOptions.oldOptions['west'].el.setStyle('height', this.dimensionOptions.newOptions['west'].styles['height']);
                 //   this.dimensionOptions.oldOptions['west'].scrollDiv.setStyle('height', this.dimensionOptions.newOptions['west'].styles['height']);
                    this.dimensionOptions.oldOptions['westDragDiv'].el.setStyle('height', this.dimensionOptions.newOptions['west'].styles['height']);

                    this.refreshOtherRefHeight('west', minusTop);
                }
                if ($defined(this.dimensionOptions.oldOptions['east'].el)) {
                    this.dimensionOptions.newOptions['east'].styles['height'] = this.dimensionOptions.newOptions['east'].styles['height'] - minusTop;
                    this.dimensionOptions.oldOptions['east'].el.setStyle('height', this.dimensionOptions.newOptions['east'].styles['height']);
                 //   this.dimensionOptions.oldOptions['east'].scrollDiv.setStyle('height', this.dimensionOptions.newOptions['east'].styles['height']);
                    this.dimensionOptions.oldOptions['eastDragDiv'].el.setStyle('height', this.dimensionOptions.newOptions['east'].styles['height']);

                    this.refreshOtherRefHeight('east', minusTop);
                }
                if ($defined(this.dimensionOptions.oldOptions['south'].el)) {
                    this.dimensionOptions.newOptions['south'].styles['top'] = this.dimensionOptions.newOptions['south'].styles['top'] - minusTop;
                    this.dimensionOptions.oldOptions['south'].el.setStyle('top', this.dimensionOptions.newOptions['south'].styles['top']);
                    this.dimensionOptions.newOptions['south'].styles['height'] = this.dimensionOptions.newOptions['south'].styles['height'] + minusTop;
                    this.dimensionOptions.oldOptions['south'].el.setStyle('height', this.dimensionOptions.newOptions['south'].styles['height']);

                    this.refreshOtherRefHeight('south', -minusTop);
                }
                this.refreshScrollBtn('west');
                this.refreshScrollBtn('east');
                this.refreshScrollBtn('south');
                break;
            default:
                break;
        }
    },
    refresh: function() {
        this.widthRate = $(document.body).getSize().x / this.options.width;
        this.heightRate = $(document.body).getSize().y / this.options.height;
        //第一遍refresh是通过比率来进行刷新
        for (var key in this.dimensionOptions.newOptions) {
            this.refreshOptionsElRegionAndDragDiv(key);
            this.refreshScrollDiv(key);
            this.refreshScrollBtn(key);
            this.refreshScrollRegionAboveFlag(key);
        }
        //第二遍在第一遍的已经刷完的基础之上,将其中的fix属性的固定的值,进行窜回来
        //这一部分先将north和south的部分窜上去，其余的部分以后再进行计算
        this.refreshFix();
    },
    refreshOptionsElRegionAndDragDiv: function(key) {
        for (var styleKey in this.dimensionOptions.newOptions[key].styles) {
            if (styleKey != "position") {
                if (styleKey == "left" || styleKey == "width") {
                    this.dimensionOptions.newOptions[key].styles[styleKey] = this.dimensionOptions.oldOptions[key].styles[styleKey] * this.widthRate;
                } else if (styleKey == "top" || styleKey == "height") {
                    this.dimensionOptions.newOptions[key].styles[styleKey] = this.dimensionOptions.oldOptions[key].styles[styleKey] * this.heightRate;
                }
                this.dimensionOptions.oldOptions[key].el.setStyle(styleKey, this.dimensionOptions.newOptions[key].styles[styleKey]);
            }
        }
        //耦合其它组件,将heightRate设置到region的div,方便其它组件获取
        if (!key.contains('DragDiv')) {
            this.dimensionOptions.oldOptions[key].el.set('heightRate', this.heightRate);
            this.dimensionOptions.oldOptions[key].el.set('widthRate', this.widthRate);
        }
    },
    refreshFix: function() {
        var o = this.dimensionOptions.oldOptions;
        var n = this.dimensionOptions.newOptions;
        ///////////////////////////////////////////南北问题////////////////////////////////////////////////////////
        var northMinus = 0;
        var southMinus = 0;





        if($defined(o['north']) && o['north']['isFix'] == 'true'){
            northMinus = o['north']['fixLength'] - n['north'].styles['height'];


            
            //alert(o['north']['fixLength'].toFloat());
            o['north'].el.setStyle('height',(o['north']['fixLength']).toFloat());


            
            if($defined(o['west']) && $defined(o['west'].el)){
                o['west'].el.setStyle('top',Math.max(0,n['west'].styles['top'] + northMinus));
                o['west'].el.setStyle('height',Math.max(0,n['west'].styles['height'] - northMinus));
            }
            if($defined(o['westDragDiv']) && $defined(o['westDragDiv'].el)){
                o['westDragDiv'].el.setStyle('top',Math.max(0,n['westDragDiv'].styles['top'] + northMinus));
                o['westDragDiv'].el.setStyle('height',Math.max(0,n['westDragDiv'].styles['height'] - northMinus));
            }
            if($defined(o['east']) && $defined(o['east'].el)){
                o['east'].el.setStyle('top',Math.max(0,n['west'].styles['top'] + northMinus));
                o['east'].el.setStyle('height',Math.max(0,n['west'].styles['height'] - northMinus));
            }
            if($defined(o['eastDragDiv']) && $defined(o['eastDragDiv'].el)){
                o['eastDragDiv'].el.setStyle('top',Math.max(0,n['eastDragDiv'].styles['top'] + northMinus));
                o['eastDragDiv'].el.setStyle('height',Math.max(0,n['eastDragDiv'].styles['height'] - northMinus));
            }
            if($defined(o['center'].el) && $defined(o['center'].el)){
                o['center'].el.setStyle('top',Math.max(0,n['center'].styles['top'] + northMinus));
                o['center'].el.setStyle('height',Math.max(0,n['center'].styles['height'] - northMinus));
            }
        }
        if($defined(o['south']) && o['south']['isFix'] == 'true'){
            southMinus = o['south']['fixLength'] - n['south'].styles['height'];
            o['south'].el.setStyle('top',Math.max(0,n['south'].styles['top'] - southMinus));
            o['south'].el.setStyle('height',Math.max(0,o['south']['fixLength']));
            if($defined(o['west']) && $defined(o['west'].el)){
                o['west'].el.set('heightMinus',southMinus + northMinus);
                o['west'].el.setStyle('height',Math.max(0,n['west'].styles['height'] - southMinus  - northMinus));
            }
            if($defined(o['westDragDiv']) && $defined(o['westDragDiv'].el)){
                o['westDragDiv'].el.setStyle('height',Math.max(0,n['westDragDiv'].styles['height'] - southMinus  - northMinus));
            }
            if($defined(o['east']) && $defined(o['east'].el)){
                o['east'].el.set('heightMinus',southMinus + northMinus);
                o['east'].el.setStyle('height',Math.max(0,n['west'].styles['height'] - southMinus  - northMinus));
            }
            if($defined(o['eastDragDiv']) && $defined(o['eastDragDiv'].el)){
                o['eastDragDiv'].el.setStyle('height',Math.max(0,n['eastDragDiv'].styles['height'] - southMinus  - northMinus));
            }
            if($defined(o['center'].el) && $defined(o['center'].el)){
                o['center'].el.set('heightMinus',southMinus + northMinus);
                o['center'].el.setStyle('height',Math.max(0,n['center'].styles['height'] - southMinus  - northMinus));
            }
        }
        if($defined(o['west']) && $defined(o['west'].scrollDiv)){
            o['west'].scrollDiv.setStyles({
                'height': o['west'].el.getStyle('height'),
                'top': o['west'].el.getStyle('top')
            });
        }
        if($defined(o['east']) && $defined(o['east'].scrollDiv)){
            o['east'].scrollDiv.setStyles({
                'height': o['east'].el.getStyle('height'),
                'top': o['east'].el.getStyle('top')
            });
        }
        ///////////////////////////////////////////南北问题////////////////////////////////////////////////////////
    },
    refreshScrollDiv: function(region) {return;
        if (!region.contains('DragDiv') && region != "center") {
            switch (region) {
                case 'west':
                    this.dimensionOptions.oldOptions[region].scrollDiv.setStyles({
                        'width': this.options.panelScrollSize,
                        'height': this.dimensionOptions.newOptions[region].styles.height,
                        'left': this.dimensionOptions.newOptions[region].styles.left - this.options.panelScrollSize.toFloat() - 10,//可能有border,因此加一些偏移量,以下同理
                        'top': this.dimensionOptions.newOptions[region].styles.top
                    });
                    break;
                case 'east':
                    this.dimensionOptions.oldOptions[region].scrollDiv.setStyles({
                        'width': this.options.panelScrollSize,
                        'height': this.dimensionOptions.newOptions[region].styles.height,
                        'left': this.dimensionOptions.newOptions[region].styles.left.toFloat() + this.dimensionOptions.newOptions[region].styles.width.toFloat() + 10,
                        'top': this.dimensionOptions.newOptions[region].styles.top
                    });
                    break;
                case 'north':
                    this.dimensionOptions.oldOptions[region].scrollDiv.setStyles({
                        'height': this.options.panelScrollSize,
                        'width': this.dimensionOptions.newOptions[region].styles.width,
                        'left': this.dimensionOptions.newOptions[region].styles.left,
                        'top': this.dimensionOptions.newOptions[region].styles.top.toFloat() - this.options.panelScrollSize.toFloat() - 10
                    });
                    break;
                case 'south':
                    this.dimensionOptions.oldOptions[region].scrollDiv.setStyles({
                        'height': this.options.panelScrollSize,
                        'width': this.dimensionOptions.newOptions[region].styles.width,
                        'left': this.dimensionOptions.newOptions[region].styles.left,
                        'top': this.dimensionOptions.newOptions[region].styles.top.toFloat() + this.dimensionOptions.newOptions[region].styles.height.toFloat() + 10
                    });
                    break;
                default:
                    break;
            }
        }
    },
    refreshScrollBtn: function(region) {
        if (!region.contains('DragDiv') && region != "center" && this.options.isScroll != "false") {
        	if(region!="east"){
            this.dimensionOptions.oldOptions[region].scrollBtn.setStyle('left', this.dimensionOptions.newOptions[region].styles['width'] - 25);
            this.dimensionOptions.oldOptions[region].scrollBtn.setStyle('top', 5);
        	}
        }
    },
    refreshScrollRegionAboveFlag: function(region) {
        this.dimensionOptions.oldOptions[region].scrollRegionAboveFlag = false;
    },
    refreshOtherRefHeight: function(region, minus) {
        var tabArray = this.dimensionOptions.oldOptions[region].el.getElements("div[sword='SwordFrameTab']");
        tabArray.each(function(item) {
            var tab = pageContainer.getWidget(item.get("name"));
            tab.refreshTabContentByNum(minus);
        }.bind(this));
        var panelArray = this.dimensionOptions.oldOptions[region].el.getElements("div[sword='SwordFramePanel']");
        panelArray.each(function(item) {
            var panel = pageContainer.getWidget(item.get("name"));
            panel.refreshPanelContentByNum(minus);
        }.bind(this));

    },
    addRegionEvent: function() {
        if (Browser.Engine.trident) {
            this.tempRegion = new Element('div', {
                'styles':{
                    'width':'100%',
                    'height':'100%'
                }
            }).inject(document.body);

            this.tempRegion.addEvent('resize', function() {
                this.refresh();
            }.bind(this));
        } else {
            window.addEvent('resize', function() {
                this.refresh();
            }.bind(this));
        }

    },
    scrollRegionOutDiv: function(region) {
      this.dimensionOptions.oldOptions[region].el.set("collapse","true")
        this.dimensionOptions.oldOptions[region].scrollBtn.setStyle('display', 'block');
        if ($defined(this.dimensionOptions.oldOptions[region + 'DragDiv'])) {
            this.dimensionOptions.oldOptions[region + 'DragDiv'].el.setStyle('z-index', '-1');//将dragDiv置为看不见,防止其遮盖
        }
    
        var lt = this.options.layout;
         if(lt=="frameLayer1"){
	        if(region=="west"||region=="east"){
	        	if(this.dimensionOptions.oldOptions["west"].el.get("collapse")=="true"&&this.dimensionOptions.oldOptions["east"].el.get("collapse")=="true"){
		        	this.dimensionOptions.oldOptions.eastDragDiv.el.setStyle("display","none");
		        	this.dimensionOptions.oldOptions.westDragDiv.el.setStyle("display","none");
	        	}
	        }
        }else if(lt=="frameLayer2"||lt=="frameLayer3"||lt=="frameLayer4"){
        	if(region=="west"){
        		if(this.dimensionOptions.oldOptions["west"].el.get("collapse")!="true"){
		        	this.dimensionOptions.oldOptions.westDragDiv.el.setStyle("display","none");
	        	}
        		
        	}
        	
        }else if(lt=="frameLayer5"){
        	if(region=="east"){
	        	if(this.dimensionOptions.oldOptions["east"].el.get("collapse")!="true"){
		        	this.dimensionOptions.oldOptions.eastDragDiv.el.setStyle("display","none");
	        	}
	        }
        	
        }
         if(region=="south"){
        	if(this.dimensionOptions.oldOptions["south"].el.get("collapse")=="true"){
	        	this.dimensionOptions.oldOptions.southDragDiv.el.setStyle("display","none");
        	}
        }
        switch (region) {
            case 'west':
                this.dimensionOptions.oldOptions[region].el.setStyle('left', this.dimensionOptions.newOptions[region].styles.left - this.dimensionOptions.newOptions[region].styles.width+22);
               // this.dimensionOptions.oldOptions[region].scrollDivTween.start('left', this.dimensionOptions.newOptions[region].styles.left - this.options.panelScrollSize, this.dimensionOptions.newOptions[region].styles.left);
                this.dimensionOptions.oldOptions['center'].el.setStyles({
                    'left': this.dimensionOptions.oldOptions['center'].el.getStyle("left").toFloat() - this.dimensionOptions.newOptions[region].styles.width + this.options.panelScrollSize,
                    'width': this.dimensionOptions.oldOptions['center'].el.getStyle("width").toFloat() + this.dimensionOptions.newOptions[region].styles.width - this.options.panelScrollSize
                });
              this.dimensionOptions.oldOptions[region].scrollBtn .set("class","x-tool x-tool-collapse-east");//收缩后更换样式.这个地方不能放在这 .去掉原来收缩后弹出的div
           
                break;
            case 'east':
                this.dimensionOptions.oldOptions[region].el.setStyle('left', this.dimensionOptions.newOptions[region].styles.left + this.dimensionOptions.newOptions[region].styles.width-22);
             //   this.dimensionOptions.oldOptions[region].scrollDivTween.start('left', this.dimensionOptions.newOptions[region].styles.left + this.dimensionOptions.newOptions[region].styles.width, this.dimensionOptions.newOptions[region].styles.left + this.dimensionOptions.newOptions[region].styles.width - this.options.panelScrollSize);
                this.dimensionOptions.oldOptions['center'].el.setStyles({
                    'width': this.dimensionOptions.oldOptions['center'].el.getStyle("width").toFloat() + this.dimensionOptions.newOptions[region].styles.width - this.options.panelScrollSize
                });
                this.dimensionOptions.oldOptions[region].scrollBtn .set("class","x-tool x-tool-collapse-west");//收缩后更换样式.这个地方不能放在这 .去掉原来收缩后弹出的div
				this.dimensionOptions.oldOptions[region].scrollBtn .setStyles({
                        'top': '0',
                        'left': 0,
                        'position':'absolute'
                    });
                break;
            case 'north':
                this.dimensionOptions.oldOptions[region].el.setStyle('top',this.dimensionOptions.newOptions[region].styles.top - this.dimensionOptions.newOptions[region].styles.height+22);
              //  this.dimensionOptions.oldOptions[region].scrollDivTween.start('top', this.dimensionOptions.newOptions[region].styles.top - this.options.panelScrollSize, this.dimensionOptions.newOptions[region].styles.top);
                if ($defined(this.dimensionOptions.oldOptions['center'].el)) {
                    this.dimensionOptions.oldOptions['center'].el.setStyles({
                        'top': this.dimensionOptions.oldOptions['center'].el.getStyle("top").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize,
                        'height': this.dimensionOptions.oldOptions['center'].el.getStyle("height").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize
                    });

                    this.refreshOtherRefHeight("center", - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize);
                    
                }
                if(lt!="frameLayer5"){
                if ($defined(this.dimensionOptions.oldOptions['west'].el)) {
                    this.dimensionOptions.oldOptions['west'].el.setStyles({
                        'top': this.dimensionOptions.oldOptions['west'].el.getStyle("top").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize,
                        'height': this.dimensionOptions.oldOptions['west'].el.getStyle("height").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize
                    });
                    this.refreshOtherRefHeight("west", - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize);
//                    this.dimensionOptions.oldOptions['west'].scrollDiv.setStyles({
//                        'top': this.dimensionOptions.oldOptions['west'].scrollDiv.getStyle("top").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize,
//                        'height': this.dimensionOptions.oldOptions['west'].scrollDiv.getStyle("height").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize
//                    });
                    this.dimensionOptions.oldOptions['westDragDiv'].el.setStyles({
                        'top': this.dimensionOptions.oldOptions['westDragDiv'].el.getStyle("top").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize,
                        'height': this.dimensionOptions.oldOptions['westDragDiv'].el.getStyle("height").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize
                    });
                    
                }
                }
                if ($defined(this.dimensionOptions.oldOptions['east'])) {
                    this.dimensionOptions.oldOptions['east'].el.setStyles({
                        'top': this.dimensionOptions.oldOptions['east'].el.getStyle("top").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize,
                        'height': this.dimensionOptions.oldOptions['east'].el.getStyle("height").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize
                    });
                    this.refreshOtherRefHeight("east", - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize);
//                    this.dimensionOptions.oldOptions['east'].scrollDiv.setStyles({
//                        'top': this.dimensionOptions.oldOptions['east'].scrollDiv.getStyle("top").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize,
//                        'height': this.dimensionOptions.oldOptions['east'].scrollDiv.getStyle("height").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize
//                    });
                    this.dimensionOptions.oldOptions['eastDragDiv'].el.setStyles({
                        'top': this.dimensionOptions.oldOptions['eastDragDiv'].el.getStyle("top").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize,
                        'height': this.dimensionOptions.oldOptions['eastDragDiv'].el.getStyle("height").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize
                    });
                }
                var sctop = this.dimensionOptions.oldOptions[region].el.getStyle('top').toFloat()*-1;
                 this.dimensionOptions.oldOptions[region].scrollBtn .set("class","x-tool  x-tool-collapse-south");//收缩后更换样式.这个地方不能放在这 .去掉原来收缩后弹出的div
                this.dimensionOptions.oldOptions[region].scrollBtn .setStyles({
                        'top': sctop,
                        'position':'absolute'
                    });
                break;
            case 'south':
                this.dimensionOptions.oldOptions[region].el.setStyle('top', this.dimensionOptions.newOptions[region].styles.top + this.dimensionOptions.newOptions[region].styles.height -this.options.panelScrollSize);
            //    this.dimensionOptions.oldOptions[region].scrollDivTween.start('top', this.dimensionOptions.newOptions[region].styles.top + this.dimensionOptions.newOptions[region].styles.height, this.dimensionOptions.newOptions[region].styles.top + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize);
                if ($defined(this.dimensionOptions.oldOptions['center'])) {
                    if ($defined(this.dimensionOptions.oldOptions['center'].el)) {
                        this.dimensionOptions.oldOptions['center'].el.setStyles({
                            'height': this.dimensionOptions.oldOptions['center'].el.getStyle("height").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize
                        });
                        this.refreshOtherRefHeight("center", - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize);
                    }
                }
                this.dimensionOptions.oldOptions[region].scrollBtn .set("class","x-tool x-tool-collapse-north");
                if ($defined(this.dimensionOptions.oldOptions['west'])) {
                    if ($defined(this.dimensionOptions.oldOptions['west'].el)) {
                        this.dimensionOptions.oldOptions['west'].el.setStyles({
                            'height': this.dimensionOptions.oldOptions['west'].el.getStyle("height").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize
                        });
                        this.refreshOtherRefHeight("west", - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize);
//                        this.dimensionOptions.oldOptions['west'].scrollDiv.setStyles({
//                            'height': this.dimensionOptions.oldOptions['west'].scrollDiv.getStyle("height").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize
//                        });
                        this.dimensionOptions.oldOptions['westDragDiv'].el.setStyles({
                            'height': this.dimensionOptions.oldOptions['westDragDiv'].el.getStyle("height").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize
                        });
                    }
                }
                if ($defined(this.dimensionOptions.oldOptions['east'])) {
                    if ($defined(this.dimensionOptions.oldOptions['east'].el)) {
                        this.dimensionOptions.oldOptions['east'].el.setStyles({
                            'height': this.dimensionOptions.oldOptions['east'].el.getStyle("height").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize
                        });
                        this.refreshOtherRefHeight("east", - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize);
//                        this.dimensionOptions.oldOptions['east'].scrollDiv.setStyles({
//                            'height': this.dimensionOptions.oldOptions['east'].scrollDiv.getStyle("height").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize
//                        });
                        this.dimensionOptions.oldOptions['eastDragDiv'].el.setStyles({
                            'height': this.dimensionOptions.oldOptions['eastDragDiv'].el.getStyle("height").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize
                        });
                    }
                }
                break;
            default:
                break;
        }
    },
    scrollRegionInDiv: function(region) { 
        this.dimensionOptions.oldOptions[region].scrollBtn.setStyle('display', 'block');
        if ($defined(this.dimensionOptions.oldOptions[region + 'DragDiv'])) {
            this.dimensionOptions.oldOptions[region + 'DragDiv'].el.setStyle('z-index', '10002');
        }
        this.dimensionOptions.oldOptions[region].el.set("collapse","false");
        var lt = this.options.layout;
        if(lt=="frameLayer1"){
	        if(region=="west"||region=="east"){
	        	if(this.dimensionOptions.oldOptions["west"].el.get("collapse")!="true"&&this.dimensionOptions.oldOptions["east"].el.get("collapse")!="true"){
		        	this.dimensionOptions.oldOptions.eastDragDiv.el.setStyle("display","");
		        	this.dimensionOptions.oldOptions.westDragDiv.el.setStyle("display","");
	        	}
	        }
        }else if(lt=="frameLayer2"||lt=="frameLayer3"||lt=="frameLayer4"){
        	if(region=="west"){
        		if(this.dimensionOptions.oldOptions["west"].el.get("collapse")!="true"){
		        	this.dimensionOptions.oldOptions.westDragDiv.el.setStyle("display","");
	        	}
        		
        	}
        	
        }else if(lt=="frameLayer5"){
        	if(region=="east"){
	        	if(this.dimensionOptions.oldOptions["east"].el.get("collapse")!="true"){
		        	this.dimensionOptions.oldOptions.eastDragDiv.el.setStyle("display","");
	        	}
	        }
        	
        }
         if(region=="south"){
        	if(this.dimensionOptions.oldOptions["south"].el.get("collapse")!="true"){
	        	this.dimensionOptions.oldOptions.southDragDiv.el.setStyle("display","");
        	}
        }
        switch (region) {
            case 'west':
                this.dimensionOptions.oldOptions[region].el.setStyle('left',  this.dimensionOptions.newOptions[region].styles.left);
            //收缩后更换样式.这个地方不能放在这 .去掉原来收缩后弹出的div   // this.dimensionOptions.oldOptions[region].scrollDivTween.start('left', this.dimensionOptions.newOptions[region].styles.left, this.dimensionOptions.newOptions[region].styles.left - this.options.panelScrollSize - 10);//可能存在border，因此这里将偏移量计算进去
                this.dimensionOptions.oldOptions['center'].el.setStyles({
                    'left': this.dimensionOptions.oldOptions['center'].el.getStyle("left").toFloat() + this.dimensionOptions.newOptions[region].styles.width - this.options.panelScrollSize,
                    'width': this.dimensionOptions.oldOptions['center'].el.getStyle("width").toFloat() - this.dimensionOptions.newOptions[region].styles.width + this.options.panelScrollSize
                });
                 this.dimensionOptions.oldOptions[region].scrollBtn .set("class","x-tool x-tool-expand-east");//收缩后更换样式.这个地方不能放在这 .去掉原来收缩后弹出的div
                break;
            case 'east':
                this.dimensionOptions.oldOptions[region].el.setStyle('left',  this.dimensionOptions.newOptions[region].styles.left);
              //  this.dimensionOptions.oldOptions[region].scrollDivTween.start('left', this.dimensionOptions.newOptions[region].styles.left + this.dimensionOptions.newOptions[region].styles.width - this.options.panelScrollSize, this.dimensionOptions.newOptions[region].styles.left + this.dimensionOptions.newOptions[region].styles.width + 10);
                this.dimensionOptions.oldOptions['center'].el.setStyles({
                    'width': this.dimensionOptions.oldOptions['center'].el.getStyle("width").toFloat() - this.dimensionOptions.newOptions[region].styles.width + this.options.panelScrollSize
                });
                this.dimensionOptions.oldOptions[region].scrollBtn .set("class","x-tool x-tool-collapse-east");//收缩后更换样式.这个地方不能放在这 .去掉原来收缩后弹出的div
				this.dimensionOptions.oldOptions[region].scrollBtn .setStyles({
                        'top': 5,
                        'left': this.dimensionOptions.newOptions[region].styles['width'] - 25,
                        'position':'inherit'
                    });
                break;
            case 'north':
                this.dimensionOptions.oldOptions[region].el.setStyle('top', this.dimensionOptions.newOptions[region].styles.top);
           //     this.dimensionOptions.oldOptions[region].scrollDivTween.start('top', this.dimensionOptions.newOptions[region].styles.top, this.dimensionOptions.newOptions[region].styles.top - this.options.panelScrollSize - 10);
                if ($defined(this.dimensionOptions.oldOptions['center'].el)) {
                    this.dimensionOptions.oldOptions['center'].el.setStyles({
                        'top': this.dimensionOptions.oldOptions['center'].el.getStyle("top").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize,
                        'height': this.dimensionOptions.oldOptions['center'].el.getStyle("height").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize
                    });
                    this.refreshOtherRefHeight("center", this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize);
                }
               if(lt!="frameLayer5"){
	                if ($defined(this.dimensionOptions.oldOptions['west'].el)) {
	                    this.dimensionOptions.oldOptions['west'].el.setStyles({
	                        'top': this.dimensionOptions.oldOptions['west'].el.getStyle("top").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize,
	                        'height': this.dimensionOptions.oldOptions['west'].el.getStyle("height").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize
	                    });
	//                    this.dimensionOptions.oldOptions['west'].scrollDiv.setStyles({
	//                        'top': this.dimensionOptions.oldOptions['west'].scrollDiv.getStyle("top").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize,
	//                        'height': this.dimensionOptions.oldOptions['west'].scrollDiv.getStyle("height").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize
	//                    });
	                    this.dimensionOptions.oldOptions['westDragDiv'].el.setStyles({
	                        'top': this.dimensionOptions.oldOptions['westDragDiv'].el.getStyle("top").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize,
	                        'height': this.dimensionOptions.oldOptions['westDragDiv'].el.getStyle("height").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize
	                    });
	                    this.refreshOtherRefHeight("west", this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize);
	                }
                }
                if ($defined(this.dimensionOptions.oldOptions['east'])) {
                    this.dimensionOptions.oldOptions['east'].el.setStyles({
                        'top': this.dimensionOptions.oldOptions['east'].el.getStyle("top").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize,
                        'height': this.dimensionOptions.oldOptions['east'].el.getStyle("height").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize
                    });
//                    this.dimensionOptions.oldOptions['east'].scrollDiv.setStyles({
//                        'top': this.dimensionOptions.oldOptions['east'].scrollDiv.getStyle("top").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize,
//                        'height': this.dimensionOptions.oldOptions['east'].scrollDiv.getStyle("height").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize
//                    });
                    this.dimensionOptions.oldOptions['eastDragDiv'].el.setStyles({
                        'top': this.dimensionOptions.oldOptions['eastDragDiv'].el.getStyle("top").toFloat() + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize,
                        'height': this.dimensionOptions.oldOptions['eastDragDiv'].el.getStyle("height").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize
                    });
                    this.refreshOtherRefHeight("east", this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize);
                }
                  this.dimensionOptions.oldOptions[region].scrollBtn .set("class","x-tool x-tool-collapse-north");//收缩后更换样式.这个地方不能放在这 .去掉原来收缩后弹出的div
                this.dimensionOptions.oldOptions[region].scrollBtn .setStyles({
                        'top': '5px',
                        'position':'inherit'
                    });
                break;
            case 'south':
                this.dimensionOptions.oldOptions[region].el.setStyle('top',  this.dimensionOptions.newOptions[region].styles.top);
              //  this.dimensionOptions.oldOptions[region].scrollDivTween.start('top', this.dimensionOptions.newOptions[region].styles.top + this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize, this.dimensionOptions.newOptions[region].styles.top + this.dimensionOptions.newOptions[region].styles.height + 10);
                if ($defined(this.dimensionOptions.oldOptions['center'])) {
                    if ($defined(this.dimensionOptions.oldOptions['center'].el)) {
                        this.dimensionOptions.oldOptions['center'].el.setStyles({
                            'height': this.dimensionOptions.oldOptions['center'].el.getStyle("height").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize
                        });
                        this.refreshOtherRefHeight("center", this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize);
                    }
                }
                this.dimensionOptions.oldOptions[region].scrollBtn .set("class","x-tool x-tool-collapse-south");//收缩后更换样式.这个地方不能放在这 .去掉原来收缩后弹出的div
                if ($defined(this.dimensionOptions.oldOptions['west'])) {
                    if ($defined(this.dimensionOptions.oldOptions['west'].el)) {
                        this.dimensionOptions.oldOptions['west'].el.setStyles({
                            'height': this.dimensionOptions.oldOptions['west'].el.getStyle("height").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize
                        });
//                        this.dimensionOptions.oldOptions['west'].scrollDiv.setStyles({
//                            'height': this.dimensionOptions.oldOptions['west'].scrollDiv.getStyle("height").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize
//                        });
                        this.dimensionOptions.oldOptions['westDragDiv'].el.setStyles({
                            'height': this.dimensionOptions.oldOptions['westDragDiv'].el.getStyle("height").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize
                        });
                        this.refreshOtherRefHeight("west", this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize);
                    }
                }

                if ($defined(this.dimensionOptions.oldOptions['east'])) {
                    if ($defined(this.dimensionOptions.oldOptions['east'].el)) {
                        this.dimensionOptions.oldOptions['east'].el.setStyles({
                            'height': this.dimensionOptions.oldOptions['east'].el.getStyle("height").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize
                        });
//                        this.dimensionOptions.oldOptions['east'].scrollDiv.setStyles({
//                            'height': this.dimensionOptions.oldOptions['east'].scrollDiv.getStyle("height").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize
//                        });
                        this.dimensionOptions.oldOptions['eastDragDiv'].el.setStyles({
                            'height': this.dimensionOptions.oldOptions['eastDragDiv'].el.getStyle("height").toFloat() - this.dimensionOptions.newOptions[region].styles.height + this.options.panelScrollSize
                        });
                        this.refreshOtherRefHeight("east", this.dimensionOptions.newOptions[region].styles.height - this.options.panelScrollSize);
                    }
                }
                break;
            default:
                break;
        }
    },
    scrollRegionOutAboveDiv: function(region) {
        this.dimensionOptions.oldOptions[region].el.setStyle("z-index", 1);
        this.dimensionOptions.oldOptions[region].scrollRegionAboveFlag = false;
        this.dimensionOptions.oldOptions[region].scrollBtn.setStyle('display', 'block');
        switch (region) {
            case 'west':
                this.dimensionOptions.oldOptions[region].elTween.start('left', this.dimensionOptions.newOptions[region].styles.left + this.options.panelScrollSize, this.dimensionOptions.newOptions[region].styles.left - this.dimensionOptions.newOptions[region].styles.width);
                break;
            case 'east':
                this.dimensionOptions.oldOptions[region].elTween.start('left', this.dimensionOptions.newOptions[region].styles.left - this.options.panelScrollSize, this.dimensionOptions.newOptions[region].styles.left + this.dimensionOptions.newOptions[region].styles.width);
                break;
            case 'north':
                this.dimensionOptions.oldOptions[region].elTween.start('top', this.dimensionOptions.newOptions[region].styles.top + this.options.panelScrollSize, this.dimensionOptions.newOptions[region].styles.top - this.dimensionOptions.newOptions[region].styles.height);
                break;
            case 'south':
                this.dimensionOptions.oldOptions[region].elTween.start('top', this.dimensionOptions.newOptions[region].styles.top - this.options.panelScrollSize, this.dimensionOptions.newOptions[region].styles.top + this.dimensionOptions.newOptions[region].styles.height);
                break;
            default:
                break;
        }
    },
    scrollRegionInAboveDiv: function(region) {
        this.dimensionOptions.oldOptions[region].el.setStyle("z-index", 10);
        this.dimensionOptions.oldOptions[region].scrollRegionAboveFlag = true;
        this.dimensionOptions.oldOptions[region].scrollBtn.setStyle('display', 'none');
        switch (region) {
            case 'west':
                this.dimensionOptions.oldOptions[region].elTween.start('left', this.dimensionOptions.newOptions[region].styles.left - this.dimensionOptions.newOptions[region].styles.width, this.dimensionOptions.newOptions[region].styles.left + this.options.panelScrollSize);
                break;
            case 'east':
                this.dimensionOptions.oldOptions[region].elTween.start('left', this.dimensionOptions.newOptions[region].styles.left + this.dimensionOptions.newOptions[region].styles.width, this.dimensionOptions.newOptions[region].styles.left - this.options.panelScrollSize);
                break;
            case 'north':
                this.dimensionOptions.oldOptions[region].elTween.start('top', this.dimensionOptions.newOptions[region].styles.top - this.dimensionOptions.newOptions[region].styles.height, this.dimensionOptions.newOptions[region].styles.top + this.options.panelScrollSize);
                break;
            case 'south':
                this.dimensionOptions.oldOptions[region].elTween.start('top', this.dimensionOptions.newOptions[region].styles.top + this.dimensionOptions.newOptions[region].styles.height, this.dimensionOptions.newOptions[region].styles.top - this.options.panelScrollSize);
                break;
            default:
                break;
        }
    }
});