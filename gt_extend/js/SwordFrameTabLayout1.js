var SwordFrameTabItemLayout1 = new Class({
     Implements:[Options,Events],
	 type: "SwordFrameTabItemLayout1",
     options:{
	 	id: 'tab',
		title: '默认的tab页卡',
		src: '',
		tabContentType: "iframe",//分为三种,一种是iframe,一种是div类型的,一种类型是innerHTML
		isCloseBtn: "true",
		tabItemWidth: 88,//最好的宽度是大于100
		isActive: "true",//后台进行打开,现在暂时不完善,以后制作
		onIframeLoaded:$empty
        ,onClose:$empty
        ,onSelect:$empty
        ,onMouseon:$empty
        ,onMouseleave:$empty
	 },
	 refSwordFrameTab: null,   //所属SwordFrameTab对象
	 tabItemLI: null,
	 tabItemInputCloseA: null,
	 tabItemLISpanWidth: null,
	 tabItemLISpanTitle: null,
	 tabContent: null,
	 tabContextMenu: null,
     tabItemCssWidth:20,//这个是每一个tab的LI的width
     initialize: function(options){
		this.setOptions(options);
     },
	 buildItemLI: function(){
	 	this.tabItemLI = new Element('li', {
			'name': "tabItem_" + this.options.id
		});
		this.tabItemLI.setStyles({
				'padding': "0px",
                'border-bottom': "0px",
                'border-top': "0px",
                'border-left': "0px",
                'border-right': "0px",
                'margin':'0px'
			});
        this.tabItemLI.addEvents({
            'mouseover': function() {
                this.fireEvent("onMouseon",[this.tabItemLI]);
            }.bind(this),
            'mouseout': function() {
                this.fireEvent("onMouseleave",[this.tabItemLI]);
            }.bind(this)
        });
		this.tabItemLI.addEvent('contextmenu',function(e){
			if (!this.refSwordFrameTab.windowClick) {
	            window.document.addEvent('click', function(e) {
	                this.refSwordFrameTab.tabItems.each(function(value, key){

						if($defined(value.tabContextMenu)){
                            value.tabContextMenu.foldFlag = false;
							 value.tabContextMenu.menuZeroLevelDiv.destroy();
							 value.tabContextMenu = null;
						}
					}.bind(this));
	            }.bind(this));
	           this.refSwordFrameTab.windowClick = true;
	        }
			  var left = this.tabItemLI.getPosition().x + this.tabItemLI.getSize().x/5;
			  var top = this.tabItemLI.getPosition().y + this.tabItemLI.getSize().y/5;
			  this.tabContextMenu = new SwordMenu({
			  	  'name': 'tabContextMenu',
				  'pos': 'absolute',
				  'left': left,
				  'top': top,
				  'isInput':"false",
				   'width':200,
                  itemWidth:'120px',
				  'dataStr': "{ 'data': [{'pcode': null,'code': '0','caption': '"+i18n.tabMenuFresh+"',imgName:'recycle.png'}," +
                             "{'pcode': null,'code': '1','caption': '"+i18n.tabMenuClose+"',imgName:'delete.png'}," +
                             "{'pcode': null,'code': '2','caption': '"+i18n.tabMenuCloseAll+"',imgName:'star_red.png'}," +
                             "{'pcode': null,'code': '3','caption': '"+i18n.tabMenuCloseOthers+"',imgName:'flag_red.png'}" +
                             "],'name': 'SwordTreeJSON1','sword': 'SwordTree'}",
				  'dataType': 'json',
				  'type': 'vertical',
				  'pNode': document.body,
                  'isShow':false,
				  'onSelect': this.onSelectMenuItem.bind(this)
			  });
			  this.tabContextMenu.build();
              this.fold.delay(3000,this);
			  e.preventDefault();//停止执行document.contextmenu

		}.bind(this));

		this.tabItemLI.addEvent('click', function(){
			 this.refSwordFrameTab.activeTabItem(this.options.id);
             this.fireEvent("onSelect",[this.refSwordFrameTab,this.options.id]);
		}.bind(this));

		var actualLength = 0;
		for(var i = 0 ; i < this.options.title.length; i++){
			if(/^[\u4e00-\u9fa5]+$/i.test(this.options.title.charAt(i))){
				actualLength = actualLength + 2;//汉字加2
			}else{
				actualLength ++;
			}
		}
		this.tabItemLISpanWidth = new Element('div', {
			'title': this.options.title
            
		}).inject(this.tabItemLI);
		if(this.options.isActive == "true"){
			this.tabItemLISpanWidth.addClass("main_tab01");
		}else{
            this.tabItemLISpanWidth.addClass("main_tab02");
        }
        this.tabItemLISpanWidth.setStyle("width",this.options.tabItemWidth);
        new Element("span",{
            'text': (actualLength > 8) ? (this.options.title.substring(0,5) + "..") : this.options.title,
            'style':{width:this.options.tabItemWidth}
        }).inject(this.tabItemLISpanWidth);
        if(this.options.isCloseBtn == "true"){
			// this.tabItemLI.addClass("main_tab02");
			this.tabItemInputCloseA = new Element('img', {
				'class': 'shutoff01',
				'src' :'blue/images/tab_shutoff02.gif'
			}).inject(this.tabItemLISpanWidth,'bottom');
			this.tabItemInputCloseA.addEvent('click', function(e){
				this.refSwordFrameTab.removeTabItem(this.options.id);
				e.stopPropagation();//停止li的click事件的传播
			}.bind(this));
		}

	 },
     fold:function(){
         if($defined(this.tabContextMenu)&&this.tabContextMenu.foldFlag){
               this.tabContextMenu.menuZeroLevelDiv.destroy();
               this.tabContextMenu = null;
         }
    } ,
	 buildContent: function(){
		if(this.options.tabContentType == "iframe"){
			this.tabContent = new Element(this.options.tabContentType, {
				'name': "tabContent_" + this.options.id,
				'frameborder': 0,
				'border': 0,
				'marginwidth': 0,
				'marginheight': 0,
				'scrolling': 'auto',
				'allowtransparency': 'yes'
			});
			this.tabContent.setStyles({
				'width': "100%",
                'height': "100%"
			});
			this.tabContent.setProperty('src', this.options.src);
            //控制iframe的加载事件
            this.refSwordFrameTab.iframeLoad = false;//初始化为false
            if(!Browser.Engine.trident) { //if not IE
                this.tabContent.addEvent('load', function(){

                    this.fireEvent("onIframeLoaded",this);

                    this.refSwordFrameTab.iframeLoad = true;
                }.bind(this));
            } else {
                this.tabContent.addEvent('readystatechange', function(){
                    if (this.tabContent.readyState == "complete"){

                        this.fireEvent("onIframeLoaded",this);

                        this.refSwordFrameTab.iframeLoad = true;
                    }
                }.bind(this));
            }

		}else if(this.options.tabContentType == "div"){
			this.tabContent = new Element(this.options.tabContentType, {
				'name': "tabContent_" + this.options.id
			});
			this.tabContent.setStyles({
				'width': "100%",
				'height': "100%"
			});
			this.tabContent = $(this.options.src);
		}else if(this.options.tabContentType == "innerHTML"){
			this.tabContent = new Element('div', {
				'name': "tabContent_" + this.options.id
			});
			this.tabContent.setStyles({
				'width': "100%",
				'height': "100%"
			});
			this.options.src.each(function(item, index){
			    this.tabContent.adopt(item);
			}.bind(this));
		}
		if(this.options.isActive == "true"){
			this.tabContent.setStyles({
//                  'position':'absolute',//如果是absolute的定位的话,那么ff中会出问题
                  'z-index':10,
                 'display':'block'
            });
		}else{
			this.tabContent.setStyles({
//                  'position':'absolute',
                  'z-index':1,
                 'display':'none'
            });
		}
	 },
	 onSelectMenuItem: function(el){
	 	if(el.getProperty("caption") == ""+i18n.tabMenuFresh){
			if($defined(window.frames["tabContent_" + this.options.id])){
				window.frames["tabContent_" + this.options.id].location.reload();
			}else{
				alert("刷新按钮不支持div");
			}
		}else if(el.getProperty("caption") == ""+i18n.tabMenuClose){
			this.refSwordFrameTab.removeTabItem(this.options.id);
		}else if(el.getProperty("caption") == ""+i18n.tabMenuCloseOthers){
			this.refSwordFrameTab.tabItems.each(function(value, key){
			    if(key != this.options.id){
					this.refSwordFrameTab.removeTabItem(key);
				}
			}.bind(this));
		}else if(el.getProperty("caption") == ""+i18n.tabMenuCloseAll){
			this.refSwordFrameTab.tabItems.each(function(value, key){
				this.refSwordFrameTab.removeTabItem(key);
			}.bind(this));
		}
	 },
	 active: function(){
	 	if($defined(this.tabItemLISpanWidth) && $defined(this.tabContent)){
			this.tabItemLISpanWidth.addClass("main_tab01");
			this.tabItemLISpanWidth.removeClass("main_tab02");
            this.tabContent.setStyles({
                  'z-index':10,
                 'display':'block'
            });
		}
	 },
	 //将选中的tab标签设定为未选中状态
	 unactive: function(){
	 	if($defined(this.tabItemLISpanWidth) && $defined(this.tabContent)){
			this.tabItemLISpanWidth.addClass("main_tab02");
			this.tabItemLISpanWidth.removeClass("main_tab01");
            this.tabContent.setStyles({
                  'z-index':1,
                'display':'none'
            });
		}
	 },
	 add: function(){
		if(!$defined(this.tabItemLI) && !$defined(this.tabContent)){
			this.buildItemLI();
			this.buildContent();
		}
	 },
	 remove: function(){
//        try{//由于跨域的问题,这里增加了try..catch
            if($defined(this.tabItemLI) && $defined(this.tabContent)){
                this.tabContent.set('src','');
                this.tabItemLI.destroy();
                /*if(!Browser.Engine.trident4){//ie6不清除
                    if($defined(this.tabContent.contentWindow)) $(this.tabContent.contentWindow.document.body).destroy();
                }*/
                this.tabContent.destroy();

            }
//        }catch(e){
//        }
	 }
});


var SwordFrameTabLayout1 = new Class({
     Implements:[Options,Events],
	 type: "SwordFrameTabLayout1",
     options:{
	 	pNode: null,
		pos: 'false',//如果需要绝对定位,这里需要修改width,height,left,top
	 	width: null,
		height: 200,//height默认需要存在
		left: null,
		top: null,
        maxTabNum: 20,//最大的tab页卡的数目
		defaultSelectId: null,//默认选中的id的tab标签
		tabType: 'scroll',//plain普通的,scroll滚动的,todo以后再做
		tabDirection: 'top',//top bottom left right四种tab的方位,todo以后再做
		items: null //默认加载的tabItem

	 },
     initialize:function(options){
		this.setOptions(options);
     },
	 initParam: function(node) {
		this.htmlOptions(node);
		//TODO 自适应高度。
		if(this.options.height == '' || String(this.options.height).indexOf("%") > -1){
			this.options.height = this.options.height || "100%";
			var percent = this.options.height.substring(0,this.options.height.indexOf("%"));
			this.options.height = this.options.pNode.getParent().getCoordinates().height * percent / 100;
		}
		//TODO
		
		this.parseFrameTabItems(node);
		this.create(node);
		this.refreshTabContentByRate();//耦合frame
		this.BuildRefreshTabContentHeightEvent();//耦合frame
     },
     //组织tab选项卡
	 parseFrameTabItems: function(node){
	 	var tempItemsOptions = {};
		var tempSwordFrameTabItem = new SwordFrameTabItemLayout1();
		node.getChildren().each(function(item, index){
		    var tempId = item.getProperty('id');
			var tempIdOptions = {};
			for(var key in tempSwordFrameTabItem.options){
				if(key != "id"){
					if($defined(item.getProperty(key))){
						tempIdOptions[key] = item.getProperty(key);
					}else{
						tempIdOptions[key] = tempSwordFrameTabItem.options[key];
					}
				}
			}
			if(!$defined(item.getProperty('tabContentType')) || !$defined(item.getProperty('src'))){
				tempIdOptions.tabContentType = "innerHTML";
				tempIdOptions.src = item.getChildren();
			}
			tempItemsOptions[tempId] = tempIdOptions;
		});
		this.options.items = tempItemsOptions;
	 },
     initData: function() {

     },
	 tabItems: new Hash(),
	 curTabItem: null,
	 tabDiv: null,
	 tabHeaderDiv: null,
	 tabItemScrollLeftDiv: null,
	 tabItemScrollRightDiv: null,
	 tabItemContentDiv: null,
	 tabItemContentUL: null,
	 tabContentDiv: null,
	 windowClick: null,
     iframeLoad:true,//当iframe格式的状态的时候,是否为默认加载的,初始化为true
	 create: function(pNode){
		if($defined(pNode)){
			this.options.pNode = pNode.getParent();//附加到父节点的上面
		}
		if(!$defined(this.options.pNode)){
			this.options.pNode = document.body;
		}
		this.buildTab();
		this.loadDefaultItems(); //加载默认标签。
		this.tabDiv.replaces(pNode); //是同tabDiv替换父。
	 },
	 loadDefaultItems: function(){
	 	if($defined(this.options.items)){
			var tempItems = new Hash(this.options.items);
			tempItems.each(function(value, key){
                value.id = key;
                this.addTabItem(value); //调用添加方法。
			}.bind(this));
		}
		if($defined(this.options.defaultSelectId)){
			if(this.tabItems.has(this.options.defaultSelectId) == true){
				this.activeTabItem(this.options.defaultSelectId);
			}
		}
	 },
	 isScroll: function(){
	 	if($defined(this.curTabItem)){

			if(this.tabItems.getKeys().length * (this.curTabItem.options.tabItemWidth + 4) > this.tabItemContentDiv.getCoordinates().width){
				return true;
			}else{
				return false;
			}
		}else{
			return false;
		}
	 },
	 activeScroll: function(){
//        alert("--------this.isScroll()--------" + this.isScroll());
		if(this.isScroll() == false){
			this.tabItemScrollRightDiv.addClass("right_a");
			this.tabItemScrollLeftDiv.addClass("left_a");
		}else{
			this.tabItemScrollRightDiv.removeClass("right_a");
			this.tabItemScrollLeftDiv.removeClass("left_a");
		}
	 },
	 scrollRight: function(){
        if($defined(this.curTabItem)){
            this.getFirstDisplayTabItem(1);
        }
	 },
	 scrollLeft: function(){
	         if($defined(this.curTabItem)){
	            	this.getLastDisplayTabItem(1);
	         }
	 },
	 addTabItem: function(options){
	 	//标签已经添加。
            if($defined(this.tabItems.get(options.id))) {
                this.unactiveAllTabItem();  //将所有标签设定为未选中状态。
                //将新增tab设定为选中。
                this.curTabItem = this.tabItems.get(options.id);
                this.activeTabItem(this.curTabItem.options.id);
                if(this.options.tabType == "scroll"){  //标签为滚动的。
                    this.activeScroll();
                }
                //添加未被添加，但是再添加则超长。
            }else if($defined(this.options.maxTabNum) && this.tabItems.getKeys().length >= this.options.maxTabNum){
                 this.isTabNumOut();//接口可以进行扩展
                 return;
            }else{ //添加
            	
                this.unactiveAllTabItem(); //更新选中状态
                if($defined(this.curTabItem))this.curTabItem.unactive();
                this.curTabItem = new SwordFrameTabItemLayout1(options);
                this.curTabItem.refSwordFrameTab = this;
                this.curTabItem.add();
                this.tabItems.set(options.id, this.curTabItem);
                this.curTabItem.tabItemLI.inject(this.tabItemContentUL);
                this.curTabItem.tabContent.inject(this.tabContentDiv);
                this.curTabItem.tabContent.setStyles({
                    'height':(this.tabContentDiv.getStyle('height').toInt()) * 0.9999
                });
                this.scrollLeft();
                this.activeTabItem(this.curTabItem.options.id);
                if(this.options.tabType == "scroll"){
                    this.activeScroll();
                }
            }
	 },
     isTabNumOut: function(){
        alert("为了使浏览器不至于过慢，请您关闭一些tab页卡，最好不要超过" + this.options.maxTabNum + "个!");
     },
	 removeTabItem: function(id){
        var CurTab = this.tabItems.get(id);
        if(CurTab.options.isCloseBtn == "false"){
            return;
        }
	 	CurTab.remove();
	 	
		var lastTabItem = this.getLastTabItem();
		if($defined(lastTabItem)){
			this.curTabItem.unactive();
			lastTabItem.active();
			this.curTabItem = lastTabItem;
			if(lastTabItem.tabItemLI.getStyle('display') != 'none'){
				this.getFirstDisplayTabItem(2);
			}else{
				this.getLastDisplayTabItem(2);
			}
		}else{
			this.curTabItem = null;
			this.getLastDisplayTabItem(2);
		}
		this.tabItems.erase(id);
		if(this.options.tabType == "scroll"){
			this.activeScroll();
		}
        CurTab.fireEvent("onClose",[this,id]);
	 },
	 removeCurrentTabItem: function(){
	 	this.removeTabItem(this.curTabItem.options.id);
	 },
	 activeTabItem: function(id){
	 	this.curTabItem.unactive();
	 	this.curTabItem = this.tabItems.get(id);
		this.curTabItem.active();
	 },
	 unactiveAllTabItem: function(){
	 	this.tabItems.each(function(value, key){
			this.unactiveTabItem(key);
		}.bind(this));
	 },
	 unactiveTabItem: function(id){
	 	this.tabItems.get(id).unactive();
		this.curTabItem = null;
	 },
	 getFirstTabItem: function(){
	 	var firstLi = this.tabItemContentUL.getFirst("li");
		return this.getTabItemByLi(firstLi);
	 },
     getDisplayTabItems: function(){
     	
        var displayHash = new Hash();
        var lis = this.tabItemContentUL.getChildren("li");
        for(var i = 0 ; i < lis.length ; i++){
            if(lis[i].getStyle('display') != "none"){
                 var item = this.getTabItemByLi(lis[i]);
                 displayHash.set(item.options.id,item);
            }
        }
        return displayHash;
     },
     getFirstDisplayTabItem: function(type){
        var lis = this.tabItemContentUL.getChildren("li");
        if(type == 1){
       	var num = this.showItemNum();
        if(lis.length > num)
	        for(var i = lis.length - 1; i > num - 1; i--){
	             if(lis[i] && lis[i].getStyle('display') != "none"){
	             		this.getTabItemByLi(lis[i]).tabItemLI.setStyle('display','none');
	                	this.getTabItemByLi(lis[i - num]).tabItemLI.setStyle('display','');
	                	break;
	             }
	        }
        }else{
        	for(var i = 1; i <= lis.length; i++){
				if(lis[i] && lis[i].getStyle('display') != "none"){
					this.getTabItemByLi(lis[i - 1]).tabItemLI.setStyle('display','');
					break;
				}
			}
        }
     },
     getLastDisplayTabItem: function(type){
     	var lis = this.tabItemContentUL.getChildren("li");
		if(type == 1){
			var num = this.showItemNum();
			if(num < lis.length)
	        for(var i = 0; i < lis.length - num; i++){
	             if(lis[i] && lis[i].getStyle('display') != "none"){
	             	this.getTabItemByLi(lis[i]).tabItemLI.setStyle('display','none');
	                this.getTabItemByLi(lis[i + num]).tabItemLI.setStyle('display','');
	                break;
	             }
	        }
		}else{
            for(var i = lis.length - 2; i >= 0; i--){
	            if(lis[i] && lis[i].getStyle('display') != "none"){
	             	this.getTabItemByLi(lis[i + 1]).tabItemLI.setStyle('display','');
	                break;
	            }
        	}
		}
     },

	 getLastTabItem: function(){
		var lastLi = this.tabItemContentUL.getLast("li");
	 	return this.getTabItemByLi(lastLi);
	 },
	 getPreviousTabItem: function(id){
	 	var thisLi = this.tabItemContentUL.getElement("li[name=tabItem_" + id + "]");
		var preLi = thisLi.getPrevious("li");
		return this.getTabItemByLi(preLi);
	 },
	 getNextTabItem: function(id){
	 	var thisLi = this.tabItemContentUL.getElement("li[name=tabItem_" + id + "]");
		var nextLi = thisLi.getNext("li");
        return this.getTabItemByLi(nextLi);
	 },
    getTabItemByLi: function(li){
        if($defined(li)){
			var nameStr = li.getProperty('name');
			nameStr = nameStr.substring(nameStr.indexOf("_")+1,nameStr.length);
			return this.tabItems.get(nameStr);
		}else{
			return null;
		}
    },
    //创建tab框架结构
	 buildTab: function(){
		this.buildTabItemDiv();
		this.buildTabItemHeaderDiv();
		this.buildTabItemScrollOrPlainDiv();
		this.buildTabItemULDiv();
		this.buildTabContentDiv();
	 },
	 //创建tab最外层div
	 buildTabItemDiv: function(){
	 	this.tabDiv = new Element('div', {
			'name': 'tabDiv',
			'class': 'layout1frametabDiv',
			'styles':{
				'height': this.options.height
			}
		}).inject($(this.options.pNode));
		if(this.options.pos == "absolute"){
			this.tabDiv.setStyles({
				'position': 'absolute',
				'left': this.options.left,
				'top': this.options.top,
				'width': this.options.width,
				'height': this.options.height,
				'z-index': this.options.zIndex
			});
		}
	 },
	 //创建tab头得容器。
	 buildTabItemHeaderDiv: function(){
		this.tabHeaderDiv = new Element('div', {
			'class': 'layout1ftable'
		}).inject(this.tabDiv);
	 },
	 
	 //创建tab标签页容器内包含的功能按钮。
	 buildTabItemScrollOrPlainDiv: function(){
		if(this.options.tabType == "plain"){
			//todo这个plain的样式以后制作
		}else if(this.options.tabType == "scroll"){
			this.tabToolsDiv = new Element('div',{
				'class':"layout1infoList",
				'align':"right"
			}).inject(this.tabHeaderDiv);
			this.tabItemScrollRightDiv = new Element('input', {
				'type': 'image',
				'src': 'blue/images/tab_proview.gif'
			}).inject(this.tabToolsDiv);
			new Element("span",{
				'text':'  '
			}).inject(this.tabToolsDiv);
			this.tabItemScrollRightDiv.addEvent('click', function(){
				if(!this.tabItemScrollRightDiv.hasClass("right_a")){
					this.scrollRight();
				}
			}.bind(this));
			this.tabItemScrollLeftDiv = new Element('input', {
				'type': 'image',
				'src': 'blue/images/tab_next.gif'
			}).inject(this.tabToolsDiv);
			new Element("span",{
				'text':'  '
			}).inject(this.tabToolsDiv);
			this.tabItemScrollLeftDiv.addEvent('click', function(){
					this.scrollLeft();
			}.bind(this));
			this.tabShutoffDiv = new Element('input', {
				'type': 'image',
				'src': 'blue/images/tab_shutoff.gif'
			}).inject(this.tabToolsDiv);
			this.tabShutoffDiv.addEvent('click',function(){
				if(this.curTabItem && this.curTabItem.options.id)
					this.removeTabItem(this.curTabItem.options.id);
			}.bind(this));
			new Element("span",{
				'text':'  '
			}).inject(this.tabToolsDiv);
			this.tabZoominDiv = new Element('input', {
				'type': 'image',
				'src': 'blue/images/tab_zoomin.gif'
			}).inject(this.tabToolsDiv);
			this.tabZoominDiv.addEvent("click",function(event){
				var img = event.target;
				var src = img.get("src");
				if(src.lastIndexOf("tab_zoomin.gif") > 0){
					src = src.substring(0,src.lastIndexOf("tab_zoomin.gif")) + "tab_zoomin1.gif"
				}else{
					src = src.substring(0,src.lastIndexOf("tab_zoomin1.gif")) + "tab_zoomin.gif"
				}
				img.set( "src", src);
				window.parent.frames['topFrame'].$("img1").fireEvent("click");
				window.parent.frames['leftFrame'].$("img2").fireEvent("click");
			});
			new Element("span",{
				'text':'  '
			}).inject(this.tabToolsDiv);
			this.tabHelpDiv = new Element('input', {
				'type': 'image',
				'src': 'blue/images/tab_help.gif'
			}).inject(this.tabToolsDiv);
		}
	 },
	//创建tab标签页容器。
	 buildTabItemULDiv: function(){
	 	var headWidth = this.tabHeaderDiv.getCoordinates().width - 168;
		this.tabItemContentDiv = new Element('div', {
			'class': 'tab_box',
			'styles':{
				'left': "0",
        		'width':headWidth
			}
		}).inject(this.tabHeaderDiv);
		this.tabItemContentUL = new Element('ul', {

		}).inject(this.tabItemContentDiv);
	 },
	 //创建tab标签体容器。
	 buildTabContentDiv: function(){
		this.tabContentDiv = new Element('div', {
			'name': 'tabContentDiv',
			'class': 'x-tab-panel-body',
			'styles':{
				'height': this.options.height.toFloat() - 30,
				'overflow' : 'hidden'
			}
		}).inject(this.tabDiv);
	 },
	 refreshTabContentByRate: function(){
	 	setTimeout(tabResize.bind(this),100);
        function tabResize(){
            this.options.height = $(document.body).getCoordinates().height;
            this.tabDiv.setStyles({
                'height': this.options.height 
            });
            this.tabContentDiv.setStyles({
                'height': (this.options.height - 50)
            });
            //由于这里的iframe是z-index的,所以这里需要刷新整个下面的所有的iframe
            this.tabItems.each(function(item, index){
                item.tabContent.setStyles({
                    'height':  (this.options.height - 50) * 0.9999
                });
            }.bind(this));
            var headWidth = this.tabHeaderDiv.getCoordinates().width - this.tabToolsDiv.getSize().x;
        	this.tabItemContentDiv.setStyle("width",headWidth-4);
        	var itemNum =  this.showItemNum();
        	var lis = this.tabItemContentUL.getChildren("li");
        	if(!lis || lis.length == 0) return;
        	var len = lis.length;
        	
        	for(var i = 0, j = -1; i < len; i++){
	        	if(lis[i].getStyle('display') != "none" && j == -1)
	        			j = i;
	        	this.getTabItemByLi(lis[i]).tabItemLI.setStyle('display','none');
	        }
	        if(len > itemNum + 1)
	        	j = len - j > itemNum ? j : len - itemNum - 1;
	        else
	       		j = 0;
	        for(var max = j + itemNum; j < len && j < max; j++){
	        	 this.getTabItemByLi(lis[j]).tabItemLI.setStyle('display','block');
	        } 
            if(this.options.tabType == "scroll"){  //标签为滚动的。
                this.activeScroll();
            }
        }
	 },
	 BuildRefreshTabContentHeightEvent: function(){
	 	//耦合frame
		window.addEvent('resize', function(e) {
			this.refreshTabContentByRate();
	    }.bind(this));
	 },
	 refreshTabContentByNum: function(heightMinus){
	 	//耦合frame
		var tabDivFloat = this.tabDiv.getStyle("height").toFloat();
		this.tabDiv.setStyles({
			'height': tabDivFloat - heightMinus
		});
		var tabContentDivFloat = this.tabContentDiv.getStyle("height").toFloat();
		this.tabContentDiv.setStyles({
			'height': tabDivFloat - heightMinus - 30
		});
	 },
     refreshTabItemById:function(id){
        this.tabItems.get(id).tabContent.contentWindow.location.reload();
     },
     refreshCurrentTabItem:function(){
        this.tabItems.get(this.curTabItem.options.id).tabContent.contentWindow.location.reload();
     }


     //根据id获得iframe
     ,getTabcontent:function(id){
    	 return this.tabItems.get(id).tabContent;
     }


     //弹出模态tab页，暂时未实现，仅仅添加了接口
     ,addModalTabItem:function(param){
    	this.addTabItem(param);
     },
     showItemNum: function(){
     	var tabItemWidth;
     	var tempSwordFrameTabItem = new SwordFrameTabItemLayout1();
     	tabItemWidth = tempSwordFrameTabItem.options.tabItemWidth + 4;
	    var num = ( this.tabItemContentDiv.getCoordinates().width/ tabItemWidth);
		return num - num % 1;
     }

});












