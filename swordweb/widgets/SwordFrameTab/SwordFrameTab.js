var SwordFrameTabItem = new Class({
     Implements:[Options,Events],
	 type: "SwordFrameTabItem",
     options:{
	 	id: '',
		title: '默认的tab页卡',
		src: '',
		lsrc:'',//暂存src，点击加载
		tabContentType: "iframe",//分为三种,一种是iframe,一种是div类型的,一种类型是innerHTML
		isCloseBtn: "true",
		tabItemWidth: 120,//最好的宽度是大于100
        autoWidth:'false',
		isActive: "true",//后台进行打开,现在暂时不完善,以后制作
        isShowMenuItem:["true","true","true","true"],//是否显示刷新,关闭当前项,关闭其他项,关闭所有项
		onIframeLoaded:$empty
        ,onClose:$empty
        ,onSelect:$empty
        ,onMouseon:$empty
        ,onMouseleave:$empty
        ,submit:null
        ,onActive:$empty
	 },
	 refSwordFrameTab: null,
	 tabItemLI: null,
	 tabItemInputCloseA: null,
	 tabItemLISpanWidth: null,
	 tabItemLISpanTitle: null,
	 tabContent: null,
	 tabContextMenu: null,
     tabItemCssWidth:20,//这个是每一个tab的LI的width
     initialize: function(options){
		if(!options.get)options.get=function(k){return this[k]};//为了让htmloption兼容传入obj元素
		this.htmlOptions(options);
     },
	 buildItemLI: function(){
	 	this.tabItemLI = new Element('li', {
			'name': "tabItem_" + this.options.id,
			'class': 'sty_b'
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
            var tempNoShowArray=[];
            this.options.isShowMenuItem.each(function(item,index){
                if (item=="false")tempNoShowArray.include(index+"");
            });
            var menuArray=[{'pcode': null,'code': '0','caption': i18n.tabMenuFresh,imgName:'recycle.png'},
                {'pcode': null,'code': '1','caption': i18n.tabMenuClose,imgName:'delete.png'},
                {'pcode': null,'code': '2','caption': i18n.tabMenuCloseAll,imgName:'star_red.png'},
                {'pcode': null,'code': '3','caption': i18n.tabMenuCloseOthers,imgName:'flag_red.png'}];
            var filterMenuArray=menuArray.filter(function(item){return !tempNoShowArray.contains(item.code)});
            var menu=filterMenuArray||menuArray;
            var menuStrItemArray=[];
            menu.each(function(item){menuStrItemArray.include(JSON.encode(item))});
			  this.tabContextMenu = new SwordMenu({
			  	  'name': 'tabContextMenu',
				  'pos': 'absolute',
				  'left': left,
				  'top': top,
				  'isInput':"false",
				   'width':200,
                  itemWidth:'120px',
				  'dataStr': "{ 'data': ["+menuStrItemArray.toString()+"],'name': 'SwordTreeJSON1','sword': 'SwordTree'}",
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
         if (this.refSwordFrameTab.options.autoWidth != 'true') {
             this.tabItemLI.setStyles({
                 'width':this.options.tabItemWidth
             });
         } else{
              this.options.tabItemWidth=300; //让左右移动继续好使。范围变大
         }
		if(this.options.isActive == "true"){
			this.tabItemLI.addClass("sty_a");
		}else{
            this.tabItemLI.addClass("sty_b");
        }

		this.tabItemLI.addEvent('click', function(){
			 if(this.options.tabContentType == "iframe" && $chk(this.options.lsrc) && !$chk(this.tabContent.get('src'))){
				 this.tabContent.set('src', this.options.lsrc);
				 this.options.src = this.options.lsrc;
				 this.options.lsrc = '';
			 }
			 this.refSwordFrameTab.activeTabItem(this.options.id);
             this.fireEvent("onSelect",[this.refSwordFrameTab,this.options.id]);
             this.fireEvent("onActive",[this.refSwordFrameTab,this.options.id]);
		}.bind(this));

         this.tabItemLI.addEvent('dblclick', function(){
             this.refSwordFrameTab.fireEvent("onDbclick",[this.refSwordFrameTab,this.options.id]);
		}.bind(this));

		this.tabItemLISpanWidth = new Element('div', {
			'title': this.options.title,
			'class': 'text'
		}).inject(this.tabItemLI);
        this.tabItemLISpanWidth.setStyle('padding',"0 5px");   //todo 放到样式里
        var s=new Element("span",{
            'text': this.computeTitleSize(this.options.title)
        }).inject(this.tabItemLISpanWidth);
         if (this.refSwordFrameTab.options.autoWidth != 'true') {
             if(this.options.tabItemWidth/1>25)
             s.setStyle('width',this.options.tabItemWidth-25);
             else  s.setStyle('width',1);
         }
        if(this.options.isCloseBtn == "true"){
			this.tabItemLI.addClass("sty_b");
			this.tabItemInputCloseA = new Element('div', {
				'class': 'esc'
			}).inject(this.tabItemLISpanWidth,'bottom');
            if (this.refSwordFrameTab.options.autoWidth != 'true') {
                this.tabItemInputCloseA.setStyle('float','right'); 
            }
			this.tabItemInputCloseA.addEvent('click', function(e){
				this.refSwordFrameTab.removeTabItem(this.options.id);
				//DOTA 殷文旭增加tab关闭后，自动显示被隐藏tab页功能。
				var lastTab = this.refSwordFrameTab.getLastTabItem();
				if($chk(lastTab)){
					this.refSwordFrameTab.curTabItem = lastTab;
                	this.refSwordFrameTab.activeTabItem(this.refSwordFrameTab.curTabItem.options.id);
                	this.refSwordFrameTab.scrollLeft();
				}
                //DOTA
				e.stopPropagation();//停止li的click事件的传播
			}.bind(this));
		}

	 },
	 computeTitleSize: function(title){
		var actualLength = 0;
		if(title.length > 5 && this.refSwordFrameTab.options.autoWidth!='true'){
			for(var i = 0 ; i < title.length; i++){
				if(/^[\u4e00-\u9fa5]+$/i.test(title.charAt(i))){
					actualLength = actualLength + 2;//汉字加2
				}else{
					actualLength ++;
				}
			}
		}
		return actualLength > 0 ? (title.substring(0,5) + "..") : title;
	 },
     fold:function(){
         if($defined(this.tabContextMenu)&&this.tabContextMenu.foldFlag){
               this.tabContextMenu.menuZeroLevelDiv.destroy();
               this.tabContextMenu = null;
         }
    } ,
	 buildContent: function(el){
		if(this.options.tabContentType == "iframe"){
			this.tabContent = new Element(this.options.tabContentType, {
				'name': "tabContent_" + this.options.id,
				'frameborder': 0,
				'border': 0,
				'marginwidth': 0,
				'marginheight': 0,
				'scrolling': 'auto',
				'allowtransparency': 'yes'
			}).inject(el);
			this.tabContent.setStyles({
				'width': "100%",
                'height': "100%"
			});
            if(this.options.src){
                this.tabContent.setProperty('src', pageContainer.AddBaseCode2URL(this.options.src));
            }else if(this.options.submit){
                var _s = this.options.submit;
                var fn = "tabContent_" + this.options.id;
                _s.isContinue = true;
                _s.initSubmitWidget(_s.container);
                _s.doBeforeEvents();
                _s.options.postType = 'form_' + fn;
                _s.submit();
            }
            //控制iframe的加载事件
            this.refSwordFrameTab.iframeLoad = false;//初始化为false
            if(!Browser.Engine.trident) { //if not IE
                this.tabContent.addEvent('load', function(){
                    this.fireEvent("onIframeLoaded",this);
                    this.refSwordFrameTab.iframeLoad = true;
                }.bind(this));
            } else {
                this.tabContent.addEvent('readystatechange', function(){
                    try{
                        if (this.tabContent.readyState == "complete"){
                            this.fireEvent("onIframeLoaded",this);
                            this.refSwordFrameTab.iframeLoad = true;
                        }
                    }catch(e){}
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
//				window.frames["tabContent_" + this.options.id].location.reload();
			    document.getElementsByName("tabContent_" + this.options.id)[0].src=this.options.src;
			}else{
				alert("刷新按钮不支持div");
			}
		}else if(el.getProperty("caption") == ""+i18n.tabMenuClose){
			this.refSwordFrameTab.removeTabItem(this.options.id);
			this.refSwordFrameTab.scrollLeft();
		}else if(el.getProperty("caption") == ""+i18n.tabMenuCloseOthers){
			this.refSwordFrameTab.tabItems.each(function(value, key){
			    if(key != this.options.id){
					this.refSwordFrameTab.removeTabItem(key);
				}
			}.bind(this));
			this.refSwordFrameTab.scrollLeft();
		}else if(el.getProperty("caption") == ""+i18n.tabMenuCloseAll){
			this.refSwordFrameTab.tabItems.each(function(value, key){
				this.refSwordFrameTab.removeTabItem(key);
			}.bind(this));
			this.refSwordFrameTab.scrollLeft();
		}
	 },
	 active: function(){
	 	if($defined(this.tabItemLI) && $defined(this.tabContent)){
			this.tabItemLI.addClass("sty_a");
			this.tabItemLI.removeClass("sty_b");
            this.tabContent.setStyles({
                  'z-index':10,
                 'display':'block'
            });
		}
	 },
	 unactive: function(){
	 	if($defined(this.tabItemLI) && $defined(this.tabContent)){
			this.tabItemLI.addClass("sty_b");
			this.tabItemLI.removeClass("sty_a");
            this.tabContent.setStyles({
                  'z-index':1,
                'display':'none'
            });
		}
	 },
	 add: function(el){
		if(!$defined(this.tabItemLI) && !$defined(this.tabContent)){
			this.buildItemLI();
			this.buildContent(el);
		}
	 },
	 remove: function(){
		  if($defined(this.tabItemLI) && $defined(this.tabContent)){
			  if($defined(this.tabItemLI) && $defined(this.tabContent)){
		          	 try{//由于跨域的问题,这里增加了try..catch
			              var tempClearIframe=function(ifEls){
									ifEls.each(function(el){
										try{//由于跨域的问题,这里增加了try..catch
											if(el){
											    if(el.contentWindow&&el.contentWindow.$$){
				                                  var b=el.contentWindow.$$("iframe");
											        if(b.lenght>0){tempClearIframe(b);}
							                     }
												if(Browser.Engine.trident){
												    el.set('src','');
													el.src='';
												    el.destroy();
												}else if (Browser.Engine.webkit) {
													el.set('src','about:blank');
													el.src='about:blank';
													top.injectIfame(el);
										        }
											}
										}catch(e){}
									}.bind(this));
							};
							if(this.tabContent.contentWindow.$$){
								var ifs = this.tabContent.contentWindow.$$("iframe");
								tempClearIframe(ifs);
							}
							tempClearIframe=null;
							if(Browser.Engine.trident){
								this.tabContent.set('src','');
								this.tabContent.src='';
								this.tabContent.destroy();
					            CollectGarbage();
							}else if (Browser.Engine.webkit) {
								this.tabContent.set('src','about:blank');
								this.tabContent.src='about:blank';
								top.injectIfame(this.tabContent);
					        }
		          	 	}catch(e){}
						this.tabItemLI.destroy();
		       }

			 }

		 }
});

var SwordFrameTab = new Class({
     Implements:[Options,Events],
	 type: "SwordFrameTab",
     options:{
	 	pNode: null,
		pos: 'false',//如果需要绝对定位,这里需要修改width,height,left,top
	 	width: null,
		height: 200,//height默认需要存在
		left: null,
		top: null,
        maxTabNum: 10,//最大的tab页卡的数目
		defaultSelectId: null,//默认选中的id的tab标签
		tabType: 'scroll',//plain普通的,scroll滚动的,todo以后再做
		tabDirection: 'top',//top bottom left right四种tab的方位,todo以后再做
		items: null //默认加载的tabItem
        ,autoWidth:'false'
        ,onDbclick:$empty

	 },
     initialize:function(options){
//		this.setOptions(options);
     },
	 initParam: function(node) {
		this.htmlOptions(node);
		this.parseFrameTabItems(node);
		this.create(node);
		this.refreshTabContentByRate();//耦合frame
		this.BuildRefreshTabContentHeightEvent();//耦合frame
     },
	 parseFrameTabItems: function(node){
	 	var tempItemsOptions = {};
//		var tempSwordFrameTabItem = new SwordFrameTabItem();
		node.getChildren().each(function(item, index){
		    var tempId = item.getProperty('id');
			var tempIdOptions = {};
			for(var key in SwordFrameTabItem.prototype.options){
				if(key != "id"){
					if($defined(item.getProperty(key))){
						tempIdOptions[key] = item.getProperty(key);
					}else{
						tempIdOptions[key] = SwordFrameTabItem.prototype.options[key];
					}
				}
			}
			if(!$defined(item.getProperty('tabContentType')) ){
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
		this.loadDefaultItems();
		this.tabDiv.replaces(pNode);
	 },
	 loadDefaultItems: function(){
	 	if($defined(this.options.items)){
			var tempItems = new Hash(this.options.items);
			tempItems.each(function(value, key){
                value.id = key;
                this.addTabItem(value);
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

			if(this.getDisplayTabItems().getKeys().length * this.curTabItem.options.tabItemWidth > this.tabItemContentDiv.getSize().x){
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
            if((this.tabItemContentDiv.getSize().x) > this.getDisplayTabItems().getKeys().length  * this.curTabItem.options.tabItemWidth){

            }else{
                this.getFirstDisplayTabItem().tabItemLI.setStyle('display','none');
            }
        }
	 },
	 scrollLeft: function(){
		if(this.getFirstTabItem() == this.getFirstDisplayTabItem()){

		}else{
            if($defined(this.curTabItem)){
                this.getLastUnDisplayTabItem().tabItemLI.setStyle('display','');
            }
		}
	 },
	 addTabItem: function(options){
            if($defined(this.tabItems.get(options.id))) {
                this.unactiveAllTabItem();
                this.curTabItem = this.tabItems.get(options.id);
                this.activeTabItem(this.curTabItem.options.id);
                if(this.options.tabType == "scroll"){
                    this.activeScroll();
                }
            }else if($defined(this.options.maxTabNum) && this.tabItems.getKeys().length >= this.options.maxTabNum){
                 this.isTabNumOut();//接口可以进行扩展
                 return;
            }else{
                this.unactiveAllTabItem();
                if($defined(this.curTabItem))this.curTabItem.unactive();
                this.curTabItem = new SwordFrameTabItem(options);
                this.curTabItem.refSwordFrameTab = this;
                this.curTabItem.add(this.tabContentDiv);
                this.tabItems.set(options.id, this.curTabItem);
                this.curTabItem.tabItemLI.inject(this.tabItemContentUL);
                if(options.tabContentType != "iframe"){
                	this.curTabItem.tabContent.inject(this.tabContentDiv); //注: 原来是没有判断的，但发现在iframe模式下会导致多执行一次process方法。
                }
                this.curTabItem.tabContent.setStyles({
                    'height':(this.tabContentDiv.getStyle('height').toInt()) * 0.9999
                });
                this.activeTabItem(this.curTabItem.options.id);
                if(this.options.tabType == "scroll"){
                    this.activeScroll();
                }
            }
            this.fireEvent("onActive",[this.curTabItem.refSwordFrameTab,this.curTabItem.options.id]);
	 },
     isTabNumOut: function(){
        alert("为了使浏览器不至于过慢，请您关闭一些tab页卡，最好不要超过" + this.options.maxTabNum + "个!");
     },
	 removeTabItem: function(id){
        var CurTab = this.tabItems.get(id);
        if(CurTab.options.isCloseBtn == "false"){
            return;
        }
        this.tabItems.erase(id);
        CurTab.remove();
		var lastTabItem = this.getLastTabItem();
		if($defined(lastTabItem)){
			this.curTabItem.unactive();
			lastTabItem.active();
			this.curTabItem = lastTabItem;
		}else{
			this.curTabItem = null;
		}
		if(this.options.tabType == "scroll"){
			this.activeScroll();
		}
        CurTab.fireEvent("onClose",[this,id]); 
	 },
     removeCurrentTabItem: function() {
         if ($defined(this.curTabItem)) {
            this.removeTabItem(this.curTabItem.options.id);
         }
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
	 setCurTabItemTitle: function(title){
		var li = this.curTabItem.tabItemLISpanWidth.set('title', title);
		li.getElement("span").set('text', this.curTabItem.computeTitleSize.run(title,this.curTabItem));
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
     getFirstDisplayTabItem: function(){
        var lis = this.tabItemContentUL.getChildren("li");
        for(var i = 0 ; i < lis.length ; i++){
             if(lis[i].getStyle('display') != "none"){
                 return this.getTabItemByLi(lis[i]);
             }
        }
     },
     getLastUnDisplayTabItem: function(){
        var lis = this.tabItemContentUL.getChildren("li");
        for(var i = lis.length ; i >=0 ; i--){
             if($defined(lis[i]) && lis[i].getStyle('display') == "none"){
                 return this.getTabItemByLi(lis[i]);
             }
        }
     },
	 getLastTabItem: function(){
		var lastLi = $(this.tabItemContentUL).getLast("li");
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
	 buildTab: function(){
		this.buildTabItemDiv();
		this.buildTabItemHeaderDiv();
		this.buildTabItemScrollOrPlainDiv();
		this.buildTabItemULDiv();
		this.buildTabContentDiv();
	 },
	 buildTabItemDiv: function(){
	 	this.tabDiv = new Element('div', {
			'name': 'tabDiv',
			'class': 'frametabDiv',
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
	 buildTabItemHeaderDiv: function(){
		this.tabHeaderDiv = new Element('div', {
			'class': 'ftable'
		}).inject(this.tabDiv);
	 },
	 buildTabItemScrollOrPlainDiv: function(){
		if(this.options.tabType == "plain"){
			//todo这个plain的样式以后制作
		}else if(this.options.tabType == "scroll"){
			this.tabItemScrollRightDiv = new Element('div', {
				'class': 'right',
				'styles':{
					'visibility': 'visible'
				}
			}).inject(this.tabHeaderDiv);
			this.tabItemScrollRightDiv.addEvent('click', function(){
				if(!this.tabItemScrollRightDiv.hasClass("right_a")){
					this.scrollRight();
				}
			}.bind(this));
			this.tabItemScrollLeftDiv = new Element('div', {
				'class': 'left',
				'styles':{
					'visibility': 'visible'
				}
			}).inject(this.tabHeaderDiv);
			this.tabItemScrollLeftDiv.addEvent('click', function(){
//				if(!this.tabItemScrollLeftDiv.hasClass("left_a")) {
					this.scrollLeft();
//				}
			}.bind(this));
		}
	 },
	 buildTabItemULDiv: function(){
		this.tabItemContentDiv = new Element('div', {
			'class': 'tab_box',
			'styles':{
				'left': "0"
			}
		}).inject(this.tabHeaderDiv);
		this.tabItemContentUL = new Element('ul', {

		}).inject(this.tabItemContentDiv);
	 },
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
        if( $defined(this.options.pNode) && $defined(this.options.pNode.getProperty("heightRate"))){
            var heightMinus = 0;
            if($defined(this.options.pNode.getProperty("heightMinus"))){
                heightMinus = (this.options.pNode.getProperty("heightMinus")).toFloat();
            }
            var heightRate = this.options.pNode.getProperty("heightRate").toFloat();
            this.tabDiv.setStyles({
                'height': Math.max(0,this.options.height * heightRate - heightMinus)
            });
            this.tabContentDiv.setStyles({
                'height': Math.max(0,(this.options.height * heightRate - 30 - heightMinus))
            });
            //由于这里的iframe是z-index的,所以这里需要刷新整个下面的所有的iframe
            this.tabItems.each(function(item, index){
                item.tabContent.setStyles({
                    'height': Math.max(0,(this.options.height * heightRate - 30 - heightMinus) * 0.9999)
                });
            }.bind(this));
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
		// 因为工作流会多次调用接口，刷新首页，所以判断iframe加载状态是否为complete
		 if(this.tabItems.get(id).tabContent.readyState == "complete"){
              this.tabItems.get(id).tabContent.contentWindow.location.reload();
		 }
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
     }


});












