var SwordMask = new Class({
    Implements: [Events,Options],
    options:{
        background:null,//背景颜色
        opacity: 1,//透明度，范围 0-1 之间
        zIndex: 30000,//层叠顺序，默认为10000
        position: 'absolute',//定位方式，absolute/relative绝对定位/相对定位
        left: 0,//距离左面的高高度
        top: 0,//距离顶端高度
        width: 0,//宽度
        height: 0,//高度
        type: 'loading9'//蒙版蒙住元素的类型
    },
    maskDiv: null,//遮盖的div对象
    maskIframe: null,//遮盖的iframe对象
    maskState: null,//mask的状态	
    divTw: null,//延迟定义的对象
    el: null,//当前引用的对象
    initialize: function(options) {
        this.setOptions(options);
		this.initEl();
    },
	initEl: function(){
		this.el = new Element('div',{});
	},
    initParam: function(node) {
    },
    initData: function() {
    },
    initDimension: function(obj, options) {
		//分为两类元素,一种是带有滚动的元素,另一种是不带有滚动的元素,最后一种是body(body和滚动元素不同的地方就是body滚动的话)
		if($(obj).getSize().x == $(obj).getScrollSize().x){
			this.options.left = $(obj).getPosition().x;
			this.options.width = $(obj).getSize().x;
		}else{
			this.options.left = $(obj).getPosition().x + $(obj).getScroll().x;
			this.options.width = $(obj).getSize().x;
		}
		if($(obj).getSize().y == $(obj).getScrollSize().y){
			this.options.top = $(obj).getPosition().y;
			this.options.height = $(obj).getSize().y;
		}else{
			this.options.top = $(obj).getPosition().y + $(obj).getScroll().y;
			this.options.height = $(obj).getSize().y;
		}
		if(this.isBody(obj)){
			this.options.top = 0;
			this.options.left = 0;
			this.options.width = $(obj).getScrollSize().x;
			this.options.height = $(obj).getScrollSize().y;
		}
        if (options != null) this.initialize(options);
    },
    //obj 被蒙住的元素，el 是显示loading的元素
    mask: function(obj, el, options) {
    	//隐藏的情况下$(obj).getPosition()=null，会报错
    	if($type(obj) == 'element' && $(obj).getHeight() == 0 && $(obj).getWidth() == 0)return;
		if(!this.maskState){
			if($defined(el)){
				if($type(el) == 'string'){
					this.el.addClass(el);
					this.el.setStyles({
						'width': 105,
						'height': 75,
                        'display':'block'
					});
				}else if($type(el) == 'element'){
					this.el = el;
				}
			}else{
                this.el.setStyle('display','block');
				this.el.addClass(this.options.type);
			}
	        ($type(obj) == 'element') ? this.initDimension(obj, options) : this.initialize(options);
            var maskWidth = this.options.width-((Browser.Engine.trident)?1:4);
            if(maskWidth < 0)maskWidth = 0;
            var maskHeight = this.options.height-((Browser.Engine.trident)?1:4);
            if(maskHeight < 0)maskHeight = 0;
            var docm = window.document;
            if($type(window.document.body) == 'element' && $(window.document.body).getHeight() == 0 && $(window.document.body).getWidth() == 0)docm = parent.window.document;
	        this.maskDiv = new Element('div', {
                'class':'maskDivEl',
	            'styles': {
	                'z-index': this.options.zIndex,
	                'filter': 'Alpha(opacity=0)',
	                'opacity': this.options.opacity,
	                'position': this.options.position,
	                'left': this.options.left,
	                'top': this.options.top,
	                'width': maskWidth,
	                'height': maskHeight,
                    'display':'block'
	            }
	        }).inject(docm.body);
            if(this.options.background)this.maskDiv.setStyle('background',this.options.background);
	        this.maskIframe = new Element('iframe', {
	            'class':'maskDivEl',
                'styles': {
//                     'background':this.options.background,
	                'z-index': this.options.zIndex - 1,
	                'filter': 'Alpha(opacity=' + this.options.opacity + ')',
	                'opacity': this.options.opacity,
	                'position': this.options.position,
	                'left': this.options.left,
	                'top': this.options.top,
	                'width': maskWidth,
	                'height': maskHeight,
                    'display':'block'
	            }
	        }).inject(docm.body);
            if(this.options.background)this.maskIframe.setStyle('background',this.options.background);
	        if ($defined(this.el)) {
	            $(this.el).inject(docm.body);
				//同上面当为滚动和不滚动的时候分情况来考虑,这里不进行考虑滚动的原因是this.options.left/top已经将滚动的因素考虑在内了
				//但是body还得特殊考虑,因为body的this.options.width/height是scrollheight,而this.options.left是0,body是取当前页面的宽度和长度
				//在body的时候还得考虑,body滚动的时候，所以需要减去getScroll().x/y
				if(this.isBody(obj)){
	                this.el.setStyles({
		                'position': 'absolute',
	                    'left':($(obj).getSize().x - this.el.getSize().x)/2 + $(obj).getScroll().x,
		                'z-index': this.options.zIndex + 1
		            });
                    this.setTop(this.el,($(obj).getSize().y - this.el.getSize().y)/2 + $(obj).getScroll().y);
				}else{
		            this.el.setStyles({
		                'position': 'absolute',
		                'left': this.options.left + (this.options.width - this.el.getSize().x) / 2,
		                'z-index': this.options.zIndex + 1
		            });
                    this.setTop(this.el,this.options.top + (this.options.height - this.el.getSize().y) / 2);
				}
	        }
			this.maskState = true;
		}
    },setTop:function(el,v){
         if(v/1<0||(v+'').indexOf('-')>=0)v=0;
         el.setStyle('top',v);
     },
	getElPosition: function(){
		return {
			'position': this.el.getStyle('position'),
            'left':this.el.getStyle('left'),
            'top':this.el.getStyle('top'),
	        'z-index': this.el.getStyle('z-index')
		};
	},
    unmask: function(minute) {
        if (!$defined(minute)) minute = 0;
        if(minute == 0){this.excute();}else{this.excute.delay(minute, this);}
    },
    excute: function() {
		this.maskState = false;
        if ($defined(this.el)) this.el.style.display="none";
        if (this.maskDiv){
            this.maskDiv.destroy();   
        }
        if (this.maskIframe){
        	if (Browser.Engine.webkit) {
				top.injectIfame(this.maskIframe);
	        }else{
	        	this.maskIframe.destroy();
	        }
        }
        this.maskDiv = null;
        this.maskIframe = null;
    },
    isBody:function(el) {
        return (/^(?:body|html)$/i).test((el.get('tag') || el.tagName));
    }
});







