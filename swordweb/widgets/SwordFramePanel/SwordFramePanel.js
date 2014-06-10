var SwordFramePanel = new Class({
     Implements:[Options,Events],
	 type: "SwordFramePanel",
     options:{
	 	pNode: null,
		src: null,//pNode节点下面的内容
	 	pos: "false",//当绝对定位的时候,需要指定为absolute,同时填写left,width,top的长度
		left: null,
		top: null,
		width: null,
		height: 400,//由于panelContentBodyDiv需要指定默认值,height属必须默认指定,其他的属性可以随意指定
		zIndex: 5000,//默认
		isCloseBtn: "false",//关闭按钮
		isCollapse: "false",//是否伸缩
		isDrag: "false",//是否支持拖拽
		isPin: "false",//是否支持固定
		isResize: "false",//是否支持resize
		title: "panel"
	 },
	 panelDiv: null,
	 panelHeaderDiv: null,
	 panelHeaderCloseDiv: null,
	 panelHeaderPinDiv: null,
	 panelHeaderCollapseContentDiv: null,
	 panelHeaderCollapseContentTween: null,
	 panelHeaderTitleSpan: null,
	 panelContentBodyDiv: null,
	 panelResizeDiv: null,
	 initialize: function(options){
		this.setOptions(options);
     },
	 initParam: function(node) {
		this.htmlOptions(node);
		this.options.src = node.getChildren();
		this.create(node);
		this.refreshPanelContentByRate();//todo,这里和frame有点耦合
		this.BuildRefreshPanelContentHeightEvent();//todo,这里和frame有点耦合
     },
     initData: function() {
		
     },
	 create: function(pNode){
	 	if($defined(pNode)){
			this.options.pNode = pNode.getParent();
		}
		if(!$defined(this.options.pNode)){
			this.options.pNode = document.body;
		}
		this.buildPanel();
		this.panelDiv.replaces(pNode);
	 },
	 buildPanel: function(){
	 	this.buildPanelHeader();
		this.buildPanelContent();
		this.buildPanelResizeDiv();
		this.buildPanelDrag();
	 },
	 buildPanelDrag: function(){
	 	if(this.options.isDrag == "true"){
            this.panelHeaderDiv.setStyle("cursor","move"); 
		 	new Drag(this.options.pNode, {
	            handle: this.panelHeaderDiv,
				onStart: function(el){
					this.options.left = el.getPosition().x||el.getCoordinates().left;
					this.options.top = el.getPosition().y||el.getCoordinates().top;
				
				}.bind(this),
				onDrag: function(el){
					if(this.options.isDrag == "false"){
						el.setStyles({
							'left': this.options.left,
							'top': this.options.top
						});
					}else{
						el.setStyles({
							'z-index': 10000
						});
					}
			    }.bind(this),
	            onComplete: function(el) {
					if(this.options.isDrag == "false"){
						el.setStyles({
							'left': this.options.left,
							'top': this.options.top
						});
					
					}else{
					
						this.options.left = el.getPosition().x;
						this.options.top = el.getPosition().y;
						
						el.setStyles({
							'z-index': 0
						});
					}
	            }.bind(this)
	        });
		}
	 },
	 buildPanelHeader: function(){
	 	this.panelDiv = new Element('div', {
			'class': 'x-panel'
		}).inject(this.options.pNode);
		if(this.options.pos == "absolute"){
			this.panelDiv.setStyles({
				'position': 'absolute',
				'left': this.options.left,
				'top': this.options.top,
				'width': this.options.width,
				'height': this.options.height,
				'z-index': this.options.zIndex
			});
		}
		this.panelHeaderDiv = new Element('div', {
			'class': 'x-panel-header x-unselectable'
		}).inject(this.panelDiv);
		if(this.options.isCloseBtn == "true"){
			this.panelHeaderCloseDiv = new Element('div', {
				'class': 'x-tool x-tool-close'
			}).inject(this.panelHeaderDiv);
			this.panelHeaderCloseDiv.addEvent('click',function(){
				this.panelDiv.setStyle('display','none');
			}.bind(this));
		}
		if(this.options.isPin == "true"){
			this.panelHeaderPinDiv = new Element('div', {
				'class': 'x-tool x-tool-pin-over'
			}).inject(this.panelHeaderDiv);
			this.panelHeaderPinDiv.addEvent('click',function(){
				if(this.options.isDrag == "true" && this.panelHeaderPinDiv.hasClass('x-tool-pin-over')){
					this.options.isDrag = "false";
					this.panelHeaderPinDiv.removeClass('x-tool-pin-over');
					this.panelHeaderPinDiv.addClass('x-tool-pin');
				}else{
					this.options.isDrag = "true";
					this.panelHeaderPinDiv.removeClass('x-tool-pin');
					this.panelHeaderPinDiv.addClass('x-tool-pin-over');
				}
			}.bind(this));
		}
		if(this.options.isCollapse == "true"){
			this.panelHeaderCollapseContentDiv = new Element('div', {
				'class': 'x-tool x-tool-toggle'
			}).inject(this.panelHeaderDiv);
			this.panelHeaderCollapseContentDiv.addEvent('click',function(){
				if(this.panelContentBodyDiv.getStyle('display') == "block"){
					this.panelHeaderDiv.addClass('x-panel-collapsed');
					this.panelHeaderCollapseContentTween.start('display', 'block', 'none');
				}else{
					this.panelHeaderDiv.removeClass('x-panel-collapsed');
					this.panelHeaderCollapseContentTween.start('display', 'none', 'block');
				}
			}.bind(this));
		}
		this.panelHeaderTitleSpan = new Element('div', {
			'class': 'x-panel-header-text',
			'text': this.options.title
		}).inject(this.panelHeaderDiv);
	 },
	 setTitle:function(title){
	 	this.panelHeaderTitleSpan.set("text",title);
	 },
	 
	 buildPanelContent: function(){
		var height = this.options.height.toFloat() - this.panelHeaderDiv.getSize().y.toFloat();
		if(height < 0)height = 0;
		this.panelContentBodyDiv = new Element('div', {
			'name': 'panelContentBodyDiv',
			'class': 'x-panel-body',
			'styles':{
                'width':'100%',//ie下面的100%的问题
                'overflow-x':'hidden',//让水平滚动条置为hidden
				'height': height
			}
		}).inject(this.panelDiv);
		this.panelHeaderCollapseContentTween = new Fx.Tween(this.panelContentBodyDiv,{duration:200, transition: Fx.Transitions.linear});
		this.options.src.each(function(item, index){
			this.panelContentBodyDiv.adopt(item);
		}.bind(this));
	 },
	 
	 buildPanelResizeDiv: function(){
	 	if(this.options.isResize == "true"){
			this.panelResizeDiv = new Element('div',{
				'class': 'x-panel-bottom-resize'
			}).inject(this.panelContentBodyDiv);
			this.panelResizeDiv.addEvent('mousedown', function(e) {
				
				var tempResizeDiv = new Element('div',{
					'styles':{
						'position': 'absolute',
						'z-index': 999999,
						'left': this.panelDiv.getPosition().x,
						'top': this.panelDiv.getPosition().y,
						'width': this.panelDiv.getSize().x,
						'height': this.panelDiv.getSize().y,
						'border': '1px solid red'
					}
				}).inject(document.body);
	            var tempX = e.client.x;
	            var tempY = e.client.y;
				var tempWidth = this.panelDiv.getSize().x;
				var tempHeight = this.panelDiv.getSize().y;
				var resetSizeFun = function(e) {
		            var tempAfterX = e.client.x;
		            var tempAfterY = e.client.y;
		            tempResizeDiv.setStyle('width',tempWidth + tempAfterX - tempX);
		            tempResizeDiv.setStyle('height',tempHeight + tempAfterY - tempY);
		        };
				var resetSizeFun1 = resetSizeFun.bind(this);//这里增加一个变量的目的是resetSizeFun.bind(this)和resetSizeFun是不一样的
	            document.addEvent('mousemove', resetSizeFun1);
				var resizeUpFun = function(e) {
					
					var tmpWidth = tempResizeDiv.getStyle('width').toFloat();
					var tmpHeight = tempResizeDiv.getStyle('height').toFloat();
				
					if(tmpWidth<3){
						tmpWidth = 3;	
					}
					if(tmpHeight<37){
						tmpHeight = 37;	
					}
					this.panelDiv.setStyles({
		                width: tmpWidth,
		                height: tmpHeight
		            });
		            this.panelContentBodyDiv.setStyles({
		                height: tmpHeight - 30
		            });
					tempResizeDiv.destroy();
	                document.removeEvent('mousemove', resetSizeFun1);
					document.removeEvent('mouseup', resizeUpFun2);
	            };
				var resizeUpFun2 = resizeUpFun.bind(this);
	            document.addEvent('mouseup', resizeUpFun2);
	        }.bind(this));			
		}
	 },
	 refreshPanelContentByRate: function(){
	 	//耦合frame
		var regionDiv = this.panelDiv.getParent();
        if($defined(regionDiv) && regionDiv.get('tag') != "body"){
            while(true){
                    if($defined(regionDiv.getProperty("region"))){
                        break;
                    }else{
                       regionDiv = regionDiv.getParent();
                    }
                    if(regionDiv.get('tag') == "body"){
                        break;
                    }
            }
            if(regionDiv.get('tag') != "body"){
                var heightRate = regionDiv.getProperty("heightRate").toFloat();
                var heightMinus = 0;
                if($defined(this.options.pNode.getProperty("heightMinus"))){
                    heightMinus = (this.options.pNode.getProperty("heightMinus")).toFloat();
                }
                var bodyHeight = this.options.height * heightRate - 30 - heightMinus;
                if(bodyHeight < 0){bodyHeight = 0;}
                this.panelContentBodyDiv.setStyles({
                    'height': bodyHeight
                });
            }
        }else{
            return;
        }
	 },
	 BuildRefreshPanelContentHeightEvent: function(){
	 	//耦合frame
		window.addEvent('resize', function(e) {
			this.refreshPanelContentByRate();
	    }.bind(this));
	 },
	 refreshPanelContentByNum: function(heightMinus){
	 	//耦合frame
		var tempFloat = this.panelContentBodyDiv.getStyle("height").toFloat();
	 	this.panelContentBodyDiv.setStyles({
			'height': tempFloat - heightMinus
		});
	 },
	 collapse: function(){
		 this.panelHeaderDiv.addClass('x-panel-collapsed');
		 this.panelContentBodyDiv.setStyle('display', 'none');
	 },
	 extend: function(){
		 this.panelHeaderDiv.removeClass('x-panel-collapsed');
		 this.panelContentBodyDiv.setStyle('display', 'block');
	 }
});














